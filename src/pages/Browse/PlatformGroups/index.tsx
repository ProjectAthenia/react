import React from 'react';
import { Link } from 'react-router-dom';
import './index.scss';
import Page from "../../../components/Template/Page";
import PlatformGroupsBrowser from "../../../components/Browse/PlatformGroupsBrowser";
import { Button } from 'react-bootstrap';

const PlatformGroups: React.FC = () => {
    return (
        <Page>
            <div className="platform-groups-page">
                <div className="page-header">
                    <h1>Platform Groups</h1>
                    <Link to="/browse/platform-groups/create">
                        <Button variant="primary">Create Platform Group</Button>
                    </Link>
                </div>
                <PlatformGroupsBrowser/>
            </div>
        </Page>
    )
}

export default PlatformGroups; 