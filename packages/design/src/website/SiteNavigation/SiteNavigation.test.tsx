import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NavigationSearchTrigger, PreferenceMenu, SiteNavigation } from './SiteNavigation'

describe('SiteNavigation', () => {
  it('exposes a visible shortcut and activates search from the keyboard', async () => {
    const user = userEvent.setup()
    const open = vi.fn()
    render(<NavigationSearchTrigger label="Search" onClick={open} />)
    expect(screen.getByText('⌘ K').tagName).toBe('KBD')
    await user.tab()
    expect(screen.getByRole('button', { name: 'Search (⌘ K)' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(open).toHaveBeenCalledOnce()
  })
  it('opens a named navigation dialog and returns focus after Escape', async () => {
    const user = userEvent.setup()
    render(<SiteNavigation brand={<a href="/">Portfolio</a>} label="Primary" openLabel="Open menu" closeLabel="Close menu" links={[{ id: 'work', content: <a href="/work">Work</a>, active: true }]} />)
    const trigger = screen.getByRole('button', { name: 'Open menu' })
    await user.click(trigger)
    expect(screen.getByRole('dialog', { name: 'Primary' })).toBeVisible()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})

describe('SiteNavigation width', () => {
  // jsdom has no layout, so the boxes the header compares are supplied: its
  // own unpinned box, and the box of the probe it fixes to the body.
  let laidOut = 0
  let viewport = 0
  let client = 0
  const innerWidth = Object.getOwnPropertyDescriptor(window, 'innerWidth')
  const masthead = () => render(<SiteNavigation brand={<a href="/">Portfolio</a>} label="Primary" openLabel="Open menu" closeLabel="Close menu" links={[]} />).container.querySelector('header')!

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1440 })
    Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, get: () => client })
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      const width = this.tagName === 'HEADER' ? laidOut : viewport
      return { x: 0, y: 0, top: 0, left: 0, right: width, bottom: 0, width, height: 0, toJSON: () => ({}) }
    })
  })
  afterEach(() => {
    vi.restoreAllMocks()
    Reflect.deleteProperty(document.documentElement, 'clientWidth')
    if (innerWidth) Object.defineProperty(window, 'innerWidth', innerWidth)
    document.body.removeAttribute('data-scroll-locked')
  })

  it('pins the viewport width, less the scrollbar, when laid out against the viewport', () => {
    client = viewport = laidOut = 1425
    expect(masthead().style.getPropertyValue('inline-size')).toBe('1425px')
  })
  it('leaves the width to a containing block that is not the viewport', () => {
    client = viewport = 1425
    laidOut = 640
    expect(masthead().style.getPropertyValue('inline-size')).toBe('')
  })
  it('keeps the unlocked width through a resize while an overlay holds the scroll lock', () => {
    client = viewport = laidOut = 1425
    const header = masthead()
    document.body.setAttribute('data-scroll-locked', '1')
    client = viewport = laidOut = 1440
    fireEvent(window, new Event('resize'))
    expect(header.style.getPropertyValue('inline-size')).toBe('1425px')
  })
})

describe('PreferenceMenu focus and scroll behavior', () => {
  const menu = () => <PreferenceMenu label="Appearance" value="system" onValueChange={() => {}} icon={<span>Theme</span>} options={[{ value: 'system', label: 'System' }, { value: 'light', label: 'Light' }]} />
  it('does not lock page scrolling or restore pointer focus after selection', async () => {
    const user = userEvent.setup()
    render(menu())
    const trigger = screen.getByRole('button', { name: 'Appearance' })
    await user.click(trigger)
    expect(document.body).not.toHaveAttribute('data-scroll-locked')
    await user.click(screen.getByRole('menuitemradio', { name: 'Light' }))
    expect(trigger).not.toHaveFocus()
  })
  it('restores trigger focus when dismissed with Escape', async () => {
    const user = userEvent.setup()
    render(menu())
    const trigger = screen.getByRole('button', { name: 'Appearance' })
    await user.tab()
    await user.keyboard('{Enter}')
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
  })
})
