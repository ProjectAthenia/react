import React, {Dispatch, PropsWithChildren, SetStateAction, useEffect, useState} from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import {connect} from '../../data/connect';
import OrganizationRequests from '../../services/requests/OrganizationRequests';
import Organization, {placeholderOrganization} from '../../models/organization/organization';
import User from '../../models/user/user';
import MeContextProvider, {MeContext} from '../MeContext';
import {setManagingBusinessId} from '../../data/persistent/persistent.actions';
import {useHistory} from "react-router";

export interface MyBusinessContextState {
    organization: Organization,
    setOrganization: (organization: Organization) => void,
    organizationInitiated: boolean,
}

const defaultState = {
    organization: placeholderOrganization(),
    organizationInitiated: false,
} as MyBusinessContextState;

let persistedState = defaultState;

export const MyBusinessContext = React.createContext<MyBusinessContextState>(defaultState);

function createSetOrganizationCallback(businessContext: MyBusinessContextState, setBusinessContext: Dispatch<SetStateAction<MyBusinessContextState>>) {
    return (organization: Organization) => {
        persistedState.organization = organization;
        setBusinessContext({
            ...businessContext,
            organization: {...organization},
        });
    }
}

interface MyBusinessContextProviderMeReadyProps extends MyBusinessContextProviderProps {
    me: User,
    setManagingBusinessId: (id?: number) => void,
}

/**
 * Allows child components the ability to easily use the information of the current business the user is managing
 */
const MyBusinessContextProviderMeReady: React.FC<PropsWithChildren<MyBusinessContextProviderMeReadyProps>> = ({me, hideLoadingSpace, setManagingBusinessId, doneManagingRedirectLink, managingBusinessId, ...props}) => {
    const [myBusinessContext, setMyBusinessContext] = useState(persistedState);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_organizationId, setOrganizationId] = useState(0);
    const history = useHistory();

    useEffect(() => {
        // If the managing organization id is not set then we want to take them home, and return some nothingness
        if (!managingBusinessId) {
            if (!window.location.pathname.includes('business')){
                history.push(doneManagingRedirectLink ?? '/home/dashboard');
                return;
            }
        } else {
            if (myBusinessContext.organization.id !== managingBusinessId) {
                OrganizationRequests.getMyOrganization(managingBusinessId).then(organization => {
                    persistedState.organization = organization;
                    persistedState.organizationInitiated = true;
                    setMyBusinessContext({...persistedState});
                }).catch((error) => {
                    setOrganizationId(0);
                    history.push('/home/dashboard');
                    console.error(error);
                });
            }
        }
    }, [managingBusinessId, doneManagingRedirectLink, history, myBusinessContext.organization.id]);

    const fullContext = {
        ...persistedState,
        setOrganization: createSetOrganizationCallback(persistedState, setMyBusinessContext),
    } as MyBusinessContextState;

    return (
        <MyBusinessContext.Provider value={fullContext}>
            {managingBusinessId && myBusinessContext.organization.id === managingBusinessId && persistedState.organizationInitiated ? props.children :
                hideLoadingSpace ? '' : <LoadingScreen text={'Please Wait'}/>
            }
        </MyBusinessContext.Provider>
    )
};

interface OwnProps {
    hideLoadingSpace?: boolean,
    doneManagingRedirectLink?: string,
}

const mapDispatchToProps = {
    setManagingBusinessId,
};

type DispatchProps = typeof mapDispatchToProps;

interface StateProps {
    managingBusinessId?: number
}

interface MyBusinessContextProviderProps extends OwnProps, StateProps {}

/**
 * Allows child components the ability to easily use the information of the current business the user is managing
 */
const MyBusinessContextProvider: React.FC<MyBusinessContextProviderProps & { setManagingBusinessId: (id?: number) => void, }> = ({hideLoadingSpace, ...props}) => {
    return (
        <MeContextProvider hideLoadingSpace={hideLoadingSpace}>
            <MeContext.Consumer>
                {meContext => (
                    <MyBusinessContextProviderMeReady me={meContext.me} hideLoadingSpace={hideLoadingSpace} {...props} />
                )}
            </MeContext.Consumer>
        </MeContextProvider>
    )
};

export default connect<OwnProps, StateProps, DispatchProps >({
    mapDispatchToProps,
    mapStateToProps: (state) => ({
        managingBusinessId: state.persistent.managingBusinessId
    }),
    component: MyBusinessContextProvider
});

