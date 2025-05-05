import React from 'react';
import { Link } from 'react-router-dom';
import './index.scss';
import Page from "../../../components/Template/Page";
import CategoriesBrowser from "../../../components/Browse/CategoriesBrowser";
import { Button } from 'react-bootstrap';

const Categories: React.FC = () => {
    return (
        <Page>
            <div className="categories-page">
                <div className="page-header">
                    <h1>Categories</h1>
                    <Link to="/browse/categories/create">
                        <Button variant="primary">Create Category</Button>
                    </Link>
                </div>
                <CategoriesBrowser/>
            </div>
        </Page>
    )
}

export default Categories; 