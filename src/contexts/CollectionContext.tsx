import React, {PropsWithChildren, useEffect, useState} from 'react';
import Collection, {collectionPlaceholder} from "../models/user/collection";
import CollectionManagementRequests from "../services/requests/CollectionManagementRequests";
import LoadingScreen from "../components/LoadingScreen";

let cachedCollections = [] as Collection[];
/**
 * The state interface for our state
 */
export interface CollectionContextConsumerState {
    hasLoaded: boolean,
    notFound: boolean,
    collection: Collection,
    setCollection: (collection: Collection) => void,
}

let defaultContext: CollectionContextConsumerState = {
    hasLoaded: false,
    notFound: false,
    collection: collectionPlaceholder(),
    setCollection: (collection: Collection) => {}
};

/**
 * The actual context component
 */
export const CollectionContext = React.createContext<CollectionContextConsumerState>(defaultContext);

export interface CollectionContextProviderProps {
    collectionId: number
    skipCache?: boolean
}

export const CollectionContextProvider: React.FC<PropsWithChildren<CollectionContextProviderProps>> = ({collectionId, skipCache, children}) => {
    const [collectionState, setCollectionState] = useState(defaultContext);

    const setCollection = (collection: Collection): void => {
        cachedCollections[collection.id!] = {...collection};
        setCollectionState({
            ...collectionState,
            collection: collection,
        })
    }

    useEffect(() => {
        if (!skipCache && cachedCollections[collectionId]) {
            setCollectionState({
                hasLoaded: true,
                notFound: false,
                collection: cachedCollections[collectionId],
                setCollection: setCollection,
            });
        } else {
            setCollectionState({
                ...collectionState,
                hasLoaded: false,
            });
            CollectionManagementRequests.getCollection(collectionId).then(collection => {
                cachedCollections[collectionId] = collection;
                setCollectionState({
                    hasLoaded: true,
                    notFound: false,
                    collection: collection,
                    setCollection,
                });
            }).catch(() => {
                setCollectionState({
                    ...collectionState,
                    hasLoaded: true,
                    notFound: true,
                });
            })
        }
    }, [collectionId, window.location.pathname]);


    return (
        <CollectionContext.Provider value={{...collectionState, setCollection}}>
            <CollectionContext.Consumer>
                {context => (context.hasLoaded ?
                    (!context.notFound ? children :
                            <div className={'post-not-found'}>
                                <h2>This collection has been deleted</h2>
                            </div>
                    ) : <LoadingScreen/>
                )}
            </CollectionContext.Consumer>
        </CollectionContext.Provider>
    )
}
