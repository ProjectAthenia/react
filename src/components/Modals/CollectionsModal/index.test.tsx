import React from 'react';
import { render, screen } from '@testing-library/react';
import CollectionsModal from './index';
import { HasType } from '../../../models/has-type';
import Collection from '../../../models/user/collection';
import {renderWithRouter} from "../../../test-utils";
import { CollectionItemsContext } from '../../../contexts/CollectionItemsContext';

// Mock the CollectionItemsContextProvider
jest.mock('../../../contexts/CollectionItemsContext', () => {
  const originalModule = jest.requireActual('../../../contexts/CollectionItemsContext');
  
  return {
    ...originalModule,
    CollectionItemsContextProvider: ({ children }: { children: React.ReactNode }) => (
      <CollectionItemsContext.Provider value={{
        1: { 
          loadedData: [],
          hasAnotherPage: false,
          initialLoadComplete: true,
          initiated: true,
          noResults: false,
          refreshing: false,
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
        },
        2: { 
          loadedData: [],
          hasAnotherPage: false,
          initialLoadComplete: true,
          initiated: true,
          noResults: false,
          refreshing: false,
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
        }
      }}>
        {children}
      </CollectionItemsContext.Provider>
    )
  };
});

describe('CollectionsModalContent', () => {
  const mockItem: HasType = {
    id: 123,
    type: 'release',
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  };

  const mockCollections: Collection[] = [
    { id: 1, name: 'Collection 1', collection_items_count: 5, owner_id: 1, owner_type: 'user', is_public: true, created_at: '2023-01-01', updated_at: '2023-01-01', type: 'collection' },
    { id: 2, name: 'Collection 2', collection_items_count: 10, owner_id: 1, owner_type: 'user', is_public: true, created_at: '2023-01-01', updated_at: '2023-01-01', type: 'collection' }
  ];

  // Mock function for onRequestClose
  const mockOnRequestClose = jest.fn();

  it('renders collections list when data is loaded', () => {
    renderWithRouter(
      <CollectionsModal
        items={mockItem}
        collections={mockCollections} 
        isLoading={false}
        isOpen={true}
        onRequestClose={mockOnRequestClose}
      />
    );
    
    expect(screen.getByText('Your Collections')).toBeInTheDocument();
    expect(screen.getByText('Collection 1')).toBeInTheDocument();
    expect(screen.getByText('Collection 2')).toBeInTheDocument();
  });
});