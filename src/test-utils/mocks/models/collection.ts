import Collection from '../../../models/user/collection';

export const mockCollection = (overrides: Partial<Collection> = {}): Collection => ({
    id: 1,
    name: 'Test Collection',
    is_public: true,
    collection_items_count: 5,
    owner_id: 1,
    owner_type: 'user',
    type: 'collection',
    ...overrides
}); 