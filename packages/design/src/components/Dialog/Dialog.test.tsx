import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import { Dialog, DialogContent } from './Dialog'
import { OverlayContainer } from '../../lib/overlay-container'
import { resetWarnings } from '../../lib/warn'

/** A dialog opened inside a bounded frame that names itself as the container. */
function Framed({ title }: { title?: string }) {
  const [frame, setFrame] = useState<HTMLElement | null>(null)
  return (
    <div ref={setFrame} data-testid="frame" className="relative" dir="rtl" data-density="compact">
      <OverlayContainer container={frame}>
        <Dialog defaultOpen>
          <DialogContent title={title}>Body</DialogContent>
        </Dialog>
      </OverlayContainer>
    </div>
  )
}

describe('DialogContent inside an OverlayContainer', () => {
  /**
   * `useOverlayContainer` documents itself as the thing EVERY portal in the
   * library reads, and `Dialog` was the one that did not — it rendered the
   * Radix portal with no container and never called the hook, and its props
   * derive from `Content`, which has no `container` either. So a caller could
   * not pass one and the library would not read one.
   *
   * The cost is not theoretical: the documentation site wraps every example in
   * an `OverlayContainer` so an overlay stays inside the preview card and
   * inherits the card's direction and density switches. Every Dialog example
   * escaped both.
   */
  it('portals into the named container rather than the body', () => {
    render(<Framed title="Delete frame" />)
    const frame = screen.getByTestId('frame')
    expect(frame).toContainElement(screen.getByRole('dialog'))
  })

  it('inherits what the frame declares, which is the other half of the point', () => {
    render(<Framed title="Delete frame" />)
    // Inherited rather than copied: the panel is INSIDE the frame, so `dir` and
    // the density attribute reach it through the cascade.
    expect(screen.getByRole('dialog').closest('[data-density="compact"]')).not.toBeNull()
    expect(screen.getByRole('dialog').closest('[dir="rtl"]')).not.toBeNull()
  })

  it('places itself against the frame instead of the viewport', () => {
    // `position: fixed` resolves against the viewport whatever it is portalled
    // into, so a contained dialog that stayed fixed would sit in the frame's
    // DOM and cover the whole page anyway.
    render(<Framed title="Delete frame" />)
    const panel = screen.getByRole('dialog')
    expect(panel.className).toContain('absolute')
    expect(panel.className).not.toContain('fixed')
  })

  it('stays fixed when no container is named', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent title="Delete frame">Body</DialogContent>
      </Dialog>,
    )
    expect(screen.getByRole('dialog').className).toContain('fixed')
  })
})

describe('a dialog with no title', () => {
  let warned: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    resetWarnings()
    warned = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warned.mockRestore()
  })

  const message = () => warned.mock.calls.map((call) => String(call[0])).join('\n')

  /**
   * The fallback is the literal string "Dialog", so every unnamed modal in an
   * application announces identically — and it passes an automated
   * accessibility check while doing it, which is the part that makes it worse
   * than nothing. A placeholder that satisfies the checker is how the problem
   * survives a review.
   */
  it('says so, at the moment it happens', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>Body</DialogContent>
      </Dialog>,
    )
    expect(message()).toContain('DIALOG_TITLE_MISSING')
    expect(message()).toContain('field: title')
    expect(message()).toContain('npx @misoto22/folio docs Dialog')
  })

  it('still renders the fallback, because an unnamed modal is worse', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>Body</DialogContent>
      </Dialog>,
    )
    expect(screen.getByRole('dialog')).toHaveAccessibleName('Dialog')
  })

  it('stays quiet when the title is only hidden', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent title="Command palette" hideTitle>
          Body
        </DialogContent>
      </Dialog>,
    )
    expect(warned).not.toHaveBeenCalled()
  })
})
