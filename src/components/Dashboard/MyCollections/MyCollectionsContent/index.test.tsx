import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import MyCollectionsContent from './index';
import Collection from '../../../../models/user/collection';
import { UserCollectionsContextState } from '../../../../contexts/UserCollectionsContext';
import { CollectionItemsContext } from '../../../../contexts/CollectionItemsContext';

// Mock the UserCollectionsContextState type
const mockCollections: Collection[] = [
  {
    id: 1,
    name: 'Test Collection 1',
    collection_items_count: 5,
    created_at: '2023-01-01',
    updated_at: '2023-01-01',
    owner_id: 1,
    owner_type: 'user',
    is_public: false
  },
  {
    id: 2,
    name: 'Test Collection 2',
    collection_items_count: 10,
    created_at: '2023-01-02',
    updated_at: '2023-01-02',
    owner_id: 1,
    owner_type: 'user',
    is_public: false
  }
];

// Mock the CollectionItemsContext
const mockCollectionItemsContext = {
  1: {
    loadedData: Array(5).fill({}),
    hasAnotherPage: false,
    initialLoadComplete: true,
    initiated: true,
    noResults: false,
    refreshing: false,
    expands: [],
    order: {},
    filter: {},
    search: {},
    limit: 50,
    loadAll: true,
    loadNext: jest.fn(),
    refreshData: jest.fn(),
    setFilter: jest.fn(),
    setSearch: jest.fn(),
    setOrder: jest.fn(),
    addModel: jest.fn(),
    removeModel: jest.fn(),
    getModel: jest.fn(),
    params: {}
  },
  2: {
    loadedData: Array(10).fill({}),
    hasAnotherPage: false,
    initialLoadComplete: true,
    initiated: true,
    noResults: false,
    refreshing: false,
    expands: [],
    order: {},
    filter: {},
    search: {},
    limit: 50,
    loadAll: true,
    loadNext: jest.fn(),
    refreshData: jest.fn(),
    setFilter: jest.fn(),
    setSearch: jest.fn(),
    setOrder: jest.fn(),
    addModel: jest.fn(),
    removeModel: jest.fn(),
    getModel: jest.fn(),
    params: {}
  }
};

// Mock the CollectionCard component
jest.mock('./CollectionCard', () => ({
    __esModule: true,
    default: ({ collection, itemCount }: { collection: Collection, itemCount: number }) => (
        <div data-testid={`collection-card-${collection.id}`}>
            {collection.name} ({itemCount} items)
        </div>
    ),
}));

// Mock the CollectionItemsContextProvider component
jest.mock('../../../../contexts/CollectionItemsContext', () => ({
    CollectionItemsContext: {
        Consumer: ({ children }: { children: any }) => children({
            // Mock context with collection items data
            1: { loadedData: [{ id: 101 }, { id: 102 }], total: 2 },
            2: { loadedData: [{ id: 201 }], total: 1 },
        })
    },
    CollectionItemsContextProvider: ({ children }: { children: React.ReactNode }) => children
}));

describe('MyCollectionsContent', () => {
  const mockCollections: Collection[] = [
    {
      id: 1,
      name: 'Collection 1',
      is_public: true,
      owner_id: 1,
      owner_type: 'user',
      collection_items_count: 2
    },
    {
      id: 2,
      name: 'Collection 2',
      is_public: false,
      owner_id: 1,
      owner_type: 'user',
      collection_items_count: 1
    }
  ];

  const mockContextState: UserCollectionsContextState = {
    loadedData: mockCollections,
    refreshing: false,
    hasAnotherPage: false,
    initiated: true,
    noResults: false,
    initialLoadComplete: true,
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
    expands: [],
    order: {},
    filter: {},
    search: {},
    params: {}
  };

  const mockOnEditCollection = jest.fn();

  it('renders collections when data is available', () => {
    render(
      <MantineProvider>
        <MyCollectionsContent
          collectionsContext={mockContextState}
          onEditCollection={mockOnEditCollection}
        />
      </MantineProvider>
    );

    // Verify both collection cards are rendered
    const collection1Card = screen.getByTestId('collection-card-1');
    const collection2Card = screen.getByTestId('collection-card-2');

    expect(collection1Card).toBeInTheDocument();
    expect(collection2Card).toBeInTheDocument();

    // Check that the grid is rendered - using className instead of role
    const grid = screen.getByTestId('collections-grid');
    expect(grid).toHaveClass('collections-grid');
  });

  it('displays loading state when refreshing', () => {
    render(
      <MantineProvider>
        <MyCollectionsContent
          collectionsContext={{ ...mockContextState, refreshing: true }}
          onEditCollection={mockOnEditCollection}
        />
      </MantineProvider>
    );

    const loadingElement = screen.getByText('Loading collections...');
    expect(loadingElement).toBeInTheDocument();
  });

  it('displays empty state when no collections', () => {
    render(
      <MantineProvider>
        <MyCollectionsContent
          collectionsContext={{ ...mockContextState, loadedData: [] }}
          onEditCollection={mockOnEditCollection}
        />
      </MantineProvider>
    );

    const emptyStateElement = screen.getByText('You don\'t have any collections yet.');
    expect(emptyStateElement).toBeInTheDocument();
  });

  it('renders collection cards correctly', () => {
    render(
      <MantineProvider>
        <MyCollectionsContent
          collectionsContext={mockContextState}
          onEditCollection={mockOnEditCollection}
        />
      </MantineProvider>
    );
    
    // Check that collection cards are rendered with the right data
    const collection1Card = screen.getByTestId('collection-card-1');
    const collection2Card = screen.getByTestId('collection-card-2');
    
    expect(collection1Card).toHaveTextContent('Collection 1');
    expect(collection2Card).toHaveTextContent('Collection 2');
    
    // Check for item count (based on the mock implementation)
    expect(collection1Card).toHaveTextContent('2 items');
    expect(collection2Card).toHaveTextContent('1 items');
  });
}); 