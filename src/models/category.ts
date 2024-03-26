import BaseModel from './base-model';
import Business from './organization/business';

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

    /**
     * The business if they are loaded
     */
    businesses?: Business[];

    /**
     * The radius of the area locations can be in, related to the primary location
     */
    location_fence_radius?: number;

    /**
     * The number of posts currently available for this category
     */
    posts_count?: number;

    /**
     * The number of users currently following this category
     */
    followers_count?: number;
}

/**
 * Finds a category with the passed in name if one exists
 * @param categories
 * @param name
 */
export function findCategory(categories: Category[], name: string): Category|undefined {
    return categories.find(i => i.name.toLowerCase() === name.toLowerCase());
}

/**
 * Removes a category with the passed in name if one exists
 * @param categories
 * @param name
 */
export function removeCategoryFromList(categories: Category[], name: string): Category[] {
    return categories.filter(i => i.name.toLowerCase() !== name.toLowerCase());
}

/**
 * determines if a category is eligible to signup for the pro plan
 * @param category
 */
export function isCategoryEligibleForProPlan(category: Category): boolean {
    return category.can_be_primary;
}

/**
 * Outputs an empty Category object
 */
export function generateEmptyCategory(): Category {
    return {
        name: "",
        can_be_primary: false,
    }
}
