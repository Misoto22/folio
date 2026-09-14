'use client'

import { RiArrowRightSLine, RiMenuFold3Line, RiMenuFoldLine, RiMenuUnfold3Line, RiMenuUnfoldLine, type RemixiconComponentType } from '@remixicon/react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/cn'
import { warnBlankName } from '../../lib/warn'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../Collapsible/Collapsible'
import { NavItem, type NavItemProps } from '../NavItem/NavItem'
import { Tooltip, TooltipProvider } from '../Tooltip/Tooltip'

/** What happens to the rail when it is closed. See {@link SidebarProviderProps.collapsible}. */
export type SidebarCollapsible = 'icon' | 'offcanvas' | 'none'

/** Which edge of the layout the rail is on. Logical, so it follows `dir`. */
export type SidebarSide = 'start' | 'end'

/** How the rail meets the page. See {@link SidebarProviderProps.variant}. */
export type SidebarVariant = 'flush' | 'inset' | 'floating'

/** Where the rail stops being a column. See {@link SidebarProviderProps.breakpoint}. */
export type SidebarBreakpoint = 'sm' | 'md' | 'lg' | 'xl'

/**
 * The drawer, written as CSS rather than decided in JavaScript.
 *
 * The first version asked `matchMedia` and rendered a different tree from the
 * answer. That answer does not exist until an effect runs, so the server sent —
 * and a phone painted — a 256px column beside a 390px screen, and the page
 * scrolled sideways until React caught up. A layout that is wrong for a frame
 * is wrong: it is the first frame, it is the one a reader sees on a slow phone,
 * and on this site's own suite it was a real failure on every route.
 *
 * So the element is the same in both states and the media query decides, which
 * is what a media query is. JavaScript is left with the two things CSS cannot
 * say — `inert`, and whether to render the scrim — and being a frame late on
 * either of those changes nothing anyone can see.
 *
 * The breakpoints are NAMED rather than numeric because these are literal class
 * strings: Tailwind emits what it can read in the source, and a class built
 * from a runtime number is a class that does not exist. Naming them also puts
 * the rail on the same four steps as everything else in the page around it,
 * which a number never quite lands on.
 *
 * It slides on `inset-inline-start`, not on `translate-x`. A transform is a
 * PHYSICAL axis, so the closed drawer needed an `rtl:` twin of every offset —
 * which is the physical-with-a-patch shape this system forbids everywhere else,
 * and which cost 3.6 kB of stylesheet on its own: each `rtl:` selector carries
 * the whole `:lang()` list, four breakpoints deep. A logical inset needs no
 * twin, is one property in each direction, and puts the rail back under the
 * same rule as every `ps-` and `me-` in the package.
 */
const DRAWER: Record<
  SidebarBreakpoint,
  { query: string; frame: string; fixed: string; absolute: string; start: string; end: string; openStart: string; openEnd: string; shutStart: string; shutEnd: string }
> = {
  sm: {
    query: '(max-width: 39.99rem)',
    frame: 'max-sm:inset-y-0 max-sm:z-(--z-modal) max-sm:w-(--sidebar-w) max-sm:m-0 max-sm:rounded-none max-sm:border-0 max-sm:transition-[inset-inline-start,inset-inline-end]',
    fixed: 'max-sm:fixed',
    absolute: 'max-sm:absolute',
    start: 'max-sm:border-e max-sm:border-(--rule)',
    end: 'max-sm:border-s max-sm:border-(--rule)',
    openStart: 'max-sm:start-0',
    openEnd: 'max-sm:end-0',
    shutStart: 'max-sm:-start-(--sidebar-w)',
    shutEnd: 'max-sm:-end-(--sidebar-w)',
  },
  md: {
    query: '(max-width: 47.99rem)',
    frame: 'max-md:inset-y-0 max-md:z-(--z-modal) max-md:w-(--sidebar-w) max-md:m-0 max-md:rounded-none max-md:border-0 max-md:transition-[inset-inline-start,inset-inline-end]',
    fixed: 'max-md:fixed',
    absolute: 'max-md:absolute',
    start: 'max-md:border-e max-md:border-(--rule)',
    end: 'max-md:border-s max-md:border-(--rule)',
    openStart: 'max-md:start-0',
    openEnd: 'max-md:end-0',
    shutStart: 'max-md:-start-(--sidebar-w)',
    shutEnd: 'max-md:-end-(--sidebar-w)',
  },
  lg: {
    query: '(max-width: 63.99rem)',
    frame: 'max-lg:inset-y-0 max-lg:z-(--z-modal) max-lg:w-(--sidebar-w) max-lg:m-0 max-lg:rounded-none max-lg:border-0 max-lg:transition-[inset-inline-start,inset-inline-end]',
    fixed: 'max-lg:fixed',
    absolute: 'max-lg:absolute',
    start: 'max-lg:border-e max-lg:border-(--rule)',
    end: 'max-lg:border-s max-lg:border-(--rule)',
    openStart: 'max-lg:start-0',
    openEnd: 'max-lg:end-0',
    shutStart: 'max-lg:-start-(--sidebar-w)',
    shutEnd: 'max-lg:-end-(--sidebar-w)',
  },
  xl: {
    query: '(max-width: 79.99rem)',
    frame: 'max-xl:inset-y-0 max-xl:z-(--z-modal) max-xl:w-(--sidebar-w) max-xl:m-0 max-xl:rounded-none max-xl:border-0 max-xl:transition-[inset-inline-start,inset-inline-end]',
    fixed: 'max-xl:fixed',
    absolute: 'max-xl:absolute',
    start: 'max-xl:border-e max-xl:border-(--rule)',
    end: 'max-xl:border-s max-xl:border-(--rule)',
    openStart: 'max-xl:start-0',
    openEnd: 'max-xl:end-0',
    shutStart: 'max-xl:-start-(--sidebar-w)',
    shutEnd: 'max-xl:-end-(--sidebar-w)',
  },
}

interface SidebarState {
  /** Whether the rail is showing — the docked column, or the open drawer. */
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
  collapsible: SidebarCollapsible
  /** True only in the state where labels are hidden and rows are icons. */
  iconOnly: boolean
  side: SidebarSide
  variant: SidebarVariant
  /**
   * True while the viewport is under the provider's breakpoint, where the rail
   * is a drawer over the page rather than a column beside it.
   */
  mobile: boolean
  /** The drawer covers its positioned ancestor rather than the window. */
  contained: boolean
  /** The step below which the rail is a drawer, or `null` for never. */
  breakpoint: SidebarBreakpoint | null
}

const SidebarContext = createContext<SidebarState | null>(null)

/**
 * What the parts read when nobody wrapped them: open, and not collapsible.
 *
 * A rail without a provider used to THROW, which is defensible for a hook a
 * consumer called by hand and wrong for the component itself — `<Sidebar>` on
 * its own is the first thing anybody writes, and the documentation site's own
 * props panel renders exactly that. A component that cannot draw without a
 * wrapper is not strict, it is unusable; so the parts fall back to the state a
 * rail with no controls would be in, and the button that would toggle it does
 * nothing because there is nothing holding the answer.
 */
const UNWRAPPED: SidebarState = {
  open: true,
  setOpen: () => {},
  toggle: () => {},
  collapsible: 'none',
  iconOnly: false,
  side: 'start',
  variant: 'flush',
  mobile: false,
  contained: false,
  breakpoint: null,
}

/** The state the parts read, wrapped or not. */
function useSidebarState(): SidebarState {
  return useContext(SidebarContext) ?? UNWRAPPED
}

/**
 * The rail's own state, for anything that has to answer to it.
 *
 * A page beside the rail needs it to reserve the right width; a control inside
 * needs to know whether its label is being drawn.
 *
 * This one THROWS outside a provider, and the parts above do not, and the
 * difference is who made the mistake. A part rendered on its own is somebody
 * writing `<Sidebar>` to see what it looks like; a call to this hook is code
 * asking for state that nothing is keeping, and returning a plausible default
 * there is a layout that is wrong in one state and right in the other with
 * nothing to say which.
 */
export function useSidebar(): SidebarState {
  const state = useContext(SidebarContext)
  if (!state) throw new Error('useSidebar must be used inside a <SidebarProvider>')
  return state
}

export interface SidebarProviderProps {
  /** Controlled open state. Leave off to let the provider own it. */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** What closing does to the rail. See {@link SidebarProps.collapsible}. */
  collapsible?: SidebarCollapsible
  /**
   * The keyboard shortcut that toggles the rail, as a single letter.
   *
   * `b`, with the platform's own modifier, because that is what every editor
   * and every application shell already uses for the same thing. Pass `null`
   * to bind nothing — an app that already owns that chord should not have it
   * taken twice, and a rail that cannot be closed does not need a shortcut for
   * closing it.
   */
  shortcut?: string | null
  /** Which edge the rail is on. Logical: `end` is the right in LTR, the left in RTL. */
  side?: SidebarSide
  /**
   * How the rail meets the page.
   *
   * `flush` is a column with a hairline down its inner edge — the rail and the
   * page are one surface divided by a line. `floating` lifts the rail off that
   * surface as its own bordered panel with the page ground showing around it.
   * `inset` is the same gesture the other way up: the rail sits on the page
   * ground and `SidebarInset` draws the CONTENT as the panel.
   *
   * `floating` and `inset` both need a ground to sit on — put `bg-(--stone)` on
   * the element holding the provider, or they are a panel on the same colour as
   * the thing behind it.
   */
  variant?: SidebarVariant
  /**
   * The step below which the rail becomes a drawer over the page.
   *
   * A rail is a column when there is a column's worth of room and an overlay
   * when there is not; below this the rail is `fixed`, covers the page from its
   * own edge, and closes onto a scrim. `null` pins it as a column at every
   * width, for a layout that is never narrow — an embedded console, a preview
   * frame.
   *
   * Named, not a number: the switch is a media query in the stylesheet, and a
   * class built from a runtime number is a class the compiler never emitted. It
   * also puts the rail on the same four steps as the page around it.
   */
  breakpoint?: SidebarBreakpoint | null
  /**
   * A `localStorage` key under which the DOCKED state is remembered.
   *
   * A reader who put the rail away did not mean "until the next page". Only the
   * docked state is kept: an open drawer is a thing a reader did to this screen,
   * and restoring it on the next visit is a page that opens with its navigation
   * over the top of itself.
   *
   * Read after mount, never during render — a value from storage in the first
   * pass is a hydration mismatch, and the markup the server sent is the one the
   * client has to agree with.
   */
  persist?: string | null
  /**
   * The drawer covers its nearest positioned ancestor rather than the window.
   *
   * For a rail inside a bounded frame — a device preview, an embedded console,
   * an example on a documentation page. `fixed` resolves against the viewport
   * wherever the markup sits, so without this the drawer inside a 400px preview
   * opens across the whole page it is previewed on. Give the frame `relative`.
   */
  contained?: boolean
  children: ReactNode
}

/**
 * Holds whether the rail is open, and binds the shortcut that changes it.
 *
 * Separate from `Sidebar` itself because the answer is needed on BOTH sides of
 * the layout: the rail draws itself from it, and the content beside the rail
 * reserves width from it. A state that lived inside the rail could only ever
 * be read downwards.
 */
export function SidebarProvider({
  open: controlled,
  defaultOpen = true,
  onOpenChange,
  collapsible = 'icon',
  shortcut = 'b',
  side = 'start',
  variant = 'flush',
  breakpoint = 'md',
  persist = null,
  contained = false,
  children,
}: SidebarProviderProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen)
  // The drawer is its own answer, not the docked column's. They are different
  // questions — "keep the rail beside the page" and "show me the rail now" —
  // and one state answering both is a phone that loads with its navigation
  // covering the page, because `defaultOpen` was written for the column.
  const [drawer, setDrawer] = useState(false)
  const [mobile, setMobile] = useState(false)

  // The same query the classes carry, asked in JavaScript for the two things a
  // class cannot answer: whether the closed rail is `inert`, and whether there
  // is a scrim. The LAYOUT is not waiting on this — see `DRAWER`.
  useEffect(() => {
    if (breakpoint === null) return
    const query = window.matchMedia(DRAWER[breakpoint].query)
    const sync = () => setMobile(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [breakpoint])

  // Crossing INTO drawer width closes it. A rail that was docked a moment ago
  // would otherwise become an overlay sitting open over the page nobody asked
  // to have covered.
  useEffect(() => {
    if (mobile) setDrawer(false)
  }, [mobile])

  useEffect(() => {
    if (!persist) return
    try {
      const stored = window.localStorage.getItem(persist)
      if (stored === 'open' || stored === 'closed') setUncontrolled(stored === 'open')
    } catch {
      // A storage-blocked context just starts at `defaultOpen` every time.
    }
  }, [persist])

  useEffect(() => {
    if (!persist) return
    try {
      window.localStorage.setItem(persist, uncontrolled ? 'open' : 'closed')
    } catch {
      // Same.
    }
  }, [persist, uncontrolled])

  const docked = controlled ?? uncontrolled
  const open = mobile ? drawer : docked

  const setOpen = useCallback(
    (next: boolean) => {
      if (mobile) setDrawer(next)
      else if (controlled === undefined) setUncontrolled(next)
      onOpenChange?.(next)
    },
    [mobile, controlled, onOpenChange],
  )

  const toggle = useCallback(() => setOpen(!open), [open, setOpen])

  useEffect(() => {
    if (!shortcut || collapsible === 'none') return
    const onKey = (event: KeyboardEvent) => {
      // `metaKey` OR `ctrlKey`, not the platform's own: a Mac keyboard on a
      // Linux browser and a PC keyboard on a Mac both exist, and a shortcut
      // that works for one of them is a shortcut with a bug report attached.
      if (event.key.toLowerCase() !== shortcut.toLowerCase()) return
      if (!event.metaKey && !event.ctrlKey) return
      event.preventDefault()
      toggle()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shortcut, collapsible, toggle])

  const value = useMemo<SidebarState>(
    () => ({
      open,
      setOpen,
      toggle,
      collapsible,
      // Never at drawer width: closed there means the rail is off the page, and
      // a column of icons is the answer for a layout that still has a column.
      iconOnly: !mobile && !open && collapsible === 'icon',
      side,
      variant,
      mobile,
      contained,
      breakpoint,
    }),
    [open, setOpen, toggle, collapsible, side, variant, mobile, contained, breakpoint],
  )

  // The tooltip provider is supplied here rather than demanded of the app. A
  // collapsed rail is rows of icons, every one of which names itself through a
  // tooltip — so without it the component does not degrade, it throws, and only
  // in the state a reader reaches by pressing the button on it. Radix scopes
  // nested providers, so an app that already has one keeps its own settings for
  // everything outside this subtree.
  return (
    <SidebarContext.Provider value={value}>
      <TooltipProvider>{children}</TooltipProvider>
    </SidebarContext.Provider>
  )
}

export interface SidebarProps extends Omit<ComponentProps<'nav'>, 'children'> {
  /**
   * Names the landmark. Required: a page with two navigations in it announces
   * two things called "navigation" unless each of them says which it is.
   */
  label: string
  /**
   * What the scrim behind the open drawer announces.
   *
   * It is a button — tapping beside a drawer closes it, and that has to be a
   * control a keyboard and a screen reader can reach, not a decorated `<div>`.
   */
  scrimLabel?: string
  children: ReactNode
}

/**
 * A navigation rail down the side of an application.
 *
 * A `<nav>`, not an `<aside>`. The element decides the landmark, and a rail of
 * links announced as "complementary" is not the one a screen reader user jumps
 * to when they go looking for the navigation.
 *
 * Composed rather than configured: a rail is a header, a scrolling middle and a
 * footer, and every product wants different things in all three. What this owns
 * is the part that is the same everywhere — the width, the edge, the scroll
 * behaviour, and what happens when it closes.
 *
 * **Closing has three shapes**, and `collapsible` on the provider picks one.
 * `icon` keeps the rail and drops the labels, which is right when the rows are
 * a fixed set a reader learns the shape of. `offcanvas` takes the whole rail
 * away, which is right when the rows are a long index nobody memorises.
 * `none` is a rail that does not close.
 *
 * The trigger belongs INSIDE the rail — `SidebarHeader` places it — rather than
 * out in an application's masthead. A control that hides a thing should live on
 * the thing: in the masthead it is one more anonymous icon in a row of them,
 * and nothing connects it to the column it operates.
 *
 * **Under the provider's `breakpoint` it is a drawer**, not a column: `fixed`
 * against its own edge, over a scrim, and `inert` while closed. Merely
 * translating it off-screen is not closed — it keeps focus and it is still read
 * aloud, so a shut drawer puts its whole index between the reader and the page
 * they were on. The scrim is a real button, because tapping beside a drawer is
 * how a drawer is closed and that gesture has to exist for a keyboard too.
 *
 * `fixed` resolves against the viewport unless an ancestor has a `transform`,
 * `filter` or `perspective`, which makes that ancestor the containing block
 * instead. Do not put one on an element wrapping the provider, or the drawer
 * opens inside it.
 *
 * @example
 * <SidebarProvider>
 *   <Sidebar label="Documentation">
 *     <SidebarHeader>Acme</SidebarHeader>
 *     <SidebarContent>
 *       <SidebarGroup label="Guide" count={2}>
 *         <SidebarItem href="/start" icon={Home}>Getting started</SidebarItem>
 *       </SidebarGroup>
 *     </SidebarContent>
 *   </Sidebar>
 * </SidebarProvider>
 */
export function Sidebar({
  label,
  scrimLabel = 'Close the navigation',
  className,
  children,
  ...rest
}: SidebarProps) {
  const { open, setOpen, collapsible, iconOnly, side, variant, mobile, contained, breakpoint } =
    useSidebarState()
  warnBlankName('Sidebar', 'label', label, 'the rail is announced as an unnamed navigation')

  const gone = !open && collapsible === 'offcanvas'
  const drawer = breakpoint === null ? null : DRAWER[breakpoint]

  return (
    <>
      {/* Only while it is actually an overlay. On a column there is nothing to
          close onto, and a full-page button over a docked rail is a page that
          cannot be clicked. */}
      {drawer && mobile && open && (
        <button
          type="button"
          aria-label={scrimLabel}
          onClick={() => setOpen(false)}
          data-folio-animated
          className={cn(
            'inset-0 z-(--z-scrim) bg-(--scrim) animate-[folio-fade-in_var(--duration-fast)_var(--ease)]',
            contained ? 'absolute' : 'fixed',
          )}
        />
      )}
      <nav
        aria-label={label}
        data-state={open ? 'open' : 'collapsed'}
        data-collapsible={collapsible}
        data-side={side}
        data-variant={variant}
        // Off-screen is not closed. Without this the drawer keeps focus and
        // keeps being read aloud while it sits beyond the edge of the page.
        // JavaScript decides it, and a frame's delay costs nothing: the
        // POSITION is CSS, so nothing has moved.
        inert={(drawer && mobile && !open) || undefined}
        // `group`, so every descendant can answer the rail's state without
        // being handed a prop through four levels of composition.
        className={cn(
          'group/sidebar flex shrink-0 flex-col overflow-hidden bg-(--paper) transition-[width] duration-(--duration-base) ease-(--ease-out-expo) motion-reduce:transition-none',
          gone ? 'w-0' : iconOnly ? 'w-(--sidebar-w-icon)' : 'w-(--sidebar-w)',
          // `inset` gives the border to `SidebarInset`, which is the panel in
          // that arrangement; the rail is the ground it sits on and draws no
          // edge of its own, or the two lines run parallel a few pixels apart.
          variant === 'floating' && 'my-2 rounded-(--radius-frame) border border-(--rule)',
          variant === 'floating' && (side === 'end' ? 'me-2' : 'ms-2'),
          variant === 'flush' &&
            !gone &&
            (side === 'end' ? 'border-s border-(--rule)' : 'border-e border-(--rule)'),
          // The drawer, below the step. Everything above is the column; these
          // override it inside one media query, so the first paint is already
          // right and no effect has to run for the page to be the right width.
          drawer && [
            drawer.frame,
            contained ? drawer.absolute : drawer.fixed,
            side === 'end' ? drawer.end : drawer.start,
            side === 'end'
              ? open
                ? drawer.openEnd
                : drawer.shutEnd
              : open
                ? drawer.openStart
                : drawer.shutStart,
          ],
          className,
        )}
        {...rest}
      >
        {/* The inner column is the full width at every state, so the rows
            inside do not reflow while the rail animates — they are clipped by
            the rail instead, which is what makes the motion read as a panel
            sliding rather than as a column of text reflowing under a wipe. */}
        <div className={cn('flex h-full flex-col', gone ? 'w-(--sidebar-w)' : 'w-full')}>
          {children}
        </div>
      </nav>
    </>
  )
}

/**
 * The page beside the rail.
 *
 * Every layout built on this component was writing the same
 * `flex min-w-0 flex-1 flex-col` by hand, and `min-w-0` is the half everybody
 * forgets: a flex child's floor is its content, so one wide table inside pushes
 * the whole page past the viewport and takes the rail's width with it.
 *
 * It is also the other half of `variant="inset"`. There the rail is the ground
 * and this is the panel — a bordered `--paper` surface with the ground showing
 * around it — which is why the variant lives on the provider rather than on
 * either piece: one setting, two components, and no way to set half of it.
 *
 * A `<div>`, not a `<main>`. What goes in here is usually a masthead AND the
 * page under it, and only one of those is the main landmark.
 */
export function SidebarInset({ className, children, ...rest }: ComponentProps<'div'>) {
  const { variant } = useSidebarState()

  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 flex-col',
        variant === 'inset' &&
          'my-2 me-2 overflow-hidden rounded-(--radius-frame) border border-(--rule) bg-(--paper) ms-0',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * The block at the top of the rail: a brand, a workspace, a switcher.
 *
 * It is also where `SidebarTrigger` belongs, and the layout assumes one:
 * anything passed as `children` takes the space and the trigger sits at the
 * inline end of the row.
 *
 * `--bar-h` is the floor, not a number of its own. This block and the masthead
 * beside it meet at a corner, and their two bottom rules are read as one line —
 * so a floor typed here is a floor that has to be retyped there, and the two
 * were 56px and 64px for exactly that reason. The token also survives a rail
 * that pins its own density: `--bar-h` is declared on the root, so its
 * `var(--control-h-md)` resolves there and inherits as one answer, which is
 * what keeps a compact rail's head level with a comfortable page's bar.
 */
export function SidebarHeader({ className, children, ...rest }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex min-h-(--bar-h) shrink-0 items-center gap-2 border-b border-(--rule) px-3',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/** The scrolling middle. Everything that is a list of places goes here. */
export function SidebarContent({ className, children, ...rest }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-2 scroll-slim', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * The block at the bottom: the utilities, the account, the thing a rail ends on.
 *
 * A separate landmark from the content above it because it is a separate kind
 * of thing — a reader scanning the index does not want Trash and Help in it.
 */
export function SidebarFooter({ className, children, ...rest }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex shrink-0 flex-col gap-1 border-t border-(--rule) p-2', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

/** A rule between blocks of rows, inset to the rail's own padding. */
export function SidebarSeparator({ className, ...rest }: ComponentProps<'hr'>) {
  return <hr className={cn('my-1 border-0 border-t border-(--rule)', className)} {...rest} />
}

export interface SidebarTriggerProps extends ComponentProps<'button'> {
  /** What the button announces. Both states, because it says both things. */
  labels?: { open: string; close: string }
}

/**
 * The control that opens and closes the rail.
 *
 * Its accessible name changes with what it will DO, and `aria-expanded` reports
 * what is true now — a button permanently called "Toggle sidebar" tells a
 * screen reader user nothing about which way it will go.
 */
export function SidebarTrigger({
  labels = { open: 'Open the sidebar', close: 'Close the sidebar' },
  className,
  onClick,
  ...rest
}: SidebarTriggerProps) {
  const { open, toggle, side } = useSidebarState()
  // The glyph points at the edge the rail is on, so the button is a picture of
  // what it will do rather than a picture of somebody else's layout.
  const Icon =
    side === 'end' ? (open ? RiMenuUnfold3Line : RiMenuFold3Line) : open ? RiMenuFoldLine : RiMenuUnfoldLine

  return (
    <button
      type="button"
      aria-label={open ? labels.close : labels.open}
      aria-expanded={open}
      onClick={(event) => {
        toggle()
        onClick?.(event)
      }}
      className={cn(
        'grid size-8 shrink-0 place-items-center rounded-(--radius) text-(--ink-3-aa) transition-colors duration-(--duration-fast) hover:bg-(--stone) hover:text-(--ink)',
        className,
      )}
      {...rest}
    >
      <Icon size={16} aria-hidden />
    </button>
  )
}

export interface SidebarGroupProps {
  /** The heading over the rows. */
  label: string
  /** How many rows are inside, printed on the far side of the heading. */
  count?: number
  /**
   * A mark that belongs to the GROUP — "Beta", "3 new".
   *
   * Beside the label, not out at the end with the count: it qualifies the
   * words, and a qualifier that has drifted to the other side of the row reads
   * as a second, unrelated fact.
   */
  badge?: ReactNode
  /**
   * A control on the heading row — a menu, an "add" button.
   *
   * Sits between the label and the count, and is NOT rendered inside the
   * heading's own button: a control nested in a control is one the keyboard
   * reaches by pressing the thing it is inside.
   */
  action?: ReactNode
  /** Whether the group folds at all. A group of two rows usually should not. */
  collapsible?: boolean
  defaultOpen?: boolean
  children: ReactNode
  className?: string
}

/**
 * A labelled block of rows, optionally foldable.
 *
 * The heading is the same SIZE as the rows beneath it and outranks them by
 * weight and by ink. Both halves of that are corrections. Smaller, it inverted
 * the hierarchy it exists to express — a group read as a footnote over a list
 * rather than as a title over its own contents. In the MONO face, which is
 * where it went next, ten of them stacked in a column read as a terminal
 * listing: mono is this system's voice for code, metadata and figures, and a
 * navigation heading is none of those. Rank belongs to weight and to a step up
 * the ink ladder, which are the two signals that can outrank a row without
 * changing what kind of thing it is.
 *
 * An open group draws a hairline down its rows. Fifty rows under seven headings
 * have nothing in them saying which heading any given row belongs to — only the
 * distance to the last one, which is gone the moment the list is scrolled.
 *
 * The whole block hides when the rail is collapsed to icons: a heading with no
 * room for its own word is two or three letters and a number, and the rows are
 * still there underneath as icons.
 */
export function SidebarGroup({
  label,
  count,
  badge,
  action,
  collapsible = true,
  defaultOpen = true,
  children,
  className,
}: SidebarGroupProps) {
  const { iconOnly } = useSidebarState()
  const [open, setOpen] = useState(defaultOpen)
  const labelId = useId()

  const rows = <div className="group/rows flex flex-col gap-0.5">{children}</div>

  if (iconOnly) {
    // No heading, and no rule: both of them are words and an indent, and there
    // is room for neither. The rows keep their own group semantics from the
    // label, which is still announced even though it is not drawn.
    return (
      <div role="group" aria-label={label} className={cn('group/rows flex flex-col gap-0.5', className)}>
        {children}
      </div>
    )
  }

  const heading = (
    <>
      <span className="truncate text-sm font-medium text-(--ink)">{label}</span>
      {badge}
      {count !== undefined && (
        <span className="ms-auto text-xs tabular-nums text-(--ink-3-aa)">{count}</span>
      )}
    </>
  )

  if (!collapsible) {
    return (
      <div role="group" aria-labelledby={labelId} className={cn('flex flex-col gap-1', className)}>
        <div className="flex min-h-8 items-center gap-1.5 px-2 py-1" id={labelId}>
          {heading}
          {action}
        </div>
        <div className="ms-[0.9rem] flex flex-col gap-0.5 border-s border-(--rule) ps-2">{rows}</div>
      </div>
    )
  }

  return (
    // Radix rather than `{open && …}`: a conditional render cannot animate — the
    // rows are simply not there on the next frame — and Radix publishes the
    // measured height, so the panel opens to what it actually is rather than to
    // a guessed maximum.
    <Collapsible open={open} onOpenChange={setOpen} className={cn('flex flex-col gap-1', className)}>
      <div className="flex min-h-9 items-center gap-1.5">
        <CollapsibleTrigger className="group/heading flex min-h-8 flex-1 items-center gap-1.5 rounded-(--radius-sm) px-2 py-1 text-start transition-colors duration-(--duration-fast) hover:bg-(--stone)">
          <RiArrowRightSLine
            size={12}
            aria-hidden
            className="shrink-0 text-(--ink-3-aa) transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-data-[state=open]/heading:rotate-90 motion-reduce:transition-none"
          />
          {heading}
        </CollapsibleTrigger>
        {action}
      </div>
      <CollapsibleContent>
        <div className="ms-[0.9rem] flex flex-col gap-0.5 border-s border-(--rule) ps-2">{rows}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}

/**
 * One filled row at a time, and it follows the pointer.
 *
 * A rail draws the current page filled and fills a row under the pointer, and
 * those are two different facts wearing the same paint — so a reader with the
 * mouse in the list sees two rows claiming to be where they are. The fill is
 * the POINTER'S while the pointer is in the list, and returns to the current
 * page when it leaves; `aria-current` never moves, so nothing about what is
 * true changes, only what is drawn.
 *
 * `not-hover` rather than an ordering trick: composed with `group-hover`, it
 * says "the list is hovered and this row is not" in one selector, which does
 * not depend on which of two equally specific rules Tailwind emitted last.
 *
 * The WEIGHT is scoped to the current row, and the other two are not, because
 * only the current row has anything to give up: it alone carries `font-medium`,
 * `bg-(--stone)` and `--ink`, and on any other row those three are no-ops. Two
 * of them stayed no-ops. `font-normal` did not — it is an absolute weight, not
 * an undo, so in a rail whose base face is lighter than 400 it made every row
 * in the list HEAVIER the moment the pointer arrived. Selecting one row
 * appeared to embolden its whole section, which is the opposite of a highlight
 * that follows the pointer.
 */
const MOVING_HIGHLIGHT =
  'group-hover/rows:not-hover:bg-transparent group-hover/rows:not-hover:text-(--ink-3-aa) group-hover/rows:not-hover:aria-[current=page]:font-normal'

export interface SidebarBranchProps {
  /** The row's own words, and the name of the group it opens. */
  label: string
  /** Drawn at the start of the row, and the whole of the row when collapsed. */
  icon?: RemixiconComponentType
  /** A count or a state at the end of the row. */
  trailing?: ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
  className?: string
}

/**
 * A row that opens onto more rows.
 *
 * The thing a rail is for and the thing a flat list of groups cannot do: a
 * workspace with projects in it, a folder with documents in it, a service with
 * its environments. `SidebarGroup` is a HEADING over a set — it is not itself a
 * place, and it has no icon and no state. This is a place that contains places,
 * so it is a row like any other and it carries the same icon, trailing slot and
 * hover as its children.
 *
 * The children sit behind the same hairline a group draws, one indent further
 * in, so nesting reads as depth rather than as two unrelated lists. Two levels
 * is what the indent has room for at this width; a third is a tree, and a tree
 * in a 16rem column is a horizontal scrollbar with an outline in it.
 *
 * Collapsed to icons the row becomes its icon and the children are not drawn —
 * there is nowhere for an indent to go, and a nested icon under an unnested one
 * is two glyphs with no visible relationship.
 *
 * @example
 * <SidebarBranch label="Acme HQ" icon={Building} defaultOpen>
 *   <SidebarItem href="/hq" icon={Home}>Home</SidebarItem>
 *   <SidebarItem href="/hq/tasks" icon={CheckSquare}>My tasks</SidebarItem>
 * </SidebarBranch>
 */
export function SidebarBranch({
  label,
  icon: Icon,
  trailing,
  defaultOpen = false,
  open: controlled,
  onOpenChange,
  children,
  className,
}: SidebarBranchProps) {
  const { iconOnly, side } = useSidebarState()
  const [uncontrolled, setUncontrolled] = useState(defaultOpen)
  const open = controlled ?? uncontrolled

  const setOpen = (next: boolean) => {
    if (controlled === undefined) setUncontrolled(next)
    onOpenChange?.(next)
  }

  if (iconOnly && Icon) {
    // The row, and nothing under it. A branch collapsed to an icon is a place
    // you can still see; its contents are a level of structure the width no
    // longer has.
    return (
      <Tooltip content={label} side={side === 'end' ? 'left' : 'right'}>
        <button
          type="button"
          aria-label={label}
          className={cn(
            'flex min-h-(--control-h-sm) items-center justify-center rounded-(--radius) text-(--ink-3-aa) transition-colors duration-(--duration-fast) hover:bg-(--stone) hover:text-(--ink)',
            className,
          )}
        >
          <Icon size={18} aria-hidden />
        </button>
      </Tooltip>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={cn('flex flex-col gap-0.5', className)}>
      <CollapsibleTrigger className="group/branch flex min-h-(--control-h-sm) items-center gap-3 rounded-(--radius) px-3 py-2 text-start text-sm text-(--ink-3-aa) transition-colors duration-(--duration-fast) hover:bg-(--stone) hover:text-(--ink)">
        {Icon && <Icon size={18} aria-hidden className="shrink-0" />}
        <span className="truncate">{label}</span>
        {trailing !== undefined && <span className="ms-auto shrink-0">{trailing}</span>}
        {/* The chevron goes at the END and only when nothing else is there, so
            a row with a count does not put two marks in the same corner. */}
        {trailing === undefined && (
          <RiArrowRightSLine
            size={12}
            aria-hidden
            className="ms-auto shrink-0 transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-data-[state=open]/branch:rotate-90 motion-reduce:transition-none"
          />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="group/rows ms-[1.35rem] flex flex-col gap-0.5 border-s border-(--rule) ps-2">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export interface SidebarItemProps extends NavItemProps {
  /** A count or a state on the far side of the row. Hidden with the label. */
  trailing?: ReactNode
}

/**
 * One row.
 *
 * `NavItem` with the two things a RAIL adds: a trailing slot, and an answer for
 * the state where there is no room for words. Collapsed to icons the label is
 * removed from the layout rather than hidden with CSS — a `sr-only` label still
 * occupies the flex row's gap — and moves into a tooltip, because an icon on
 * its own is a guess for everyone and unusable for a screen reader.
 *
 * A row with no `icon` keeps its label collapsed, since hiding it would leave a
 * blank row: the icon is what makes the collapsed state legible, and a rail
 * that collapses needs one on every row.
 */
export function SidebarItem({ trailing, children, className, onClick, ...rest }: SidebarItemProps) {
  const { iconOnly, side, mobile, setOpen } = useSidebarState()

  // A drawer closes when a row in it is taken. On a phone the rail is over the
  // page, so following a link inside it and leaving it open is a reader landing
  // on a destination they cannot see — and every application that ships this
  // pattern without it has the same bug report.
  const take = (event: MouseEvent<HTMLAnchorElement>) => {
    if (mobile) setOpen(false)
    onClick?.(event)
  }

  if (iconOnly && rest.icon && !rest.asChild) {
    return (
      <Tooltip content={children} side={side === 'end' ? 'left' : 'right'}>
        <NavItem {...rest} onClick={take} className={cn('justify-center px-0', className)}>
          <span className="sr-only">{children}</span>
        </NavItem>
      </Tooltip>
    )
  }

  // `asChild` hands the row to a router's own Link, and Radix's Slot takes
  // exactly ONE child — a second one, or even the `false` an unused conditional
  // leaves behind, throws rather than renders. So a slotted row passes its
  // children straight through and puts its own trailing content inside the
  // child it was handed. NavItem's `icon` has the same constraint for the same
  // reason, and says so.
  if (rest.asChild) {
    return (
      <NavItem {...rest} onClick={take} className={cn(MOVING_HIGHLIGHT, className)}>
        {children}
      </NavItem>
    )
  }

  return (
    <NavItem {...rest} onClick={take} className={cn(MOVING_HIGHLIGHT, className)}>
      {children}
      {trailing !== undefined && <span className="ms-auto shrink-0">{trailing}</span>}
    </NavItem>
  )
}
