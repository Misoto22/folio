import { describe, expect, it } from 'vitest'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import { Sheet, SheetContent } from './Sheet'
import { OverlayContainer } from '../../lib/overlay-container'

function Framed() {
  const [frame, setFrame] = useState<HTMLElement | null>(null)
  return (
    <div ref={setFrame} data-testid="frame" className="relative" dir="rtl" data-density="compact">
      <OverlayContainer container={frame}>
        <Sheet defaultOpen>
          <SheetContent title="Filters">Body</SheetContent>
        </Sheet>
      </OverlayContainer>
    </div>
  )
}

describe('SheetContent inside an OverlayContainer', () => {
  /** Same defect as `Dialog`, same cause: it IS a Radix dialog, docked. */
  it('portals into the named container rather than the body', () => {
    render(<Framed />)
    expect(screen.getByTestId('frame')).toContainElement(screen.getByRole('dialog'))
  })

  it('inherits the frame’s direction and density', () => {
    render(<Framed />)
    expect(screen.getByRole('dialog').closest('[data-density="compact"]')).not.toBeNull()
    expect(screen.getByRole('dialog').closest('[dir="rtl"]')).not.toBeNull()
  })

  it('docks to the frame’s edge instead of the viewport’s', () => {
    render(<Framed />)
    const panel = screen.getByRole('dialog')
    expect(panel.className).toContain('absolute')
    expect(panel.className).not.toContain('fixed')
  })

  it('stays fixed when no container is named', () => {
    render(
      <Sheet defaultOpen>
        <SheetContent title="Filters">Body</SheetContent>
      </Sheet>,
    )
    expect(screen.getByRole('dialog').className).toContain('fixed')
  })
})

describe('SheetContent under reduced motion', () => {
  /**
   * The scrim asserted that its fade was decorative and the panel asserted
   * nothing, so the two halves of one overlay disagreed: the fade was cancelled
   * and the panel still travelled the full width of itself, which reads worse
   * than leaving both alone. The marker removes the travel outright rather than
   * running an instant frame of it — see the reduced-motion block in
   * `keyframes.css` for why it is an assertion rather than the guarantee.
   */
  it('carries the marker that says its travel is decorative', () => {
    render(
      <Sheet defaultOpen>
        <SheetContent title="Filters">Body</SheetContent>
      </Sheet>,
    )
    expect(screen.getByRole('dialog')).toHaveAttribute('data-folio-animated')
  })

  it('is the same marker the scrim already carried', () => {
    const { baseElement } = render(
      <Sheet defaultOpen>
        <SheetContent title="Filters">Body</SheetContent>
      </Sheet>,
    )
    // Both halves of one overlay, or the reduced-motion rule reaches half of it.
    expect(baseElement.querySelectorAll('[data-folio-animated]').length).toBeGreaterThanOrEqual(2)
  })
})

describe('SheetContent close action', () => {
  it('keeps the icon compact inside a 44px target', () => {
    render(
      <Sheet defaultOpen>
        <SheetContent title="Filters" closeLabel="Close filters">Body</SheetContent>
      </Sheet>,
    )
    expect(screen.getByRole('button', { name: 'Close filters' }).className).toContain('size-11')
  })
})
