import PersistentState from './persistent.state';
import { PersistentActions } from './persistent.actions';

export function persistentReducer(state: PersistentState, action: PersistentActions): PersistentState {
    switch (action.type) {
        case 'set-token-data':
            return {...state, tokenData: action.tokenData};
        case 'set-managing-business-id':
            return {...state, managingBusinessId: action.managingBusinessId};
        case 'log-out':
            return {...state, tokenData: undefined};
        default:
            return state;
    }
}
