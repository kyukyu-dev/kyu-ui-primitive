import { useSafeLayoutEffect } from '@kyu-ui/react-utils-use-safe-layout-effect'
import React from 'react'
import { useStateMachine } from './useStateMachine'

function usePresence(present: boolean) {
  const [node, setNode] = React.useState<HTMLElement>()
  const stylesRef = React.useRef<CSSStyleDeclaration>({} as any)
  const prevPresentRef = React.useRef(present)
  const prevAnimationNameRef = React.useRef<string>('none')

  const initialState = present ? 'mounted' : 'unmounted'
  const [state, send] = useStateMachine(initialState, {
    mounted: {
      UNMOUNT: 'unmounted',
      ANIMATION_OUT: 'unmountSuspended',
    },
    unmountSuspended: {
      MOUNT: 'mounted',
      ANIMATION_END: 'unmounted',
    },
    unmounted: {
      MOUNT: 'mounted',
    },
  })

  React.useEffect(() => {
    const currentAnimationName = getAnimationName(stylesRef.current)
    prevAnimationNameRef.current = state === 'mounted' ? currentAnimationName : 'none'
  }, [state])

  useSafeLayoutEffect(() => {
    const styles = stylesRef.current
    const wasPresent = prevPresentRef.current
    const hasPresentChanged = wasPresent !== present

    if (hasPresentChanged) {
      const prevAnimationName = prevAnimationNameRef.current
      const currentAnimationName = getAnimationName(styles)

      if (present) {
        send('MOUNT')
      } else if (currentAnimationName === 'none' || styles?.display === 'none') {
        send('UNMOUNT')
      } else {
        const isAnimating = prevAnimationName !== currentAnimationName

        if (wasPresent && isAnimating) {
          send('ANIMATION_OUT')
        } else {
          send('UNMOUNT')
        }
      }

      prevPresentRef.current = present
    }
  }, [present, send])

  useSafeLayoutEffect(() => {
    if (node) {
      let timeoutId: number
      const ownerWindow = node.ownerDocument.defaultView ?? window

      const handleAnimationEnd = (event: AnimationEvent) => {
        const currentAnimationName = getAnimationName(stylesRef.current)
        const isCurrentAnimation = currentAnimationName.includes(event.animationName)

        if (event.target === node && isCurrentAnimation) {
          send('ANIMATION_END')

          if (!prevPresentRef.current) {
            const currentFillMode = node.style.animationFillMode
            node.style.animationFillMode = 'forwards'

            timeoutId = ownerWindow.setTimeout(() => {
              if (node.style.animationFillMode === 'forwards') {
                node.style.animationFillMode = currentFillMode
              }
            })
          }
        }
      }

      const handleAnimationStart = (event: AnimationEvent) => {
        if (event.target === node) {
          prevAnimationNameRef.current = getAnimationName(stylesRef.current)
        }
      }

      node.addEventListener('animationstart', handleAnimationStart)
      node.addEventListener('animationcancel', handleAnimationEnd)
      node.addEventListener('animationend', handleAnimationEnd)

      return () => {
        ownerWindow.clearTimeout(timeoutId)
        node.removeEventListener('animationstart', handleAnimationStart)
        node.removeEventListener('animationcancel', handleAnimationEnd)
        node.removeEventListener('animationend', handleAnimationEnd)
      }
    } else {
      send('ANIMATION_END')
    }
  }, [node, send])

  return {
    isPresent: ['mounted', 'unmountSuspended'].includes(state),
    ref: React.useCallback((node: HTMLElement) => {
      if (node) {
        stylesRef.current = getComputedStyle(node)
      }
      setNode(node)
    }, []),
  }
}

function getAnimationName(styles?: CSSStyleDeclaration) {
  return styles?.animationName || 'none'
}

export { usePresence }
