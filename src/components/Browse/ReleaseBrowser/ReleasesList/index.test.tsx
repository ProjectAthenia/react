import React, { act } from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import ReleasesList from './index';
import { ReleasesContextState } from '../../../../contexts/GamingComponents/ReleasesContext';
import Platform from '../../../../models/platform/platform';
import PlatformGroup from '../../../../models/platform/platform-group';
import { renderWithRouter } from '../../../../test-utils';
import { UserCollectionsContext } from '../../../../contexts/UserCollectionsContext';
import { CollectionItemsContext } from '../../../../contexts/CollectionItemsContext';
import { MantineProvider, createTheme } from '@mantine/core';
import '@testing-library/jest-dom';
import Collection from '../../../../models/user/collection';
import CollectionItem from '../../../../models/user/collection-items';
import { jest } from '@jest/globals';
import { BasePaginatedContextState, defaultBaseContext } from '../../../../contexts/BasePaginatedContext';
import Page from '../../../../models/page';
import Release from '../../../../models/game/release';

// Add type declarations for jest-dom matchers
declare global {
    namespace jest {
        interface Matchers<R> {
            toBeInTheDocument(): R;
            toHaveValue(value: string): R;
        }
    }
}

const mantineTheme = createTheme({
    primaryColor: 'blue',
    fontFamily: 'Inter, sans-serif',
    other: {
        primaryShade: { light: 6, dark: 8 }
    },
    components: {
        Table: {
            styles: {
                th: {
                    backgroundColor: '#f8f9fa',
                    borderBottom: '2px solid #dee2e6',
                    padding: '1rem',
                },
                td: {
                    padding: '1rem',
                },
                tr: {
                    '&:hover': {
                        backgroundColor: '#f8f9fa',
                    },
                },
            },
        },
    },
});

const mockPlatformGroup: PlatformGroup = {
    id: 1,
    name: 'Test Group',
    total_games: 200,
    platforms: []
};

const mockPlatform: Platform = {
    id: 1,
    name: 'Test Platform',
    total_games: 100,
    platform_group_id: 1,
    platform_group: mockPlatformGroup
};

mockPlatformGroup.platforms = [mockPlatform];

const emptyPage: Page<any> = { data: [], total: 0, current_page: 1, last_page: 1 };

const mockContextValue = {
    ...defaultBaseContext(),
    loadedData: [
        {
            id: 1,
            region_id: 1,
            publisher_id: 1,
            game_id: 1,
            platform_id: 1,
            release_date: '2024-01-01',
            release_type: 'retail',
            game: {
                id: 1,
                name: 'Test Game',
                critic_rating: 8.0,
                user_rating: 8.5,
            },
            platform: {
                id: 1,
                name: 'Test Platform',
                total_games: 100,
                platform_group_id: 1,
                platform_group: {
                    id: 1,
                    name: 'Test Group',
                    total_games: 200,
                    platforms: []
                }
            },
        },
    ],
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
    params: {},
    loadNext: jest.fn(),
    refreshData: jest.fn(),
    setFilter: jest.fn(),
    setSearch: jest.fn(),
    setOrder: jest.fn(),
    addModel: jest.fn(),
    removeModel: jest.fn(),
    getModel: jest.fn()
} as ReleasesContextState;

const mockCollections = [
    { 
        id: 1, 
        name: 'My Collection', 
        collection_items_count: 5,
        owner_id: 1,
        owner_type: 'user',
        is_public: true
    },
    { 
        id: 2, 
        name: 'Favorites', 
        collection_items_count: 3,
        owner_id: 1,
        owner_type: 'user',
        is_public: true
    }
];

const mockCollectionsContext = {
    ...defaultBaseContext(),
    loadedData: [
        { 
            id: 1, 
            name: 'My Collection', 
            collection_items_count: 5,
            owner_id: 1,
            owner_type: 'user',
            is_public: true,
            collectionItems: []
        }
    ],
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
    params: {},
    loadNext: jest.fn(),
    refreshData: jest.fn(),
    setFilter: jest.fn(),
    setSearch: jest.fn(),
    setOrder: jest.fn(),
    addModel: jest.fn(),
    removeModel: jest.fn(),
    getModel: jest.fn()
} as BasePaginatedContextState<Collection>;

const mockCollectionItemsContext = {
    1: {
        ...defaultBaseContext(),
        loadedData: [],
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
        params: {},
        loadNext: jest.fn(),
        refreshData: jest.fn(),
        setFilter: jest.fn(),
        setSearch: jest.fn(),
        setOrder: jest.fn(),
        addModel: jest.fn(),
        removeModel: jest.fn(),
        getModel: jest.fn()
    } as BasePaginatedContextState<CollectionItem>,
    2: {
        ...defaultBaseContext(),
        loadedData: [],
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
        params: {},
        loadNext: jest.fn(),
        refreshData: jest.fn(),
        setFilter: jest.fn(),
        setSearch: jest.fn(),
        setOrder: jest.fn(),
        addModel: jest.fn(),
        removeModel: jest.fn(),
        getModel: jest.fn()
    } as BasePaginatedContextState<CollectionItem>
};

const renderWithProviders = (children: React.ReactNode) => {
    return render(
        <MantineProvider theme={mantineTheme}>
            <UserCollectionsContext.Provider value={mockCollectionsContext}>
                <CollectionItemsContext.Provider value={mockCollectionItemsContext}>
                    {children}
                </CollectionItemsContext.Provider>
            </UserCollectionsContext.Provider>
        </MantineProvider>
    );
};

// Mock the Modal component
jest.mock('../../../GeneralUIElements/Modal', () => ({
    __esModule: true,
    default: ({ children, isOpen, onRequestClose, title }: { 
        children: React.ReactNode; 
        isOpen: boolean; 
        onRequestClose: () => void; 
        title: string; 
    }) => {
        if (!isOpen) return null;
        return (
            <div data-testid="mock-modal">
                <div data-testid="modal-title">{title}</div>
                <button onClick={onRequestClose} data-testid="modal-close">Close</button>
                {children}
            </div>
        );
    }
}));

// Mock the UserCollectionsContext
jest.mock('../../../../contexts/UserCollectionsContext', () => ({
    UserCollectionsContext: {
        Provider: ({ children }: any) => children,
        Consumer: ({ children }: any) => children(mockCollectionsContext)
    },
    UserCollectionsContextProvider: ({ children }: any) => children
}));

// Mock the CollectionItemsContext
jest.mock('../../../../contexts/CollectionItemsContext', () => ({
    CollectionItemsContext: {
        Provider: ({ children }: any) => children,
        Consumer: ({ children }: any) => children(mockCollectionItemsContext)
    },
    CollectionItemsContextProvider: ({ children }: any) => children
}));

describe('ReleasesList', () => {
    const mockOnYearChanged = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        renderWithProviders(<ReleasesList contextState={mockContextValue} onYearChanged={mockOnYearChanged} />);
        expect(screen.getByTestId('releases-list')).toBeInTheDocument();
    });

    it('displays correct release data in the table', () => {
        renderWithProviders(<ReleasesList contextState={mockContextValue} onYearChanged={mockOnYearChanged} />);
        expect(screen.getByText('Test Game')).toBeInTheDocument();
        expect(screen.getByText('1/1/2024')).toBeInTheDocument();
        expect(screen.getByText('8.0')).toBeInTheDocument();
        expect(screen.getByText('8.5')).toBeInTheDocument();
    });

    it('handles refreshing state', () => {
        const contextValue = {
            ...mockContextValue,
            refreshing: true,
            loadedData: []
        };
        
        renderWithProviders(<ReleasesList contextState={contextValue} onYearChanged={mockOnYearChanged} />);
        expect(screen.getByTestId('releases-list')).toBeInTheDocument();
    });

    it('renders year selector with no year selected by default', () => {
        renderWithProviders(<ReleasesList contextState={mockContextValue} onYearChanged={mockOnYearChanged} />);
        
        const yearFilter = screen.getByPlaceholderText(/Filter Release Date/i);
        expect(yearFilter).toBeInTheDocument();
        expect(yearFilter).toHaveValue('');
    });

    it('calls onYearChanged when year is changed', () => {
        const mockOnYearChanged = jest.fn();
        renderWithProviders(<ReleasesList contextState={mockContextValue} onYearChanged={mockOnYearChanged} />);

        // Get the year filter input by its placeholder text
        const yearFilter = screen.getByPlaceholderText(/Filter Release Date/i);
        expect(yearFilter).toBeInTheDocument();
        
        // Test with a valid year (after 1960)
        fireEvent.change(yearFilter, { target: { value: '2024' } });
        expect(mockOnYearChanged).toHaveBeenCalledWith(2024);

        // Test with an invalid year (before 1960)
        fireEvent.change(yearFilter, { target: { value: '1950' } });
        expect(mockOnYearChanged).toHaveBeenCalledWith(undefined);

        // Test with empty value
        fireEvent.change(yearFilter, { target: { value: '' } });
        expect(mockOnYearChanged).toHaveBeenCalledWith(undefined);
    });
}); 