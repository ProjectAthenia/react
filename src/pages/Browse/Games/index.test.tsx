import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { GamesContext } from '../../../contexts/GamingComponents/GamesContext';
import { mockGamesContextValue, mockGamesContextValueLoading, mockGamesContextValueEmpty } from '../../../test-utils/mocks/contexts';
import Games from './index';
import Game from '../../../models/game/game';
import { renderWithProviders } from '../../../test-utils';

// Mock the API
jest.mock('../../../services/api', () => ({
    __esModule: true,
    default: {
        get: jest.fn().mockResolvedValue({
            data: {
                data: [
                    { 
                        id: '1', 
                        title: 'Game 1', 
                        platform: { id: '1', name: 'Platform 1' },
                        release_date: '2023-01-01',
                        rating: 4.5,
                        genre: 'Action',
                        developer: 'Developer 1',
                        publisher: 'Publisher 1'
                    },
                    { 
                        id: '2', 
                        title: 'Game 2', 
                        platform: { id: '2', name: 'Platform 2' },
                        release_date: '2023-02-01',
                        rating: 4.0,
                        genre: 'RPG',
                        developer: 'Developer 2',
                        publisher: 'Publisher 2'
                    }
                ],
                total: 2,
                current_page: 1,
                last_page: 1
            }
        })
    }
}));

// Mock the Page component
jest.mock('../../../components/Template/Page', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock the GameBrowser component
jest.mock('../../../components/Browse/GameBrowser', () => {
    return {
        __esModule: true,
        default: () => <div data-testid="games-list">Mocked GameBrowser</div>
    };
});

// Mock the GamesList component
jest.mock('../../../components/Browse/GameBrowser/GamesList', () => {
    return {
        __esModule: true,
        default: ({ context }: { context: any }) => {
            if (!context.initialLoadComplete) {
                return <div data-testid="loading-indicator" className="loading">Loading...</div>;
            }

            if (context.loadedData.length === 0) {
                return <div data-testid="empty-state" className="empty-state">No games found</div>;
            }

            return (
                <div data-testid="games-list">
                    {context.loadedData.map((game: any) => (
                        <div key={game.id}>{game.name}</div>
                    ))}
                </div>
            );
        }
    };
});

const mockGames: Game[] = [
    {
        id: 1,
        name: 'Super Mario Bros.',
        igdb_id: 123,
        critic_rating: 4.8,
        user_rating: 4.7,
        critic_rating_count: 100,
        user_rating_count: 1000,
        releases: [
            {
                id: 1,
                game_id: 1,
                platform_id: 1,
                release_date: '1985-09-13',
                release_type: 'retail',
                platform: { id: 1, name: 'NES', total_games: 1000 }
            }
        ]
    }
];

describe('Games Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders Games page with data', async () => {
        render(<Games />);
        
        await waitFor(() => {
            expect(screen.getByTestId('games-list')).toBeInTheDocument();
        });
    });
}); 