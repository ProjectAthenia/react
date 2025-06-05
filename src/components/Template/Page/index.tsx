import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';
import Menu from "../../Menu";
import { Link } from "react-router-dom";

interface PageProps extends React.HTMLProps<HTMLDivElement> {
}

const Page: React.FC<PageProps> = ({children}) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="d-flex" id="wrapper">
            {/* Sidebar */}
            <div className={`border-end bg-light sidebar ${sidebarOpen ? 'open' : 'collapsed'}`} id="sidebar-wrapper" data-testid="sidebar">
                <div className="sidebar-heading border-bottom bg-white">
                    <Link to="/" className="list-group-item list-group-item-action list-group-item-light p-3 text-decoration-none">
                        Home
                    </Link>
                </div>
                <Menu/>
            </div>

            {/* Page Content */}
            <div id="page-content-wrapper" className="flex-grow-1">
                {/* Top Navigation */}
                <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                    <button className="btn btn-primary" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        ☰
                    </button>
                    <div className="ms-3">Header Title</div>
                </nav>

                {/* Main Content */}
                <div className="container-fluid mt-4" role="main">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Page;
