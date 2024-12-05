import React from 'react'
import { useSafeLayoutEffect } from '@kyu-ui/react-utils-use-safe-layout-effect'

function useResponsiveSize(element: HTMLElement | null) {
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null)

  useSafeLayoutEffect(() => {
    if (element) {
      setSize({ width: element.offsetWidth, height: element.offsetHeight })

      const resizeObserver = new ResizeObserver(entries => {
        const entry = entries[0]
        let width: number
        let height: number

        if (entry.borderBoxSize) {
          // 오래 된 Firefox에서는 array가 아닌 entry.borderBoxSize를 array가 아닌 단일 아이템으로 취급함.
          // 참고: https://github.com/mdn/dom-examples/blob/main/resize-observer/resize-observer-border-radius.html
          const borderBoxSize: ResizeObserverSize = Array.isArray(entry.borderBoxSize)
            ? entry.borderBoxSize[0]
            : entry.borderBoxSize

          width = borderBoxSize.inlineSize
          height = borderBoxSize.blockSize
        } else {
          width = element.offsetWidth
          height = element.offsetHeight
        }

        setSize({ width, height })
      })

      resizeObserver.observe(element, { box: 'border-box' })

      return () => resizeObserver.unobserve(element)
    } else {
      setSize(null)
    }
  }, [element])

  return size
}

export { useResponsiveSize }
