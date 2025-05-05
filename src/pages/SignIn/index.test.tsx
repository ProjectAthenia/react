import React from 'react';
import { mockHistory, mockHistoryPush, renderWithProviders } from '../../test-utils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import SignIn from './index';
import AuthRequests from '../../services/requests/AuthRequests';

// Mock AuthRequests
jest.mock('../../services/requests/AuthRequests', () => ({
    signIn: jest.fn()
}));

// Mock the Page component
jest.mock('../../components/Template/Page', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div className="page">{children}</div>
}));

// Mock useHistory
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

describe('SignIn', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockHistoryPush.mockClear();
        localStorage.clear();
    });

    it('handles successful sign in with redirect', async () => {
        (AuthRequests.signIn as jest.Mock).mockResolvedValue(true);
        localStorage.setItem('login_redirect', '/browse');

        renderWithProviders(<SignIn />);

        const emailInput = screen.getByRole('textbox', { name: /email/i });
        const passwordInput = screen.getByLabelText(/password/i);

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        const submitButton = screen.getByRole('button', { name: 'Sign In' });
        fireEvent.click(submitButton);

        // Wait for the auth request to complete
        await waitFor(() => {
            expect(AuthRequests.signIn).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123'
            });
        });

        // Wait for the redirect to happen
        await waitFor(() => {
            expect(mockHistoryPush).toHaveBeenCalledWith('/browse');
        });
    });

    it('handles sign in error', async () => {
        (AuthRequests.signIn as jest.Mock).mockRejectedValue({ status: 401 });

        renderWithProviders(<SignIn />);

        const emailInput = screen.getByRole('textbox', { name: /email/i });
        const passwordInput = screen.getByLabelText(/password/i);

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

        const submitButton = screen.getByRole('button', { name: 'Sign In' });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Invalid Login Credentials.')).toBeInTheDocument();
        });
    });

    it('shows validation errors for empty fields', async () => {
        renderWithProviders(<SignIn />);

        const submitButton = screen.getByRole('button', { name: 'Sign In' });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Email required')).toBeInTheDocument();
            expect(screen.getByText('Password is required')).toBeInTheDocument();
        });
    });
});
