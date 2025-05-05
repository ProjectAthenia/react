import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import './index.scss';
import Page from "../../components/Template/Page";
import Platforms from './Platforms';
import Games from './Games';
import PlatformPage from './Platform';
import PlatformGroups from './PlatformGroups';
import PlatformGroupPage from './PlatformGroup';
import PlatformGroupEditor from './PlatformGroupEditor';
import PlatformEditor from './PlatformEditor';
import Categories from './Categories';
import CategoryEditor from './CategoryEditor';

const BrowseContent: React.FC = () => {
    return (
        <Page>
            <div className="browse-content">
                <h1>Browse Collection</h1>
                <p className="lead">Explore our video game collection by different categories</p>
                
                <div className="browse-grid">
                    <Link to="/browse/platforms" className="browse-card">
                        <div className="card-content">
                            <h2>Platforms</h2>
                            <p>Browse and learn about different gaming platforms in our collection</p>
                        </div>
                    </Link>
                    
                    <Link to="/browse/platform-groups" className="browse-card">
                        <div className="card-content">
                            <h2>Platform Groups</h2>
                            <p>Browse platforms by their manufacturer or family</p>
                        </div>
                    </Link>

                    <Link to="/browse/categories" className="browse-card">
                        <div className="card-content">
                            <h2>Categories</h2>
                            <p>Browse games by category or genre</p>
                        </div>
                    </Link>
                    
                    <Link to="/browse/games" className="browse-card">
                        <div className="card-content">
                            <h2>Games</h2>
                            <p>Browse our complete collection of games</p>
                        </div>
                    </Link>
                    
                    <div className="browse-card coming-soon">
                        <div className="card-content">
                            <h2>Years</h2>
                            <p>Browse games by release year</p>
                            <span className="badge">Coming Soon</span>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    )
}

const Browse: React.FC = () => {
    return (
        <Switch>
            <Route exact path="/browse" component={BrowseContent} />
            <Route path="/browse/platforms/create" component={PlatformEditor} />
            <Route path="/browse/platforms/:id/edit" component={PlatformEditor} />
            <Route path="/browse/platforms/:id" component={PlatformPage} />
            <Route path="/browse/platforms" component={Platforms} />
            <Route path="/browse/platform-groups/create" component={PlatformGroupEditor} />
            <Route path="/browse/platform-groups/:id/edit" component={PlatformGroupEditor} />
            <Route path="/browse/platform-groups/:id" component={PlatformGroupPage} />
            <Route path="/browse/platform-groups" component={PlatformGroups} />
            <Route path="/browse/categories/create" component={CategoryEditor} />
            <Route path="/browse/categories/:id/edit" component={CategoryEditor} />
            <Route path="/browse/categories" component={Categories} />
            <Route path="/browse/games" component={Games} />
        </Switch>
    )
}

export default Browse



