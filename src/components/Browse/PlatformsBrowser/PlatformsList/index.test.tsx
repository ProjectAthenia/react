import React from 'react';
import { screen } from '@testing-library/react';
import PlatformsList from './index';
import { BasePaginatedContextState } from '../../../../contexts/BasePaginatedContext';
import Platform from '../../../../models/platform/platform';
import PlatformGroup from '../../../../models/platform/platform-group';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../test-utils';

// Mock ag-grid components
jest.mock('ag-grid-react', () => ({
    AgGridReact: ({ rowData, columnDefs }: any) => (
        <div data-testid="ag-grid">
            {rowData.map((row: any) => (
                <div key={row.id} data-testid={`platform-${row.id}`}>
                    <span>{row.name}</span>
                    <span>{row.total_games}</span>
                </div>
            ))}
        </div>
    )
}));

// Mock ag-grid CSS imports to avoid errors in Jest
jest.mock('ag-grid-community/styles/ag-grid.css', () => {});
jest.mock('ag-grid-community/styles/ag-theme-quartz.css', () => {});

describe('PlatformsList', () => {
    const mockPlatformsContextState: BasePaginatedContextState<Platform> = {
        hasAnotherPage: false,
        initialLoadComplete: true,
        initiated: true,
        noResults: false,
        refreshing: false,
        expands: [],
        order: {},
        filter: {},
        search: {},
        limit: 20,
        loadedData: [
            { id: 1, name: 'PlayStation 5', total_games: 120 },
            { id: 2, name: 'Xbox Series X', total_games: 95 },
        ],
        loadAll: false,
        loadNext: jest.fn(),
        refreshData: jest.fn(),
        setFilter: jest.fn(),
        setSearch: jest.fn(),
        setOrder: jest.fn(),
        addModel: jest.fn(),
        removeModel: jest.fn(),
        getModel: jest.fn(),
        params: {},
    };

    const mockPlatformGroupsContextState: BasePaginatedContextState<PlatformGroup> = {
        hasAnotherPage: false,
        initialLoadComplete: true,
        initiated: true,
        noResults: false,
        refreshing: false,
        expands: [],
        order: {},
        filter: {},
        search: {},
        limit: 20,
        loadedData: [
            { id: 1, name: 'Sony', total_games: 500 },
            { id: 2, name: 'Microsoft', total_games: 400 },
        ],
        loadAll: false,
        loadNext: jest.fn(),
        refreshData: jest.fn(),
        setFilter: jest.fn(),
        setSearch: jest.fn(),
        setOrder: jest.fn(),
        addModel: jest.fn(),
        removeModel: jest.fn(),
        getModel: jest.fn(),
        params: {},
    };

    it('renders platforms list', () => {
        renderWithProviders(
            <PlatformsList 
                platformsContextState={mockPlatformsContextState}
                platformGroupsContextState={mockPlatformGroupsContextState}
            />
        );
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Total Games')).toBeInTheDocument();
    });

    it('renders platform groups', () => {
        renderWithProviders(
            <PlatformsList 
                platformsContextState={mockPlatformsContextState}
                platformGroupsContextState={mockPlatformGroupsContextState}
            />
        );
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Total Games')).toBeInTheDocument();
    });

    it('shows loading state', () => {
        renderWithProviders(
            <PlatformsList 
                platformsContextState={{ ...mockPlatformsContextState, refreshing: true }}
                platformGroupsContextState={mockPlatformGroupsContextState}
            />
        );
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
});
