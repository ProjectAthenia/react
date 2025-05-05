import { mockHistory, mockHistoryPush, mockUseParams, renderWithRouter } from '../../../../test-utils';

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: () => <span>icon</span>
}));

import React from 'react';
import { screen, fireEvent, waitFor, render } from '@testing-library/react';
import GamesList from './index';
import { mockGamesContextValue, mockGamesContextValueLoading } from '../../../../test-utils/mocks/contexts';
import Game from '../../../../models/game/game';

describe('GamesList', () => {
    const mockGames: Game[] = [
        {
            id: 1,
            name: 'Test Game 1',
            igdb_id: 123,
            franchise_id: 456,
            critic_rating: 8.5,
            user_rating: 8.5,
            source_url: 'http://example.com',
            critic_rating_count: 10,
            user_rating_count: 100,
            created_at: '2024-01-01',
            updated_at: '2024-01-01'
        },
        {
            id: 2,
            name: 'Test Game 2',
            igdb_id: 124,
            franchise_id: 457,
            critic_rating: 8.0,
            user_rating: 8.0,
            source_url: 'http://example.com',
            critic_rating_count: 10,
            user_rating_count: 100,
            created_at: '2024-01-02',
            updated_at: '2024-01-02'
        }
    ];

    it('renders games list', async () => {
        renderWithRouter(<GamesList context={mockGamesContextValue} />, { route: '/' });
        await waitFor(() => {
            expect(screen.getByRole('table')).toBeInTheDocument();
            expect(screen.getByText('Game')).toBeInTheDocument();
            expect(screen.getByText('Release Date')).toBeInTheDocument();
        });
    });

    it('shows loading state', () => {
        renderWithRouter(<GamesList context={mockGamesContextValueLoading} />, { route: '/' });
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

});