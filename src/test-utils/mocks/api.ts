import { mockUser } from './models/user';
import { mockCategory } from './models/category';
import { mockCollection } from './models/collection';
import { mockCollectionItem } from './models/collection-items';
import { mockOrganization } from './models/organization';
import { mockBusiness } from './models/business';
import { mockPostResponse } from './models/post-response';
import { mockLocation } from './models/location';
import { mockRole } from './models/role';
import { mockOrganizationManager } from '../../../models/organization/organization-manager';
import { mockPage } from '../../../models/page';

export interface ApiConfig {
    params?: Record<string, any>;
    signal?: AbortSignal;
}

export interface ApiResponse<T> {
    data: T;
}

export interface Page<T> {
    current_page: number;
    last_page: number;
    total: number;
    data: T[];
}

// Export mock data for use in tests
export { mockPlatform, mockPlatformGroup };

const api = {
    get: jest.fn().mockImplementation((url: string, config?: ApiConfig): Promise<ApiResponse<any>> => {
        // Parse URL parameters from both URL and config
        const urlParams = new URLSearchParams(url.split('?')[1] || '');
        const configParams = config?.params || {};
        
        // Merge URL params with config params
        Object.entries(configParams).forEach(([key, value]) => {
            if (value !== undefined) {
                urlParams.set(key, value.toString());
            }
        });

        const expand = urlParams.get('expand[platforms]') === '*';
        const page = parseInt(urlParams.get('page') || '1');
        const limit = parseInt(urlParams.get('limit') || '10');

        // Handle paginated endpoints
        if (url === '/platforms') {
            const response: Page<any> = {
                current_page: page,
                last_page: 1,
                total: 1,
                data: [mockPlatform]
            };
            return Promise.resolve({ data: response });
        }

        if (url === '/platform-groups') {
            const response: Page<any> = {
                current_page: page,
                last_page: 1,
                total: 1,
                data: [mockPlatformGroup]
            };
            return Promise.resolve({ data: response });
        }

        // Handle single platform group endpoint
        const platformGroupMatch = url.match(/\/platform-groups\/(\d+)/);
        if (platformGroupMatch) {
            const groupId = parseInt(platformGroupMatch[1]);
            if (groupId === mockPlatformGroup.id) {
                const response = {
                    ...mockPlatformGroup,
                    platforms: expand ? [mockPlatform] : undefined
                };
                return Promise.resolve({ data: response });
            }
            return Promise.reject({ 
                response: { 
                    data: { error: 'Platform group not found' },
                    status: 404 
                }
            });
        }

        // Handle single platform endpoint
        const platformMatch = url.match(/\/platforms\/(\d+)/);
        if (platformMatch) {
            const platformId = parseInt(platformMatch[1]);
            if (platformId === mockPlatform.id) {
                return Promise.resolve({ data: mockPlatform });
            }
            return Promise.reject({ 
                response: { 
                    data: { error: 'Platform not found' },
                    status: 404 
                }
            });
        }

        // Default response for unhandled endpoints
        return Promise.resolve({ 
            data: {
                current_page: 1,
                last_page: 1,
                total: 0,
                data: []
            }
        });
    }),

    post: jest.fn().mockImplementation((url: string, data: any): Promise<ApiResponse<any>> => {
        if (url === '/platform-groups') {
            return Promise.resolve({ data: { ...mockPlatformGroup, ...data } });
        }
        if (url === '/platforms') {
            return Promise.resolve({ data: { ...mockPlatform, ...data } });
        }
        return Promise.resolve({ data: null });
    }),

    put: jest.fn().mockImplementation((url: string, data: any): Promise<ApiResponse<any>> => {
        const platformGroupMatch = url.match(/\/platform-groups\/(\d+)/);
        if (platformGroupMatch) {
            return Promise.resolve({ data: { ...mockPlatformGroup, ...data } });
        }
        const platformMatch = url.match(/\/platforms\/(\d+)/);
        if (platformMatch) {
            return Promise.resolve({ data: { ...mockPlatform, ...data } });
        }
        return Promise.resolve({ data: null });
    }),

    delete: jest.fn().mockImplementation((url: string): Promise<ApiResponse<any>> => {
        return Promise.resolve({ data: { success: true } });
    })
};

// Mock the API module
jest.mock('../../services/api', () => ({
    __esModule: true,
    default: api
}));

export default api; 