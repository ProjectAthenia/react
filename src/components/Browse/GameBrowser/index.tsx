import React from 'react';
import './index.scss';
import {GamesContext, GamesContextProvider} from "../../../contexts/GamingComponents/GamesContext";
import GamesList from "./GamesList";

const GameBrowser: React.FC = ( ) => {
    return (
        <GamesContextProvider>
            <GamesContext.Consumer>
                {contextValue => {
                    return (
                        <GamesList
                            context={contextValue}
                        />
                    );
                }}
            </GamesContext.Consumer>
        </GamesContextProvider>
    );
}

export default GameBrowser; 