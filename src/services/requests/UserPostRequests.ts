import api from '../api';
import Page from '../../models/page';
import {isNaN} from 'formik';

export default class UserPostRequests {

    /**
     * Gets a single post off the server
     * @param postId
     */
    static async getPost(postId: number): Promise<any> {
        const {data} = await api.get('/posts/' + postId, {
            params: {
                'expand[publisher]': '*',
            },
        });

        return data;
    }

    /**
     * Reports the users initial response to a post for us
     * @param post
     * @param postResponseData The response data
     */
    static async reportPostResponse(post: any|string, postResponseData: any): Promise<any> {
        const postId = isNaN(+post) ? (post as any).id! : post;
        const {data} = await api.post('/posts/' + postId + '/responses', postResponseData);

        return data;
    }

    /**
     * Runs our update process
     * @param postResponse The existing response ID
     * @param postResponseData The response data
     */
    static async updatePostResponse(postResponse: any, postResponseData: any): Promise<any> {
        const {data} = await api.put('/users/' + postResponse.user_id + '/post-responses/' + postResponse.id!, postResponseData);
        return data;
    }

    /**
     * Archives a post response for us
     * @param postResponse
     */
    static async archivePostResponse(postResponse: any): Promise<any> {
        const {data} = await api.put('/users/' + postResponse.user_id + '/post-responses/' + postResponse.id!, {
            archived: true,
        });

        return data;
    }

    /**
     * Gets the next up posts for a user
     *
     * @param userId
     */
    static async getUserFollowingUnseenPosts(userId: number): Promise<Page<any>> {
        const {data} = await api.get('/users/' + userId + '/followed-posts');
        return data as Page<any>;
    }

    /**
     * Searches the server to see if the user has responded to the post yet
     * @param userId
     * @param postId
     * @param includePostData
     */
    static async searchForPostResponse(userId: number, postId: number, includePostData = true): Promise<Page<any>> {
        const expands = [
            'follows',
            'follows.follows',
        ];
        if (includePostData) {
            expands.push(...[
                'post',
                'post.publisher',
            ]);
        }
        const expand = "&expand[" + expands.join("]=*&expand[") + "]=*";
        const {data} = await api.get('/users/' + userId + '/post-responses?filter[post_id]=' + postId + expand + "&order[created_at]=DESC");

        return data as Page<any>;
    }
}
