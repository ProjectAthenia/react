import BaseModel from '../base-model';
import CustomLink from '../custom-link';
import Business from '../organization/business';
import Asset from "../asset";

/**
 * model wrapper for a piece of location data
 */
export default interface Location extends BaseModel {

    /**
     * The name of the location
     */
    name: string;

    /**
     * The business id of our location
     */
    business_id: number;

    /**
     * The logo asset if it exists
     */
    logo_asset?: Asset;

    /**
     * The id of the related logo
     */
    logo_asset_id?: number;

    /**
     * The url to the logo image for this location
     */
    logo?: string;

    /**
     * The street number for the location
     */
    address: string;

    /**
     * The city for the location
     */
    city: string;

    /**
     * The state for this location
     */
    state: string;

    /**
     * The zip code for this location
     */
    zip: string;

    /**
     * The website url the admin entered
     */
    website?: string;

    /**
     * The phone number the user has entered for the location
     */
    phone?: string;

    /**
     * The email the user has entered for the location
     */
    email?: string;

    /**
     * The neighborhood of this location if set
     */
    neighborhood?: string;

    /**
     * The description of the location
     */
    description?: string;

    /**
     * The latitude coordinate for the location
     */
    latitude?: number;

    /**
     * The longitude coordinate for the location
     */
    longitude?: number;

    /**
     * Whether or not this location is currently inactive
     */
    inactive: boolean;

    /**
     * Whether or not this location should have it's physical address hidden to outside members
     */
    hide_address: boolean;

    /**
     * whether or not this location is ready to be publicly available
     */
    ready_at?: string;

    /**
     * The business this is owned by. This is set whenever the data load started from the location
     */
    business?: Business;

    /**
     * The custom links that have been configured for this location
     */
    custom_links?: CustomLink[];
}

export function placeholderLocation(): Location {
    return {
        address: '',
        city: '',
        inactive: false,
        hide_address: false,
        logo: '',
        business_id: 0,
        name: '',
        state: '',
        zip: ''
    }
}

/**
 * selects the proper logo that should be used to represent the location depending on what information we have on the location
 * @param location
 * @param business
 */
export function selectionLocationLogo(location: Location, business: Business): string|undefined {
    return location.logo ? location.logo : business.logo_url;
}
