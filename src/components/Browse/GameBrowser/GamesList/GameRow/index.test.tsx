import { render, screen } from '@testing-library/react';
import GameRow from './index';
import Game from '../../../../../models/game/game';
import Release from '../../../../../models/game/release';
import Platform from '../../../../../models/platform/platform';
import { MantineProvider, Table } from '@mantine/core';

describe('GameRow', () => {
  const mockPlatform: Platform = {
    id: 1,
    name: 'PlayStation 5',
    total_games: 100,
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  };

  const mockRelease: Release = {
    id: 1,
    game_id: 1,
    platform_id: 1,
    release_type: 'retail',
    release_date: '2023-03-15',
    platform: mockPlatform,
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  };

  const mockGame: Game = {
    id: 1,
    name: 'Test Game',
    critic_rating: 85,
    releases: [mockRelease],
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  };

  const renderWithMantine = (ui: React.ReactElement) => {
    return render(
      <MantineProvider>
        <Table>
          <Table.Tbody>
            {ui}
          </Table.Tbody>
        </Table>
      </MantineProvider>
    );
  };

  test('renders game information correctly', () => {
    renderWithMantine(<GameRow game={mockGame} />);
    
    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
    expect(screen.getByText('3/15/2023')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  test('renders N/A when no ratings are available', () => {
    const gameWithoutRatings: Game = {
      ...mockGame,
      critic_rating: undefined,
      user_rating: undefined
    };
    
    renderWithMantine(<GameRow game={gameWithoutRatings} />);
    
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  test('renders Unknown when no release date is available', () => {
    const gameWithoutReleaseDate: Game = {
      ...mockGame,
      releases: [{
        ...mockRelease,
        release_date: undefined
      }]
    };
    
    renderWithMantine(<GameRow game={gameWithoutReleaseDate} />);
    
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  test('renders user rating when critic rating is not available', () => {
    const gameWithUserRating: Game = {
      ...mockGame,
      critic_rating: undefined,
      user_rating: 75
    };
    
    renderWithMantine(<GameRow game={gameWithUserRating} />);
    
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  test('handles missing platform information', () => {
    const gameWithoutPlatform: Game = {
      ...mockGame,
      releases: [{
        ...mockRelease,
        platform: undefined
      }]
    };
    
    renderWithMantine(<GameRow game={gameWithoutPlatform} />);
    
    expect(screen.getByText('Test Game')).toBeInTheDocument();
    // Platform cell should be empty
    const cells = screen.getAllByRole('cell');
    expect(cells[1]).toHaveTextContent('');
  });
}); 