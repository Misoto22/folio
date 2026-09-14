'use client'

import { Children, useLayoutEffect, useRef, type ReactNode } from 'react'

/** Justified photo rows preserve image proportions without leaving masonry tails. */
function FrameLayout({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const grid = ref.current
    if (!grid) return
    const measure = () => {
      const columns = grid.clientWidth >= 600 ? 3 : 2
      const items = Array.from(grid.children) as HTMLElement[]
      for (let start = 0; start < items.length; start += columns) {
        const row = items.slice(start, start + columns)
        const ratios = row.map(item => {
          const image = item.querySelector('img')
          const width = image?.naturalWidth || Number(image?.getAttribute('width'))
          const height = image?.naturalHeight || Number(image?.getAttribute('height'))
          return width > 0 && height > 0 ? width / height : 1
        })
        const total = ratios.reduce((sum, ratio) => sum + ratio, 0)
        row.forEach((item, index) => {
          const share = (ratios[index] ?? 1) / total
          item.style.flexBasis = `calc(${share * 100}% - ${(row.length - 1) * 12 * share}px)`
        })
      }
    }
    const observer = new ResizeObserver(measure)
    observer.observe(grid)
    grid.addEventListener('load', measure, true)
    measure()
    return () => { observer.disconnect(); grid.removeEventListener('load', measure, true) }
  }, [children])
  return <div ref={ref}>{Children.map(children, child => <div className="folio-frame-layout-item">{child}</div>)}</div>
}

export default FrameLayout
