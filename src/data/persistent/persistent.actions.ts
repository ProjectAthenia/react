import {TokenState} from './persistent.state';
import {ActionType} from '../../util/types';

export const setTokenData = (tokenData: TokenState) => ({
    type: 'set-token-data' as const,
    tokenData,
});

export const logOut = () => ({
    type: 'log-out' as const,
});

export type PersistentActions =
    | ActionType<typeof setTokenData>
    | ActionType<typeof logOut>;
