import Post from '../../models/post/post';

export const mockPostManagementRequests = {
    getPosts: jest.fn(),
    getPost: jest.fn(),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    publishPost: jest.fn(),
    unpublishPost: jest.fn()
}; 