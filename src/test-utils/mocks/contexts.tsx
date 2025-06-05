import React, { ReactNode } from 'react';
import { MeContextStateConsumer, MeContext } from '../../contexts/MeContext';
import { placeholderUser } from '../../models/user/user';
import User from '../../models/user/user';
import { CategoriesContextState } from '../../contexts/CategoriesContext';
import Category from '../../models/category';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mockCategory } from './models/category';
import { mockPagination } from './pagination';

// Mock appState
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
export const createBaseMockContextState = <T extends Category>(data: T[]) => mockPagination<T>({
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
    setFilter: jest.fn(),
    setSearch: jest.fn(),
    setOrder: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addModel: jest.fn((_model: T) => {}),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeModel: jest.fn((_model: T) => {}),
    getModel: jest.fn((id: number) => data.find(item => item.id === id) || null),
    params: {},
    loadNext: jest.fn(),
    refreshData: jest.fn()
});

// Mock CategoriesContext
export const mockCategoriesContextValue = {
    ...createBaseMockContextState<Category>([
        mockCategory({ id: 1, name: 'Test Category', can_be_primary: true })
    ])
};

export const mockCategoriesContextValueLoading = {
    ...createBaseMockContextState<Category>([]),
    initialLoadComplete: false,
    isLoading: true
};

export const mockCategoriesContextValueEmpty = {
    ...createBaseMockContextState<Category>([]),
    noResults: true
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
            user: User;
            networkError: boolean;
            isLoggedIn: boolean;
            isLoading: boolean;
        };
    };
    hideLoadingSpace?: boolean;
}

// MeContext Provider
export const MeContextProvider: React.FC<MeContextProviderProps> = ({ children, initialState, hideLoadingSpace }) => {
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
        setMe: (user: User) => {
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