import BaseModel from '../base-model';
import Follower from '../user/follower';
import Post from './post';
import User from "../user/user";

/**
 * The interface for when someone has responded to a post
 */
export default interface PostResponse extends BaseModel {

    /**
     * The id of the post that was responded to
     */
    post_id: number;

    /**
     * The id of the user that responded to the post
     */
    user_id: number;

    /**
     * Whether or not the user liked the post
     */
    liked: boolean;

    /**
     * Whether or not the user saved the post
     */
    saved: boolean;

    /**
     * Whether or not the user shared the post
     */
    shared: boolean;

    /**
     * Whether or not the user clicked the button associated with the post
     */
    clicked: boolean;

    /**
     * Whether or not the post was opened from a share
     */
    share_clicked?: boolean;

    /**
     * Whether or not the post was opened from a notification
     */
    notification_clicked?: boolean;

    /**
     * Whether or not this post has been archived
     */
    archived?: boolean;

    /**
     * Whether or not the user has reported the post
     */
    reported?: boolean;

    /**
     * This is pseudo prop that needs to be submitted when the post was dismissed from the user
     */
    dismissed?: boolean;

    /**
     * This is only set from the server. If this is not set, then the post has not been dismissed yet
     */
    dismissed_at?: string;

    /**
     * The id for the related follows location
     */
    follows_id?: number;

    /**
     * The related follows location
     */
    follows?: Follower;

    /**
     * The post that was responded to
     */
    post: Post;

    /**
     * The User that responded
     */
    user?: User;
}

export  const defaultPostResponse = {
    saved: false,
    clicked: false,
    liked: false,
    shared: false,
} as PostResponse

/**
 * Takes in a working model, and returns the data that we want to submit to the server
 * @param postResponse
 */
export const postResponseToServerSubmission = (postResponse: PostResponse) => {
    const submitData : any = {
        liked: postResponse.liked,
        saved: postResponse.saved,
        shared: postResponse.shared,
        clicked: postResponse.clicked,
    }

    if (postResponse.reported != undefined) {
        submitData.reported = postResponse.reported
    }
    if (postResponse.follows_id != undefined) {
        submitData.follows_id = postResponse.follows_id
    }
    if (postResponse.archived != undefined) {
        submitData.archived = postResponse.archived
    }
    if (postResponse.dismissed) {
        submitData.dismissed = postResponse.dismissed
    }
    if (postResponse.notification_clicked) {
        submitData.notification_clicked = postResponse.notification_clicked
    }
    if (postResponse.share_clicked) {
        submitData.share_clicked = postResponse.share_clicked
    }

    return submitData;
}


/**
 * Acceptable strings for labeling a post interaction
 */
export type PostResponseType
    = 'Likes'
    | 'Saves'
    | 'Clicks'
    | 'Views'
    | 'Viewed'

/**
 * determines if a response is a member of the passed in type
 * @param response
 * @param postResponseType
 */
export function isResponseOfType(response: PostResponse, postResponseType: string): boolean {
    switch(postResponseType.toLowerCase()){
        case 'likes':
        case 'agree':
            return response.liked
        case 'saves':
            return response.saved
        case 'clicks':
            return response.clicked
        case 'views':
        case 'viewed':
            return true
        default:
            console.warn(`Type of "${postResponseType}" is not a valid Response Type`)
            return false
    }
}
