import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import './index.scss';
import Page from "../../components/Template/Page";
import Categories from './Categories';
import CategoryEditor from './CategoryEditor';

const BrowseContent: React.FC = () => {
    return (
        <Page>
            <div className="browse-content">
                <h1>Browse Collection</h1>
                <p className="lead">Explore our collection by different categories</p>
                
                <div className="browse-grid">
                    <Link to="/browse/categories" className="browse-card">
                        <div className="card-content">
                            <h2>Categories</h2>
                            <p>Browse items by category</p>
                        </div>
                    </Link>
                </div>
            </div>
        </Page>
    )
}

const Browse: React.FC = () => {
    return (
        <Switch>
            <Route exact path="/browse" component={BrowseContent} />
            <Route path="/browse/categories/create" component={CategoryEditor} />
            <Route path="/browse/categories/:id/edit" component={CategoryEditor} />
            <Route path="/browse/categories" component={Categories} />
        </Switch>
    )
}

export default Browse;



