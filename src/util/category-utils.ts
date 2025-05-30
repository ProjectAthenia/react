import Category from '../models/category';

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

/**
 * Checks if a category can be used as a primary category
 * @param category
 */
export function canBePrimaryCategory(category: Category): boolean {
    return category.can_be_primary ?? false;
}

/**
 * Creates a new category with default values
 * @param name
 */
export function createNewCategory(name: string): Category {
    return {
        id: 0,
        name,
        can_be_primary: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        description: undefined,
        parent_id: undefined,
        parent: undefined,
        children: undefined
    };
} 