import React, {Dispatch, PropsWithChildren, SetStateAction, useEffect, useRef, useState} from 'react';
import User, {placeholderUser} from '../models/user/user';
import AuthRequests from '../services/requests/AuthRequests';
import { logOut } from '../data/persistent/persistent.actions';
import {connect} from '../data/connect';
import LoadingScreen from '../components/LoadingScreen';
import NetworkError from '../components/Errors/NetworkError';
import {useHistory} from "react-router-dom";
import { AppState } from '../data/state';

interface MeContextState {
    me: User,
    networkError: boolean,
    isLoggedIn: boolean,
    isLoading: boolean,
}

export interface MeContextStateConsumer extends MeContextState {
    setMe: (user: User) => void,
}

let persistedState = {
    me: placeholderUser(),
    networkError: false,
    isLoggedIn: false,
    isLoading: true,
} as MeContextState;

let meRequest: Promise<User>|null = null;

let meSubscriptions: {[key: string]: Dispatch<SetStateAction<MeContextState>>} = {};

function createDefaultState(): MeContextStateConsumer {
    return {
        ...persistedState,
        setMe: (user: User) => {},
    }
}

export const MeContext = React.createContext<MeContextStateConsumer>(createDefaultState());

const setPersistedState = (me: User) => {
    me.full_name = me.first_name + ' ' + me.last_name;
    persistedState = {
        me: {...me},
        networkError: false,
        isLoggedIn: !!me.id,
        isLoading: false,
    };
    Object.values(meSubscriptions).forEach(callback => callback(persistedState));
}

const setNetworkError = () => {
    persistedState = {
        ...persistedState,
        networkError: true,
        isLoggedIn: false,
        isLoading: false,
    }
    Object.values(meSubscriptions).forEach(callback => callback(persistedState));
}

interface OwnProps {
    optional?: boolean
    hideLoadingSpace?: boolean
    reset?: boolean
}

interface StateProps {
    tokenData?: { token: string; receivedAt: number };
}

interface DispatchProps {
    logOut: typeof logOut,
}

interface MeContextProviderProps extends OwnProps, StateProps, DispatchProps {
}

/**
 * Allows child components the ability to easily use the information of the currently logged in user
 */
const MeContextProvider: React.FC<PropsWithChildren<MeContextProviderProps>> = ({hideLoadingSpace, logOut, optional, reset, tokenData, ...props}) => {
    const [meContext, setMeContext] = useState(persistedState);
    const [instanceKey, _] = useState(Math.random() + "-" + Date.now());
    const history = useHistory();

    useEffect(() => {
        meSubscriptions[instanceKey] = setMeContext;

        if (!meContext.me.id && tokenData?.token) {
            loadInfo();
        } else if (!tokenData?.token) {
            setPersistedState(placeholderUser());
        }

        return () => {
            delete meSubscriptions[instanceKey];
        }
    }, [tokenData]);

    const goToSignIn = () => {
        if (!optional) {
            try {
                logOut();
                history.push('/welcome', 'root');
            } catch (e) {}
        }
    }

    const loadInfo = async () => {
        if (!meRequest && !meContext.me.id && tokenData?.token) {
            try {
                meRequest = AuthRequests.getMe();
                const me = await meRequest;

                setPersistedState(me);
            } catch(error: any)  {
                if (error.status) {
                    const ignoredStatuses = [
                        429, 499,
                        500, 503,
                    ]
                    if (!ignoredStatuses.includes(error.status)) {
                        // there is an error, and it is not a hang up
                        goToSignIn();
                    }
                } else {
                    setNetworkError();
                }
            }
            meRequest = null;
        }
    }

    useEffect(() => {
        loadInfo()
    }, [reset]);

    const fullContext = {
        ...meContext,
        setMe: setPersistedState,
    } as MeContextStateConsumer;

    return (
        <MeContext.Provider value={fullContext}>
            {!meContext.isLoading ? props.children :
                (hideLoadingSpace ? '' :
                    (meContext.networkError ?
                        <NetworkError/> :
                        <LoadingScreen text={'Getting Ready'}/>
                    )
                )
            }
        </MeContext.Provider>
    )
};

export default connect<PropsWithChildren<OwnProps>, StateProps, DispatchProps>({
    mapStateToProps: (state: AppState) => ({
        tokenData: state.persistent.tokenData
    }),
    mapDispatchToProps: ({
        logOut,
    }),
    component: MeContextProvider
});

