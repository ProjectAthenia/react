
import BaseEntityModel from '../entities';
import Organization from '../organization/organization';
import Role, {AvailableRoles} from '../role';
import Category from "../category";
import OrganizationManager from "../organization/organization-manager";

/**
 * Our user interface
 */
export default interface User extends BaseEntityModel {

    /**
     * The full name of the user
     */
    full_name: string;

    /**
     * The first name the user entered upon sign up
     */
    first_name: string;

    /**
     * The last name the user entered upon sign up
     */
    last_name: string;

    /**
     * The email address of the user
     */
    email: string;

    /**
     * The phone number if set
     */
    phone?: string;

    /**
     * The birthday without any formatting
     */
    birthday?: string;

    /**
     * The gender they user entered, either M F or O
     */
    gender?: string;

    /**
     * The zip code entered
     */
    zip_code?: string;

    /**
     * This is the user bio information
     */
    about_me: string;

    /**
     * The amount of invites that have been accepted for this user
     */
    accepted_invites: number;

    /**
     * The total amount of people that the user follows
     */
    follows_count: number;

    /**
     * The total amount of people that follow the user
     */
    followers_count: number;

    /**
     * The date for when the user
     */
    website_registered_at?: string;

    /**
     * Whether this user signed up when the password field was still required
     */
    has_password: boolean;

    /**
     * Whether this user will receive email notification for transaction receipts
     */
    allow_transaction_receipts: boolean;

    /**
     * Master switch of all push notifications
     */
    receive_push_notifications: boolean;

    /**
     * Whether this user will receive push notification for breaking news
     */
    push_notifications_receive_breaking_news: boolean;

    /**
     * Whether this user will receive push notification for inbox reminders
     */
    push_notifications_receive_inbox_reminders: boolean;

    /**
     * Whether this user will receive push notification for business offers
     */
    push_notifications_receive_business_offers: boolean;

    /**
     * Whether this user will receive push notification for business events
     */
    push_notifications_receive_business_events: boolean;

    /**
     * Whether this user will receive push notification for business updates
     */
    push_notifications_receive_business_updates: boolean;

    /**
     * Whether this user wants notifications for new locations nearby
     */
    push_notifications_receive_new_locations: boolean;

    /**
     * Whether this user receives new followers emails
     */
    email_notifications_receive_new_followers: boolean;

    /**
     * Whether this user receives new locations emails
     */
    email_notifications_receive_new_locations: boolean;

    /**
     * Whether this user receives recent posts emails
     */
    email_notifications_receive_recent_posts: boolean;

    /**
     * Whether other users can find this user
     */
    allow_users_to_find_me: boolean;

    /**
     * Whether other users can add this user
     */
    allow_users_to_add_me: boolean;

    /**
     * All roles that the user has attached to their account
     */
    roles?: Array<Role>;

    /**
     * The organization managers
     */
    organization_managers?: OrganizationManager[];

    /**
     * All categories this user is following
     */
    followed_categories?: Category[];
}

function canUserFillRole(user: User, role: AvailableRoles): boolean {
    return user.roles ? user.roles.find(i => i.id == role) != null : false;
}

/**
 * Tells us whether the user can create full businesses
 * @param user
 */
export function canUserCreateBusiness(user: User): boolean {
    return isSuperUser(user) || canUserFillRole(user, AvailableRoles.BusinessCreator);
}

/**
 * Whether the user is a superuser
 * @param user
 */
export function isSuperUser(user: User): boolean {
    return canUserFillRole(user, AvailableRoles.SuperAdmin);
}

/**
 * tells us whether there is a bisection between the user, the organization, and the roles passed through
 * @param user
 * @param organization
 * @param roles
 */
export function canFillRole(user: User, organization: Organization, roles: AvailableRoles[]) : boolean {
    roles.push(AvailableRoles.Administrator);
    const relatedOrganizationManagers = user.organization_managers?.filter(i => i.organization_id == organization.id) ?? [];

    return isSuperUser(user) || relatedOrganizationManagers.find(i => roles.indexOf(i.role_id) != -1) != undefined;
}

/**
 * Formats the user gender properly
 * @param user
 */
export function formatUserGender(user: User): string {
    switch (user.gender) {
        case 'M':
            return 'Male';

        case 'F':
            return 'Female';

        default:
            return '';
    }
}

/**
 * Formats the phone number properly to be read in the US
 * @param user
 */
export function formatUserPhoneNumber(user: User): string {
    return user.phone? "(" + user.phone.substr(0, 3) + ") "
        + user.phone.substr(3, 3) + "-" + user.phone.substr(6) : '';
}

/**
 * Creates a placeholder user to handle our default logged in user state
 */
export function placeholderUser(): User {
    return {
        first_name: '',
        last_name: '',
        full_name: '',
        email: '',
        phone: '',
        about_me: '',
        has_password: false,
        allow_transaction_receipts: false,
        receive_push_notifications: false,
        push_notifications_receive_breaking_news: false,
        push_notifications_receive_inbox_reminders: false,
        push_notifications_receive_business_offers: false,
        push_notifications_receive_business_events: false,
        push_notifications_receive_business_updates: false,
        push_notifications_receive_new_locations: true,
        email_notifications_receive_new_followers: true,
        email_notifications_receive_new_locations: true,
        email_notifications_receive_recent_posts: true,
        allow_users_to_find_me: true,
        allow_users_to_add_me: true,
        accepted_invites: 0,
        follows_count: 0,
        followers_count: 0,
    };
}

/**
 * The name of the user to display
 */
export function userName(user: User) : string {
    if (user.website_registered_at) {
        return user.full_name;
    }

    return 'Unregistered User';
}
