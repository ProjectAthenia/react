import React from 'react';
import {Redirect, Route, RouteProps} from 'react-router-dom';
import {TokenState} from '../../data/persistent/persistent.state';
import {connect} from '../../data/connect';

interface OwnProps extends RouteProps {
    children?: React.ReactNode
}

interface StateProps {
    tokenData?: TokenState;
}

interface AuthenticatedRouteProps extends OwnProps, StateProps {
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ children, tokenData, ...rest }) => {
    return (
        <>
            {tokenData ? (
                <Route {...rest} >
                    {children}
                </Route>
            ) : (
                <Redirect to="/splash" />
            )}
        </>
    )
}

export default connect<OwnProps, StateProps, { }>({
    mapStateToProps: (state) => ({
        tokenData: state.persistent.tokenData
    }),
    component: AuthenticatedRoute
});
