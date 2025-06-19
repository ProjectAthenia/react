import BaseModel from '../base-model';

/**
 * Our Organization details
 */
export default interface Organization extends BaseModel {

    /**
     * the name of the merchant
     */
    name: string;

    /**
     * The description of the organization
     */
    description?: string;
}

/**
 * Gets an organization that we can use throughout the app if we need to load the organization
 */
export const placeholderOrganization = (): Organization => ({
    name: ''
});
