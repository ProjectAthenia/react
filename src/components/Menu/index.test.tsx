import React from 'react';
import { screen } from '@testing-library/react';
import Menu from './index';
import { MeContext } from '../../contexts/MeContext';
import { placeholderUser } from '../../models/user/user';
import { renderWithProviders } from '../../test-utils';

// Mock the MeContextProvider component
jest.mock('../../contexts/MeContext', () => ({
    __esModule: true,
    MeContext: {
        Consumer: ({ children }: { children: (context: any) => React.ReactNode }) => (
            <div>{children({
                me: null,
                networkError: false,
                isLoggedIn: false,
                isLoading: false,
                setMe: () => {}
            })}</div>
        )
    },
    default: ({ children }: { children: React.ReactNode }) => children
}));

describe('Menu', () => {
    it('renders basic navigation links when not logged in', () => {
        jest.spyOn(MeContext, 'Consumer').mockImplementation(
            ({ children }: { children: (context: any) => React.ReactNode }) => (
                <div>{children({
                    me: placeholderUser(),
                    networkError: false,
                    isLoggedIn: false,
                    isLoading: false,
                    setMe: () => {}
                })}</div>
            )
        );

        renderWithProviders(<Menu />);

        expect(screen.getByText('Browse')).toBeInTheDocument();
        expect(screen.getByText('Data View')).toBeInTheDocument();
        expect(screen.getByText('Sign In')).toBeInTheDocument();
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
        expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    });

    it('renders authenticated navigation links when logged in', () => {
        const loggedInUser = placeholderUser();
        loggedInUser.id = 1;
        
        jest.spyOn(MeContext, 'Consumer').mockImplementation(
            ({ children }: { children: (context: any) => React.ReactNode }) => (
                <div>{children({
                    me: loggedInUser,
                    networkError: false,
                    isLoggedIn: true,
                    isLoading: false,
                    setMe: () => {}
                })}</div>
            )
        );

        renderWithProviders(<Menu />);

        expect(screen.getByText('Browse')).toBeInTheDocument();
        expect(screen.getByText('Data View')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
        expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
    });
}); 