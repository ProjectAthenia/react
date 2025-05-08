import React from 'react';
import { mockAuthRequests } from './auth-requests';
import { mockCategoryRequests } from './category-requests';
import { mockCollectionManagementRequests } from './collection-management-requests';
import { mockOrganizationRequests } from './organization-requests';
import { mockPostManagementRequests } from './post-management-requests';
import { mockUserPostRequests } from './user-post-requests';
import { mockUserRequests } from './user-requests';

// Mock Page component
jest.mock('../../components/Template/Page', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => React.createElement('div', { className: 'page' }, children)
}));

// Mock AuthRequests
jest.mock('../../services/requests/AuthRequests', () => ({
    __esModule: true,
    default: mockAuthRequests,
    ...mockAuthRequests
}));

// Mock CategoryRequests
jest.mock('../../services/requests/CategoryRequests', () => ({
    __esModule: true,
    default: mockCategoryRequests,
    ...mockCategoryRequests
}));

// Mock CollectionManagementRequests
jest.mock('../../services/requests/CollectionManagementRequests', () => ({
    __esModule: true,
    default: mockCollectionManagementRequests,
    ...mockCollectionManagementRequests
}));

// Mock OrganizationRequests
jest.mock('../../services/requests/OrganizationRequests', () => ({
    __esModule: true,
    default: mockOrganizationRequests,
    ...mockOrganizationRequests
}));

// Mock PostManagementRequests
jest.mock('../../services/requests/PostManagementRequests', () => ({
    __esModule: true,
    default: mockPostManagementRequests,
    ...mockPostManagementRequests
}));

// Mock UserPostRequests
jest.mock('../../services/requests/UserPostRequests', () => ({
    __esModule: true,
    default: mockUserPostRequests,
    ...mockUserPostRequests
}));

// Mock UserRequests
jest.mock('../../services/requests/UserRequests', () => ({
    __esModule: true,
    default: mockUserRequests,
    ...mockUserRequests
})); 