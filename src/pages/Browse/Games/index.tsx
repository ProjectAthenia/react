import React from 'react';
import './index.scss';
import Page from "../../../components/Template/Page";
import GameBrowser from "../../../components/Browse/GameBrowser";

const Games: React.FC = () => {
    return (
        <Page>
            <GameBrowser/>
        </Page>
    )
}

export default Games 