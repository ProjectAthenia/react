import React, {PropsWithChildren, useEffect, useState} from 'react';
import User, {placeholderUser} from '../models/user/user';
import UserRequests from '../services/requests/UserRequests';
import LoadingScreen from '../components/LoadingScreen';

let cachedUsers = [] as User[];

/**
 * The structure of the consumer
 */
export interface UserContextConsumerState {
    hasLoaded: boolean,
    notFound: boolean,
    user: User,
    setUser: (user: User) => void,
}

let defaultContext: UserContextConsumerState = {
    hasLoaded: false,
    notFound: false,
    user: placeholderUser(),
    setUser: (user: User) => {}
};

export const UserContext = React.createContext<UserContextConsumerState>(defaultContext);

export interface UserContextProviderProps {
    userId: number,
    skipCache?: boolean,
}

export const UserContextProvider: React.FC<PropsWithChildren<UserContextProviderProps>> = ({userId, skipCache, children}) => {
    const [userState, setUserState] = useState(defaultContext);

    const setUser = (user: User): void => {
        cachedUsers[user.id!] = {...user};
        setUserState({
            ...userState,
            user: user,
        })
    }

    useEffect(() => {
        if (!skipCache && cachedUsers[userId]) {
            setUserState({
                hasLoaded: true,
                notFound: false,
                user: cachedUsers[userId],
                setUser: setUser,
            });
        } else {
            setUserState({
                ...userState,
                hasLoaded: false,
            });
            UserRequests.getUser(userId).then(user => {
                cachedUsers[userId] = user;
                setUserState({
                    hasLoaded: true,
                    notFound: false,
                    user: user,
                    setUser,
                });
            }).catch(() => {
                setUserState({
                    ...userState,
                    hasLoaded: true,
                    notFound: true,
                });
            })
        }
    }, [userId]);

    return (
        <UserContext.Provider value={{...userState, setUser}}>
            <UserContext.Consumer>
                {context => (context.hasLoaded ?
                    (!context.notFound ? children :
                        <div className={'user-not-found'}>
                            Not Found
                        </div>
                    ) : <LoadingScreen/>
                )}
            </UserContext.Consumer>
        </UserContext.Provider>
    )
}
