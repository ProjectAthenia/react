import React from 'react';
import './index.scss';
import Page from "../../../components/Template/Page";
import PlatformsBrowser from "../../../components/Browse/PlatformsBrowser";

const Platforms: React.FC = () => {
    return (
        <Page>
            <div className="platforms-page">
                <div className="page-header">
                    <h1>Platforms</h1>
                </div>
                <PlatformsBrowser/>
            </div>
        </Page>
    )
}

export default Platforms;



