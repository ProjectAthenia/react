import CollectionItem from '../../../models/user/collection-items';
import { mockCategory } from './category';

export const mockCollectionItem = (overrides: Partial<CollectionItem> = {}): CollectionItem => ({
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
            category: mockCategory({ id: 1, name: 'Action' }),
            created_at: '2024-03-20T00:00:00Z',
            updated_at: '2024-03-20T00:00:00Z'
        }
    ],
    ...overrides
}); 