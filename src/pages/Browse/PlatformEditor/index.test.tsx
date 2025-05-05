import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { PlatformEditorContent } from './index';
import PlatformManagementRequests from '../../../services/requests/PlatformManagementRequests';
import { PlatformsContextState } from '../../../contexts/GamingComponents/PlatformsContext';
import { renderWithRouter } from '../../../test-utils';

const mockHistoryPush = jest.fn();
const mockUseParams = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => mockUseParams(),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

// Mock the PlatformManagementRequests
jest.mock('../../../services/requests/PlatformManagementRequests');

// Mock the PlatformForm component
jest.mock('../../../components/Forms/PlatformForm', () => {
    return function MockPlatformForm({ onSubmit, onCancel, submitError, mode }: any) {
        return (
            <form role="form">
                {submitError && <div role="alert">{submitError}</div>}
                <button type="button" onClick={onCancel}>Back</button>
                <button type="submit" onClick={() => onSubmit({ name: 'Test Platform' })} role={mode === 'edit' ? 'Save' : 'Create'}>
                    {mode === 'edit' ? 'Save' : 'Create'}
                </button>
            </form>
        );
    };
});

// Mock the Page component
jest.mock('../../../components/Template/Page', () => {
    return function MockPage({ children }: any) {
        return <div>{children}</div>;
    };
});

const mockPlatformsContext: PlatformsContextState = {
    initialLoadComplete: false,
    refreshing: false,
    loadedData: [],
    hasAnotherPage: false,
    initiated: true,
    noResults: false,
    expands: [],
    order: {},
    filter: {},
    search: {},
    limit: 20,
    loadAll: false,
    loadNext: jest.fn(),
    refreshData: jest.fn(),
    setFilter: jest.fn(),
    setSearch: jest.fn(),
    setOrder: jest.fn(),
    addModel: jest.fn(),
    removeModel: jest.fn(),
    getModel: jest.fn(),
    params: {}
};

describe('PlatformEditorContent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseParams.mockReturnValue({ id: undefined });
    });

    it('shows loading state when data is being loaded', () => {
        mockUseParams.mockReturnValue({ id: '1' });
        // Mock getPlatform to return a promise that never resolves
        (PlatformManagementRequests.getPlatform as jest.Mock).mockImplementation(() => new Promise(() => {}));

        renderWithRouter(
            <PlatformEditorContent platformsContext={mockPlatformsContext} />
        );

        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('shows error when platform is not found', async () => {
        mockUseParams.mockReturnValue({ id: '1' });
        // Mock the getPlatform request to throw an error
        (PlatformManagementRequests.getPlatform as jest.Mock).mockRejectedValueOnce(new Error('Not found'));

        renderWithRouter(
            <PlatformEditorContent platformsContext={mockPlatformsContext} />
        );

        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent('Failed to load platform. Please try again.');
        });
    });

    it('handles successful platform update', async () => {
        mockUseParams.mockReturnValue({ id: '1' });
        // Mock the getPlatform request to return a platform
        const mockPlatform = { id: 1, name: 'Test Platform' };
        (PlatformManagementRequests.getPlatform as jest.Mock).mockResolvedValueOnce(mockPlatform);
        (PlatformManagementRequests.updatePlatform as jest.Mock).mockResolvedValueOnce(mockPlatform);

        renderWithRouter(
            <PlatformEditorContent platformsContext={mockPlatformsContext} />
        );

        await waitFor(() => {
            expect(screen.getByRole('Save')).toBeInTheDocument();
        });

        // Click the save button
        screen.getByRole('Save').click();

        await waitFor(() => {
            expect(PlatformManagementRequests.updatePlatform).toHaveBeenCalled();
        });
    });

    it('renders form when platform is loaded', async () => {
        renderWithRouter(
            <PlatformEditorContent platformsContext={mockPlatformsContext} />
        );
        
        await waitFor(() => {
            expect(screen.getByRole('form')).toBeInTheDocument();
        });
    });

    it('navigates back when back button is clicked', () => {
        renderWithRouter(
            <PlatformEditorContent platformsContext={mockPlatformsContext} />
        );

        const backButton = screen.getByRole('button', { name: /back/i });
        fireEvent.click(backButton);

        expect(mockHistoryPush).toHaveBeenCalledWith('/browse/platforms');
    });
}); 