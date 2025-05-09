import Collection from '../../models/user/collection';
import CollectionItem from '../../models/user/collection-items';
import { CollectionItemCategory } from '../../models/user/collection-item-category';

export const mockCollectionManagementRequests = {
    getCollection: jest.fn(),
    createCollection: jest.fn(),
    updateCollection: jest.fn(),
    deleteCollection: jest.fn(),
    createCollectionItem: jest.fn(),
    removeCollectionItem: jest.fn(),
    createCollectionItemCategory: jest.fn(),
    updateCollectionItemCategory: jest.fn(),
    deleteCollectionItemCategory: jest.fn()
}; 