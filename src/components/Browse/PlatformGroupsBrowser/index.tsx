import React from 'react';
import './index.scss';
import {PlatformGroupsContext, PlatformGroupsContextProvider} from "../../../contexts/GamingComponents/PlatformGroupsContext";
import PlatformGroupsList from "./PlatformGroupsList";

const PlatformGroupsBrowser: React.FC = () => {
    return (
        <PlatformGroupsContextProvider>
            <PlatformGroupsContext.Consumer>
                {context =>
                    <PlatformGroupsList contextState={context}/>
                }
            </PlatformGroupsContext.Consumer>
        </PlatformGroupsContextProvider>
    )
}

export default PlatformGroupsBrowser; 