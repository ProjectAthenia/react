import SessionState from './session.state';
import { AllActions } from '../combineReducers';

export const sessionReducer = (state: SessionState, action: AllActions): SessionState => {
    switch (action.type) {
        case 'increment-loading-count': {
            return {...state, loadingCount: state.loadingCount + 1};
        }
        case 'decrement-loading-count': {
            return {...state, loadingCount: state.loadingCount - 1};
        }
        case 'clear-loading-count': {
            return {...state, loadingCount: 0};
        }
    }
    return state;
}
