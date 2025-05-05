import {
    BasePaginatedContextProviderProps,
    BasePaginatedContextState, createCallbacks,
    defaultBaseContext, prepareContextState,
} from '../BasePaginatedContext';
import React, {PropsWithChildren, useEffect, useState} from 'react';
import Platform from "../../models/platform/platform";
import Page from "../../components/Template/Page";

/**
 * The state interface for our state
 */
export interface PlatformsContextState extends BasePaginatedContextState<Platform> {}

/**
 * This lets us persist the loaded state across multiple instances of the provider
 */
const persistentStateRef = { current: createDefaultState() };

function createDefaultState(): PlatformsContextState {
    return {
        ...defaultBaseContext(),
        loadAll: true,
        expands: ["platformGroup"],
        limit: 100,
    }
}

/**
 * The actual context component
 */
export const PlatformsContext = React.createContext<PlatformsContextState>(createDefaultState());

export const PlatformsContextProvider: React.FC<PropsWithChildren> = (props => {

    const [platformsState, setPlatformsState] = useState(persistentStateRef.current);

    const fullContext = {
        ...platformsState,
        ...prepareContextState(setPlatformsState, platformsState, '/platforms')
    }

    return (
        <PlatformsContext.Provider value={fullContext}>
            <PlatformsContext.Consumer>
                {context => {
                    persistentStateRef.current = context
                    return props.children
                }}
            </PlatformsContext.Consumer>
        </PlatformsContext.Provider>
    )
});
