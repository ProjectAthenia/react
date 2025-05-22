import React from "react";
import {Link, LinkProps} from "react-router-dom";

const MenuLink: React.FC<LinkProps> = ({children, ...props}) => {
    return (
        <Link 
            className="list-group-item list-group-item-action list-group-item-light p-3" 
            {...props}
        >
            {children}
        </Link>
    );
}

export default MenuLink;