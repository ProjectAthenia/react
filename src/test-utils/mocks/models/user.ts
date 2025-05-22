import User from '../../../models/user/user';

export const mockUser = (overrides: Partial<User> = {}): User => ({
    id: 1,
    email: 'test@example.com',
    full_name: 'Test User',
    first_name: 'Test',
    last_name: 'User',
    about_me: '',
    accepted_invites: 0,
    allow_users_to_find_me: true,
    allow_users_to_add_me: true,
    created_at: '2023-01-01',
    updated_at: '2023-01-01',
    ...overrides
}); 