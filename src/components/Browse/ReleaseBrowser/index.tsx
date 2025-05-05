import React, { useState, useEffect } from 'react';
import './index.scss';
import {ReleasesContext, ReleasesContextProvider} from "../../../contexts/GamingComponents/ReleasesContext";
import ReleasesList from "./ReleasesList";
import Platform from "../../../models/platform/platform";
import PlatformGroup from "../../../models/platform/platform-group";
import { UserCollectionsContext, UserCollectionsContextProvider } from "../../../contexts/UserCollectionsContext";
import { CollectionItemsContext, CollectionItemsContextProvider } from "../../../contexts/CollectionItemsContext";

interface ReleaseBrowserProps {
    platform?: Platform;
    platformGroup?: PlatformGroup;
    userId?: number;
}

const ReleaseBrowser: React.FC<ReleaseBrowserProps> = ({ platform, platformGroup, userId }) => {
    const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
    const [platformIds, setPlatformIds] = useState<number[]>([]);

    useEffect(() => {
        let newPlatformIds: number[] = [];
        
        if (platform?.id) {
            newPlatformIds = [platform.id];
        } else if (platformGroup?.platforms) {
            newPlatformIds = platformGroup.platforms
                .map(p => p.id!);
        }

        // Only update if the values are different
        if (JSON.stringify(newPlatformIds) !== JSON.stringify(platformIds)) {
            setPlatformIds(newPlatformIds);
        }
    }, [platform?.id, platformGroup?.platforms]);

    return (platformIds?.length ?
        <ReleasesContextProvider year={selectedYear} platformIds={platformIds}>
            <ReleasesContext.Consumer>
                {context => (
                    userId ? (
                        <UserCollectionsContextProvider userId={userId}>
                            <UserCollectionsContext.Consumer>
                                {collectionsContext => (
                                    <CollectionItemsContextProvider 
                                        collectionIds={collectionsContext.loadedData
                                            .filter(c => c.id !== undefined)
                                            .map(c => c.id as number)
                                        }
                                    >
                                        <CollectionItemsContext.Consumer>
                                            {collectionItemsContext => (
                                                <ReleasesList 
                                                    contextState={context}
                                                    onYearChanged={setSelectedYear}
                                                    userId={userId}
                                                    collectionsContextState={collectionsContext}
                                                    collectionItemsContextState={collectionItemsContext}
                                                />
                                            )}
                                        </CollectionItemsContext.Consumer>
                                    </CollectionItemsContextProvider>
                                )}
                            </UserCollectionsContext.Consumer>
                        </UserCollectionsContextProvider>
                    ) : (
                        <ReleasesList 
                            contextState={context}
                            onYearChanged={setSelectedYear}
                            userId={userId}
                        />
                    )
                )}
            </ReleasesContext.Consumer>
        </ReleasesContextProvider> : <></>
    )
}

export default ReleaseBrowser 