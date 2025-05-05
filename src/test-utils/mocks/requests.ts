import React from 'react';
import { mockPlatform, mockPlatformGroup } from './models';

const mockPlatformManagementRequests = {
    getPlatformGroup: jest.fn().mockResolvedValue(mockPlatformGroup),
    createPlatformGroup: jest.fn(),
    updatePlatformGroup: jest.fn(),
    deletePlatformGroup: jest.fn(),
    getPlatform: jest.fn().mockResolvedValue(mockPlatform),
    createPlatform: jest.fn(),
    updatePlatform: jest.fn(),
    deletePlatform: jest.fn()
};

// Mock PlatformManagementRequests
jest.mock('../../services/requests/PlatformManagementRequests', () => ({
    __esModule: true,
    default: mockPlatformManagementRequests,
    ...mockPlatformManagementRequests
}));

// Mock Page component
jest.mock('../../components/Template/Page', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => React.createElement('div', { className: 'page' }, children)
}));

export { mockPlatformManagementRequests }; 