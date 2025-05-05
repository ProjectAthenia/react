import {
    BasePaginatedContextProviderProps,
    BasePaginatedContextState, createCallbacks,
    defaultBaseContext, prepareContextState,
} from '../BasePaginatedContext';
import React, {PropsWithChildren, useEffect, useState} from 'react';
import Game from "../../models/game/game";

/**
 * The state interface for our state
 */
export interface GamesContextState extends BasePaginatedContextState<Game> {}

/**
 * This lets us persist the loaded state across multiple instances of the provider
 */
const persistentStateRef = { current: createDefaultState() };

function createDefaultState(): GamesContextState {
    return {
        ...defaultBaseContext(),
        expands: [],
        limit: 100,
    }
}

/**
 * The actual context component
 */
export const GamesContext = React.createContext<GamesContextState>(createDefaultState());

export const GamesContextProvider: React.FC<PropsWithChildren> = (props => {
    const [gamesState, setGamesState] = useState(persistentStateRef.current);

    const fullContext = {
        ...gamesState,
        ...prepareContextState(setGamesState, gamesState, '/games')
    }

    return (
        <GamesContext.Provider value={fullContext}>
            <GamesContext.Consumer>
                {context => {
                    persistentStateRef.current = context
                    return props.children
                }}
            </GamesContext.Consumer>
        </GamesContext.Provider>
    )
}); 