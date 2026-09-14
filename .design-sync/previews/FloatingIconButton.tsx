import { FloatingIconButton } from '@misoto22/folio'
import { RiArrowUpLine } from '@remixicon/react'

/**
 * FloatingIconButton is `position: fixed` and pins to a screen corner (a
 * back-to-top / mobile-TOC trigger). To show that behaviour in a static card we
 * frame it in a mini "page": a wrapper with `transform` establishes a containing
 * block, so the fixed button anchors to this box's bottom-right corner instead
 * of the viewport's — the same placement it has in a real page.
 */
export function BackToTop() {
  return (
    <div
      style={{
        position: 'relative',
        transform: 'translateZ(0)',
        height: 180,
        width: 280,
        background: 'var(--background)',
        border: '1px solid var(--border-color)',
        borderRadius: 18,
        overflow: 'hidden',
      }}
    >
      <FloatingIconButton position="right" label="Back to top" onClick={() => {}}>
        <RiArrowUpLine size={18} aria-hidden />
      </FloatingIconButton>
    </div>
  )
}
