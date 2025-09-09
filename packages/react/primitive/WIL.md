# What I Learn

## forwardRef의 반환 함수 타입

- `React.ForwardRefExoticComponent<P>`에서 제너릭 P에 `React.ComponentPropsWithRef`를 넘기면 됨

## 리액트가 이벤트를 배치하는 방식 (dispatchDiscreteCustomEvent)

- 리액트는 18버전부터 모든 이벤트를 배치 시키는데, discrete/continuous/default 순의 우선순위로 배치시킨다. 이때 커스텀 이벤트는 리액트가 우선순위를 알 수 없기 때문에 만약 discrete 이벤트 내부에서 커스텀 이벤트를 발생키실 경우 flushSync를 통해 동기화 처리를 해줘야한다
