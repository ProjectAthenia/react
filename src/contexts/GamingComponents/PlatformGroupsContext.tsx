import {
    BasePaginatedContextProviderProps,
    BasePaginatedContextState, createCallbacks,
    defaultBaseContext,
    prepareContextState,
} from '../BasePaginatedContext';
import React, {PropsWithChildren, useEffect, useState} from 'react';
import PlatformGroup from "../../models/platform/platform-group";
import Page from "../../models/page";

/**
 * The state interface for our state
 */
export interface PlatformGroupsContextState extends BasePaginatedContextState<PlatformGroup> {}

/**
 * This lets us persist the loaded state across multiple instances of the provider
 */
const persistentStateRef = { current: createDefaultState() };

function createDefaultState(): PlatformGroupsContextState {
    return {
        ...defaultBaseContext(),
        loadAll: true,
        expands: ["platforms"],
        limit: 100,
    }
}

/**
 * The actual context component
 */
export const PlatformGroupsContext = React.createContext<PlatformGroupsContextState>(createDefaultState());

export const PlatformGroupsContextProvider: React.FC<PropsWithChildren> = (props => {

    const [platformGroupsState, setPlatformGroupsState] = useState(persistentStateRef.current);

    const fullContext = {
        ...platformGroupsState,
        ...prepareContextState(setPlatformGroupsState, platformGroupsState, '/platform-groups')
    }

    return (
        <PlatformGroupsContext.Provider value={fullContext}>
            <PlatformGroupsContext.Consumer>
                {context => {
                    persistentStateRef.current = context
                    return props.children
                }}
            </PlatformGroupsContext.Consumer>
        </PlatformGroupsContext.Provider>
    )
}); 