import { useState } from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MediaLightbox } from './MediaLightbox'

function Viewer({ aspectRatio = 2 / 3 }: { aspectRatio?: number }) {
  const [open, setOpen] = useState(false)
  return <><button>Outside the viewer</button><MediaLightbox open={open} onOpenChange={setOpen} title="The shore" triggerLabel="Enlarge photograph" closeLabel="Close photograph" aspectRatio={aspectRatio} media={<img src="/shore.jpg" alt="The shore at dusk" width={800} height={1200} />} /></>
}

describe('MediaLightbox', () => {
  it('traps keyboard focus, closes with Escape and restores the print trigger', async () => {
    const user = userEvent.setup()
    render(<Viewer />)
    const print = screen.getByRole('button', { name: 'Enlarge photograph' })
    await user.click(print)
    const dialog = screen.getByRole('dialog', { name: 'The shore' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(print).toHaveAttribute('aria-expanded', 'true')
    const close = within(dialog).getByRole('button', { name: 'Close photograph' })
    await waitFor(() => expect(close).toHaveFocus())
    await user.tab()
    expect(close).toHaveFocus()
    await user.tab({ shift: true })
    expect(close).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await waitFor(() => expect(print).toHaveFocus())
    expect(print).toHaveAttribute('aria-expanded', 'false')
  })

  it('keeps image clicks open and dismisses a click on the surrounding stage', async () => {
    const user = userEvent.setup()
    render(<Viewer />)
    await user.click(screen.getByRole('button', { name: 'Enlarge photograph' }))
    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByRole('img'))
    expect(dialog).toBeInTheDocument()
    fireEvent.click(dialog)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('preserves intrinsic dimensions and safely handles an invalid aspect ratio', () => {
    render(<Viewer aspectRatio={Number.NaN} />)
    const print = screen.getByRole('button', { name: 'Enlarge photograph' })
    expect(print.style.getPropertyValue('--folio-media-aspect')).toBe('1.5')
    expect(within(print).getByRole('img')).toHaveAttribute('width', '800')
    expect(within(print).getByRole('img')).toHaveAttribute('height', '1200')
  })

  it('paints the page print at once and fades the larger rendering in only when it has loaded', async () => {
    const user = userEvent.setup()
    function Expanded() {
      const [open, setOpen] = useState(false)
      return <MediaLightbox open={open} onOpenChange={setOpen} title="The shore" triggerLabel="Enlarge photograph" closeLabel="Close" aspectRatio={1.5}
        media={<img src="/shore-640.jpg" alt="The shore at dusk" />} expandedMedia={<img src="/shore-2400.jpg" alt="The shore at dusk" />} />
    }
    render(<Expanded />)
    await user.click(screen.getByRole('button', { name: 'Enlarge photograph' }))
    const dialog = screen.getByRole('dialog')
    const print = dialog.querySelector('.folio-media-lightbox-print')!
    const full = dialog.querySelector<HTMLElement>('.folio-media-lightbox-full')!
    // The print is there from the first frame, hidden from assistive tech so the photograph is named once.
    expect(print.querySelector('img')).toHaveAttribute('src', '/shore-640.jpg')
    expect(print).toHaveAttribute('aria-hidden', 'true')
    expect(within(dialog).getAllByRole('img')).toHaveLength(1)
    expect(full).toHaveAttribute('data-loaded', 'false')
    const large = full.querySelector('img')!
    Object.defineProperty(large, 'complete', { value: true })
    Object.defineProperty(large, 'naturalWidth', { value: 2400 })
    fireEvent.load(large)
    expect(full).toHaveAttribute('data-loaded', 'true')
  })

  it('measures the way back to the print’s frame onto the stage', async () => {
    const user = userEvent.setup()
    render(<Viewer />)
    const print = screen.getByRole('button', { name: 'Enlarge photograph' })
    print.getBoundingClientRect = () => ({ left: 100, top: 200, width: 200, height: 300, right: 300, bottom: 500, x: 100, y: 200, toJSON: () => ({}) })
    const stageRect = { left: 400, top: 100, width: 400, height: 600, right: 800, bottom: 700, x: 400, y: 100, toJSON: () => ({}) }
    const original = HTMLElement.prototype.getBoundingClientRect
    HTMLElement.prototype.getBoundingClientRect = function rect(this: HTMLElement) { return this.classList.contains('folio-media-lightbox-stage') ? stageRect : original.call(this) }
    try {
      await user.click(print)
      const stage = screen.getByRole('dialog').querySelector<HTMLElement>('.folio-media-lightbox-stage')!
      expect(stage.style.getPropertyValue('--folio-lightbox-x')).toBe('-400px')
      expect(stage.style.getPropertyValue('--folio-lightbox-y')).toBe('-50px')
      expect(stage.style.getPropertyValue('--folio-lightbox-scale')).toBe('0.5')
    } finally {
      HTMLElement.prototype.getBoundingClientRect = original
    }
  })
})
