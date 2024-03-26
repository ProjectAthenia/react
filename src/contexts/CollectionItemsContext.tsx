import {
    BasePaginatedContextProviderProps,
    BasePaginatedContextState, createCallbacks,
    defaultBaseContext, prepareContextState,
} from './BasePaginatedContext';
import React, {PropsWithChildren, useEffect, useState} from 'react';
import CollectionItem from "../models/user/collection-items";
import CollectionManagementRequests from "../services/requests/CollectionManagementRequests";

/**
 * The state interface for our state
 */
export interface CollectionItemsContextState extends BasePaginatedContextState<CollectionItem> {}

function createDefaultState(): CollectionItemsContextState {
    return {
        ...defaultBaseContext(),
        expands: [
            'item',
            'item.postLocations',
        ],
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
export const CollectionItemsContext = React.createContext<CollectionItemsContextState>(createDefaultState());

export interface CollectionItemsContextProviderProps extends BasePaginatedContextProviderProps{
    collectionId: number
    skipCache?: boolean
}

export const CollectionItemsContextProvider: React.FC<PropsWithChildren<CollectionItemsContextProviderProps>> = ({collectionId, skipCache, children, ...rest}) => {
    const [collectionItemsState, setCollectionItemsState] = useState(createDefaultState());

    useEffect(() => {
        const collectionItemsNewContextState = prepareContextState(setCollectionItemsState, collectionItemsState, '/collections/' + collectionId + '/items')
        setCollectionItemsState(collectionItemsNewContextState)
    }, [collectionId]);

    const fullContext = {
        ...collectionItemsState,
        ...createCallbacks(setCollectionItemsState, collectionItemsState, '/collections/' + collectionId + '/items')
    }

    return (
        <CollectionItemsContext.Provider value={fullContext}>
            {children}
        </CollectionItemsContext.Provider>
    )
};
