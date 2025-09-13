import { useLayoutEffect } from '@kyui/react-use-layout-effect';
import * as React from 'react';

type AnyFunction = (...args: any[]) => any;

const useReactEffectEvent = (React as any)[' useEffectEvent '.trim().toString()];
const useReactInsertionEffect = (React as any)[' useInsertionEffect '.trim().toString()];

export function useEffectEvent<T extends AnyFunction>(callback?: T): T {
  if (typeof useReactEffectEvent === 'function') {
    return useReactEffectEvent(callback);
  }

  const ref = React.useRef<AnyFunction | undefined>(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  if (typeof useReactInsertionEffect === 'function') {
    useReactInsertionEffect(() => {
      ref.current = callback;
    });
  } else {
    useLayoutEffect(() => {
      ref.current = callback;
    });
  }

  return React.useMemo(() => ((...args) => ref.current?.(...args)) as T, []);
}
