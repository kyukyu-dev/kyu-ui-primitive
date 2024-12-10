import React from 'react'

type ProviderType<ContextValueType> = React.FC<ContextValueType & { children: React.ReactNode }>

function createContext<ContextValueType extends object | null>(
  rootComponentName: string,
  defaultContext?: ContextValueType
) {
  const Context = React.createContext<ContextValueType | undefined>(defaultContext)

  const Provider: ProviderType<ContextValueType> = props => {
    const { children, ...context } = props
    const value = React.useMemo(() => context, Object.values(context)) as ContextValueType

    return <Context.Provider value={value}>{children}</Context.Provider>
  }
  Provider.displayName = rootComponentName + '.Provider'

  function useContext() {
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

export { createContext }
