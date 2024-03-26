import BaseModel from '../base-model';
import Organization from './organization';
import User from '../user/user';
import {AvailableRoles} from '../role';

/**
 * Our Organization Manager details
 */
export default interface OrganizationManager extends BaseModel {

    /**
     * The organization model this relates to if loaded
     */
    organization: Organization;

    /**
     * The related user
     */
    user?: User;

    /**
     * The id of the organization this is related to
     */
    organization_id: number;

    /**
     * The related role
     */
    role_id: number;

    /**
     * the id of the user
     */
    user_id: number;
}
