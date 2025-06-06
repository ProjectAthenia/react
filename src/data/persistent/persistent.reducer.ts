import PersistentState from './persistent.state';
import { AllActions } from '../combineReducers';

export function persistentReducer(state: PersistentState, action: AllActions): PersistentState {
    switch (action.type) {
        case 'set-token-data':
            return {...state, tokenData: action.tokenData};
        default:
            return state;
    }
}
