import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import PlatformGroupsList from './PlatformGroupsList';
import { PlatformGroupsContext, PlatformGroupsContextState } from '../../../contexts/GamingComponents/PlatformGroupsContext';
import { renderWithRouter } from '../../../test-utils';

// Mock api
jest.mock('../../../services/api', () => ({
    __esModule: true,
    default: {
        get: jest.fn().mockResolvedValue({
            data: {
                data: [],
                total: 0,
                current_page: 1,
                last_page: 1
            }
        })
    }
}));

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
                                        if (!target.closest('button')) {
                                            onCellClicked({ data: row, column: { getColId: () => 'name' } });
                                        }
                                    }}
                                >
                                    <div className="ag-cell">{row.name}</div>
                                    <div className="ag-cell">{row.total_games}</div>
                                    <div className="ag-cell">{row.platforms?.map((p: any) => p.name).join(', ')}</div>
                                    <div className="ag-cell">
                                        <button 
                                            title="Edit" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onCellClicked({ 
                                                    data: row, 
                                                    column: { getColId: () => 'actions' }, 
                                                    event: { target: { dataset: { action: 'edit' } } } 
                                                });
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            title="Delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onCellClicked({ 
                                                    data: row, 
                                                    column: { getColId: () => 'actions' }, 
                                                    event: { target: { dataset: { action: 'delete' } } } 
                                                });
                                            }}
                                        >
                                            Delete
                                        </button>
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

const mockGroup1 = {
    id: 1,
    name: 'Test Group 1',
    total_games: 300,
    platforms: [
        { id: 1, name: 'Platform 1', total_games: 100 },
        { id: 2, name: 'Platform 2', total_games: 200 }
    ]
};

const mockGroup2 = {
    id: 2,
    name: 'Test Group 2',
    total_games: 200,
    platforms: [
        { id: 3, name: 'Platform 3', total_games: 100 },
        { id: 4, name: 'Platform 4', total_games: 100 }
    ]
};

const mockContextState = {
    loadedData: [mockGroup1, mockGroup2],
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

const renderWithContext = (contextValue: any) => {
    return renderWithRouter(
        <PlatformGroupsList contextState={contextValue} />
    );
};

describe('PlatformGroupsList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows loading state when context is loading', async () => {
        const loadingContext: PlatformGroupsContextState = {
            ...mockContextState,
            initialLoadComplete: false,
            refreshing: true,
            loadedData: [],
        };

        renderWithContext(loadingContext);
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('shows loading state when context is refreshing', async () => {
        const refreshingContext: PlatformGroupsContextState = {
            ...mockContextState,
            initialLoadComplete: true,
            refreshing: true,
            loadedData: [],
        };

        renderWithContext(refreshingContext);
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    it('renders no results message when there are no platform groups', async () => {
        const emptyContext = {
            ...mockContextState,
            loadedData: [],
            noResults: true,
            initialLoadComplete: true,
            refreshing: false
        };

        renderWithContext(emptyContext);
        await waitFor(() => {
            expect(screen.getByText('No platform groups found')).toBeInTheDocument();
        });
    });

    it('renders platform groups list with context data', async () => {
        renderWithContext(mockContextState);
        await waitFor(() => {
            expect(screen.getByRole('table')).toBeInTheDocument();
            expect(screen.getByText('Test Group 1')).toBeInTheDocument();
            expect(screen.getByText('Test Group 2')).toBeInTheDocument();
        });
    });
}); 