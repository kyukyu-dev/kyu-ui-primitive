# What I Learn

## CSS 애니메이션 시작 판단

- CSS 애니메이션은 시작 시점에 computed style의 animation-name 값이 none에서 변한다.
  animation start 이벤트는 애니메이션 delay 이후에 늦게 발생한다. 따라서 애니메이션 시작을 즉시 판단하기 위해서는 animation-name 비교를 해야한다.

## unmount with animation 시 end 시점에 깜빡임 방지

- animationend 시점에 send('ANIMATION_END')로 state를 업데이트 하게 되면, 요소의 animation이 잠시 unset 으로 돌아가 깜빡이는 것처럼 보임 (애니메이션 초기 모습으로 돌아가서)
  따라서 animation fill mode를 강제로 forwards로 세팅하고 unmount 된 후 다시 되돌림.
  원래는 ReactDom.flushSync를 통해 이를 처리했지만, 이 경우 node가 animationEnd 이벤트를 dispatch 하기 전에 DOM 에서 unmount 시켜버려서 유저가 설정한 animationEnd 이벤트가 발생하지 않는 문제가 발생.
