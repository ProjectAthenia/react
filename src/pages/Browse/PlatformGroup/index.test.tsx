import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import PlatformGroupPage from './index';
import { renderWithProviders } from '../../../test-utils';
import { mockPlatformGroup } from '../../../test-utils/mocks/models';
import PlatformManagementRequests from '../../../services/requests/PlatformManagementRequests';

// Mock the Page component
jest.mock('../../../components/Template/Page', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div className="page">{children}</div>
}));

// Mock useParams
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ id: '1' })
}));

// Mock PlatformManagementRequests
jest.mock('../../../services/requests/PlatformManagementRequests');

// Mock ReleaseBrowser component
jest.mock('../../../components/Browse/ReleaseBrowser', () => ({
    __esModule: true,
    default: ({ platformGroup }: { platformGroup: any }) => (
        <div data-testid="release-browser" className="release-browser-mock">
            Mocked Release Browser for {platformGroup?.name || 'unknown'} with {platformGroup?.total_games || 0} games
        </div>
    )
}));

describe('PlatformGroupPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders platform group content when group is found', async () => {
        // Mock the service response
        (PlatformManagementRequests.getPlatformGroup as jest.Mock).mockResolvedValueOnce(mockPlatformGroup);
        
        renderWithProviders(<PlatformGroupPage />);
        
        await waitFor(() => {
            expect(screen.getByText(mockPlatformGroup.name)).toBeInTheDocument();
            expect(screen.getByText(`${mockPlatformGroup.total_games} total games`)).toBeInTheDocument();
            expect(screen.getByText('Platforms in this group')).toBeInTheDocument();
        });
    });

    it('renders the release browser component', async () => {
        // Mock the service response
        (PlatformManagementRequests.getPlatformGroup as jest.Mock).mockResolvedValueOnce(mockPlatformGroup);
        
        renderWithProviders(<PlatformGroupPage />);
        
        await waitFor(() => {
            expect(screen.getByText('Releases')).toBeInTheDocument();
            expect(screen.getByTestId('release-browser')).toBeInTheDocument();
            expect(screen.getByText(`Mocked Release Browser for ${mockPlatformGroup.name} with ${mockPlatformGroup.total_games} games`)).toBeInTheDocument();
        });
    });

    it('shows error when platform group is not found', async () => {
        // Mock the service to reject with a 404 error
        (PlatformManagementRequests.getPlatformGroup as jest.Mock).mockRejectedValueOnce({
            response: { data: { error: 'Platform group not found' }, status: 404 }
        });
        
        renderWithProviders(<PlatformGroupPage />);
        
        await waitFor(() => {
            expect(screen.getByText('Platform group not found')).toBeInTheDocument();
        });
    });

    it('shows error for invalid group ID', async () => {
        // Mock useParams to return an invalid ID
        jest.spyOn(require('react-router-dom'), 'useParams').mockReturnValue({ id: 'invalid' });
        
        renderWithProviders(<PlatformGroupPage />);

        await waitFor(() => {
            expect(screen.getByText('Invalid group ID')).toBeInTheDocument();
        });
    });
}); 