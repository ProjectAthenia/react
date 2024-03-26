import {PersistentActions} from './persistent.actions';
import PersistentState from './persistent.state';

export function persistentReducer(state: PersistentState, action: PersistentActions): PersistentState {
    switch (action.type) {
        case 'set-token-data':
            return {...state, tokenData: action.tokenData};
        default:
            return state;
    }
}
