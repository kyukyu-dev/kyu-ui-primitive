import React from 'react'
import { useCallbackHandlerRef } from '@kyu-ui/react-utils-use-callback-handler-ref'

type UseControllableStateParams<T> = {
  prop?: T
  defaultProp?: T
  onChange?: (state: T) => void
}

type UseUncontrolledStateParams<T> = Omit<UseControllableStateParams<T>, 'prop'>

type SetStateFn<T> = (prevState?: T) => T

const HANDLER_RECIEVED_UNDEFINED_ERROR =
  '`onChange` event handler가 undefined를 전달받았습니다. handler에 undefined가 아닌 다음 상태 값을 전달하도록 수정이 필요합니다'

function useControllableState<T>({ prop, defaultProp, onChange = () => {} }: UseControllableStateParams<T>) {
  const [uncontrolledState, setUncontrolledState] = useUncontrolledState({ defaultProp, onChange })

  const handleChange = useCallbackHandlerRef(onChange)

  const setControlledState: React.Dispatch<React.SetStateAction<T | undefined>> = React.useCallback(
    setValueParam => {
      const nextValue = typeof setValueParam === 'function' ? (setValueParam as SetStateFn<T>)(prop) : setValueParam

      if (nextValue === undefined) throw new Error(HANDLER_RECIEVED_UNDEFINED_ERROR)

      const isValueChanged = nextValue !== prop
      if (isValueChanged) handleChange(nextValue)
    },
    [prop, handleChange]
  )

  const isControlledState = prop !== undefined

  const value = isControlledState ? prop : uncontrolledState
  const setValue = isControlledState ? setControlledState : setUncontrolledState

  return [value, setValue] as const
}

function useUncontrolledState<T>({ defaultProp, onChange }: UseUncontrolledStateParams<T>) {
  const uncontrolledState = React.useState<T | undefined>(defaultProp)
  const [value] = uncontrolledState

  const prevValueRef = React.useRef(value)
  const handleChange = useCallbackHandlerRef(onChange)

  React.useEffect(() => {
    const isValueChanged = value !== prevValueRef.current

    if (isValueChanged) {
      if (value === undefined) throw new Error(HANDLER_RECIEVED_UNDEFINED_ERROR)

      handleChange(value)
      prevValueRef.current = value
    }
  }, [value, prevValueRef, handleChange])

  return uncontrolledState
}

export { useControllableState }
export type { UseControllableStateParams }
