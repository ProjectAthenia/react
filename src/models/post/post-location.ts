import BaseModel from '../base-model';
import Business from '../organization/business';
import Location from '../location/location';
import User from '../user/user';

type AvailableReferenceType
    = 'business' | 'location' | 'google_place' | 'user'

type ResourceType
    = Business | Location | User

/**
 * The data structure for our post location
 */
export default interface PostLocation extends BaseModel {

    /**
     * The longitude of the actual location
     */
    longitude: number;

    /**
     * The latitude of the actual location
     */
    latitude: number;

    /**
     * The id of the piece of data that this location is centered around
     */
    reference_id: number|string;

    /**
     * whether this is a tagged location
     */
    tagged?: boolean;

    /**
     * The type of resource the is related to
     */
    reference_type: AvailableReferenceType;

    /**
     * The actual reference if it is loaded
     */
    reference?: ResourceType;
}

export const postLocationPlaceholder = (): PostLocation => ({
    longitude: 0,
    latitude: 0,
    reference_id: 0,
    reference_type: "user"
})
//
// export const findGooglePlaceAddressComponent = (componentType: string, googlePlaceResult?:  google.maps.places.PlaceResult) => (
//     googlePlaceResult?.address_components?.find( (component) => component.types.includes(componentType) )
// )
