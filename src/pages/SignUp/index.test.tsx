import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from './index';
import { mockHistory, renderWithRouter } from '../../test-utils';
import AuthRequests from '../../services/requests/AuthRequests';

jest.mock('../../services/requests/AuthRequests', () => ({
    signUp: jest.fn()
}));

// Mock useHistory
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => mockHistory
}));

describe('SignUp', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockHistory.push.mockClear();
    });

    it('renders signup form', () => {
        renderWithRouter(<SignUp />);
        expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('shows validation errors for empty fields', async () => {
        renderWithRouter(<SignUp />);
        const form = screen.getByRole('form');
        
        fireEvent.submit(form);
        
        await waitFor(() => {
            expect(screen.getByText('Email is required')).toBeInTheDocument();
        });
        expect(screen.getByText('First name is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    it('shows validation error for invalid email', async () => {
        renderWithRouter(<SignUp />);
        const emailInput = screen.getByLabelText(/email/i);
        const form = screen.getByRole('form');
        
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        fireEvent.submit(form);
        
        await waitFor(() => {
            expect(screen.getByText('Invalid email format')).toBeInTheDocument();
        });
    });

    it('shows validation error for short password', async () => {
        renderWithRouter(<SignUp />);
        const passwordInput = screen.getByLabelText(/password/i);
        const form = screen.getByRole('form');
        
        fireEvent.change(passwordInput, { target: { value: '12345' } });
        fireEvent.submit(form);
        
        await waitFor(() => {
            expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
        });
    });

    it('handles successful signup', async () => {
        (AuthRequests.signUp as jest.Mock).mockResolvedValueOnce(true);
        
        renderWithRouter(<SignUp />);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const firstNameInput = screen.getByLabelText(/first name/i);
        const form = screen.getByRole('form');
        
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(firstNameInput, { target: { value: 'John' } });
        fireEvent.submit(form);
        
        await waitFor(() => {
            expect(AuthRequests.signUp).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
                first_name: 'John',
                last_name: ''
            });
        });

        expect(mockHistory.push).toHaveBeenCalledWith('/browse');
    });

    it('handles signup failure', async () => {
        (AuthRequests.signUp as jest.Mock).mockResolvedValueOnce(false);
        
        renderWithRouter(<SignUp />);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const firstNameInput = screen.getByLabelText(/first name/i);
        const form = screen.getByRole('form');
        
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(firstNameInput, { target: { value: 'John' } });
        fireEvent.submit(form);
        
        await waitFor(() => {
            expect(screen.getByText('Unknown Error')).toBeInTheDocument();
        });
    });

    describe('Form Submission', () => {
        it('handles successful sign up', async () => {
            (AuthRequests.signUp as jest.Mock).mockResolvedValueOnce(true);
            
            renderWithRouter(<SignUp />);
            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const firstNameInput = screen.getByLabelText(/first name/i);
            const lastNameInput = screen.getByLabelText(/last name/i);
            const form = screen.getByRole('form');
            
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.change(firstNameInput, { target: { value: 'John' } });
            fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
            fireEvent.submit(form);
            
            await waitFor(() => {
                expect(AuthRequests.signUp).toHaveBeenCalledWith({
                    email: 'test@example.com',
                    password: 'password123',
                    first_name: 'John',
                    last_name: 'Doe'
                });
            });

            expect(mockHistory.push).toHaveBeenCalledWith('/browse');
        });

        it('handles sign up error', async () => {
            (AuthRequests.signUp as jest.Mock).mockRejectedValue({ status: 409 });

            renderWithRouter(<SignUp />);

            const firstNameInput = screen.getByRole('textbox', { name: /first name/i });
            const lastNameInput = screen.getByRole('textbox', { name: /last name/i });
            const emailInput = screen.getByRole('textbox', { name: /email/i });
            const passwordInput = screen.getByLabelText(/password/i);
            const form = screen.getByRole('form');

            fireEvent.change(firstNameInput, { target: { value: 'John' } });
            fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.submit(form);

            await waitFor(() => {
                expect(screen.getByText('Email already exists.')).toBeInTheDocument();
            });
        });
    });
}); 