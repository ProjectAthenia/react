import React from 'react';
import './index.scss';
import {PlatformsContext, PlatformsContextProvider} from "../../../contexts/GamingComponents/PlatformsContext";
import {PlatformGroupsContext, PlatformGroupsContextProvider} from "../../../contexts/GamingComponents/PlatformGroupsContext";
import PlatformsList from "./PlatformsList";

const PlatformsBrowser: React.FC = () => {
    return (
        <PlatformsContextProvider>
            <PlatformsContext.Consumer>
                {platformsContext => (
                    <PlatformGroupsContextProvider>
                        <PlatformGroupsContext.Consumer>
                            {platformGroupsContext => (
                                <PlatformsList 
                                    platformsContextState={platformsContext}
                                    platformGroupsContextState={platformGroupsContext}
                                />
                            )}
                        </PlatformGroupsContext.Consumer>
                    </PlatformGroupsContextProvider>
                )}
            </PlatformsContext.Consumer>
        </PlatformsContextProvider>
    )
}

export default PlatformsBrowser;



