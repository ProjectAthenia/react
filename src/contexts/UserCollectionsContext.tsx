import {
    BasePaginatedContextProviderProps,
    BasePaginatedContextState, createCallbacks,
    defaultBaseContext,
    // prepareContextState, // No longer used directly by this context
} from './BasePaginatedContext';
import React, {PropsWithChildren, useCallback, useEffect, useMemo, useState, Dispatch, SetStateAction} from 'react'; // Added useMemo, useCallback, Dispatch, SetStateAction
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

// Define a type for the setUserCollectionsState to properly type the wrapped version if needed.
// However, BasePaginatedContext already defines setContext with the base type.
// The issue before was with SearchContext having extra fields.
// UserCollectionsContextState does not have extra fields beyond BasePaginatedContextState<Collection>.
// So, direct passing of setUserCollectionsState should be fine if BasePaginatedContext helpers are fixed
// to use functional updates. Assuming that for now, or if not, the wrapper approach like in SearchContext would be needed.
// For now, let's try direct pass and see if linter complains after base context fix (which isn't done yet).
// Given the current state of BasePaginatedContext, a wrapper would be safer. Let's implement it for consistency.

export const UserCollectionsContextProvider: React.FC<PropsWithChildren<UserCollectionsContextProviderProps>> = (props => {
    const [userCollectionsState, setUserCollectionsState] = useState<UserCollectionsContextState>(initialPersistentContextState);

    // Wrapper for setUserCollectionsState to ensure compatibility with BasePaginatedContext's setContext expectations
    // if BasePaginatedContext helpers don't use functional updates preserving extended fields.
    // Since UserCollectionsContextState = BasePaginatedContextState<Collection> (no extra fields), this wrapper might be overly cautious
    // but harmless if BasePaginatedContext is correctly implemented later.
    const wrappedSetUserCollectionsState: Dispatch<SetStateAction<BasePaginatedContextState<Collection>>> = 
        useCallback((action) => {
            setUserCollectionsState(currentUserCollectionsState => {
                const baseStateChanges = typeof action === 'function' 
                    ? (action as (prevState: BasePaginatedContextState<Collection>) => BasePaginatedContextState<Collection>)(currentUserCollectionsState) 
                    : action;
                // Since UserCollectionsContextState has no extra fields over BasePaginatedContextState<Collection>,
                // this effectively becomes { ...currentUserCollectionsState, ...baseStateChanges }
                // which should correctly result in UserCollectionsContextState.
                return { ...currentUserCollectionsState, ...baseStateChanges } as UserCollectionsContextState;
            });
    }, [setUserCollectionsState]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setUserCollectionsState(_prevState => {
            // When userId changes, we want to reset and reload to that user's collections.
            // Create a fresh default state, then prepare it with callbacks for the new endpoint.
            let newState = createDefaultState(); // Fresh state for the new user

            // Bind callbacks to this new state and the correct endpoint using the wrapped setter
            newState = createCallbacks<Collection>(
                wrappedSetUserCollectionsState, 
                newState, 
                `/users/${props.userId}/collections`
            );
            
            // Trigger the load for the new user ID
            newState.refreshData(false).catch(console.error);

            // Return the state that reflects "about to load" for the new user.
            // refreshData itself sets refreshing to true, clears data etc. via the setter.
            return {
                ...newState, // This now has the correct callbacks and endpoint reference within them.
                loadedData: [],
                lastLoadedPage: undefined,
                noResults: false,
                refreshing: true,
                initialLoadComplete: false,
                initiated: true, // We've initiated the load process for the new user.
            };
        });
    }, [props.userId, setUserCollectionsState, wrappedSetUserCollectionsState]); // Add wrappedSetUserCollectionsState

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
