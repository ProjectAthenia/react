import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignInForm from './index';

// Mock useHistory
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn()
    })
}));

// Mock AuthRequests
jest.mock('../../../services/requests/AuthRequests', () => ({
    signIn: jest.fn()
}));

test('renders SignInForm without crashing', () => {
    render(
        <BrowserRouter>
            <SignInForm />
        </BrowserRouter>
    );
    
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('forgot password?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
});
