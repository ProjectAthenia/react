import React, { ReactNode } from 'react';
import { MeContextStateConsumer, MeContext } from '../../contexts/MeContext';
import { placeholderUser } from '../../models/user/user';
import { appState } from '../../data/AppContext';
import { CategoriesContextState, CategoriesContext } from '../../contexts/CategoriesContext';
import Category from '../../models/category';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mockCategory } from './models/category';

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

// Create mock store
const mockStore = configureStore([]);

interface MeContextProviderProps {
    children: ReactNode;
    initialState?: {
        me: {
            user: any;
            networkError: boolean;
            isLoggedIn: boolean;
            isLoading: boolean;
        };
    };
    optional?: boolean;
    hideLoadingSpace?: boolean;
}

// MeContext Provider
export const MeContextProvider: React.FC<MeContextProviderProps> = ({ children, initialState, optional, hideLoadingSpace }) => {
    const store = mockStore(initialState || {
        me: {
            user: placeholderUser(),
            networkError: false,
            isLoggedIn: false,
            isLoading: false
        }
    });

    const [meContext, setMeContext] = React.useState({
        me: initialState?.me?.user || placeholderUser(),
        networkError: initialState?.me?.networkError || false,
        isLoggedIn: initialState?.me?.isLoggedIn || false,
        isLoading: initialState?.me?.isLoading || false,
    });

    const fullContext = {
        ...meContext,
        setMe: (user: any) => {
            setMeContext(prev => ({
                ...prev,
                me: user,
                isLoggedIn: !!user.id,
                isLoading: false
            }));
            store.dispatch({ type: 'SET_USER', payload: user });
        },
    } as MeContextStateConsumer;

    return (
        <Provider store={store}>
            <MeContext.Provider value={fullContext}>
                {(!meContext.isLoading || hideLoadingSpace) ? children :
                    (meContext.networkError ?
                        <div>Network Error</div> :
                        <div>Loading...</div>
                    )
                }
            </MeContext.Provider>
        </Provider>
    );
};