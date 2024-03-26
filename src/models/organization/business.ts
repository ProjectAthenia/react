import BaseModel from '../base-model';
import Location from '../location/location';
import Asset from '../asset';
import Category, {isCategoryEligibleForProPlan} from '../category';
import Organization from './organization';

/**
 * The interface for our business model
 */
export default interface Business extends BaseModel {

    /**
     * The full name of the business
     */
    full_name: string;

    /**
     * The id of the organization this is related to
     */
    organization_id: number;

    /**
     * The name of our business
     */
    name: string;

    /**
     * The amount of people that are following a business
     */
    total_followers: number;

    /**
     * The total amount of locations within a business
     */
    total_locations: number;

    /**
     * The website url for the business
     */
    website?: string;

    /**
     *
     */
    approved_at?: string;

    /**
     * The url to the banner if there is a banner
     */
    banner_url?: string;

    /**
     * The url to this businesses logo if it exists
     */
    logo_url?: string;

    /**
     * The main category name of the business if the business manager has set it
     */
    main_category_name?: string;

    /**
     * The id that the business owner has selected as the main category id
     */
    main_category_id?: number,

    /**
     * The owning Organization if this has been expanded
     */
    organization?: Organization;

    /**
     * The main category of the business
     */
    main_category?: Category;

    /**
     * The categories for this business
     */
    categories?: Category[];

    /**
     * The locations for this business if they are loaded
     */
    locations?: Location[];

    /**
     * The featured images that have been selected for this business
     */
    featured_images?: Asset[];

}

/**
 * Gets the quick information used throughout the app for a business
 * @param business
 * @param location
 */
export function getBusinessQuickInformationLine(business: Business, location: Location|null = null): string {
    const parts: string[] = [];

    if (business.main_category_name) {
        parts.push(business.main_category_name);
    }

    if (location) {
        parts.push(location.neighborhood ?? location.city);
    }

    parts.push(business.total_followers + ' followers');

    return parts.join(" * ");
}

/**
 * Determines if a business is eligible for the pro plan based on it's main category
 * @param business
 */
export function isBusinessEligibleForProPlan(business: Business): boolean {
    if (business.main_category) {
        return isCategoryEligibleForProPlan(business.main_category);
    }
    return false;
}

/**
 * Gets an organization that we can use throughout the app if we need to load the organization
 */
export function placeholderBusiness(): Business {
    return {
        name: '',
        full_name: '',
        website: '',
        total_locations: 0,
        total_followers: 0,
        organization_id: 0,
    };
}
