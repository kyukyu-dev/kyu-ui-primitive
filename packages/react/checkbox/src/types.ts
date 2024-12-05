import type { Scope } from '@kyu-ui/react-utils-context'

type ScopedProps<P> = P & { __scopedCheckbox?: Scope }
type CheckedState = boolean | 'indeterminate'

export type { CheckedState, ScopedProps }
