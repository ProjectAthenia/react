import SessionState from './session.state';
import { SessionActions } from './session.actions';
import { AllActions } from '../combineReducers';

function isSessionAction(action: AllActions): action is SessionActions {
    return (
        action.type === 'increment-loading-count' ||
        action.type === 'decrement-loading-count' ||
        action.type === 'clear-loading-count'
    );
}

export const sessionReducer = (state: SessionState, action: AllActions): SessionState => {
    if (!isSessionAction(action)) return state;
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
