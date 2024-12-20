import React from 'react'
import type { CreateScope } from './types'

const composeContextScopes = (...scopes: CreateScope[]) => {
  const baseScope = scopes[0]
  if (scopes.length === 1) {
    return baseScope
  }

  const createScope: CreateScope = () => {
    const scopeHooks = scopes.map(createScope => ({
      useScope: createScope(),
      scopeName: createScope.scopeName,
    }))

    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes)
        const currentScope = scopeProps[`__scope${scopeName}`]
        return { ...nextScopes, ...currentScope }
      }, {})

      return React.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes])
    }
  }

  createScope.scopeName = baseScope.scopeName
  return createScope
}

export { composeContextScopes }
