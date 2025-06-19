import BaseModel from '../base-model';
import { HasType } from '../has-type';
import Category from '../category';
import { CollectionItemCategory } from './collection-item-category';

export enum CollectionItemTypes {
	POST = 'post',
	BUSINESS = 'business',
	USER = 'user'
}

/**
 * The data interface for albums
 */
export default interface CollectionItem extends BaseModel {
	type: CollectionItemTypes;

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

	categories?: Category[];
}

export const placeholderCollectionItem = (): CollectionItem => ({
	type: CollectionItemTypes.POST,
	item_id: 0,
	item_type: 'post',
	collection_id: 0,
	order: 0,
});
