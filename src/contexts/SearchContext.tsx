import {
    BasePaginatedContextProviderProps,
    BasePaginatedContextState, createCallbacks,
    defaultBaseContext, prepareContextState,
} from './BasePaginatedContext';
import React, {createContext, PropsWithChildren, useEffect, useState} from 'react';
import User from "../models/user/user";
import Resource from "../models/resource";
import LoadingScreen from '../components/LoadingScreen';

/**
 * The state interface for our state
 */
export interface SearchContextState extends BasePaginatedContextState<Resource<User>> {
    lastSearch: string|null,
}

const defaultContext = {
    ...defaultBaseContext(),
    expands: [
        'resource',
        'resource.business',
    ],
    limit: 20,
} as SearchContextState;

/**
 * The actual context component
 */
export const SearchContext = React.createContext<SearchContextState>(defaultContext);

export interface SearchContextProviderProps extends BasePaginatedContextProviderProps {
    latitude: number,
    longitude: number,
    searchText: string,
}

export const SearchContextProvider: React.FC<PropsWithChildren<SearchContextProviderProps>> = (({latitude, longitude, searchText, ...props}) => {
    const [searchState, setSearchState] = useState({...defaultContext});

    useEffect(() => {
        const params = {
            latitude,
            longitude,
        } as any;
        if (!searchText || searchText.length === 0) {
            params.radius = 80.4672;
            params['filter[resource_type]'] = 'location';
        }
        searchState.initiated = true;
        const newState = prepareContextState(setSearchState as any, searchState,'/resources', params);

        // This actually kicks off the load
        newState.initialLoadComplete = false;
        newState.setSearch('content', searchText);
    }
    , [latitude, longitude, searchText]);

    const fullContext = {
        ...searchState,
        ...createCallbacks(setSearchState as any, searchState, '/resources')
    }

    return (
        <SearchContext.Provider value={fullContext}>
            <SearchContext.Consumer>
                {context => {
                    return context.initialLoadComplete ? props.children : <LoadingScreen text={"Searching"}/>;
                }}
            </SearchContext.Consumer>
        </SearchContext.Provider>
    )
});
