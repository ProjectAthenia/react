import {api} from '../api';
import Collection from "../../models/user/collection";
import CollectionItem, {CollectionItemTypes} from "../../models/user/collection-items";

export default class CollectionManagementRequests {

    /**
     * Loads a single collection for us
     * @param collectionId
     */
    static async getCollection(collectionId: number) {
        const {data} = await api.get('/collections/' + collectionId);
        return data as Collection;
    }


    /**
     * Runs the creation promise for a collection for us
     * @param userId
     * @param collectionData
     */
    static async createCollection(userId: number, collectionData: any): Promise<Collection> {
        const {data} = await api.post('/users/' + userId + '/collections', collectionData);
        return data as Collection;
    }

    /**
     * Runs our update process
     * @param collection
     * @param collectionData
     */
    static async updateCollection(collection: Collection, collectionData: any): Promise<Collection> {
        const {data} = await api.put('/collections/' + collection.id, collectionData);
        return data as Collection;
    }

    /**
     * Runs a deletion of a post
     * @param collection
     */
    static async deleteCollection(collection: Collection): Promise<boolean> {
        await api.delete('/collections/' + collection.id);
        return true;
    }

    /**
     * Adds an item to a collection
     * @param collection
     * @param collectionItemData
     */
    static async createCollectionItem(collection: Collection, collectionItemData: any): Promise<CollectionItem> {
        const {data} = await api.post('/collections/' + collection.id + '/items', collectionItemData);
        return data as CollectionItem

    }

    /**
     * Removes an item from a collection
     * @param collectionItem
     */
    static async removeCollectionItem(collectionItem: CollectionItem): Promise<boolean> {
        await api.delete('/collection-items/' + collectionItem.id);
        return true

    }
}
