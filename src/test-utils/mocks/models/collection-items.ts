import CollectionItem, { CollectionItemTypes } from '../../../models/user/collection-items';
import { HasType } from '../../../models/has-type';

export const mockCollectionItem = (overrides: Partial<CollectionItem> = {}): CollectionItem => ({
    id: 100,
    type: CollectionItemTypes.POST,
    item_id: 1,
    item_type: 'post',
    collection_id: 1,
    order: 0,
    item: {} as HasType,
    collection_item_categories: [],
    categories: [],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides
}); 