import BaseModel from '../base-model';
import Organization from '../organization/organization';
import Location from '../location/location';
import moment from 'moment';
import User, {canFillRole, isSuperUser} from '../user/user';
import Business from '../organization/business';
import PostLocation from './post-location';
import {addHttpPrefix} from '../../util/strings';
import Asset from '../asset';
import {AvailableRoles} from '../role';

export type PostType
    = 'news'
    | 'product'
    | 'service'
    | 'referral'

/**
 * The publisher types are what will be set on the model when it comes from the server
 */
export type PublisherType
    = 'organization'
    | 'user'

export type Publisher
    = Organization
    | User

/**
 * The publisher endpoint types are how we interact with the post from our end
 */
export type PublisherEndpointType
    = 'businesses'
    | 'users'

export type PublisherEndpointModel
    = Business
    | User

/**
 * The interface for what a post will look like
 */
export default interface Post extends BaseModel {

    /**
     * The id of the organization that created this post
     */
    publisher_id?: number;

    /**
     * The type of entity that created this post
     */
    publisher_type: PublisherType;

    /**
     * The id of the main image
     */
    main_image_id?: number;

    /**
     * The title for this post if it has been set
     */
    title?: string;

    /**
     * The primary type of post this is
     */
    post_type: PostType|string;

    /**
     * The date time for when this post was published
     */
    published_at?: string;

    /**
     * The date time for when this post expires
     */
    expires_at?: string;

    /**
     * The related article
     */
    article?: any;

    /**
     * The content of the article
     */
    article_content?: string;

    /**
     * The url of the main image for this post if there is one
     */
    main_image_url?: string;

    /**
     * The url of the video upload for this post
     */
    video_url?: string;

    /**
     * The custom button label it was entered
     */
    button_label?: string;

    /**
     * The color for the button if it was entered
     */
    button_color?: string;

    /**
     * Instaram id associated with the post if it has an equivelant
     */
    instagram_id?: string;

    /**
     * Whether or not this post originates on instagram
     */
    from_instagram?: boolean;

    /**
     * A URL if entered
     */
    url?: string;

    /**
     * Any price associated with this post
     */
    price?: string;

    /**
     * A max price associated with this post
     */
    max_price?: string;

    /**
     * Whether or not to publish to instagram
     */
    publish_instagram: boolean;

    /**
     * Whether or not to publish to instagram
     */
    publish_facebook: boolean;

    /**
     * Whether or not we want to notify followers upon the post creation
     */
    notify_followers: boolean;

    /**
     * Whether or not commenting is enabled on this post
     */
    comments_allowed: boolean;

    /**
     * The total amount of views the post has gotten
     */
    view_count: number;

    /**
     * The total clicks the post has gotten
     */
    click_count: number;

    /**
     * The total comments the post has gotten
     */
    comment_count?: number;

    /**
     * The total likes the post has gotten
     */
    like_count: number;

    /**
     * How many times this post has been saved
     */
    save_count: number;

    /**
     * How many times this post has been shared
     */
    share_count: number;

    /**
     * The organization that created this post, if it is loaded
     */
    publisher?: Publisher;

    /**
     * The post locations objects
     */
    post_locations?: PostLocation[];

    /**
     * The locations this post is at
     */
    locations?: Location[];
}

export function toPostServerObject(post: Post, postLocations?: PostLocation[], mainImage?: Asset): any {
    let postContent = {
        title: post.title,
        post_type: post.post_type,
        article_content: post.article_content,
        notify_followers: post.notify_followers,
        comments_allowed: post.comments_allowed,
        published_at: post.published_at ?? null,
        publish_instagram: post.publish_instagram,
        publish_facebook: post.publish_facebook,
        expires_at: post.expires_at ?? null,
        price: post.price && post.price != '$' ? post.price : null,
        max_price: post.max_price && post.max_price != '$' ? post.max_price : null,
    } as any;

    if (post.main_image_id) {
        postContent.main_image_id = post.main_image_id
    }
    if (mainImage) {
        postContent.main_image_id = mainImage.id;
    }

    if (post.url && post.button_label) {
        postContent.url = addHttpPrefix(post.url);
        postContent.button_label = post.button_label;

        if (post.button_color) {
            postContent.button_color = post.button_color;
        }
    }

    const newPostLocations = postLocations ?? post.post_locations;
    if (newPostLocations !== undefined) {
        postContent.post_locations = newPostLocations.filter((value, index, array) => {
            const firstOccurrence = array.findIndex(i => i.reference_id == value.reference_id && i.reference_type == value.reference_type);
            return firstOccurrence == index;
        }).map((i: any) => {
            if (!i.latitude || !i.longitude) {
                delete i.latitude;
                delete i.longitude;
            }

            return i;
        });
    }

    return postContent;
}

/**
 * convenience function for getting a starter post
 */
export function postPlaceholder(availablePostTypes: PostType[]): Post {
    return {
        article_content: '',
        post_type: availablePostTypes[0],
        comments_allowed: true,
        notify_followers: false,
        publish_instagram: false,
        publish_facebook: false,
        view_count: 0,
        click_count: 0,
        like_count: 0,
        save_count: 0,
        share_count: 0,
        button_color: '#e77818',
        publisher_type: 'organization',
    };
}

/**
 * Returns the formatted published date
 * @param publishedAt
 */
export function formatPostPublishedAtDate(publishedAt: string): string {
    return moment(publishedAt).format('MMMM Do, h:mm a');
}

/**
 * Tells us whether or not the post has expired
 * @param post
 */
export function isPostPublished(post: Post): boolean {
    return post.published_at ? Date.parse(post.published_at) <= Date.now() + 60 * 1000 : false;
}

/**
 * Tells us whether or not the post was published in the last minute
 * @param post
 */
export function isPostRecentlyPublished(post: Post): boolean {
    return post.published_at ? Math.abs(Date.now() - Date.parse(post.published_at))  < 5 * 1000 : false;
}

/**
 * Tells us whether or not the post has expired
 * @param post
 */
export function isPostExpired(post: Post): boolean {
    return post.expires_at ? Date.parse(post.expires_at) < Date.now() : false;
}

/**
 * This takes in two arrays and returns a new array combining all unique
 * @param seenPosts
 * @param availablePosts
 */
export function getUnseenPosts(seenPosts: Post[], availablePosts: Post[]) : Post[] {
    return availablePosts.filter(availablePost => !seenPosts.find(seenPost => seenPost.id == availablePost.id));
}

export function canUserRemovePost(user: User, post: Post): boolean {
    if (isSuperUser(user)) {
        return true;
    }

    const organizationRoles = [
        AvailableRoles.Administrator,
        AvailableRoles.Manager,
    ];

    if (post.publisher_type == 'organization') {
        return canFillRole(user, (post.publisher ? post.publisher : {
            id: post.publisher_id
        }) as Organization, organizationRoles);
    } else if (post.publisher_id == user.id) {
        return true;
    } else {
        const organizations =
            post.locations?.filter(i => i.business)
                .map(i => ({id: i.business!.organization_id} as Organization)) ?? []
        return organizations.find(i => canFillRole(user, i, organizationRoles)) != undefined;
    }
}
