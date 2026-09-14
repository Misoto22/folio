import { afterEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppShell } from './AppShell'

/**
 * The drawer half of the shell, which is the half that only exists below `md`.
 *
 * jsdom has no layout and no `window.matchMedia`, so the viewport is stubbed
 * rather than measured: these tests assert what the component decides once it
 * has been told which side of the breakpoint it is on, not that a browser
 * reports the breakpoint correctly.
 */
function stubViewport(kind: 'phone' | 'desktop') {
  const matches = kind === 'desktop'
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

afterEach(() => {
  Reflect.deleteProperty(window, 'matchMedia')
})

const shell = (
  <AppShell sidebar={<a href="#projects">Projects</a>}>
    <p>Body</p>
  </AppShell>
)

describe('AppShell drawer', () => {
  it('takes the closed drawer out of the tab order and the accessibility tree', () => {
    stubViewport('phone')
    render(shell)

    // Translated off-screen is a visual state, not an accessibility one: without
    // `inert` the whole menu stays focusable while nobody can see it.
    expect(screen.getByRole('complementary', { name: 'Sidebar' })).toHaveAttribute('inert')
  })

  it('leaves the sidebar reachable on a desktop, where it is a column and not a drawer', () => {
    stubViewport('desktop')
    render(shell)

    expect(screen.getByRole('complementary', { name: 'Sidebar' })).not.toHaveAttribute('inert')
  })

  it('gives the drawer back to the keyboard once it is open', async () => {
    stubViewport('phone')
    const user = userEvent.setup()
    render(shell)

    await user.click(screen.getByRole('button', { name: 'Open navigation' }))
    expect(screen.getByRole('complementary', { name: 'Sidebar' })).not.toHaveAttribute('inert')
  })

  it('puts focus back on the toggle when Escape closes the drawer', async () => {
    stubViewport('phone')
    const user = userEvent.setup()
    render(shell)

    await user.click(screen.getByRole('button', { name: 'Open navigation' }))
    screen.getByRole('link', { name: 'Projects' }).focus()
    await user.keyboard('{Escape}')

    // Escape used to close the drawer and leave the reader standing on a link
    // that had just slid off screen — and that is now inert as well.
    expect(screen.getByRole('button', { name: 'Open navigation' })).toHaveFocus()
  })

  it('puts focus back on the toggle when the scrim closes the drawer', async () => {
    stubViewport('phone')
    const user = userEvent.setup()
    render(shell)

    await user.click(screen.getByRole('button', { name: 'Open navigation' }))
    // The scrim and the toggle share closeLabel by design; the toggle is the
    // one that owns the drawer through aria-controls.
    const scrim = screen
      .getAllByRole('button', { name: 'Close navigation' })
      .find((button) => !button.hasAttribute('aria-controls'))
    await user.click(scrim as HTMLElement)

    expect(screen.getByRole('button', { name: 'Open navigation' })).toHaveFocus()
  })

  it('marks the drawer animated, so the reduced-motion rule reaches its transition', () => {
    stubViewport('phone')
    render(shell)

    expect(screen.getByRole('complementary', { name: 'Sidebar' })).toHaveAttribute(
      'data-folio-animated',
    )
  })
})
