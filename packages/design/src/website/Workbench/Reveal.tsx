'use client'

import { Slot } from '@radix-ui/react-slot'
import { useEffect, useRef, type ReactElement } from 'react'

export interface RevealProps {
  /** One element; it keeps its own tag and receives the reveal state. */
  children: ReactElement
}

/**
 * Fades and lifts its child the first time it scrolls into view.
 *
 * The server renders the child visible. Only after hydration, and only for an
 * element that starts below the fold, is it hidden and then revealed — so a
 * page without JavaScript, a crawler and anything already on screen never see
 * an empty frame. Reduced motion skips the whole thing, and the duration is the
 * motion axis's own, so `data-motion="still"` makes it instant.
 */
export function Reveal({ children }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    if (node.getBoundingClientRect().top < window.innerHeight) return
    node.dataset.reveal = 'hidden'
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        node.dataset.reveal = 'shown'
        observer.disconnect()
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return <Slot ref={ref} className="folio-wb-reveal">{children}</Slot>
}
