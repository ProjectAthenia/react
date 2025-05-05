import React from 'react';
import { render, screen, act } from '@testing-library/react';
import PlatformsBrowser from './index';
import { PlatformsContext } from '../../../contexts/GamingComponents/PlatformsContext';
import { PlatformGroupsContext } from '../../../contexts/GamingComponents/PlatformGroupsContext';

// Mock the PlatformsList component
jest.mock('./PlatformsList', () => {
    return {
        __esModule: true,
        default: ({ platformsContextState, platformGroupsContextState }: any) => {
            if (!platformsContextState.initialLoadComplete || platformsContextState.refreshing) {
                return <div data-testid="loading-indicator" className="loading">Loading...</div>;
            }

            if (platformsContextState.loadedData.length === 0) {
                return <div data-testid="empty-state" className="empty-state">No platforms found</div>;
            }

            return (
                <div data-testid="platforms-list">
                    {platformsContextState.loadedData.map((platform: any) => (
                        <div key={platform.id}>{platform.name}</div>
                    ))}
                </div>
            );
        }
    };
});

const mockPlatforms = [
    { id: 1, name: 'Platform 1', total_games: 10 },
    { id: 2, name: 'Platform 2', total_games: 20 }
];

const mockPlatformGroups = [
    { 
        id: 1, 
        name: 'Group 1', 
        platforms: [
            { id: 1, name: 'Platform 1', total_games: 10 }
        ], 
        total_games: 10 
    },
    { 
        id: 2, 
        name: 'Group 2', 
        platforms: [
            { id: 2, name: 'Platform 2', total_games: 20 }
        ], 
        total_games: 20 
    }
];

const defaultPlatformsContext = {
    initialLoadComplete: true,
    refreshing: false,
    loadedData: mockPlatforms,
    error: null,
    hasAnotherPage: false,
    loadNext: jest.fn(),
    setFilter: jest.fn(),
    setSearch: jest.fn(),
    setOrder: jest.fn(),
    addModel: jest.fn(),
    removeModel: jest.fn(),
    getModel: jest.fn(),
    expands: [],
    limit: 10,
    loadAll: false,
    initiated: true,
    order: {},
    filter: {},
    search: {},
    params: {},
    noResults: false,
    refreshData: jest.fn()
};

const defaultPlatformGroupsContext = {
    initialLoadComplete: true,
    refreshing: false,
    loadedData: mockPlatformGroups,
    error: null,
    hasAnotherPage: false,
    loadNext: jest.fn(),
    setFilter: jest.fn(),
    setSearch: jest.fn(),
    setOrder: jest.fn(),
    addModel: jest.fn(),
    removeModel: jest.fn(),
    getModel: jest.fn(),
    expands: [],
    limit: 10,
    loadAll: false,
    initiated: true,
    order: {},
    filter: {},
    search: {},
    params: {},
    noResults: false,
    refreshData: jest.fn()
};

// Mock the contexts
jest.mock('../../../contexts/GamingComponents/PlatformsContext', () => ({
    __esModule: true,
    PlatformsContext: {
        Consumer: ({ children }: any) => children(defaultPlatformsContext)
    },
    PlatformsContextProvider: ({ children }: any) => children
}));

jest.mock('../../../contexts/GamingComponents/PlatformGroupsContext', () => ({
    __esModule: true,
    PlatformGroupsContext: {
        Consumer: ({ children }: any) => children(defaultPlatformGroupsContext)
    },
    PlatformGroupsContextProvider: ({ children }: any) => children
}));

describe('PlatformsBrowser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders platforms list with data', async () => {
        await act(async () => {
            render(<PlatformsBrowser />);
        });
        expect(screen.getByTestId('platforms-list')).toBeInTheDocument();
        expect(screen.getByText('Platform 1')).toBeInTheDocument();
        expect(screen.getByText('Platform 2')).toBeInTheDocument();
    });

    it('shows loading state', async () => {
        // Override the PlatformsContext mock for this test
        jest.spyOn(PlatformsContext, 'Consumer').mockImplementation(({ children }: any) => 
            children({
                ...defaultPlatformsContext,
                initialLoadComplete: false,
                loadedData: []
            })
        );

        await act(async () => {
            render(<PlatformsBrowser />);
        });
        expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });

    it('shows empty state when no platforms', async () => {
        // Override the PlatformsContext mock for this test
        jest.spyOn(PlatformsContext, 'Consumer').mockImplementation(({ children }: any) => 
            children({
                ...defaultPlatformsContext,
                initialLoadComplete: true,
                loadedData: []
            })
        );

        await act(async () => {
            render(<PlatformsBrowser />);
        });
        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
});
