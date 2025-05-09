import React from 'react';

// Mock Page component
jest.mock('../../../components/Template/Page', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => React.createElement('div', { className: 'page' }, children)
}));

// Export all request mocks
export { mockAuthRequests } from './auth-requests';
export { mockCategoryRequests } from './category-requests';
export { mockCollectionManagementRequests } from './collection-management-requests';
export { mockOrganizationRequests } from './organization-requests';
export { mockPostManagementRequests } from './post-management-requests';
export { mockUserPostRequests } from './user-post-requests';
export { mockUserRequests } from './user-requests';

// Import all request mocks for jest.mock
import { mockAuthRequests } from './auth-requests';
import { mockCategoryRequests } from './category-requests';
import { mockCollectionManagementRequests } from './collection-management-requests';
import { mockOrganizationRequests } from './organization-requests';
import { mockPostManagementRequests } from './post-management-requests';
import { mockUserPostRequests } from './user-post-requests';
import { mockUserRequests } from './user-requests';

// Mock all request services
jest.mock('../../../services/requests/AuthRequests', () => ({
    __esModule: true,
    default: mockAuthRequests,
    ...mockAuthRequests
}));

jest.mock('../../../services/requests/CategoryRequests', () => ({
    __esModule: true,
    default: mockCategoryRequests,
    ...mockCategoryRequests
}));

jest.mock('../../../services/requests/CollectionManagementRequests', () => ({
    __esModule: true,
    default: mockCollectionManagementRequests,
    ...mockCollectionManagementRequests
}));

jest.mock('../../../services/requests/OrganizationRequests', () => ({
    __esModule: true,
    default: mockOrganizationRequests,
    ...mockOrganizationRequests
}));

jest.mock('../../../services/requests/PostManagementRequests', () => ({
    __esModule: true,
    default: mockPostManagementRequests,
    ...mockPostManagementRequests
}));

jest.mock('../../../services/requests/UserPostRequests', () => ({
    __esModule: true,
    default: mockUserPostRequests,
    ...mockUserPostRequests
}));

jest.mock('../../../services/requests/UserRequests', () => ({
    __esModule: true,
    default: mockUserRequests,
    ...mockUserRequests
})); 