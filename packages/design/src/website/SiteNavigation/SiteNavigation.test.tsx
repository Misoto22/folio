import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NavigationSearchTrigger, PreferenceMenu, PreferenceSegment, SiteNavigation } from './SiteNavigation'

/** Answers one media query `true` for the test's duration; the setup stub answers `false` to all. */
function matchOnly(query: string) {
  vi.spyOn(window, 'matchMedia').mockImplementation((media: string) => ({
    media, matches: media === query, onchange: null, dispatchEvent: () => false,
    addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {},
  }) as MediaQueryList)
}

const links = [
  { id: 'home', content: <a href="/">Home</a> },
  { id: 'work', content: <a href="/work">Work</a>, active: true },
  { id: 'ask', content: <a href="/ask">Ask</a>, marker: <span>*</span> },
]

describe('SiteNavigation', () => {
  afterEach(() => { vi.restoreAllMocks() })

  it('exposes a visible shortcut and activates search from the keyboard', async () => {
    matchOnly('(hover: hover)')
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
  it('names search without the shortcut where nothing can hover', () => {
    render(<NavigationSearchTrigger label="Search" onClick={() => {}} />)
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })
  it('opens and closes the menu with one button that stays in the bar and swaps its name', async () => {
    const user = userEvent.setup()
    render(<SiteNavigation brand={<a href="/">Portfolio</a>} label="Primary" openLabel="Open menu" closeLabel="Close menu" links={links} />)
    const toggle = screen.getByRole('button', { name: 'Open menu' })
    await user.click(toggle)
    expect(screen.getByRole('dialog', { name: 'Primary' })).toBeVisible()
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(toggle).toHaveAccessibleName('Close menu')
    expect(screen.getAllByRole('button', { name: /menu/ })).toHaveLength(1)
    expect(document.documentElement.style.overflow).toBe('hidden')
    await user.click(toggle)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(toggle).toHaveAccessibleName('Open menu')
    expect(document.documentElement.style.overflow).toBe('')
  })
  it('marks the current page decoratively, carries a link marker, and adds the second row and the foot', async () => {
    const user = userEvent.setup()
    render(<SiteNavigation brand={<a href="/">Portfolio</a>} label="Primary" openLabel="Open menu" closeLabel="Close menu" currentLabel="You are here"
      links={links} secondaryLabel="More" secondaryLinks={[{ id: 'contact', content: <a href="/contact">Contact</a> }]} footer={<p>Settings</p>} />)
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    const dialog = screen.getByRole('dialog', { name: 'Primary' })
    const current = within(dialog).getByRole('link', { name: 'Work' })
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(within(current).getByText('You are here')).toHaveAttribute('aria-hidden', 'true')
    expect(within(dialog).getByRole('link', { name: 'Ask' })).toHaveAttribute('href', '/ask')
    expect(within(within(dialog).getByRole('navigation', { name: 'More' })).getByRole('link', { name: 'Contact' })).toBeInTheDocument()
    expect(within(dialog).getByText('Settings')).toBeInTheDocument()
  })
  it('keeps Tab inside the bar and the menu, and moving focus to the bar does not close it', async () => {
    const user = userEvent.setup()
    render(<><SiteNavigation brand={<a href="/">Portfolio</a>} label="Primary" openLabel="Open menu" closeLabel="Close menu" links={[{ id: 'work', content: <a href="/work">Work</a> }]} /><a href="/after">After</a></>)
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    const dialog = screen.getByRole('dialog', { name: 'Primary' })
    within(dialog).getByRole('link', { name: 'Work' }).focus()
    await user.tab()
    expect(screen.getAllByRole('link', { name: 'Portfolio' })[0]).toHaveFocus()
    expect(screen.getByRole('dialog', { name: 'Primary' })).toBeInTheDocument()
    await user.tab({ shift: true })
    expect(within(dialog).getByRole('link', { name: 'Work' })).toHaveFocus()
  })
  it('shows the bar actions beside the toggle and keeps the desk tools apart', () => {
    const { container } = render(<SiteNavigation brand={<a href="/">Portfolio</a>} label="Primary" openLabel="Open menu" closeLabel="Close menu" links={[]} actions={<button type="button">Language</button>} barActions={<button type="button">Find</button>} />)
    expect(container.querySelector('.folio-site-navigation-actions')).toHaveAttribute('data-split', 'true')
    expect(screen.getByRole('button', { name: 'Language' }).closest('.folio-site-navigation-desk')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Find' }).closest('.folio-site-navigation-bar')).not.toBeNull()
  })
})

describe('PreferenceSegment', () => {
  it('is a named radio group that shows its state and reports a new choice', async () => {
    const user = userEvent.setup()
    const change = vi.fn()
    render(<PreferenceSegment label="Appearance" value="light" onValueChange={change} options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'System' }]} />)
    const group = screen.getByRole('radiogroup', { name: 'Appearance' })
    expect(within(group).getByRole('radio', { name: 'Light' })).toHaveAttribute('aria-checked', 'true')
    await user.click(within(group).getByRole('radio', { name: 'Dark' }))
    expect(change).toHaveBeenCalledWith('dark')
    await user.click(within(group).getByRole('radio', { name: 'Light' }))
    expect(change).not.toHaveBeenCalledWith('')
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
