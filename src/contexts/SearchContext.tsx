import {
    BasePaginatedContextProviderProps,
    BasePaginatedContextState,
    defaultBaseContext,
    createCallbacks,
    SearchProps,
} from './BasePaginatedContext';
import React, { useCallback, PropsWithChildren, useEffect, useState, Dispatch, SetStateAction} from 'react';
import User from "../models/user/user";
import Resource from "../models/resource";
import LoadingScreen from '../components/LoadingScreen';

/**
 * The state interface for our state
 */
export interface SearchContextState extends BasePaginatedContextState<Resource<User>> {
    lastSearch: string|null,
}

const defaultContextObject: SearchContextState = {
    ...defaultBaseContext<Resource<User>>(),
    expands: [
        'resource',
        'resource.business',
    ],
    limit: 20,
    lastSearch: null,
};

/**
 * The actual context component
 */
export const SearchContext = React.createContext<SearchContextState>(defaultContextObject);

export interface SearchContextProviderProps extends BasePaginatedContextProviderProps {
    latitude: number,
    longitude: number,
    searchText: string,
}

export const SearchContextProvider: React.FC<PropsWithChildren<SearchContextProviderProps>> = (({latitude, longitude, searchText, children}) => {
    const [searchState, setSearchState] = useState<SearchContextState>({...defaultContextObject});

    const wrappedSetSearchStateForBaseContext: Dispatch<SetStateAction<BasePaginatedContextState<Resource<User>>>> = 
        useCallback((action) => {
            setSearchState(currentSearchState => {
                const baseStateChanges = typeof action === 'function' 
                    ? (action as (prevState: BasePaginatedContextState<Resource<User>>) => BasePaginatedContextState<Resource<User>>)(currentSearchState) 
                    : action;
                return { ...currentSearchState, ...baseStateChanges };
            });
    }, [setSearchState]);

    useEffect(() => {
        setSearchState(prevState => {
            const newParams: Record<string, unknown | number> = {
                latitude,
                longitude,
            };
            if (!searchText || searchText.length === 0) {
                newParams.radius = 80.4672;
                newParams['filter[resource_type]'] = 'location';
            }

            const newSearchProps: SearchProps = { ...prevState.search };
            if (searchText && searchText.length > 0) {
                newSearchProps.content = searchText;
            } else {
                delete newSearchProps.content;
            }

            const nextState: SearchContextState = {
                ...prevState,
                params: newParams,
                search: newSearchProps,
                lastSearch: searchText,
                initiated: true,
                initialLoadComplete: false,
                loadedData: [],
                lastLoadedPage: undefined,
                noResults: false,
                refreshing: true,
            };

            const contextWithNewSettings = createCallbacks<Resource<User>>(wrappedSetSearchStateForBaseContext, nextState, '/resources');
            contextWithNewSettings.refreshData(false).catch(console.error);

            return nextState;
        });
    }, [latitude, longitude, searchText, setSearchState, wrappedSetSearchStateForBaseContext]);

    const fullContext = {
        ...searchState,
        ...createCallbacks<Resource<User>>(wrappedSetSearchStateForBaseContext, searchState, '/resources')
    };

    return (
        <SearchContext.Provider value={fullContext}>
            <SearchContext.Consumer>
                {context => {
                    return context.initialLoadComplete ? children : <LoadingScreen text={"Searching"}/>;
                }}
            </SearchContext.Consumer>
        </SearchContext.Provider>
    )
});
