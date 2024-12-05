import React from 'react'
import { useComposedRefs } from '@kyu-ui/react-utils-compose-refs'
import { usePresence } from './usePresence'
import { getElementRef } from '@kyu-ui/react-utils-get-element-ref'

interface PresenceProps {
  children: React.ReactElement | ((props: { present: boolean }) => React.ReactElement)
  present: boolean
}

function Presence(props: PresenceProps) {
  const { present, children } = props
  const presence = usePresence(present)

  const child =
    typeof children === 'function' ? children({ present: presence.isPresent }) : React.Children.only(children)

  const ref = useComposedRefs(presence.ref, getElementRef(child))
  const forceMount = typeof children === 'function'
  return forceMount || presence.isPresent ? React.cloneElement(child, { ref }) : null
}

export { Presence }
export type { PresenceProps }
