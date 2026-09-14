'use client'

import { RiCloseLine, RiMenuLine } from '@remixicon/react'
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

/**
 * The width the sidebar stops being a drawer at — `--breakpoint-md`, the same
 * 768px every `md:` variant below is compiled against. Written out rather than
 * read from the token, because a media query string is not a custom property
 * and `matchMedia` cannot resolve one.
 */
const DESKTOP = '(min-width: 768px)'

/** True where nothing can answer the question: a server, or a DOM without it. */
function cannotMeasure(): boolean {
  return typeof window === 'undefined' || typeof window.matchMedia !== 'function'
}

function subscribeToWidth(onChange: () => void): () => void {
  if (cannotMeasure()) return () => {}
  const list = window.matchMedia(DESKTOP)
  list.addEventListener('change', onChange)
  return () => list.removeEventListener('change', onChange)
}

/**
 * Falls back to "not a drawer", which is the safe answer rather than the likely
 * one: an environment that cannot measure must not take an entire application's
 * navigation out of the accessibility tree on a guess.
 */
function readIsDrawer(): boolean {
  if (cannotMeasure()) return false
  return !window.matchMedia(DESKTOP).matches
}

function readIsDrawerOnServer(): boolean {
  return false
}

/**
 * True while the sidebar is a drawer rather than a column.
 *
 * `open` alone cannot answer this. It is false on a desktop too, where the
 * sidebar is a visible grid column — so anything keyed on `open` by itself
 * would hide the navigation of every desktop app in the package.
 *
 * `useSyncExternalStore` rather than an effect: the server has no viewport, so
 * it renders the desktop answer and React reconciles the real one on hydration
 * instead of the two silently disagreeing.
 */
function useIsDrawer(): boolean {
  return useSyncExternalStore(subscribeToWidth, readIsDrawer, readIsDrawerOnServer)
}

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /** Navigation content for the sidebar (e.g. a stack of `NavItem`s). */
  sidebar: ReactNode
  /** Optional content for the sticky topbar, laid out after the mobile toggle. */
  topbar?: ReactNode
  /** Optional brand lockup pinned to the top of the sidebar. */
  brand?: ReactNode
  /**
   * Which element the content well renders as.
   *
   * `main` is right for the shell of an application, and is the default. A
   * document may contain exactly one `main` landmark, so an AppShell rendered
   * INSIDE another page — a preview on a documentation site, a screenshot
   * harness — must pass `div`, or the page has two and assistive tech can no
   * longer answer "where is the content".
   */
  contentAs?: 'main' | 'div'
  /**
   * Names the sidebar landmark.
   *
   * Two `complementary` landmarks with the same name cannot be told apart, and
   * a shell rendered inside another page — a preview, a screenshot harness —
   * makes exactly that pair. It is also the only way a non-English app gets a
   * landmark name its readers can read.
   */
  sidebarLabel?: string
  /** Names the navigation landmark inside the sidebar. */
  navLabel?: string
  /** The drawer toggle, closed and open. */
  openLabel?: string
  closeLabel?: string
  children: ReactNode
}

/**
 * Two columns on a desktop, one column and a drawer on a phone.
 *
 * The drawer closes on Escape as well as on the scrim, because a drawer that
 * only closes by tapping outside it strands a keyboard user inside a menu they
 * cannot leave. The scrim is a `<button>` for the same reason — a `<div>` with
 * an `onClick` is not reachable by keyboard and not announced as anything.
 *
 * Below `md` the closed drawer is `inert`. Sliding it off-screen is a visual
 * state and nothing more: without that attribute every link in it stays
 * focusable and stays in the accessibility tree, so Tab from the toggle walks
 * into a menu nobody can see. Closing it also returns focus to the toggle,
 * because the element focus was on is the element that just left.
 *
 * @example
 * <AppShell brand={<Wordmark />} sidebar={<NavItem href="/">Home</NavItem>}>
 *   <Card>…</Card>
 * </AppShell>
 */
export function AppShell({
  sidebar,
  topbar,
  brand,
  contentAs: Content = 'main',
  sidebarLabel = 'Sidebar',
  navLabel = 'Primary',
  openLabel = 'Open navigation',
  closeLabel = 'Close navigation',
  children,
  className,
  ...rest
}: AppShellProps) {
  const [open, setOpen] = useState(false)
  const sidebarId = useId()
  const toggle = useRef<HTMLButtonElement>(null)
  const isDrawer = useIsDrawer()

  /**
   * Both ways out, so both return focus.
   *
   * Escape used to leave the reader standing on a link that had just slid off
   * screen; the scrim is worse, because the scrim itself is the focused element
   * and it unmounts, dropping focus to `<body>`. Either way the drawer is about
   * to become inert, and focus inside an inert subtree is focus the browser
   * throws away.
   */
  const close = useCallback(() => {
    setOpen(false)
    toggle.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  return (
    <div
      className={cn('min-h-svh bg-(--paper) md:grid md:grid-cols-[15rem_1fr]', className)}
      {...rest}
    >
      {open && (
        <button
          type="button"
          aria-label={closeLabel}
          onClick={close}
          className="fixed inset-0 z-(--z-scrim) bg-(--scrim) md:hidden"
        />
      )}

      <aside
        id={sidebarId}
        aria-label={sidebarLabel}
        // Only below `md`, and only while it is shut. Above the breakpoint this
        // element is the page's navigation column, and inert would delete it.
        inert={isDrawer && !open}
        // The transition is motion like any other, and the reduced-motion rule
        // in keyframes.css matches on this attribute.
        data-folio-animated
        className={cn(
          'fixed inset-y-0 start-0 z-(--z-modal) flex w-60 flex-col border-e border-(--rule) bg-(--paper) transition-transform duration-(--duration-slow) ease-(--ease-out-expo)',
          // The drawer slides in from the edge reading STARTS at, so in an
          // right-to-left document it comes from the right.
          open ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full',
          'md:static md:z-auto md:translate-x-0',
        )}
      >
        {brand && (
          <div className="flex h-(--bar-h) items-center border-b border-(--rule) px-5">{brand}</div>
        )}
        <nav
          aria-label={navLabel}
          className="flex flex-1 flex-col gap-1 overflow-y-auto p-3 scroll-slim"
        >
          {sidebar}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-(--z-sticky) flex h-(--bar-h) items-center gap-3 border-b border-(--rule) bg-(--paper)/85 px-(--page-pad) backdrop-blur">
          <button
            type="button"
            aria-label={open ? closeLabel : openLabel}
            aria-expanded={open}
            aria-controls={sidebarId}
            ref={toggle}
            onClick={() => setOpen((previous) => !previous)}
            className="-ms-2.5 grid size-11 place-items-center rounded-(--radius) text-(--ink-2) transition-colors duration-(--duration-fast) hover:text-(--ink) md:hidden"
          >
            {open ? <RiCloseLine size={20} aria-hidden /> : <RiMenuLine size={20} aria-hidden />}
          </button>
          {topbar}
        </header>

        <Content className="mx-auto w-full max-w-(--w-page) px-(--page-pad) py-8">{children}</Content>
      </div>
    </div>
  )
}

export default AppShell
