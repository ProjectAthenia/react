import BaseModel from '../base-model';
import Post from "../post/post";

export type CollectionItemType = 'post';
export type CollectionItemTypes = Post;

/**
 * The data interface for albums
 */
export default interface CollectionItem extends BaseModel {

	/**
	 * The primary id of item
	 */
	item_id: number;

	/**
	 * The type of the collection item
	 */
	item_type?: CollectionItemType;

	/**
	 * The collection id
	 */
	collection_id: number;

	/**
	 * The position within the collection of the item
	 */
	order: number;

	/**
	 * The item object
	 */
	item?: CollectionItemTypes;
}
