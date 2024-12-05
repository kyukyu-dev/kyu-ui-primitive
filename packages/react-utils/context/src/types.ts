type Scope<C = any> = { [scopeName: string]: React.Context<C>[] } | undefined

type ScopeHook = (scope: Scope) => { [__scopeProp: string]: Scope }

interface CreateScope {
  scopeName: string
  (): ScopeHook
}

export type { Scope, ScopeHook, CreateScope }
