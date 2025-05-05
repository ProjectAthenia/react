import React from "react";
import MenuLink from "./MenuLink";
import MeContextProvider, { MeContext } from "../../contexts/MeContext";

const Menu: React.FC = () => {
    return (
        <div className="list-group list-group-flush">
            <MenuLink to="/browse">
                Browse
            </MenuLink>
            <MenuLink to="/data-view">
                Data View
            </MenuLink>
            <MeContextProvider optional hideLoadingSpace>
                <MeContext.Consumer>
                    {context => (
                        context.isLoggedIn ? (
                            <MenuLink to="/settings">
                                Settings
                            </MenuLink>
                        ) : (
                            <>
                                <MenuLink to="/sign-in">
                                    Sign In
                                </MenuLink>
                                <MenuLink to="/sign-up">
                                    Sign Up
                                </MenuLink>
                            </>
                        )
                    )}
                </MeContext.Consumer>
            </MeContextProvider>
        </div>
    )
}

export default Menu;