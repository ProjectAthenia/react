import React from 'react';
import { screen, fireEvent, render } from '@testing-library/react';
import DataList, { RangeFilterColumn } from '.';
import { renderWithRouter } from '../../../test-utils';
import { MantineProvider } from '@mantine/core';
import { useHistory } from 'react-router-dom';
import { BasePaginatedContextState } from '../../../contexts/BasePaginatedContext';
import { defaultBaseContext } from '../../../contexts/BasePaginatedContext';

// Mock useHistory
jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));

interface TestItem {
    id: number;
    name: string;
    date: string;
    score: number;
}

const mockData: TestItem[] = [
    { id: 1, name: 'Test Item 1', date: '2024-01-01', score: 8.5 },
    { id: 2, name: 'Test Item 2', date: '2024-02-01', score: 7.8 },
];

const columns = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'date',
        header: 'Date',
        cell: (info: { getValue: () => string }) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
        accessorKey: 'score',
        header: 'Score',
        cell: (info: { getValue: () => number }) => info.getValue().toFixed(1),
        meta: {
            filterType: 'range'
        }
    },
];

const renderWithMantine = (component: React.ReactElement) => {
    return render(
        <MantineProvider>
            {component}
        </MantineProvider>
    );
};

describe('DataList', () => {
    const mockContext: BasePaginatedContextState<TestItem> = {
        ...defaultBaseContext(),
        loadedData: mockData,
        total: mockData.length,
        refreshing: false,
        setFilter: jest.fn(),
        loadNext: jest.fn(),
    };

    it('renders data table with provided data', () => {
        renderWithMantine(<DataList context={mockContext} columns={columns} />);
        
        expect(screen.getByTestId('data-table')).toBeInTheDocument();
        expect(screen.getByText('Test Item 1')).toBeInTheDocument();
        expect(screen.getByText('Test Item 2')).toBeInTheDocument();
        expect(screen.getByText('8.5')).toBeInTheDocument();
        expect(screen.getByText('7.8')).toBeInTheDocument();
    });

    it('renders filter inputs for each column', () => {
        renderWithMantine(<DataList context={mockContext} columns={columns} />);
        
        expect(screen.getByPlaceholderText('Filter Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Filter Date')).toBeInTheDocument();
    });

    it('calls onFilterChanged when filter value changes', () => {
        const onFilterChanged = jest.fn().mockReturnValue(false);
        renderWithMantine(<DataList context={mockContext} columns={columns} onFilterChanged={onFilterChanged} />);
        
        const nameFilter = screen.getByPlaceholderText('Filter Name');
        fireEvent.change(nameFilter, { target: { value: 'Test' } });
        
        expect(onFilterChanged).toHaveBeenCalledWith('name', 'Test');
    });

    it('calls onRowClick when row is clicked', () => {
        const onRowClick = jest.fn();
        renderWithMantine(<DataList context={mockContext} columns={columns} onRowClick={onRowClick} />);
        
        const row = screen.getByText('Test Item 1').closest('tr');
        fireEvent.click(row!);
        
        expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
    });

    it('navigates to detail path when row is clicked and detailPath is provided', () => {
        const mockHistory = { push: jest.fn() };
        (useHistory as jest.Mock).mockImplementation(() => mockHistory);
        
        renderWithMantine(<DataList context={mockContext} columns={columns} detailPath="/items" />);
        
        const row = screen.getByText('Test Item 1').closest('tr');
        fireEvent.click(row!);
        
        expect(mockHistory.push).toHaveBeenCalledWith('/items/1');
    });

    it('uses range filter for score column when rangeFields is provided', () => {
        const rangeFields: Record<string, RangeFilterColumn> = {
            score: {
                valueCallback: (row: TestItem) => row.score
            }
        };

        const onFilterChanged = jest.fn().mockReturnValue(false);

        renderWithMantine(
            <DataList 
                context={mockContext}
                columns={columns} 
                rangeFields={rangeFields}
                onFilterChanged={onFilterChanged}
            />
        );
        
        const minInput = screen.getByPlaceholderText('Min');
        const maxInput = screen.getByPlaceholderText('Max');
        
        expect(minInput).toBeInTheDocument();
        expect(maxInput).toBeInTheDocument();

        fireEvent.change(minInput, { target: { value: '8' } });
        expect(onFilterChanged).toHaveBeenCalledWith('score', 'between,8,100');

        fireEvent.change(maxInput, { target: { value: '9' } });
        expect(onFilterChanged).toHaveBeenCalledWith('score', 'between,8,9');
    });

    it('handles bulk selection when enabled', () => {
        const onBulkSelect = jest.fn();
        
        renderWithMantine(
            <DataList 
                context={mockContext}
                columns={columns}
                bulkSelectEnabled={true}
                onBulkSelect={onBulkSelect}
                selectedItems={new Set([1])}
            />
        );

        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes.length).toBe(mockData.length);

        expect(checkboxes[0]).toBeChecked();

        fireEvent.click(checkboxes[1]);
        expect(onBulkSelect).toHaveBeenCalledWith(2);
    });
}); 