import React from 'react'

function usePrevState<T>(state: T) {
  const ref = React.useRef({ state, prevState: state })

  return React.useMemo(() => {
    const isStateChanged = ref.current.state !== state

    if (isStateChanged) {
      ref.current.prevState = ref.current.state
      ref.current.state = state
    }

    return ref.current.prevState
  }, [state])
}

export { usePrevState }
