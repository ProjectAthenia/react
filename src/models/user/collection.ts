import BaseModel from '../base-model';
import CollectionItem from "./collection-items";

export const collectionDefaultData = {
	is_public: false,
	owner_type: 'user',
}

export const collectionPlaceholder = (): Collection => {

	return {
		owner_id: 0,
		owner_type: 'user',
		name: '',
		is_public: false,
		collection_items_count: 0,
		collectionItems: [],
	}
}
/**
 * The data interface for albums
 */
export default interface Collection extends BaseModel {

	/**
	 * The primary id of album creator
	 */
	owner_id: number;

	/**
	 * The type of thing that owns this album
	 */
	owner_type: string;

	/**
	 * The album name
	 */
	name?: string;

	/**
	 * Public visibility boolean
	 */
	is_public: boolean;

	/**
	 * Number of items in the collection
	 */
	collection_items_count?: number;

	/**
	 * Items within the collection
	 */
	collectionItems?: CollectionItem[];
}
