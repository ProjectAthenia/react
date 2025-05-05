import { mockHistory, mockHistoryPush, mockUseParams, renderWithRouter } from '../../../../test-utils';

// Mock PlatformManagementRequests
jest.mock('../../../../services/requests/PlatformManagementRequests', () => ({
    deletePlatformGroup: jest.fn().mockResolvedValue(true)
}));

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: () => <span>icon</span>
}));

import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import PlatformGroupsList from './index';
import { BasePaginatedContextState } from '../../../../contexts/BasePaginatedContext';
import PlatformGroup from '../../../../models/platform/platform-group';
import PlatformManagementRequests from '../../../../services/requests/PlatformManagementRequests';
import { mockPlatformGroupsContextValue } from '../../../../test-utils/mocks/contexts';
import { renderWithProviders } from '../../../../test-utils';

// Mock AG Grid
jest.mock('ag-grid-react', () => ({
    AgGridReact: ({ rowData, columnDefs, onCellClicked }: any) => (
        <div className="ag-root-wrapper" data-testid="ag-grid-wrapper">
            <div className="ag-root-wrapper-body">
                <div className="ag-root">
                    <div className="ag-body-viewport">
                        <div className="ag-center-cols-container">
                            {rowData.map((row: any) => (
                                <div 
                                    key={row.id} 
                                    className="ag-row" 
                                    data-testid={`row-${row.id}`}
                                    onClick={(e) => {
                                        const target = e.target as HTMLElement;
                                        if (!target.closest('.action-buttons')) {
                                            onCellClicked({ data: row, column: { getColId: () => 'name' } });
                                        }
                                    }}
                                >
                                    <div className="ag-cell">{row.name}</div>
                                    <div className="ag-cell">{row.total_games}</div>
                                    <div className="ag-cell">{row.platforms?.map((p: any) => p.name).join(', ')}</div>
                                    <div className="ag-cell">
                                        <div className="action-buttons">
                                            <button 
                                                className="edit-button"
                                                title="Edit"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    mockHistory.push(`/browse/platform-groups/${row.id}/edit`);
                                                }}
                                            >
                                                <span>icon</span>
                                            </button>
                                            <button 
                                                className="delete-button"
                                                title="Delete"
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    if (window.confirm('Are you sure you want to delete this platform group?')) {
                                                        await PlatformManagementRequests.deletePlatformGroup(row);
                                                        mockContextState.removeModel(row);
                                                    }
                                                }}
                                            >
                                                <span>icon</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}));

const mockGroup: PlatformGroup = {
    id: 1,
    name: 'Test Group',
    total_games: 500,
    platforms: [
        {
            id: 1,
            name: 'Test Platform 1',
            total_games: 200
        },
        {
            id: 2,
            name: 'Test Platform 2',
            total_games: 300
        }
    ]
};

const mockContextState = {
    loadedData: [mockGroup],
    initialLoadComplete: true,
    refreshing: false,
    hasAnotherPage: false,
    initiated: true,
    noResults: false,
    expands: [],
    order: {},
    filter: {},
    search: {},
    limit: 20,
    loadAll: false,
    loadNext: jest.fn(),
    refreshData: jest.fn(),
    setFilter: jest.fn(),
    setSearch: jest.fn(),
    setOrder: jest.fn(),
    addModel: jest.fn(),
    removeModel: jest.fn(),
    getModel: jest.fn(),
    params: {}
};

describe('PlatformGroupsList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockHistoryPush.mockClear();
        mockHistory.push.mockClear();
        window.confirm = jest.fn(() => true);
    });

    it('renders platform groups list', () => {
        renderWithProviders(<PlatformGroupsList contextState={mockPlatformGroupsContextValue} />, { route: '/' });
        expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });

    it('handles platform group deletion', async () => {
        const mockConfirm = jest.fn(() => true);
        window.confirm = mockConfirm;

        renderWithProviders(<PlatformGroupsList contextState={mockPlatformGroupsContextValue} />, { route: '/' });
        
        const deleteButton = screen.getByTitle('Delete');
        fireEvent.click(deleteButton);

        expect(mockConfirm).toHaveBeenCalled();
        
        await waitFor(() => {
            expect(mockPlatformGroupsContextValue.removeModel).toHaveBeenCalled();
        });
    });

    it('navigates to edit page when edit button is clicked', async () => {
        const history = createMemoryHistory();
        
        renderWithProviders(
            <Router history={history}>
                <PlatformGroupsList contextState={mockPlatformGroupsContextValue} />
            </Router>,
            { route: '/' }
        );

        const editButton = screen.getByTitle('Edit');
        fireEvent.click(editButton);

        await waitFor(() => {
            expect(history.location.pathname).toBe(`/browse/platform-groups/${mockGroup.id}/edit`);
        });
    });

    it('navigates to platform group details when row is clicked', async () => {
        const history = createMemoryHistory();
        
        renderWithProviders(
            <Router history={history}>
                <PlatformGroupsList contextState={mockPlatformGroupsContextValue} />
            </Router>,
            { route: '/' }
        );

        const row = screen.getByText(mockGroup.name).closest('tr');
        if (row) {
            fireEvent.click(row);
        }

        await waitFor(() => {
            expect(history.location.pathname).toBe(`/browse/platform-groups/${mockGroup.id}`);
        });
    });

    it('shows loading state when context is refreshing', () => {
        renderWithProviders(
            <PlatformGroupsList 
                contextState={{
                    ...mockPlatformGroupsContextValue,
                    refreshing: true
                }}
            />,
            { route: '/' }
        );
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
}); 