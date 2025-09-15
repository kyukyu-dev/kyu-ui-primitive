import * as React from 'react';
import { useEffectEvent } from '@kyui/react-use-effect-event';

type ChangeHandler<T> = (state: T) => void;

interface UseControllableStateParams<T> {
  prop: T | undefined;
  defaultProp: T;
  onChange: ChangeHandler<T> | undefined;
  caller: string;
}

interface AnyAction {
  type: string;
}

const SYNC_STATE = Symbol('KYUI:SYNC_STATE');

interface SyncStateAction<T> {
  type: typeof SYNC_STATE;
  state: T;
}

export function useControllableStateReducer<T, S extends {}, A extends AnyAction>(
  reducer: (prevState: S & { state: T }, action: A) => S & { state: T },
  userArgs: UseControllableStateParams<T>,
  initialState: S,
): [S & { state: T }, React.Dispatch<A>];

export function useControllableStateReducer<T, S extends {}, I, A extends AnyAction>(
  reducer: (prevState: S & { state: T }, action: A) => S & { state: T },
  userArgs: UseControllableStateParams<T>,
  initialArg: I,
  init: (i: I & { state: T }) => S,
): [S & { state: T }, React.Dispatch<A>];

export function useControllableStateReducer<T, S extends {}, A extends AnyAction>(
  reducer: (prevState: S & { state: T }, action: A) => S & { state: T },
  userArgs: UseControllableStateParams<T>,
  initialArgs: any,
  init?: (i: any) => Omit<S, 'state'>,
): [S & { state: T }, React.Dispatch<A>] {
  const { prop: controlledState, defaultProp, onChange: onChangeProp, caller } = userArgs;
  const isControlled = controlledState !== undefined;

  const onChange = useEffectEvent(onChangeProp);

  /* eslint-disable react-hooks/rules-of-hooks */
  if (process.env.NODE_ENV !== 'production') {
    const isControlledRef = React.useRef(controlledState !== undefined);
    React.useEffect(() => {
      const wasControlled = isControlledRef.current;
      if (wasControlled !== isControlled) {
        const from = wasControlled ? 'controlled' : 'uncontrolled';
        const to = isControlled ? 'controlled' : 'uncontrolled';
        console.warn(
          `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`,
        );
      }
      isControlledRef.current = isControlled;
    }, [isControlled, caller]);
  }

  type InternalState = S & { state: T };
  const args: [InternalState] = [{ ...initialArgs, state: defaultProp }];
  if (init) {
    // @ts-expect-error
    args.push(init);
  }

  const [internalState, dispatch] = React.useReducer(
    (state: InternalState, action: A | SyncStateAction<T>): InternalState => {
      if (action.type === SYNC_STATE) {
        return { ...state, state: action.state };
      }

      const next = reducer(state, action);
      if (isControlled && !Object.is(next.state, state.state)) {
        onChange(next.state);
      }
      return next;
    },
    ...args,
  );

  const uncontrolledState = internalState.state;
  const prevValueRef = React.useRef(uncontrolledState);
  React.useEffect(() => {
    if (prevValueRef.current !== uncontrolledState) {
      prevValueRef.current = uncontrolledState;
      if (!isControlled) {
        onChange(uncontrolledState);
      }
    }
  }, [onChange, uncontrolledState, prevValueRef, isControlled]);

  const state = React.useMemo(() => {
    const isControlled = controlledState !== undefined;
    if (isControlled) {
      return { ...internalState, state: controlledState };
    }

    return internalState;
  }, [internalState, controlledState]);

  React.useEffect(() => {
    if (isControlled && !Object.is(controlledState, internalState.state)) {
      dispatch({ type: SYNC_STATE, state: controlledState });
    }
  }, [controlledState, internalState.state, isControlled]);

  return [state, dispatch as React.Dispatch<A>];
}
