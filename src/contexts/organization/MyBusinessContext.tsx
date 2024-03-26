import React, {Dispatch, PropsWithChildren, SetStateAction, useEffect, useState} from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import {connect} from '../../data/connect';
import OrganizationRequests from '../../services/requests/OrganizationRequests';
import Business, {placeholderBusiness} from '../../models/organization/business';
import Organization, {placeholderOrganization} from '../../models/organization/organization';
import User from '../../models/user/user';
import MeContextProvider, {MeContext} from '../MeContext';
import {setManagingBusinessId} from '../../data/persistent/persistent.actions';
import PostManagementRequests from '../../services/requests/PostManagementRequests';
import {useHistory} from "react-router";

export interface MyBusinessContextState {
    organization: Organization,
    setOrganization: (organization: Organization) => void,
    organizationInitiated: boolean,
    business: Business,
    setBusiness: (business: Business) => void,
    businessInitiated: boolean,
}

const defaultState = {
    organization: placeholderOrganization(),
    organizationInitiated: false,
    business: placeholderBusiness(),
    businessInitiated: false,
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

function createSetBusinessCallback(businessContext: MyBusinessContextState, setBusinessContext: Dispatch<SetStateAction<MyBusinessContextState>>) {
    return (business: Business) => {
        business.total_locations = business.locations ? business.locations.length : business.total_locations;
        persistedState.business = business;
        persistedState.organization.businesses = persistedState.organization.businesses ?? [];
        const businessIndex = persistedState.organization.businesses.findIndex(i => i.id == business.id);
        if (businessIndex == -1) {
            persistedState.organization.businesses.push(business);
        } else {
            persistedState.organization.businesses[businessIndex] = business;
        }
        setBusinessContext({
            ...businessContext,
            business: {...business},
            organization: {...persistedState.organization},
        });
    }
}


interface MyBusinessContextProviderMeReadyProps extends MyBusinessContextProviderProps {
    me: User,
    postId?: number,
    locationId?: number,
}

/**
 * Allows child components the ability to easily use the information of the current business the user is managing
 */
const MyBusinessContextProviderMeReady: React.FC<PropsWithChildren<MyBusinessContextProviderMeReadyProps>> = ({me, postId, hideLoadingSpace, setManagingBusinessId, doneManagingRedirectLink, managingBusinessId, ...props}) => {
    const [myBusinessContext, setMyBusinessContext] = useState(persistedState);
    const [organizationId, setOrganizationId] = useState(0);
    const history = useHistory();

    useEffect(() => {
        // If the managing organization id is not set then we want to take them home, and return some nothingness
        if (!managingBusinessId) {

            if (postId) {
                PostManagementRequests.getPost(postId).then(post => {
                    setManagingBusinessId(post.publisher_id);
                })
            } else if (!window.location.pathname.includes('business')){
                history.push(doneManagingRedirectLink ?? '/home/dashboard');
                return;
            }
        } else {

            if (myBusinessContext.business.id !== managingBusinessId) {
                OrganizationRequests.getMyBusiness(managingBusinessId).then(business => {
                    persistedState.business = business;
                    persistedState.businessInitiated = true;
                    setMyBusinessContext({...persistedState});
                    setOrganizationId(business.organization_id);
                }).catch((error) => {
                    setOrganizationId(0);
                    history.push('/home/dashboard');
                    console.error(error);
                });
            }
        }
    }, [managingBusinessId]);

    useEffect(() => {

        if (organizationId != 0) {
            OrganizationRequests.getMyOrganization(organizationId).then(organization => {
                persistedState.organization = organization;
                persistedState.organizationInitiated = true;
                setMyBusinessContext(persistedState);
            }).catch(error => {
                setOrganizationId(0)
                history.push('/home/dashboard');
                console.error(error);
            });
        }

    }, [organizationId]);

    const fullContext = {
        ...persistedState,
        setOrganization: createSetOrganizationCallback(persistedState, setMyBusinessContext),
        setBusiness: createSetBusinessCallback(persistedState, setMyBusinessContext),
    } as MyBusinessContextState;

    return (
        <MyBusinessContext.Provider value={fullContext}>
            {managingBusinessId && myBusinessContext.business.id === managingBusinessId && (persistedState.businessInitiated && persistedState.organizationInitiated) ? props.children :
                hideLoadingSpace ? '' : <LoadingScreen text={'Please Wait'}/>
            }
        </MyBusinessContext.Provider>
    )
};

interface OwnProps {
    hideLoadingSpace?: boolean,
    doneManagingRedirectLink?: string,
}

interface DispatchProps {
    setManagingBusinessId: typeof setManagingBusinessId,
}

interface StateProps {
    managingBusinessId?: number
}

interface MyBusinessContextProviderProps extends OwnProps, DispatchProps, StateProps {}


/**
 * Allows child components the ability to easily use the information of the current business the user is managing
 */
const MyBusinessContextProvider: React.FC<MyBusinessContextProviderProps> = ({hideLoadingSpace, ...props}) => {

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
    mapDispatchToProps: ({
        setManagingBusinessId,
    }),
    mapStateToProps: (state) => ({
        managingBusinessId: state.persistent.managingBusinessId
    }),
    component: MyBusinessContextProvider
});

