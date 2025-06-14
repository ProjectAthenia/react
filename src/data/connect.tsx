import React, {useContext, useMemo} from 'react';
import {AppContext} from './AppContext';
import {DispatchObject} from '../util/types';
import {AppState} from './state';
import {SessionActions} from './session/session.actions';
import {PersistentActions} from './persistent/persistent.actions';

// Union of all possible action types
type AnyAction = SessionActions | PersistentActions;

// Type for functions in mapDispatchToProps: can return an action or a thunk
type ThunkOrActionCreator = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
) => AnyAction | ((dispatch: React.Dispatch<AnyAction>) => void | Promise<void | DispatchObject | AnyAction>); // Allow thunk to return AnyAction too

// Map of action creators or thunks
type ActionCreatorsMap = Record<string, ThunkOrActionCreator>;

// Type for the props injected by mapDispatchToProps (wrapped functions)
type WrappedActionCreators<T extends ActionCreatorsMap> = {
  [K in keyof T]: (...args: Parameters<T[K]>) => void;
};

interface ConnectParams<
  TOwnProps,
  TStateProps,
  TDispatchProps extends ActionCreatorsMap
> {
  mapStateToProps?: (state: AppState, props: TOwnProps) => TStateProps;
  mapDispatchToProps?: TDispatchProps;
  component: React.ComponentType<TOwnProps & TStateProps & WrappedActionCreators<TDispatchProps>>;
}

export function connect<
  TOwnProps extends {}, // Ensure TOwnProps is an object
  TStateProps = {},     // Default to empty object for no state props
  TDispatchProps extends ActionCreatorsMap = {} // Default to empty map, constrained
>(
  {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mapStateToProps = (_state?: AppState, _props?: TOwnProps) => ({} as TStateProps),
    mapDispatchToProps = {} as TDispatchProps,
    component
  }: ConnectParams<TOwnProps, TStateProps, TDispatchProps>
): React.FunctionComponent<TOwnProps> {

  const Connect: React.FC<TOwnProps> = (ownProps) => {
    const context = useContext(AppContext);

    const dispatchFuncs = useMemo(() => {
      const funcs = {} as WrappedActionCreators<TDispatchProps>;
      const keys = Object.keys(mapDispatchToProps) as (keyof TDispatchProps)[];

      for (const key of keys) {
        const originalActionCreator = mapDispatchToProps[key];

        funcs[key] = (...args: Parameters<typeof originalActionCreator>): void => {
          const resultOrThunk = originalActionCreator(...args);

          if (typeof resultOrThunk === 'function') {
            const thunk = resultOrThunk as ((dispatch: React.Dispatch<AnyAction>) => void | Promise<void | DispatchObject | AnyAction>);
            const promiseOrVoid = thunk(context.dispatch);

            if (promiseOrVoid && typeof (promiseOrVoid as Promise<unknown>).then === 'function') {
              (promiseOrVoid as Promise<void | DispatchObject | AnyAction>).then((resolvedValue: void | DispatchObject | AnyAction) => {
                if (resolvedValue && typeof resolvedValue === 'object' && 'type' in resolvedValue && typeof resolvedValue.type === 'string') {
                   context.dispatch(resolvedValue as AnyAction);
                }
              }).catch(err => {
                console.error('Error in dispatched thunk promise:', err);
              });
            }
          } else {
            context.dispatch(resultOrThunk as AnyAction);
          }
        };
      }
      return funcs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapDispatchToProps, context]);

    const stateProps = useMemo(() => {
        return mapStateToProps(context.state, ownProps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.state, ownProps, mapStateToProps]);

    const finalProps = useMemo(() => {
        return { ...ownProps, ...stateProps, ...dispatchFuncs };
    }, [ownProps, stateProps, dispatchFuncs]);

    return React.createElement(component, finalProps);
  };

  return React.memo(Connect);
}
