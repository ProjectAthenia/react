import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import PlatformGroupEditor from './index';
import PlatformManagementRequests from '../../../services/requests/PlatformManagementRequests';
import { PlatformGroupEditorContent } from './index';
import { renderWithRouter } from '../../../test-utils';

const mockHistoryPush = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

// Mock the PlatformManagementRequests service
jest.mock('../../../services/requests/PlatformManagementRequests', () => ({
    createPlatformGroup: jest.fn(),
    updatePlatformGroup: jest.fn(),
    getPlatformGroup: jest.fn(),
}));

// Mock the PlatformGroupForm component
jest.mock('../../../components/Forms/PlatformGroupForm', () => {
    return function MockPlatformGroupForm({ onSubmit, onCancel, submitError, isSubmitting }: any) {
        const [name, setName] = React.useState('');
        const [validationError, setValidationError] = React.useState('');

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (!name.trim()) {
                setValidationError('Name is required');
                return;
            }
            setValidationError('');
            onSubmit({ name });
        };

        return (
            <form role="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        aria-label="Name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setValidationError('');
                        }}
                    />
                    {validationError && (
                        <span className="error-message" role="alert">{validationError}</span>
                    )}
                </div>
                {submitError && <div role="alert">{submitError}</div>}
                <button type="button" onClick={onCancel} disabled={isSubmitting}>Back</button>
                <button type="submit" disabled={isSubmitting}>
                    Create Platform Group
                </button>
            </form>
        );
    };
});

describe('PlatformGroupEditor', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the form correctly', () => {
        renderWithRouter(<PlatformGroupEditorContent />);

        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
    });

    it('shows validation error when submitting empty form', async () => {
        renderWithRouter(<PlatformGroupEditorContent />);

        const submitButton = screen.getByRole('button', { name: /create/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    });

    it('submits form successfully with valid data', async () => {
        const mockResponse = { id: 1, name: 'Test Group' };
        (PlatformManagementRequests.createPlatformGroup as jest.Mock).mockResolvedValueOnce(mockResponse);

        renderWithRouter(<PlatformGroupEditorContent />);

        const nameInput = screen.getByLabelText(/name/i);
        const submitButton = screen.getByRole('button', { name: /create/i });

        fireEvent.change(nameInput, { target: { value: 'Test Group' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(PlatformManagementRequests.createPlatformGroup).toHaveBeenCalledWith({
                name: 'Test Group'
            });
        });
    });

    it('handles API error correctly', async () => {
        (PlatformManagementRequests.createPlatformGroup as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

        renderWithRouter(<PlatformGroupEditorContent />);

        const nameInput = screen.getByLabelText(/name/i);
        const submitButton = screen.getByRole('button', { name: /create/i });

        fireEvent.change(nameInput, { target: { value: 'Test Group' } });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/failed to create platform group/i)).toBeInTheDocument();
    });

    it('navigates back when back button is clicked', () => {
        renderWithRouter(<PlatformGroupEditorContent />);

        const backButton = screen.getByRole('button', { name: /back/i });
        fireEvent.click(backButton);

        expect(mockHistoryPush).toHaveBeenCalledWith('/browse/platform-groups');
    });
}); 