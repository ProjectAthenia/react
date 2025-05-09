import Post from '../../models/post/post';

export const mockUserPostRequests = {
    getUserPosts: jest.fn(),
    getUserPost: jest.fn(),
    createUserPost: jest.fn(),
    updateUserPost: jest.fn(),
    deleteUserPost: jest.fn()
}; 