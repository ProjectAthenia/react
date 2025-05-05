import React, { ReactNode } from 'react';
import { MeContextStateConsumer } from '../../contexts/MeContext';
import { GamesContext } from '../../contexts/GamingComponents/GamesContext';
import { PlatformsContext, PlatformsContextState } from '../../contexts/GamingComponents/PlatformsContext';
import { PlatformGroupsContext, PlatformGroupsContextState } from '../../contexts/GamingComponents/PlatformGroupsContext';
import { ReleasesContextState } from '../../contexts/GamingComponents/ReleasesContext';
import { mockRelease1, mockRelease2 } from './models';
import { placeholderUser } from '../../models/user/user';
import { appState } from '../../data/AppContext';
import { CategoriesContextState, CategoriesContext } from '../../contexts/CategoriesContext';
import Category from '../../models/category';

// Mock appState
(global as any).appState = {
    state: {
        persistent: {
            tokenData: null
        },
        session: {
            loadingCount: 0
        }
    },
    dispatch: jest.fn()
};

// Mock functions
export const mockSetFilter = jest.fn();
export const mockOnYearChanged = jest.fn();

// Base mock context state type
type BaseMockContextState = {
    loadedData: any[];
    initialLoadComplete: boolean;
    refreshing: boolean;
    hasAnotherPage: boolean;
    initiated: boolean;
    noResults: boolean;
    expands: any[];
    order: Record<string, any>;
    filter: Record<string, any>;
    search: Record<string, any>;
    limit: number;
    loadAll: boolean;
    loadNext: jest.Mock;
    refreshData: jest.Mock;
    setFilter: jest.Mock;
    setSearch: jest.Mock;
    setOrder: jest.Mock;
    addModel: jest.Mock;
    removeModel: jest.Mock;
    getModel: jest.Mock;
    params: Record<string, any>;
};

// Base mock context state factory
export const createBaseMockContextState = (data: any[] = []): BaseMockContextState => ({
    loadedData: data,
    initialLoadComplete: true,
    refreshing: false,
    hasAnotherPage: false,
    initiated: true,
    noResults: false,
    expands: [],
    order: {},
    filter: {},
    search: {},
    limit: 20,
    loadAll: false,
    loadNext: jest.fn(),
    refreshData: jest.fn(),
    setFilter: jest.fn(),
    setSearch: jest.fn(),
    setOrder: jest.fn(),
    addModel: jest.fn(),
    removeModel: jest.fn(),
    getModel: jest.fn(),
    params: {}
});

// Mock context values
export const mockContextValue: ReleasesContextState = {
    ...createBaseMockContextState([mockRelease1, mockRelease2]),
    setFilter: mockSetFilter
};

export const mockGamesContextValue = {
    ...createBaseMockContextState([
        {
            id: 1,
            name: 'Super Mario Bros.',
            igdb_id: 123,
            critic_rating: 4.8,
            user_rating: 4.7,
            critic_rating_count: 100,
            user_rating_count: 1000,
            release_date: '1985-09-13',
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
    ])
};

export const mockGamesContextValueLoading = {
    ...mockGamesContextValue,
    initialLoadComplete: false,
    refreshing: true,
    initiated: false
};

export const mockGamesContextValueEmpty = {
    ...mockGamesContextValue,
    loadedData: [],
    initialLoadComplete: true,
    refreshing: false,
    initiated: true,
    noResults: true
};

export const mockGamesContextValueError = {
    ...mockGamesContextValue,
    error: new Error('Failed to fetch games'),
    initialLoadComplete: true,
    refreshing: false
};

export const mockMeContextValue = {
    me: placeholderUser(),
    networkError: false,
    isLoggedIn: false,
    isLoading: false,
    setMe: jest.fn()
};

export const mockPlatformsContextValue = {
    ...createBaseMockContextState(),
    loadNext: jest.fn().mockResolvedValue({ data: [], current_page: 1, last_page: 1, total: 0 }),
    refreshData: jest.fn().mockResolvedValue({ data: [], current_page: 1, last_page: 1, total: 0 }),
    setFilter: jest.fn().mockResolvedValue({ data: [], current_page: 1, last_page: 1, total: 0 }),
    setSearch: jest.fn().mockResolvedValue({ data: [], current_page: 1, last_page: 1, total: 0 }),
    setOrder: jest.fn().mockResolvedValue({ data: [], current_page: 1, last_page: 1, total: 0 })
};

export const mockPlatformGroupsContextValue: PlatformGroupsContextState = {
    ...createBaseMockContextState([
        { id: 1, name: 'Test Group', total_games: 5 }
    ])
};

export const mockCategoriesContextValue: CategoriesContextState = {
    ...createBaseMockContextState([
        { id: 1, name: 'Action', can_be_primary: true },
        { id: 2, name: 'Adventure', can_be_primary: true }
    ])
};

export const mockCategoriesContextValueLoading: CategoriesContextState = {
    ...mockCategoriesContextValue,
    initialLoadComplete: false,
    refreshing: true,
    initiated: false,
    loadedData: []
};

export const mockCategoriesContextValueEmpty: CategoriesContextState = {
    ...mockCategoriesContextValue,
    loadedData: [],
    initialLoadComplete: true,
    refreshing: false,
    initiated: true,
    noResults: true
};

export const mockCategoriesContextValueError: CategoriesContextState = {
    ...mockCategoriesContextValue,
    initialLoadComplete: true,
    refreshing: false
};

// Create mock context
const MockMeContext = React.createContext<MeContextStateConsumer>(mockMeContextValue);

// Context Providers
interface ProviderProps {
    children: ReactNode;
}

export const MeContextProvider = ({ children }: ProviderProps) => (
    <MockMeContext.Provider value={mockMeContextValue}>
        <div data-testid="me-context-provider">{children}</div>
    </MockMeContext.Provider>
);

export const GamesContextProvider = ({ children }: ProviderProps) => (
    <GamesContext.Provider value={mockGamesContextValue}>
        <div data-testid="games-context-provider">{children}</div>
    </GamesContext.Provider>
);

export const PlatformsContextProvider = ({ children }: ProviderProps) => (
    <PlatformsContext.Provider value={mockPlatformsContextValue}>
        <div data-testid="platforms-context-provider">{children}</div>
    </PlatformsContext.Provider>
);

export const PlatformGroupsContextProvider = ({ children }: ProviderProps) => (
    <PlatformGroupsContext.Provider value={mockPlatformGroupsContextValue}>
        <div data-testid="platform-groups-context-provider">{children}</div>
    </PlatformGroupsContext.Provider>
);

export const CategoriesContextProvider: React.FC<{ children: ReactNode; value?: CategoriesContextState }> = ({ children, value = mockCategoriesContextValue }) => (
    <CategoriesContext.Provider value={value}>
        {children}
    </CategoriesContext.Provider>
);

// Mock the actual GamesContext
jest.mock('../../contexts/GamingComponents/GamesContext', () => ({
    GamesContext: React.createContext(null),
    useGames: () => React.useContext(React.createContext(mockGamesContextValue))
}));

// Mock MeContext
jest.mock('../../contexts/MeContext', () => ({
    __esModule: true,
    default: MockMeContext,
    MeContextStateConsumer: mockMeContextValue
}));

// Mock PlatformsContext
jest.mock('../../contexts/GamingComponents/PlatformsContext', () => ({
    __esModule: true,
    PlatformsContext: React.createContext<PlatformsContextState>(mockPlatformsContextValue)
}));

// Mock PlatformGroupsContext
jest.mock('../../contexts/GamingComponents/PlatformGroupsContext', () => ({
    __esModule: true,
    default: {
        PlatformGroupsContext: React.createContext<PlatformGroupsContextState>(mockPlatformGroupsContextValue)
    }
}));

// Mock ReleasesContext
jest.mock('../../contexts/GamingComponents/ReleasesContext', () => ({
    __esModule: true,
    default: {
        ReleasesContext: React.createContext<ReleasesContextState>(mockContextValue)
    }
}));