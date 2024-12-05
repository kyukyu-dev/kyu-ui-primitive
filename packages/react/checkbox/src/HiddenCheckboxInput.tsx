import React from 'react'
import { usePrevState } from '@kyu-ui/react-utils-use-prev-state'
import { useResponsiveSize } from '@kyu-ui/react-utils-use-responsive-size'
import { isIndeterminate } from './utils'
import type { CheckedState } from './types'

type InputProps = React.ComponentPropsWithoutRef<'input'>
interface HiddenCheckboxInputProps extends Omit<InputProps, 'checked'> {
  checked: CheckedState
  controller: HTMLElement | null
  bubbles: boolean
}

const HiddenCheckboxInput = (props: HiddenCheckboxInputProps) => {
  const { controller, checked, bubbles = true, defaultChecked, ...inputProps } = props
  const ref = React.useRef<HTMLInputElement>(null)
  const prevChecked = usePrevState(checked)
  const controllerSize = useResponsiveSize(controller)

  React.useEffect(() => {
    const inputProto = window.HTMLInputElement.prototype
    const descriptor = Object.getOwnPropertyDescriptor(inputProto, 'checked') as PropertyDescriptor
    const setChecked = descriptor.set

    const isCheckedChanged = prevChecked !== checked

    if (isCheckedChanged && setChecked) {
      const input = ref.current!
      const event = new Event('click', { bubbles })

      input.indeterminate = isIndeterminate(checked)
      setChecked.call(input, isIndeterminate(checked) ? false : checked)
      input.dispatchEvent(event)
    }
  }, [prevChecked, checked])

  const defaultCheckedRef = React.useRef(isIndeterminate(checked) ? false : checked)

  return (
    <input
      type="checkbox"
      aria-hidden
      defaultChecked={defaultChecked ?? defaultCheckedRef.current}
      {...inputProps}
      tabIndex={-1}
      ref={ref}
      style={{
        ...props.style,
        ...controllerSize,
        pointerEvents: 'none',
        opacity: 0,
        margin: 0,
      }}
    />
  )
}

export { HiddenCheckboxInput }
