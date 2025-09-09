# What I Learn

## getOwnPropertyDescriptor

- 프로퍼티 descriptor를 가져와 isReactWarning을 체크함으로써 리액트에서 경고를 날리는 코드인지 판별할 수 있다.

## Symbol

## NO_SIDE_EFFECTS

- 번들러에게 side effect가 없음을 명시하여 해당 함수가 사용되지 않을 경우 트리 쉐이킹 과정에서 제거되도록 한다.

## 타입스크립트 is 연산자 (child is React.ReactElement<SlottableProps, typeof Slottable>)

- 해당 return boolean 값이 참이라면 is 앞의 값의 타입이 is 뒤에 작성한 타입으로 타입을 좁혀 판단할 수 있도록 명시한다.

## React.HTMLAttributes와 React.ComponentProps 의 차이

- React.HTMLAttributes<T> → HTML 태그 공통 속성만, React.ComponentProps<'button'> → 실제 <button> 엘리먼트가 받을 수 있는 모든 속성.

---

# More

- slot 테스트에서 composeRefs를 호출하면 asChild와 함께 사용했을 때 call ref가 한 번이 아닌 여러번 호출 되는 문제가 있다. 어떻게 해결할 수 있을까
