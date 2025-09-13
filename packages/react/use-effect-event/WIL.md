# What I Learn

## useEffectEvent

- useEffect 내부에서 의존성을 가지면 안되는 값을 가지고 있는 함수를 추출할 때 useEffectEvent를 사용. 의존성을 가지지 않아 값이 변할 때 useEffect가 발생하지는 않지만 useEffect 호출 시 useEffectEvent 내부의 값은 최신 값을 바라본다.
