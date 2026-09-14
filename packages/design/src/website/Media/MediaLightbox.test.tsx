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
})
