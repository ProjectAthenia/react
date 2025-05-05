import {
    BasePaginatedContextState, createCallbacks,
    defaultBaseContext, prepareContextState,
} from '../BasePaginatedContext';
import React, {PropsWithChildren, useEffect, useState} from 'react';
import Release from "../../models/game/release";

/**
 * The state interface for our state
 */
export interface ReleasesContextState extends BasePaginatedContextState<Release> {}

function createDefaultState(): ReleasesContextState {
    return {
        ...defaultBaseContext(),
        expands: ["game", "platform"],
        limit: 100,
    }
}

/**
 * The actual context component
 */
export const ReleasesContext = React.createContext<ReleasesContextState>(createDefaultState());

interface ReleasesContextProviderProps extends PropsWithChildren {
    year?: number;
    platformIds?: number[];
}

export const ReleasesContextProvider: React.FC<ReleasesContextProviderProps> = ({ children, year, platformIds }) => {
    const [releasesState, setReleasesState] = useState(createDefaultState());

    useEffect(() => {
        if (year) {
            const startDate = `${year}-01-01 00:00:00`;
            const endDate = `${year}-12-31 23:59:59`;
            releasesState.setFilter('release_date', `between,${startDate},${endDate}`);
        } else {
            releasesState.setFilter('release_date', undefined);
        }
    }, [year]);

    useEffect(() => {
        if (platformIds?.length) {
            releasesState.setFilter('platform_id', `in,${platformIds.join(',')}`);
        } else {
            releasesState.setFilter('platform_id', undefined);
        }
    }, [platformIds]);

    const fullContext = {
        ...releasesState,
        ...createCallbacks(setReleasesState, releasesState, '/releases')
    }

    return (
        <ReleasesContext.Provider value={fullContext}>
            {children}
        </ReleasesContext.Provider>
    )
}; 