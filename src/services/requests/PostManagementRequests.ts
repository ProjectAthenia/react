import Business from '../../models/organization/business';
import Post, {PublisherEndpointModel, PublisherEndpointType} from '../../models/post/post';
import api from '../api';
import User from '../../models/user/user';

export default class PostManagementRequests {

    /**
     * Loads a single post for us
     * @param postId
     */
    static async getPost(postId: number) {
        const {data} = await api.get('/posts/' + postId);
        return data as Post;
    }

    /**
     * Runs our actual post creation process
     * @param publisherType
     * @param publisher
     * @param postContent Checkout the post model to get an idea of what the post structure should be
     */
    static async createPost(publisherType: PublisherEndpointType, publisher: PublisherEndpointModel, postContent: any): Promise<Post> {
        const {data} = await api.post('/' + publisherType + '/' + publisher.id! + '/posts', postContent);
        return data as Post;
    }

    /**
     * Runs our update process
     * @param publisherType
     * @param publisher
     * @param post The existing post
     * @param postContent The new content of the post
     */
    static async updatePost(publisherType: PublisherEndpointType, publisher: PublisherEndpointModel, post: Post, postContent: any): Promise<Post> {
        const {data} = await api.put('/' + publisherType + '/' + publisher.id! + '/posts/' + post.id!, postContent);
        return data as Post;
    }

    /**
     * Runs a deletion of a post
     * @param publisherType
     * @param publisherId
     * @param post The existing post
     */
    static async deletePost(publisherType: PublisherEndpointType, publisherId: number, post: Post): Promise<boolean> {
        await api.delete('/' + publisherType + '/' + publisherId + '/posts/' + post.id!);
        return true;
    }
}
