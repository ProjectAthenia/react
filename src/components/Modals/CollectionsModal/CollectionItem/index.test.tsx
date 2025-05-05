import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import CollectionItemComponent from './index';
import { isReleaseInCollection, getCollectionItemForRelease } from '../../../../util/gaming-utils';
import CollectionManagementRequests from '../../../../services/requests/CollectionManagementRequests';
import { CollectionItemContextState } from '../../../../contexts/CollectionItemsContext';
import CollectionItem, { CollectionItemType } from '../../../../models/user/collection-items';

// Mock dependencies
jest.mock('../../../../util/gaming-utils', () => ({
    isReleaseInCollection: jest.fn(),
    getCollectionItemForRelease: jest.fn()
}));

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
    const mockRelease = {
        id: 1,
        game: { name: 'Test Game' }
    } as any;

    const mockCollection = {
        id: 1,
        name: 'Test Collection',
        collection_items_count: 5
    } as any;

    const mockCollectionItem: CollectionItem = {
        id: 100,
        item_id: mockRelease.id,
        item_type: 'release' as CollectionItemType,
        collection_id: mockCollection.id,
        order: 0,
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
                    can_be_primary: true
                }
            }
        ]
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
        loadedData: [mockCollectionItem],
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
        (getCollectionItemForRelease as jest.Mock).mockReturnValue(mockCollectionItem);
    });

    it('renders in not-in-collection state', () => {
        (isReleaseInCollection as jest.Mock).mockReturnValue(false);

        renderWithProviders(
            <CollectionItemComponent
                collection={mockCollection}
                release={mockRelease}
                collectionItemsContext={mockCollectionItemsContext}
            />
        );

        expect(screen.getByText('Test Collection')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('Add')).toBeInTheDocument();
        expect(screen.queryByText('Categories:')).not.toBeInTheDocument();
    });

    it('renders in in-collection state with categories', () => {
        (isReleaseInCollection as jest.Mock).mockReturnValue(true);

        renderWithProviders(
            <CollectionItemComponent
                collection={mockCollection}
                release={mockRelease}
                collectionItemsContext={mockCollectionItemsContext}
            />
        );

        expect(screen.getByText('Test Collection')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('Remove')).toBeInTheDocument();
        expect(screen.getByText('Categories:')).toBeInTheDocument();
        expect(screen.getByText('Action')).toBeInTheDocument();
        expect(screen.getByTestId('category-autocomplete')).toBeInTheDocument();
    });

    it('handles adding to collection', async () => {
        (isReleaseInCollection as jest.Mock).mockReturnValue(false);
        (CollectionManagementRequests.createCollectionItem as jest.Mock).mockResolvedValue(mockCollectionItem);

        renderWithProviders(
            <CollectionItemComponent
                collection={mockCollection}
                release={mockRelease}
                collectionItemsContext={mockCollectionItemsContext}
            />
        );

        fireEvent.click(screen.getByText('Add'));

        await waitFor(() => {
            expect(CollectionManagementRequests.createCollectionItem).toHaveBeenCalledWith(
                mockCollection,
                {
                    item_id: mockRelease.id,
                    item_type: 'release' as CollectionItemType,
                    order: 0
                }
            );
            expect(mockCollectionItemsContext[1].addModel).toHaveBeenCalledWith(mockCollectionItem);
        });
    });

    it('handles removing from collection', async () => {
        (isReleaseInCollection as jest.Mock).mockReturnValue(true);
        (CollectionManagementRequests.removeCollectionItem as jest.Mock).mockResolvedValue({});

        renderWithProviders(
            <CollectionItemComponent
                collection={mockCollection}
                release={mockRelease}
                collectionItemsContext={mockCollectionItemsContext}
            />
        );

        fireEvent.click(screen.getByText('Remove'));

        await waitFor(() => {
            expect(CollectionManagementRequests.removeCollectionItem).toHaveBeenCalledWith(mockCollectionItem);
            expect(mockCollectionItemsContext[1].removeModel).toHaveBeenCalledWith(mockCollectionItem);
        });
    });

    it('handles adding a category', async () => {
        (isReleaseInCollection as jest.Mock).mockReturnValue(true);
        const newCollectionItemCategory = { id: 51, category_id: 2 };
        
        (CollectionManagementRequests.createCollectionItemCategory as jest.Mock).mockResolvedValue(newCollectionItemCategory);

        renderWithProviders(
            <CollectionItemComponent
                collection={mockCollection}
                release={mockRelease}
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
        (isReleaseInCollection as jest.Mock).mockReturnValue(true);
        (CollectionManagementRequests.deleteCollectionItemCategory as jest.Mock).mockResolvedValue({});

        renderWithProviders(
            <CollectionItemComponent
                collection={mockCollection}
                release={mockRelease}
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