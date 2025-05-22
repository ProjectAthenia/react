import User from '../../models/user/user';

export const mockUserRequests = {
    getUsers: jest.fn(),
    getUser: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn()
}; 