import BaseModel from '../base-model';
import { HasType } from '../has-type';
import Category from '../category';
import { CollectionItemCategory } from './collection-item-category';

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
	item_type: string;

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
	item?: HasType;

	/**
	 * The categories of the item
	 */
	collection_item_categories?: CollectionItemCategory[];
}
