import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import CollectionItemComponent from './index';
import CollectionManagementRequests from '../../../../services/requests/CollectionManagementRequests';
import { CollectionItemContextState } from '../../../../contexts/CollectionItemsContext';
import CollectionItem from '../../../../models/user/collection-items';
import { HasType } from '../../../../models/has-type';

// Mock dependencies
jest.mock('../../../../services/requests/CollectionManagementRequests', () => ({
    createCollectionItem: jest.fn(),
    removeCollectionItem: jest.fn(),
    createCollectionItemCategory: jest.fn(),
    deleteCollectionItemCategory: jest.fn()
}));

// Mock CategoryAutocomplete component
jest.mock('../../../GeneralUIElements/CategoryAutocomplete', () => {
    return {
        __esModule: true,
        default: React.forwardRef((props: any, ref: React.Ref<any>) => (
            <div data-testid="category-autocomplete">
                <input 
                    placeholder={props.placeholder} 
                    data-testid="category-input"
                    ref={ref as React.RefObject<HTMLInputElement>}
                />
                <button 
                    data-testid="mock-select-category"
                    onClick={() => props.onSelect({ id: 1, name: 'Test Category' })}
                >
                    Select Category
                </button>
            </div>
        ))
    };
});

// Helper function to render component with MantineProvider
const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <MantineProvider>
            {ui}
        </MantineProvider>
    );
};

describe('CollectionItemComponent', () => {
    const mockItem: HasType = {
        id: 1,
        type: 'release',
        created_at: '2024-03-20T00:00:00Z',
        updated_at: '2024-03-20T00:00:00Z'
    };

    const mockCollectionItem: CollectionItem = {
        id: 100,
        item_id: 1,
        item_type: 'release',
        collection_id: 1,
        order: 0,
        created_at: '2024-03-20T00:00:00Z',
        updated_at: '2024-03-20T00:00:00Z',
        collection_item_categories: [
            {
                id: 50,
                category_id: 1,
                collection_item_id: 100,
                linked_at: '2024-03-20T00:00:00Z',
                linked_at_format: 'Y-m-d',
                category: {
                    id: 1,
                    name: 'Action',
                    can_be_primary: true,
                    created_at: '2024-03-20T00:00:00Z',
                    updated_at: '2024-03-20T00:00:00Z'
                },
                created_at: '2024-03-20T00:00:00Z',
                updated_at: '2024-03-20T00:00:00Z'
            }
        ]
    };

    const mockCollection = {
        id: 1,
        type: 'collection',
        owner_id: 1,
        owner_type: 'user',
        is_public: false,
        name: 'Test Collection',
        collection_items_count: 5,
        created_at: '2024-03-20T00:00:00Z',
        updated_at: '2024-03-20T00:00:00Z',
        items: [mockCollectionItem]
    };

    const mockCollectionContextState: CollectionItemContextState = {
        hasAnotherPage: false,
        initialLoadComplete: true,
        initiated: true,
        noResults: false,
        refreshing: false,
        expands: [],
        order: {},
        filter: {},
        search: {},
        limit: 50,
        loadedData: [],
        loadAll: true,
        params: {},
        loadNext: jest.fn(),
        refreshData: jest.fn(),
        setFilter: jest.fn(),
        setSearch: jest.fn(),
        setOrder: jest.fn(),
        addModel: jest.fn(),
        removeModel: jest.fn(),
        getModel: jest.fn(),
    };

    const mockCollectionItemsContext = {
        1: mockCollectionContextState
    };

    // Reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders in not-in-collection state', () => {
        renderWithProviders(
            <CollectionItemComponent
                collection={mockCollection}
                item={mockItem}
                collectionItemsContext={mockCollectionItemsContext}
            />
        );

        expect(screen.getByText('Test Collection')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('Add to Collection')).toBeInTheDocument();
        expect(screen.queryByText('Categories:')).not.toBeInTheDocument();
    });

    it('renders in in-collection state with categories', () => {
        mockCollectionContextState.loadedData = [mockCollectionItem];

        renderWithProviders(
            <CollectionItemComponent
                collection={mockCollection}
                item={mockItem}
                collectionItemsContext={mockCollectionItemsContext}
            />
        );

        expect(screen.getByText('Test Collection')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('Remove from Collection')).toBeInTheDocument();
        expect(screen.getByText('Categories:')).toBeInTheDocument();
        expect(screen.getByText('Action')).toBeInTheDocument();
        expect(screen.getByTestId('category-autocomplete')).toBeInTheDocument();
    });

    it('handles adding to collection', async () => {
        (CollectionManagementRequests.createCollectionItem as jest.Mock).mockResolvedValue(mockCollectionItem);

        renderWithProviders(
            <CollectionItemComponent
                collection={mockCollection}
                item={mockItem}
                collectionItemsContext={mockCollectionItemsContext}
            />
        );

        fireEvent.click(screen.getByText('Add to Collection'));

        await waitFor(() => {
            expect(CollectionManagementRequests.createCollectionItem).toHaveBeenCalledWith(
                mockCollection,
                {
                    item_id: mockItem.id,
                    item_type: mockItem.type,
                    order: 0
                }
            );
            expect(mockCollectionItemsContext[1].addModel).toHaveBeenCalledWith(mockCollectionItem);
        });
    });

    it('handles removing from collection', async () => {
        (CollectionManagementRequests.removeCollectionItem as jest.Mock).mockResolvedValue({});

        renderWithProviders(
            <CollectionItemComponent
                collection={mockCollection}
                item={mockItem}
                collectionItemsContext={mockCollectionItemsContext}
            />
        );

        fireEvent.click(screen.getByText('Remove from Collection'));

        await waitFor(() => {
            expect(CollectionManagementRequests.removeCollectionItem).toHaveBeenCalledWith(mockCollectionItem);
            expect(mockCollectionItemsContext[1].removeModel).toHaveBeenCalledWith(mockCollectionItem);
        });
    });

    it('handles adding a category', async () => {
        const newCollectionItemCategory = { id: 51, category_id: 2 };
        
        (CollectionManagementRequests.createCollectionItemCategory as jest.Mock).mockResolvedValue(newCollectionItemCategory);

        renderWithProviders(
            <CollectionItemComponent
                collection={mockCollection}
                item={mockItem}
                collectionItemsContext={mockCollectionItemsContext}
            />
        );

        fireEvent.click(screen.getByTestId('mock-select-category'));

        await waitFor(() => {
            expect(CollectionManagementRequests.createCollectionItemCategory).toHaveBeenCalledWith(
                mockCollectionItem.id,
                expect.objectContaining({
                    category_id: 1,
                    linked_at_format: 'Y-m-d'
                })
            );
        });
    });

    it('handles removing a category', async () => {
        (CollectionManagementRequests.deleteCollectionItemCategory as jest.Mock).mockResolvedValue({});

        renderWithProviders(
            <CollectionItemComponent
                collection={mockCollection}
                item={mockItem}
                collectionItemsContext={mockCollectionItemsContext}
            />
        );

        // Find the delete button for the category and click it
        const deleteButtons = screen.getAllByRole('button');
        const deleteButton = deleteButtons.find(button => button.querySelector('svg'));
        fireEvent.click(deleteButton!);

        await waitFor(() => {
            expect(CollectionManagementRequests.deleteCollectionItemCategory).toHaveBeenCalledWith(50);
        });
    });
}); 