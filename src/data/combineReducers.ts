import { SessionActions } from './session/session.actions';
import { PersistentActions } from './persistent/persistent.actions';
import SessionState from './session/session.state';
import PersistentState from './persistent/persistent.state';

// Union of all possible action types
export type AllActions = SessionActions | PersistentActions;

// Describes the shape of the application state managed by these combined reducers
interface CombinedState {
    session: SessionState;
    persistent: PersistentState;
    // Add other state slices here if they exist
}

// Describes the type of the 'reducers' object passed to combineReducers
// S is the type of the overall state (e.g., CombinedState)
// K is a key of S (e.g., 'session' or 'persistent')
// Each reducer function takes its specific slice of state S[K] and an action, returning the new S[K]
type ReducersMapObject<S, A> = {
  [K in keyof S]: (state: S[K], action: A) => S[K];
};

export function combineReducers<S_AppState extends CombinedState>(
    reducers: ReducersMapObject<S_AppState, AllActions>
) {
    type ReducerKeys = keyof S_AppState;

    // The returned function is the main reducer for the application
    return (state: S_AppState, action: AllActions): S_AppState => {
        // Initialize newState as an empty object, to be cast to S_AppState at the end
        // This ensures all keys from S_AppState are potentially set.
        const newStatePartial: Partial<S_AppState> = {};
        const reducerKeysArray = Object.keys(reducers) as ReducerKeys[];

        reducerKeysArray.forEach(key => {
            const reducer = reducers[key];
            const previousStateForKey = state[key];
            const result = reducer(previousStateForKey, action);
            // Original logic: if reducer returns a falsy value, keep the old state for that key
            newStatePartial[key] = result || previousStateForKey;
        });
        // Cast to S_AppState, assuming all keys are handled and newStatePartial now matches S_AppState structure.
        return newStatePartial as S_AppState;
    };
}
