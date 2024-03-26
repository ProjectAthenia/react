import React, {Dispatch, PropsWithChildren, SetStateAction, useEffect, useRef, useState} from 'react';
import User, {placeholderUser} from '../models/user/user';
import AuthRequests from '../services/requests/AuthRequests';
import { logOut } from '../data/persistent/persistent.actions';
import {connect} from '../data/connect';
import LoadingScreen from '../components/LoadingScreen';
import NetworkError from '../components/Errors/NetworkError';
import {useHistory} from "react-router-dom";

interface MeContextState {
    me: User,
    networkError: boolean,
}

export interface MeContextStateConsumer extends MeContextState {
    setMe: (user: User) => void,
}

let persistedState = {
    me: placeholderUser(),
    networkError: false,
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
    };
    Object.values(meSubscriptions).forEach(callback => callback(persistedState));
}

const setNetworkError = () => {
    persistedState = {
        ...persistedState,
        networkError : true,
    }
    Object.values(meSubscriptions).forEach(callback => callback(persistedState));
}

interface OwnProps {
    optional?: boolean
    hideLoadingSpace?: boolean
    reset?: boolean
}

interface DispatchProps {
    logOut: typeof logOut,
}

interface MeContextProviderProps extends OwnProps, DispatchProps {
}

/**
 * Allows child components the ability to easily use the information of the currently logged in user
 */
const MeContextProvider: React.FC<PropsWithChildren<MeContextProviderProps>> = ({hideLoadingSpace, logOut, optional, reset, ...props}) => {
    const [meContext, setMeContext] = useState(persistedState);
    const [instanceKey, _] = useState(Math.random() + "-" + Date.now());
    const history = useHistory();


    useEffect(() => {
        meSubscriptions[instanceKey] = setMeContext;

        if (!meContext.me.id) {
            loadInfo();
        }

        return () => {
            delete meSubscriptions[instanceKey];
        }
    }, []);

    const goToSignIn = () => {
        if (!optional) {
            try {
                logOut();
                history.push('/welcome', 'root');
            } catch (e) {}
        }
    }

    const loadInfo = async () => {
        if (!meRequest && !meContext.me.id) {
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
            {fullContext.me.id ? props.children :
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

export default connect<PropsWithChildren<OwnProps>, { }, DispatchProps>({
    mapDispatchToProps: ({
        logOut,
    }),
    component: MeContextProvider
});

