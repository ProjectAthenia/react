import BaseModel from './base-model';

/**
 * The interface for what we can expect our category to look like
 */
export default interface Category extends BaseModel {

    /**
     * The name of the category
     */
    name: string;

    /**
     * The description of the category if it is written
     */
    description?: string;

    /**
     * Whether or not this category can be used as a primary category for a business
     */
    can_be_primary: boolean;
}
