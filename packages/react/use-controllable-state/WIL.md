# What I Learn

## stale closure

- 오래된 onChange를 호출하는 것을 방지하기 위해 state, reducer 에서 다른 방법을 사용하고 있다.
  state -> onChange를 ref에 담고 해당 ref를 useInsertionEffect를 통해 업데이트 한다. 이러면 useEffect 실행 전 최신 onChange를 참조할 수 있다.
  reducer -> useEffectEvent 훅을 통해 useEffect 에서 항상 최신의 onChange를 호출 하도록 한다.
