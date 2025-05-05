import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import GameBrowser from './index';
import { renderWithProviders } from '../../../test-utils';
import { 
    mockGamesContextValue, 
    mockGamesContextValueLoading, 
    mockGamesContextValueEmpty, 
    mockGamesContextValueError 
} from '../../../test-utils/mocks/contexts';
import { GamesContext } from '../../../contexts/GamingComponents/GamesContext';

// Mock the GamesContextProvider
jest.mock('../../../contexts/GamingComponents/GamesContext', () => ({
    ...jest.requireActual('../../../contexts/GamingComponents/GamesContext'),
    GamesContextProvider: ({ children }: { children: React.ReactNode }) => {
        return (
            <GamesContext.Provider value={mockGamesContextValue}>
                {children}
            </GamesContext.Provider>
        );
    }
}));

describe('GameBrowser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders games list when data is loaded', async () => {
        renderWithProviders(<GameBrowser />, { value: mockGamesContextValue });

        await waitFor(() => {
            expect(screen.getByTestId('games-list')).toBeInTheDocument();
        });
    });

    it('displays correct game data in the table', async () => {
        renderWithProviders(<GameBrowser />, { value: mockGamesContextValue });
        
        await waitFor(() => {
            expect(screen.getByText('Super Mario Bros.')).toBeInTheDocument();
            const elements = screen.getAllByRole('cell');
            const dateCell = elements.find(element => {
                const text = element.textContent || '';
                return text.includes('1985') && (text.includes('9') || text.includes('09')) && text.includes('13');
            });
            expect(dateCell).toBeTruthy();
        });
    });

    it('displays table headers correctly', async () => {
        renderWithProviders(<GameBrowser />, { value: mockGamesContextValue });
        
        await waitFor(() => {
            expect(screen.getByText('Game')).toBeInTheDocument();
            expect(screen.getByText('Release Date')).toBeInTheDocument();
        });
    });
});