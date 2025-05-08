import { isInCollection } from './collection-utils';
import { CollectionItemsContextState } from '../contexts/CollectionItemsContext';
import { HasType } from '../models/has-type';
import type CollectionItem from '../models/user/collection-items';

describe('collection-utils', () => {
    describe('isInCollection', () => {
        const mockItem: HasType = { id: 1, type: 'item' };
        const mockCollectionId = 123;
        
        const createMockContextState = (items: Array<{ item_id: number; item_type: string }>) => ({
            loadedData: items.map((item, index) => ({
                ...item,
                collection_id: mockCollectionId,
                order: index + 1
            })) as CollectionItem[],
            hasAnotherPage: false,
            initialLoadComplete: true,
            initiated: true,
            noResults: false,
            page: 1,
            perPage: 20,
            total: items.length,
            totalPages: 1,
            loading: false,
            error: null,
            filters: {},
            sort: {},
            search: '',
            selectedItems: new Set(),
            selectedAll: false,
            selectedCount: 0,
            selectedPages: new Set(),
            selectedPagesCount: 0,
            selectedPagesTotal: 0,
            selectedPagesTotalCount: 0,
            selectedPagesTotalPages: 0,
            selectedPagesTotalPerPage: 0,
            selectedPagesTotalFilters: {},
            selectedPagesTotalSort: {},
            selectedPagesTotalSearch: '',
            refreshing: false,
            expands: {},
            order: {},
            filter: {}
        });

        it('should return false when collectionId is not provided', () => {
            const context: CollectionItemsContextState = {};
            expect(isInCollection(mockItem, 0, context)).toBe(false);
        });

        it('should return false when collection does not exist in context', () => {
            const context: CollectionItemsContextState = {};
            expect(isInCollection(mockItem, mockCollectionId, context)).toBe(false);
        });

        it('should return false when item is not in collection', () => {
            const context: CollectionItemsContextState = {
                [mockCollectionId]: createMockContextState([
                    { item_id: 2, item_type: 'item' },
                    { item_id: 1, item_type: 'other' }
                ])
            };
            expect(isInCollection(mockItem, mockCollectionId, context)).toBe(false);
        });

        it('should return true when item exists in collection with matching id and type', () => {
            const context: CollectionItemsContextState = {
                [mockCollectionId]: createMockContextState([
                    { item_id: 2, item_type: 'item' },
                    { item_id: 1, item_type: 'item' }
                ])
            };
            expect(isInCollection(mockItem, mockCollectionId, context)).toBe(true);
        });
    });
}); 