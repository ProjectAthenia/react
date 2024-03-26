import {SessionActions} from './session.actions';
import SessionState from './session.state';

export const sessionReducer = (state: SessionState, action: SessionActions): SessionState => {
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
}
