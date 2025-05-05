import React from 'react';
import './index.scss';
import Page from "../../components/Template/Page";
import MeContextProvider, { MeContext } from '../../contexts/MeContext';
import MyCollections from '../../components/Dashboard/MyCollections/index';

const Home: React.FC = () => {
  return (
    <Page>
      <div className="home-content">
        <h1>Welcome to Game Museum</h1>
        
        <MeContextProvider>
          <MeContext.Consumer>
            {({ me, isLoggedIn }) => (
              <>
                {isLoggedIn && me.id ? (
                  <div className="dashboard-section">
                    <MyCollections user={me} />
                  </div>
                ) : (
                  <div className="welcome-section">
                    <p>Please log in to view your collections and manage your game library.</p>
                  </div>
                )}
              </>
            )}
          </MeContext.Consumer>
        </MeContextProvider>
      </div>
    </Page>
  );
};

export default Home;



