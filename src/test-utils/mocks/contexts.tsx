import React, { ReactNode } from 'react';
import { MeContextStateConsumer, MeContext } from '../../contexts/MeContext';
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

// Base mock context state creator
export const createBaseMockContextState = <T extends { id: number }>(data: T[]) => ({
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
    setFilter: mockSetFilter,
    setSearch: jest.fn(),
    setOrder: jest.fn(),
    addModel: jest.fn(),
    removeModel: jest.fn(),
    getModel: jest.fn(),
    params: {}
});

// Mock CategoriesContext
export const mockCategoriesContextValue = {
    ...createBaseMockContextState([
        { id: 1, name: 'Test Category', can_be_primary: true }
    ])
};

// Mock CategoriesContext
jest.mock('../../contexts/CategoriesContext', () => ({
    __esModule: true,
    CategoriesContext: React.createContext<CategoriesContextState>(mockCategoriesContextValue)
}));

// MeContext Provider
export const MeContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <MeContext.Provider value={{
            me: placeholderUser(),
            networkError: false,
            isLoggedIn: false,
            isLoading: false,
            setMe: () => {}
        }}>
            {children}
        </MeContext.Provider>
    );
};