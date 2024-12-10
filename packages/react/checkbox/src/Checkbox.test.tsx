import React from 'react'
import { Checkbox, CheckboxIndicator } from '@kyu-ui/react-checkbox'
import { axe } from 'jest-axe'
import { render, fireEvent } from '@testing-library/react'
import type { RenderResult } from '@testing-library/react'

const CHECKBOX_ROLE = 'checkbox'
const INDICATOR_TEST_ID = 'checkbox-indicator'

const NO_ACCESSIBILITY_VIOLATION = 'accessibility 위반 없음'

describe('기본 체크박스 생성', () => {
  let rendered: RenderResult
  let checkbox: HTMLElement
  let indicator: HTMLElement | null

  beforeEach(() => {
    rendered = render(<CheckboxTest />)
    checkbox = rendered.getByRole(CHECKBOX_ROLE)
    indicator = rendered.queryByTestId(INDICATOR_TEST_ID)
  })

  it(NO_ACCESSIBILITY_VIOLATION, async () => {
    expect(await axe(rendered.container)).toHaveNoViolations()
  })

  describe('체크박스를 클릭하면', () => {
    beforeEach(async () => {
      fireEvent.click(checkbox)
      indicator = rendered.queryByTestId(INDICATOR_TEST_ID)
    })

    it('보이는 Indicator가 렌더링 됨', () => {
      expect(indicator).toBeVisible()
    })

    describe('그리고 체크박스를 다시 클릭하면', () => {
      beforeEach(async () => {
        fireEvent.click(checkbox)
      })

      it('Indicator가 지워짐', () => {
        expect(indicator).not.toBeInTheDocument()
      })
    })
  })
})

describe('disabled 체크박스 생성', () => {
  let rendered: RenderResult

  beforeEach(() => {
    rendered = render(<CheckboxTest disabled />)
  })

  it(NO_ACCESSIBILITY_VIOLATION, async () => {
    expect(await axe(rendered.container)).toHaveNoViolations()
  })
})

describe('uncontrolled `checked` 체크박스 생성', () => {
  let rendered: RenderResult
  let checkbox: HTMLElement
  let indicator: HTMLElement | null
  const onCheckedChange = jest.fn()

  beforeEach(() => {
    rendered = render(<CheckboxTest defaultChecked onCheckedChange={onCheckedChange} />)
    checkbox = rendered.getByRole(CHECKBOX_ROLE)
    indicator = rendered.queryByTestId(INDICATOR_TEST_ID)
  })

  it(NO_ACCESSIBILITY_VIOLATION, async () => {
    expect(await axe(rendered.container)).toHaveNoViolations()
  })

  describe('체크박스를 클릭하면', () => {
    beforeEach(async () => {
      fireEvent.click(checkbox)
    })

    it('Indicator가 지워짐', () => {
      expect(indicator).not.toBeInTheDocument()
    })

    it('`onCheckedChange` props을 호출', () => {
      expect(onCheckedChange).toHaveBeenCalled()
    })
  })
})

describe('controlled `checked` 체크박스 생성', () => {
  let rendered: RenderResult
  let checkbox: HTMLElement
  const onCheckedChange = jest.fn()

  beforeEach(() => {
    rendered = render(<Checkbox checked onCheckedChange={onCheckedChange} />)
    checkbox = rendered.getByRole(CHECKBOX_ROLE)
  })

  describe('체크박스를 클릭하면', () => {
    beforeEach(() => {
      fireEvent.click(checkbox)
    })

    it('`onCheckedChange` props를 호출', () => {
      expect(onCheckedChange).toHaveBeenCalled()
    })
  })
})

describe('form 안에 uncontrolled 체크박스 생성', () => {
  describe('체크박스를 클릭하면', () => {
    it('event가 form change event까지 전파되고 `target.defaultChecked`의 값이 체크박스의 `defaultChecked` 값과 같아야함', done => {
      const rendered = render(
        <form
          onChange={event => {
            const target = event.target as HTMLInputElement
            expect(target.defaultChecked).toBe(true)
          }}
        >
          <CheckboxTest defaultChecked />
        </form>
      )

      const checkbox = rendered.getByRole(CHECKBOX_ROLE)
      fireEvent.click(checkbox)
      rendered.rerender(
        <form
          onChange={event => {
            const target = event.target as HTMLInputElement
            expect(target.defaultChecked).toBe(false)
            done()
          }}
        >
          <CheckboxTest defaultChecked={false} />
        </form>
      )
      fireEvent.click(checkbox)
    })
  })
})

describe('form 안에 controlled 체크박스 생성', () => {
  describe('체크박스를 클릭하면', () => {
    it('event가 form change event까지 전파되고 `target.defaultChecked`의 값이 체크박스의 `defaultChecked` 값과 같아야함', done => {
      const rendered = render(
        <form
          onChange={event => {
            const target = event.target as HTMLInputElement
            expect(target.defaultChecked).toBe(true)
          }}
        >
          <CheckboxTest checked />
        </form>
      )

      const checkbox = rendered.getByRole(CHECKBOX_ROLE)
      fireEvent.click(checkbox)
      rendered.rerender(
        <form
          onChange={event => {
            const target = event.target as HTMLInputElement
            expect(target.defaultChecked).toBe(true)
            done()
          }}
        >
          <CheckboxTest checked={false} />
        </form>
      )
      fireEvent.click(checkbox)
    })
  })
})

function CheckboxTest(props: React.ComponentProps<typeof Checkbox>) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    containerRef.current?.querySelector('input')?.setAttribute('aria-hidden', 'true')
  }, [])

  return (
    <div ref={containerRef}>
      <Checkbox aria-label="test checkbox" {...props}>
        <CheckboxIndicator data-testid={INDICATOR_TEST_ID} />
      </Checkbox>
    </div>
  )
}
