import Release from 'models/game/release';
import BaseModel from '../base-model';
import Post from "../post/post";
import Category from 'models/category';
import {CollectionItemCategory} from "./collection-item-category";

export type CollectionItemType = 'post' | 'release';
export type CollectionItemTypes = Post | Release;

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

	/**
	 * The categories of the item
	 */
	collection_item_categories?: CollectionItemCategory[];
}
