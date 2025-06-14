import {ActionType} from '../../util/types';
import {TokenState} from './persistent.state';

export const setTokenData = (tokenData: TokenState) => ({
    type: 'set-token-data',
    tokenData
} as const);

export const setManagingBusinessId = (managingBusinessId?: number) => ({
    type: 'set-managing-business-id',
    managingBusinessId,
} as const);

export const logOut = () => ({
    type: 'log-out'
} as const);

export type PersistentActions =
    | ActionType<typeof setTokenData>
    | ActionType<typeof setManagingBusinessId>
    | ActionType<typeof logOut>
