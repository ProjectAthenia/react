import { PersistentState } from './persistent.state';
import { PersistentActions } from './persistent.actions';
import { AllActions } from '../combineReducers';

function isPersistentAction(action: AllActions): action is PersistentActions {
    return (
        action.type === 'set-token-data' ||
        action.type === 'log-out'
    );
}

export function persistentReducer(state: PersistentState, action: AllActions): PersistentState {
    if (!isPersistentAction(action)) return state;
    switch (action.type) {
        case 'set-token-data':
            return {...state, tokenData: action.tokenData};
        case 'log-out':
            return {...state, tokenData: undefined};
        default:
            return state;
    }
}
