import React from 'react'
import { composeContextScopes } from './composeContextScopes'
import type { CreateScope, Scope } from './types'

type ProviderType<ContextValueType> = React.FC<
  ContextValueType & { scope: Scope<ContextValueType>; children: React.ReactNode }
>

function createContextScope(scopeName: string, createContextScopeDeps: CreateScope[] = []) {
  let defaultContexts: any[] = []

  function createContext<ContextValueType extends object | null>(
    rootComponentName: string,
    defaultContext?: ContextValueType
  ) {
    const BaseContext = React.createContext<ContextValueType | undefined>(defaultContext)
    const index = defaultContexts.length
    defaultContexts = [...defaultContexts, defaultContext]

    const Provider: ProviderType<ContextValueType> = props => {
      const { scope, children, ...context } = props
      const Context = scope?.[rootComponentName]?.[index] || BaseContext

      const value = React.useMemo(() => context, Object.values(context)) as ContextValueType
      return <Context.Provider value={value}>{children}</Context.Provider>
    }

    Provider.displayName = rootComponentName + '.Provider'

    function useContext(scope: Scope<ContextValueType | undefined>) {
      const Context = scope?.[rootComponentName]?.[index] || BaseContext
      const context = React.useContext(Context)
      if (context) {
        return context
      }
      if (defaultContext !== undefined) {
        return defaultContext
      }

      throw new Error(`defaultContext가 없는 useContext는 \`${rootComponentName}.Provider\`내에서만 사용되어야합니다.`)
    }

    return [Provider, useContext] as const
  }

  const createScope: CreateScope = () => {
    const scopeContexts = defaultContexts.map(defaultContext => {
      return React.createContext(defaultContext)
    })

    return function useScope(scope: Scope) {
      const contexts = scope?.[scopeName] || scopeContexts

      return React.useMemo(() => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }), [scope, contexts])
    }
  }

  createScope.scopeName = scopeName

  return [createContext, composeContextScopes(createScope, ...createContextScopeDeps)] as const
}

export { createContextScope }
