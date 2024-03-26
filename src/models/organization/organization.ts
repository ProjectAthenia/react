import Business from './business';
import BaseEntityModel from '../entities';

/**
 * Our Organization details
 */
export default interface Organization extends BaseEntityModel {

    /**
     * the name of the merchant
     */
    name: string;

    /**
     * Whether or not the merchant is inactive
     */
    inactive: boolean;

    /**
     * The profile image for this organization if set
     */
    profile_image_url?: string;

    /**
     * All businesses for this organization
     */
    businesses?: Business[];
}

/**
 * Gets an organization that we can use throughout the app if we need to load the organization
 */
export function placeholderOrganization(): Organization {
    return {
        id: 0,
        name: '',
        inactive: false,
        created_at: '',
        updated_at: '',
    };
}
