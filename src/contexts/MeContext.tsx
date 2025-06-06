import React, {Dispatch, PropsWithChildren, SetStateAction, useCallback, useEffect, useState} from 'react';
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setMe: (_user: User) => {},
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
    logOut: logOut,
}

interface MeContextProviderProps extends OwnProps, StateProps, DispatchProps {
}

/**
 * Allows child components the ability to easily use the information of the currently logged in user
 */
const MeContextProvider: React.FC<PropsWithChildren<MeContextProviderProps>> = ({hideLoadingSpace, logOut, optional, reset, tokenData, ...props}) => {
    const [meContext, setMeContext] = useState(persistedState);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [instanceKey, _] = useState(Math.random() + "-" + Date.now());
    const history = useHistory();

    const goToSignIn = useCallback(() => {
        if (!optional) {
            try {
                logOut();
                history.push('/welcome', 'root');
            } catch (e) {}
        }
    }, [optional, logOut, history]);

    const loadInfo = useCallback(async () => {
        if (!meRequest && !meContext.me.id && tokenData?.token) {
            try {
                meRequest = AuthRequests.getMe();
                const me = await meRequest;
                setPersistedState(me);
            } catch(error: unknown)  {
                let status: number | undefined;
                if (typeof error === 'object' && error !== null && 'status' in error) {
                    const potentialStatus = (error as { status: unknown }).status;
                    if (typeof potentialStatus === 'number') {
                        status = potentialStatus;
                    }
                }

                if (status) {
                    const ignoredStatuses = [
                        429, 499,
                        500, 503,
                    ];
                    if (!ignoredStatuses.includes(status)) {
                        goToSignIn();
                    }
                } else {
                    setNetworkError();
                }
            }
            meRequest = null;
        }
    }, [tokenData, meContext.me.id, goToSignIn]);

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
    }, [tokenData, instanceKey, loadInfo, meContext.me.id]);

    useEffect(() => {
        loadInfo()
    }, [reset, loadInfo]);

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
    mapDispatchToProps: {
        logOut,
    },
    component: MeContextProvider
});

