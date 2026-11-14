import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { House, PanelLeftOpen, Settings as SettingsIcon } from '../../icons'
import {
  Sidebar,
  SidebarBranch,
  SidebarContent,
  SidebarGroup,
  SidebarInset,
  SidebarItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from './Sidebar'

function rail(props: Partial<React.ComponentProps<typeof SidebarProvider>> = {}) {
  return (
    <SidebarProvider {...props}>
      <Sidebar label="Documentation">
        <SidebarTrigger />
        <SidebarContent>
          <SidebarGroup label="Guide" count={2}>
            <SidebarItem href="#start" icon={House} active>
              Getting started
            </SidebarItem>
            <SidebarItem href="#settings" icon={SettingsIcon} trailing="3">
              Settings
            </SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}

describe('Sidebar', () => {
  it('is a named landmark, because a page can have two navigations in it', () => {
    render(rail())
    expect(screen.getByRole('navigation', { name: 'Documentation' })).toBeInTheDocument()
  })

  it('marks the current row for a reader who cannot see that it is darker', () => {
    render(rail())
    expect(screen.getByRole('link', { name: 'Getting started' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('reports what the trigger will do, not what it is called', async () => {
    // A button permanently named "Toggle sidebar" tells a screen reader user
    // nothing about which way it is about to go.
    const user = userEvent.setup()
    render(rail())

    const trigger = screen.getByRole('button', { name: 'Close the sidebar' })
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await user.click(trigger)
    expect(screen.getByRole('button', { name: 'Open the sidebar' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('keeps every row reachable when it collapses to icons', async () => {
    // The label leaves the layout and moves into a tooltip, so it is still the
    // row's accessible name — an icon on its own is a guess for everyone and
    // nothing at all for a screen reader.
    const user = userEvent.setup()
    render(rail({ defaultOpen: false, collapsible: 'icon' }))

    expect(screen.getByRole('link', { name: 'Getting started' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Open the sidebar' }))
    expect(screen.getByRole('link', { name: 'Getting started' })).toBeInTheDocument()
  })

  it('keeps the group announced when its heading is not drawn', () => {
    render(rail({ defaultOpen: false, collapsible: 'icon' }))
    expect(screen.getByRole('group', { name: 'Guide' })).toBeInTheDocument()
  })

  it('folds a group without taking its rows out of the document', async () => {
    const user = userEvent.setup()
    render(rail())

    await user.click(screen.getByRole('button', { name: /Guide/ }))
    expect(screen.getByRole('button', { name: /Guide/ })).toHaveAttribute('aria-expanded', 'false')
  })

  it('toggles on the platform shortcut, whichever modifier the keyboard has', async () => {
    const user = userEvent.setup()
    render(rail())

    await user.keyboard('{Meta>}b{/Meta}')
    expect(screen.getByRole('button', { name: 'Open the sidebar' })).toBeInTheDocument()

    await user.keyboard('{Control>}b{/Control}')
    expect(screen.getByRole('button', { name: 'Close the sidebar' })).toBeInTheDocument()
  })

  it('binds nothing when the app already owns that chord', async () => {
    const user = userEvent.setup()
    render(rail({ shortcut: null }))

    await user.keyboard('{Meta>}b{/Meta}')
    expect(screen.getByRole('button', { name: 'Close the sidebar' })).toBeInTheDocument()
  })

  it('lets a caller own the open state', async () => {
    const user = userEvent.setup()
    render(rail({ open: true }))

    // Controlled and given no handler: the rail cannot change itself.
    await user.click(screen.getByRole('button', { name: 'Close the sidebar' }))
    expect(screen.getByRole('button', { name: 'Close the sidebar' })).toBeInTheDocument()
  })
})

describe('SidebarBranch', () => {
  function tree(props: Partial<React.ComponentProps<typeof SidebarProvider>> = {}) {
    return (
      <SidebarProvider {...props}>
        <Sidebar label="Workspace">
          <SidebarContent>
            <SidebarGroup label="Teamspaces" count={1} badge={<span>Beta</span>}>
              <SidebarBranch label="Acme HQ" icon={House}>
                <SidebarItem href="#hq" icon={House}>
                  Overview
                </SidebarItem>
              </SidebarBranch>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )
  }

  it('opens onto its children, and says whether it is open', async () => {
    const user = userEvent.setup()
    render(tree())

    const branch = screen.getByRole('button', { name: 'Acme HQ' })
    expect(branch).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', { name: 'Overview' })).toBeNull()

    await user.click(branch)
    expect(branch).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: 'Overview' })).toBeInTheDocument()
  })

  it('is a place with an icon, collapsed to that icon and no children', () => {
    // A nested icon under an unnested one is two glyphs with no visible
    // relationship, so the contents are a level the width no longer has.
    render(tree({ defaultOpen: false, collapsible: 'icon' }))
    expect(screen.getByRole('button', { name: 'Acme HQ' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Overview' })).toBeNull()
  })

  it('carries a group badge beside the words it qualifies', () => {
    render(tree())
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })
})

describe('without a provider', () => {
  it('renders, because <Sidebar> on its own is the first thing anybody writes', () => {
    // It used to throw. A component that cannot draw unwrapped is not strict,
    // it is unusable — the documentation site's own props panel renders exactly
    // this and got an error boundary instead of a rail.
    render(
      <Sidebar label="Workspace">
        <SidebarContent>
          <SidebarGroup label="Guide" count={1}>
            <SidebarItem href="#one" icon={House}>
              One
            </SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>,
    )
    expect(screen.getByRole('navigation', { name: 'Workspace' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'One' })).toBeInTheDocument()
  })

  it('still refuses the hook, because that is code asking for state nothing keeps', () => {
    const Probe = () => {
      useSidebar()
      return null
    }
    // React logs the boundary-less throw; the assertion is that it throws.
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Probe />)).toThrow(/SidebarProvider/)
    quiet.mockRestore()
  })
})

/**
 * Puts every media query at `matches`, which is how this suite reaches the
 * drawer: jsdom has no media engine, so the setup file answers "no" to
 * everything and the rail is a column in every other test in this file.
 */
function atDrawerWidth() {
  vi.stubGlobal('matchMedia', (query: string) => ({
    media: query,
    matches: true,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }))
}

describe('Sidebar at drawer width', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts closed, whatever defaultOpen said about the column', () => {
    // `defaultOpen` answers "keep the rail beside the page". Read as "show the
    // rail now", it is a phone that loads with its navigation over the page.
    atDrawerWidth()
    render(rail({ defaultOpen: true }))
    expect(screen.getByRole('navigation', { name: 'Documentation' })).toHaveAttribute('inert')
  })

  it('is inert while closed, because off-screen is not closed', async () => {
    // Translated off the page it still holds focus and is still read aloud, so
    // a shut drawer puts its whole index between the reader and the page.
    atDrawerWidth()
    const user = userEvent.setup()
    render(rail())

    const nav = screen.getByRole('navigation', { name: 'Documentation' })
    expect(nav).toHaveAttribute('inert')

    await user.click(screen.getByRole('button', { name: 'Open the sidebar' }))
    expect(nav).not.toHaveAttribute('inert')
  })

  it('closes onto a scrim, which is a button because tapping beside it is a gesture', async () => {
    atDrawerWidth()
    const user = userEvent.setup()
    render(rail())

    await user.click(screen.getByRole('button', { name: 'Open the sidebar' }))
    const scrim = screen.getByRole('button', { name: 'Close the navigation' })

    await user.click(scrim)
    expect(screen.getByRole('navigation', { name: 'Documentation' })).toHaveAttribute('inert')
  })

  it('closes when a row in it is taken', async () => {
    // Following a link inside an overlay and leaving the overlay open is a
    // reader landing on a destination they cannot see.
    atDrawerWidth()
    const user = userEvent.setup()
    render(rail())

    await user.click(screen.getByRole('button', { name: 'Open the sidebar' }))
    // "Settings3" — the row's trailing count is part of its accessible name.
    await user.click(screen.getByRole('link', { name: /Settings/ }))

    expect(screen.getByRole('navigation', { name: 'Documentation' })).toHaveAttribute('inert')
  })

  it('never collapses to icons, because closed here means off the page', async () => {
    atDrawerWidth()
    const user = userEvent.setup()
    render(rail({ collapsible: 'icon' }))

    // The label is still in the markup rather than moved into a tooltip: an
    // icon rail is the answer for a layout that still has a column.
    await user.click(screen.getByRole('button', { name: 'Open the sidebar' }))
    expect(screen.getByRole('link', { name: /Settings/ })).toHaveTextContent('Settings')
  })
})

describe('SidebarProvider persistence', () => {
  // This environment has no `localStorage` at all — Node's own experimental one
  // is disabled without `--localstorage-file` and jsdom's is shadowed by it — so
  // the suite supplies the store it is testing against rather than asserting on
  // a global that is simply absent here.
  let store: Record<string, string>

  beforeEach(() => {
    store = {}
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value
      },
      removeItem: (key: string) => {
        delete store[key]
      },
      clear: () => {
        store = {}
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('opens where the reader left it', async () => {
    // "I put the rail away" is not "until the next page".
    store.rail = 'closed'
    render(rail({ persist: 'rail' }))

    await screen.findByRole('button', { name: 'Open the sidebar' })
  })

  it('writes the docked state, and only that', async () => {
    const user = userEvent.setup()
    render(rail({ persist: 'rail' }))

    await user.click(screen.getByRole('button', { name: 'Close the sidebar' }))
    expect(store.rail).toBe('closed')
  })

  it('survives a storage-blocked context rather than failing to render', () => {
    // Safari in private browsing, and any embedded frame with storage denied:
    // the accessor itself throws rather than returning nothing.
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('denied')
      },
      setItem: () => {
        throw new Error('denied')
      },
    })
    render(rail({ persist: 'rail' }))
    expect(screen.getByRole('navigation', { name: 'Documentation' })).toBeInTheDocument()
  })
})

describe('Sidebar side and variant', () => {
  it('draws its edge on the side the page is on', () => {
    render(rail({ side: 'end' }))
    const nav = screen.getByRole('navigation', { name: 'Documentation' })
    expect(nav).toHaveAttribute('data-side', 'end')
    // Whole classes, not substrings: the drawer's own `max-md:border-e` CONTAINS
    // "border-e", so a substring check reads the column's edge off the overlay's.
    const classes = nav.className.split(/\s+/)
    expect(classes).toContain('border-s')
    expect(classes).not.toContain('border-e')
  })

  it('points the trigger at the edge it operates', () => {
    render(rail({ side: 'end' }))
    // The drawn path is what tells the two panel marks apart without a
    // snapshot or a dependency on the icon set's class names. Render the
    // one this side is supposed to draw and compare against it, rather than
    // pinning the path data a version bump is free to redraw.
    const trigger = screen.getByRole('button', { name: 'Close the sidebar' })
    const { container } = render(<PanelLeftOpen />)
    const expected = container.querySelector('svg path')?.getAttribute('d')
    expect(expected).toBeTruthy()
    expect(trigger.querySelector('svg path')?.getAttribute('d')).toBe(expected)
  })

  it('gives the border to the panel, not to both halves', () => {
    // Under `inset` the rail is the ground and the content is the panel. A rail
    // that kept its own edge would draw two lines a few pixels apart.
    render(
      <SidebarProvider variant="inset">
        <Sidebar label="Documentation">
          <SidebarContent>
            <SidebarGroup label="Guide" count={1}>
              <SidebarItem href="#one" icon={House}>
                One
              </SidebarItem>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset data-testid="page">Page</SidebarInset>
      </SidebarProvider>,
    )

    expect(
      screen.getByRole('navigation', { name: 'Documentation' }).className.split(/\s+/),
    ).not.toContain('border-e')
    expect(screen.getByTestId('page').className.split(/\s+/)).toContain('border')
  })
})

/**
 * The fill follows the pointer while the pointer is in the list, and the three
 * declarations that do it land on EVERY row. Two of them are no-ops on a row
 * that is not current — it has no fill and no ink to give up. The weight was
 * not: `font-normal` is an absolute weight rather than an undo, so in a rail
 * whose base face is lighter than 400 every row in the list got HEAVIER the
 * moment the pointer arrived, and picking one row appeared to embolden its
 * whole section.
 *
 * jsdom has no `:hover`, so this asserts the scoping the selector carries.
 * That is the thing that regressed.
 */
describe('the highlight that follows the pointer', () => {
  const rows = () => screen.getAllByRole('link')

  it('scopes the weight it gives up to the current row', () => {
    render(rail())

    for (const row of rows()) {
      const weight = row.className
        .split(/\s+/)
        .filter((cls) => cls.includes('not-hover') && cls.includes('font-'))
      expect(weight, `${row.textContent} must not carry an unscoped weight`).toEqual([
        'group-hover/rows:not-hover:aria-[current=page]:font-normal',
      ])
    }
  })

  it('still gives up the fill and the ink on every row', () => {
    render(rail())

    for (const row of rows()) {
      expect(row).toHaveClass('group-hover/rows:not-hover:bg-transparent')
      expect(row).toHaveClass('group-hover/rows:not-hover:text-(--ink-3-aa)')
    }
  })
})
