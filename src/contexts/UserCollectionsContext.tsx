import {
    BasePaginatedContextProviderProps,
    BasePaginatedContextState, createCallbacks,
    defaultBaseContext,
} from './BasePaginatedContext';
import React, {PropsWithChildren, useCallback, useEffect, useMemo, useState, Dispatch, SetStateAction} from 'react';
import Collection from "../models/user/collection";

/**
 * The state interface for our state
 */
export interface UserCollectionsContextState extends BasePaginatedContextState<Collection> {}

/**
 * This lets us persist the loaded state across multiple instances of the provider
 * For initial load only.
 */
const initialPersistentContextState = createDefaultState();

function createDefaultState(): UserCollectionsContextState {
    return {
        ...defaultBaseContext<Collection>(), // Specify Model type
        loadAll: true,
        order: {
            'created_at': 'desc',
        },
        limit: 50,
    }
}

/**
 * The actual context component
 */
export const UserCollectionsContext = React.createContext<UserCollectionsContextState>(createDefaultState());

export interface UserCollectionsContextProviderProps extends BasePaginatedContextProviderProps{
    userId: number,
}

export const UserCollectionsContextProvider: React.FC<PropsWithChildren<UserCollectionsContextProviderProps>> = (props => {
    const [userCollectionsState, setUserCollectionsState] = useState<UserCollectionsContextState>(initialPersistentContextState);

    const wrappedSetUserCollectionsState: Dispatch<SetStateAction<BasePaginatedContextState<Collection>>> = 
        useCallback((action) => {
            setUserCollectionsState(currentUserCollectionsState => {
                const baseStateChanges = typeof action === 'function' 
                    ? (action as (prevState: BasePaginatedContextState<Collection>) => BasePaginatedContextState<Collection>)(currentUserCollectionsState) 
                    : action;
                return { ...currentUserCollectionsState, ...baseStateChanges } as UserCollectionsContextState;
            });
    }, [setUserCollectionsState]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setUserCollectionsState(_prevState => {
            let newState = createDefaultState(); 

            newState = createCallbacks<Collection>(
                wrappedSetUserCollectionsState, 
                newState, 
                `/users/${props.userId}/collections`
            );
            
            newState.refreshData(false).catch(console.error);

            return {
                ...newState,
                loadedData: [],
                lastLoadedPage: undefined,
                noResults: false,
                refreshing: true,
                initialLoadComplete: false,
                initiated: true, 
            };
        });
    }, [props.userId, setUserCollectionsState, wrappedSetUserCollectionsState]);

    const fullContext = useMemo(() => ({
        ...userCollectionsState,
        ...createCallbacks<Collection>(wrappedSetUserCollectionsState, userCollectionsState, `/users/${props.userId}/collections`)
    }), [userCollectionsState, wrappedSetUserCollectionsState, props.userId]);

    return (
        <UserCollectionsContext.Provider value={fullContext}>
            {props.children}
        </UserCollectionsContext.Provider>
    )
});
