import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import CollectionItemComponent from './index';
import CollectionManagementRequests from '../../../../services/requests/CollectionManagementRequests';
import { CollectionItemContextState } from '../../../../contexts/CollectionItemsContext';
import CollectionItem from '../../../../models/user/collection-items';
import { HasType } from '../../../../models/has-type';
import { mockCollection } from '../../../../test-utils/mocks/models/collection';

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

    const testCollection = mockCollection({
        id: 1,
        name: 'Test Collection',
        collection_items_count: 5,
        collectionItems: [mockCollectionItem]
    });

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
        mockCollectionContextState.loadedData = [];
    });

    it('renders in not-in-collection state', () => {
        renderWithProviders(
            <CollectionItemComponent
                collection={testCollection}
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
                collection={testCollection}
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
                collection={testCollection}
                item={mockItem}
                collectionItemsContext={mockCollectionItemsContext}
            />
        );

        const addButton = screen.getByText('Add to Collection');
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(CollectionManagementRequests.createCollectionItem).toHaveBeenCalledWith(
                testCollection,
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
        mockCollectionContextState.loadedData = [mockCollectionItem];

        renderWithProviders(
            <CollectionItemComponent
                collection={testCollection}
                item={mockItem}
                collectionItemsContext={mockCollectionItemsContext}
            />
        );

        const removeButton = screen.getByText('Remove from Collection');
        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(CollectionManagementRequests.removeCollectionItem).toHaveBeenCalledWith(mockCollectionItem);
            expect(mockCollectionItemsContext[1].removeModel).toHaveBeenCalledWith(mockCollectionItem);
        });
    });

    it('handles adding a category', async () => {
        (CollectionManagementRequests.createCollectionItemCategory as jest.Mock).mockResolvedValue({
            id: 51,
            category_id: 1,
            collection_item_id: 100,
            linked_at: '2024-03-20T00:00:00Z',
            linked_at_format: 'Y-m-d',
            category: {
                id: 1,
                name: 'Test Category',
                can_be_primary: true,
                created_at: '2024-03-20T00:00:00Z',
                updated_at: '2024-03-20T00:00:00Z'
            },
            created_at: '2024-03-20T00:00:00Z',
            updated_at: '2024-03-20T00:00:00Z'
        });
        mockCollectionContextState.loadedData = [mockCollectionItem];

        renderWithProviders(
            <CollectionItemComponent
                collection={testCollection}
                item={mockItem}
                collectionItemsContext={mockCollectionItemsContext}
            />
        );

        const selectButton = screen.getByTestId('mock-select-category');
        fireEvent.click(selectButton);

        await waitFor(() => {
            expect(CollectionManagementRequests.createCollectionItemCategory).toHaveBeenCalledWith(
                100,
                {
                    category_id: 1,
                    linked_at: expect.any(String),
                    linked_at_format: 'Y-m-d'
                }
            );
        });
    });

    it('handles removing a category', async () => {
        (CollectionManagementRequests.deleteCollectionItemCategory as jest.Mock).mockResolvedValue({});
        mockCollectionContextState.loadedData = [mockCollectionItem];

        renderWithProviders(
            <CollectionItemComponent
                collection={testCollection}
                item={mockItem}
                collectionItemsContext={mockCollectionItemsContext}
            />
        );

        // The ActionIcon trash button does not have an accessible name, so select the first button in the category list
        const categoryButtons = screen.getAllByRole('button');
        // The first ActionIcon button in the category list is the remove category button
        const removeCategoryButton = categoryButtons.find(
            btn => btn.querySelector('svg') && btn.querySelector('svg')?.className.baseVal.includes('tabler-icon-trash')
        );
        fireEvent.click(removeCategoryButton!);

        await waitFor(() => {
            expect(CollectionManagementRequests.deleteCollectionItemCategory).toHaveBeenCalledWith(50);
        });
    });
}); 