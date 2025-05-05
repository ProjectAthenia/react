import Game from '../../models/game/game';
import Platform from '../../models/platform/platform';
import PlatformGroup from '../../models/platform/platform-group';
import Release from '../../models/game/release';

export const mockGame: Game = {
    id: 1,
    name: 'Test Game',
    critic_rating: 8.0,
    user_rating: 8.5,
};

export const mockPlatformGroup: PlatformGroup = {
    id: 1,
    name: 'Test Platform Group',
    total_games: 200,
    platforms: []
};

export const mockPlatform: Platform = {
    id: 1,
    name: 'Test Platform',
    total_games: 100,
    platform_group_id: 1,
    platform_group: mockPlatformGroup
};

mockPlatformGroup.platforms = [mockPlatform];

export const mockRelease1: Release = {
    id: 1,
    region_id: 1,
    publisher_id: 1,
    game_id: 1,
    platform_id: 1,
    release_date: '2023-06-15',
    release_type: 'retail',
    game: {
        id: 1,
        name: 'Test Game 1',
        igdb_id: 12345,
        critic_rating: 8.0,
        user_rating: 8.8,
        critic_rating_count: 10,
        user_rating_count: 100,
        source_url: 'https://example.com'
    },
    platform: {
        id: 1,
        name: 'Test Platform 1',
        total_games: 100,
        platform_group_id: 1,
        platform_group: {
            id: 1,
            name: 'Test Platform Group 1',
            total_games: 200,
            platforms: []
        }
    }
};

export const mockRelease2: Release = {
    id: 2,
    game_id: 2,
    platform_id: 2,
    release_type: 'retail',
    game: { ...mockRelease1.game, id: 2, name: 'Test Game 2' },
    platform: { 
        id: 2, 
        name: 'Test Platform 2',
        total_games: 1,
        platform_group_id: 1,
        platform_group: mockPlatformGroup
    }
}; 