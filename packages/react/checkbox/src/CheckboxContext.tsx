import { createContextScope } from '@kyu-ui/react-utils-context'
import type { CheckedState } from './types'

const [createCheckboxContext, createCheckboxScope] = createContextScope('Checkbox')

interface CheckboxContextValue {
  state: CheckedState
  disabled?: boolean
}

const [CheckboxProvider, useCheckboxContext] = createCheckboxContext<CheckboxContextValue>('Checkbox')

export { createCheckboxScope, useCheckboxContext, CheckboxProvider }
