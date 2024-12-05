import React from 'react'
import ReactDom from 'react-dom'
import { Slot } from '@kyu-ui/react-slot'

const ELEMENT_NODES = [
  'a',
  'button',
  'div',
  'form',
  'h2',
  'h3',
  'img',
  'input',
  'label',
  'li',
  'nav',
  'ol',
  'p',
  'span',
  'svg',
  'ul',
] as const

type ElementPropsWithRef<Element extends React.ElementType> = React.ComponentPropsWithRef<Element> & {
  asChild?: boolean
}
interface ForwardRefExoticElement<Element extends React.ElementType>
  extends React.ForwardRefExoticComponent<ElementPropsWithRef<Element>> {}

type Elements = { [Element in (typeof ELEMENT_NODES)[number]]: ForwardRefExoticElement<Element> }

const Element = ELEMENT_NODES.reduce((elements, node) => {
  const Node = React.forwardRef((props: ElementPropsWithRef<typeof node>, forwardedRef: any) => {
    const { asChild, ...primitiveProps } = props
    const Component: any = asChild ? Slot : node

    if (typeof window !== 'undefined') {
      ;(window as any)[Symbol.for('kyu-ui')] = true
    }

    return <Component {...primitiveProps} ref={forwardedRef} />
  })

  Node.displayName = `Element.${node}`

  return { ...elements, [node]: Node }
}, {} as Elements)

function dispatchDiscreteCustomEvent<Event extends CustomEvent>(target: Event['target'], event: Event) {
  if (target) ReactDom.flushSync(() => target.dispatchEvent(event))
}

export { Element, dispatchDiscreteCustomEvent }
export type { ElementPropsWithRef }
