# What I Learn

## canUseDom

- 단순히 typeof window undeifned 체크 하는 걸 넘어서 실제 document가 존재하는지, document.createElement 메서드가 있는지까지 확인하여 실제로 DOM을 만들어낼 수 있는 완전한 환경인지 체크.

## composeEventHandler

- 원본 이벤트 핸들러에 preventDefault가 설정되었어도 compose 대상 이벤트 핸들러가 꼭 호출되어야 할 경우를 대비하여 checkForDefaultPrevented를 설정할 수 있도록 함

## getOwnerWindow, getOwnerDocument

- document가 꼭 하나이지 않고 여러개 일 수 있기 때문에 파라미터로 넘긴 Node가 어떤 document에 속한 것인지 알고 싶을 때 사용함. canUseDom을 내부적으로 사용하여 SSR 대응이 되어있음.

## getActiveElement

- IFRAME의 경우 재귀적으로 IFRAME 내부의 컨텐츠 바디에서 activeElement를 찾는 처리가 되어있음. 또한 aria-activedescendant 처리가 되어있는데, combobox 와 같은 UI에서 input에 포커싱되어있지만 그 내부 자식에게 포커싱 처리를 할 경우 그 내부 자식 엘리먼트를 반환하도록 하는 처리가 되어있음.

---

# More

## Shadow DOM

- Shadow DOM에 포커싱되어 activeElement가 Shadow DOM 바운더리 내부에 있을 경우 그 엘리먼트를 찾아내어 반환하는 로직이 추가로 필요할까? (shadowRoot.activeElement)
