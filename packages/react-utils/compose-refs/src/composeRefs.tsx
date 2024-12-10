import React from 'react'

type PossibleRef<T> = React.Ref<T> | undefined

function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref !== null && ref !== undefined) {
    ;(ref as React.MutableRefObject<T>).current = value
  }
}

function composeRefs<T>(...refs: Array<PossibleRef<T>>) {
  return (node: T) => refs.forEach(ref => setRef(ref, node))
}

function useComposedRefs<T>(...refs: Array<PossibleRef<T>>) {
  return React.useCallback(composeRefs(...refs), refs)
}

export { composeRefs, useComposedRefs }
