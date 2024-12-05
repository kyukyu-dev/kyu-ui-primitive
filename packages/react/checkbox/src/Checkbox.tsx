import React from 'react'
import { Element } from '@kyu-ui/react-element'
import { useComposedRefs } from '@kyu-ui/react-utils-compose-refs'
import { useControllableState } from '@kyu-ui/react-utils-use-controllable-state'

import { HiddenCheckboxInput } from './HiddenCheckboxInput'
import { CheckboxProvider } from './CheckboxContext'
import { getDataState, isIndeterminate } from './utils'
import type { CheckedState, ScopedProps } from './types'

const CHECKBOX_NAME = 'Checkbox'

type CheckboxElement = React.ElementRef<typeof Element.button>
type ButtonElementProps = React.ComponentPropsWithoutRef<typeof Element.button>

interface CheckboxProps extends Omit<ButtonElementProps, 'checked' | 'defaultChecked'> {
  checked?: CheckedState
  defaultChecked?: CheckedState
  required?: boolean
  onCheckedChange?: (checked: CheckedState) => void
}

const Checkbox = React.forwardRef<CheckboxElement, ScopedProps<CheckboxProps>>((props, forwardedRef) => {
  const {
    __scopedCheckbox,
    name,
    checked: checkedProp,
    defaultChecked,
    required,
    disabled,
    value = 'on',
    onCheckedChange,
    form,
    ...checkboxProps
  } = props
  const [button, setButton] = React.useState<HTMLButtonElement | null>(null)
  const composedRefs = useComposedRefs<HTMLButtonElement>(forwardedRef, node => setButton(node))

  // We set this to true by default so that events bubble to forms without JS (SSR)
  const isFormControl = button ? form || !!button.closest('form') : true
  const [checked = false, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
  })

  const initialCheckedStateRef = React.useRef(checked)
  const handleFormReset = () => setChecked(initialCheckedStateRef.current)

  React.useEffect(() => {
    const form = button?.form

    if (form) {
      form.addEventListener('reset', handleFormReset)
      return () => form.removeEventListener('reset', handleFormReset)
    }
  }, [button, setChecked])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    props.onKeyDown?.(e)

    // WAI ARIA에 따르면 체크박스는 엔터 KeyDown 이벤트를 발생시키지 않음.
    if (e.key === 'Enter') e.preventDefault()
  }

  const isInputEventBubbles = React.useRef(true)
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    props.onClick?.(e)

    setChecked(prevChecked => (isIndeterminate(prevChecked) ? true : !prevChecked))

    if (isFormControl) {
      isInputEventBubbles.current = !e.isPropagationStopped()

      // 체크박스가 form 안에 있을 때, button의 이벤트 전파는 막고 input의 이벤트만 전파되도록 하여
      // native form validation이 동작하고 form event들이 체크박스의 업데이트를 반영하도록 함.
      if (!e.isPropagationStopped()) e.stopPropagation()
    }
  }

  return (
    <CheckboxProvider scope={__scopedCheckbox} state={checked} disabled={disabled}>
      <Element.button
        type="button"
        role="checkbox"
        aria-checked={isIndeterminate(checked) ? 'mixed' : checked}
        aria-required={required}
        data-state={getDataState(checked)}
        data-disabled={disabled ? '' : undefined}
        disabled={disabled}
        value={value}
        {...checkboxProps}
        ref={composedRefs}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
      />
      {isFormControl && (
        <HiddenCheckboxInput
          checked={checked}
          controller={button}
          bubbles={isInputEventBubbles.current}
          name={name}
          value={value}
          required={required}
          disabled={disabled}
          form={form}
          style={setOnTopOfButton}
          defaultChecked={isIndeterminate(defaultChecked) ? false : defaultChecked}
        />
      )}
    </CheckboxProvider>
  )
})

const setOnTopOfButton: React.CSSProperties = { position: 'absolute', transform: 'translateX(-100%)' }

Checkbox.displayName = CHECKBOX_NAME

const Root = Checkbox

export { Root, Checkbox }
export type { CheckboxProps }
