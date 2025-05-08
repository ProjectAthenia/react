import React from 'react';
import { mockAuthRequests } from './auth-requests';
import { mockCategoryRequests } from './category-requests';
import { mockCollectionRequests } from './collection-requests';
import { mockLocationRequests } from './location-requests';
import { mockMeRequests } from './me-requests';
import { mockOrganizationRequests } from './organization-requests';
import { mockPostManagementRequests } from './post-management-requests';
import { mockPostRequests } from './post-requests';
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

// Mock CollectionRequests
jest.mock('../../services/requests/CollectionRequests', () => ({
    __esModule: true,
    default: mockCollectionRequests,
    ...mockCollectionRequests
}));

// Mock LocationRequests
jest.mock('../../services/requests/LocationRequests', () => ({
    __esModule: true,
    default: mockLocationRequests,
    ...mockLocationRequests
}));

// Mock MeRequests
jest.mock('../../services/requests/MeRequests', () => ({
    __esModule: true,
    default: mockMeRequests,
    ...mockMeRequests
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

// Mock PostRequests
jest.mock('../../services/requests/PostRequests', () => ({
    __esModule: true,
    default: mockPostRequests,
    ...mockPostRequests
}));

// Mock UserRequests
jest.mock('../../services/requests/UserRequests', () => ({
    __esModule: true,
    default: mockUserRequests,
    ...mockUserRequests
})); 