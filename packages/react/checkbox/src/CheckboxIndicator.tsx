import React from 'react'
import { Element } from '@kyu-ui/react-element'
import { ScopedProps } from './types'
import { useCheckboxContext } from './CheckboxContext'
import { Presence } from '@kyu-ui/react-presence'
import { getDataState, isIndeterminate } from './utils'

const INDICATOR_NAME = 'CheckboxIndicator'

type CheckboxIndicatorElement = React.ElementRef<typeof Element.span>
type SpanElementProps = React.ComponentPropsWithoutRef<typeof Element.span>
interface CheckboxIndicatorProps extends ScopedProps<SpanElementProps> {
  forceMount?: true
}

const CheckboxIndicator = React.forwardRef<CheckboxIndicatorElement, CheckboxIndicatorProps>((props, forwardedRef) => {
  const { __scopedCheckbox, forceMount, ...indicatorProps } = props
  const context = useCheckboxContext(__scopedCheckbox)

  return (
    <Presence present={forceMount || isIndeterminate(context.state) || context.state === true}>
      <Element.span
        data-state={getDataState(context.state)}
        data-disabled={context.disabled ? '' : undefined}
        {...indicatorProps}
        ref={forwardedRef}
        style={{ pointerEvents: 'none', ...props.style }}
      />
    </Presence>
  )
})

CheckboxIndicator.displayName = INDICATOR_NAME

const Indicator = CheckboxIndicator

export { Indicator, CheckboxIndicator }
export type { CheckboxIndicatorProps }
