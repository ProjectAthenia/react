import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import PlatformPage from '.';
import Platform from '../../../models/platform/platform';
import PlatformManagementRequests from '../../../services/requests/PlatformManagementRequests';
import { renderWithProviders } from '../../../test-utils';
import api from '../../../test-utils/mocks/api';

// Mock useParams
const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => mockUseParams()
}));

// Mock PlatformManagementRequests
jest.mock('../../../services/requests/PlatformManagementRequests', () => ({
    __esModule: true,
    default: {
        getPlatform: jest.fn().mockImplementation((id) => {
            if (id === 1) {
                return Promise.resolve({
                    id: 1,
                    name: 'Test Platform',
                    total_games: 100,
                    platform_group_id: 1,
                    platform_group: {
                        id: 1,
                        name: 'Test Group',
                        total_games: 500,
                    },
                });
            }
            return Promise.reject(new Error('Platform not found'));
        })
    }
}));

describe('PlatformPage', () => {
    const mockPlatform: Platform = {
        id: 1,
        name: 'Test Platform',
        total_games: 100,
        platform_group_id: 1,
        platform_group: {
            id: 1,
            name: 'Test Group',
            total_games: 500,
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseParams.mockReturnValue({ id: '1' });
    });

    it('shows loading state initially', () => {
        renderWithProviders(<PlatformPage />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows error when platform is not found', async () => {
        mockUseParams.mockReturnValue({ id: '999' });
        
        renderWithProviders(<PlatformPage />);
        
        await waitFor(() => {
            expect(screen.getByText('Platform not found')).toBeInTheDocument();
        });
    });

    it('shows error for invalid platform ID', async () => {
        mockUseParams.mockReturnValue({ id: 'invalid' });
        
        renderWithProviders(<PlatformPage />);
        
        await waitFor(() => {
            expect(screen.getByText('Invalid platform ID')).toBeInTheDocument();
        });
    });

    it('renders platform content when platform is found', async () => {
        renderWithProviders(<PlatformPage />);
        
        await waitFor(() => {
            expect(screen.getByText('Test Platform')).toBeInTheDocument();
            expect(screen.getByText('100 games.')).toBeInTheDocument();
            expect(screen.getByText('Part of Test Group')).toBeInTheDocument();
        });
    });
}); 