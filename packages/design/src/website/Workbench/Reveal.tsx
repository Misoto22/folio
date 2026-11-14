'use client'

import { Slot } from '@radix-ui/react-slot'
import { useEffect, useRef, type ReactElement } from 'react'
import { revealOnScroll } from './reveal-on-scroll'

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
 * motion axis's own, so `data-motion="still"` makes it instant. Inside another
 * reveal it does nothing, so travel and opacity never compound.
 */
export function Reveal({ children }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const node = ref.current
    if (!node || node.parentElement?.closest('.folio-wb-reveal')) return
    return revealOnScroll([node])
  }, [])
  return <Slot ref={ref} className="folio-wb-reveal">{children}</Slot>
}
