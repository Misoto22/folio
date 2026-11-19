'use client'

import {
  Button,
  Kbd,
  Sidebar as SidebarRail,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from '@misoto22/folio'
import { RiCloseLine, RiGithubFill, RiMenuFoldLine, RiMenuLine, RiMenuUnfoldLine, RiSearchLine } from '@remixicon/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import { ThemeMenu } from './ThemeMenu'
import { BrandMark } from './BrandMark'
import { CommandPalette } from './CommandPalette'
import { DocsFooter } from './DocsFooter'
import { LocaleMenu } from './LocaleMenu'
import { Sidebar } from './Sidebar'
import { ThemeToggle } from './ThemeToggle'
import { SECTION_ICON } from '@/content/icons'
import { HAS_SIDEBAR, SECTIONS, SECTION_ROOT, sectionFor, type SectionId } from '@/content/sections'
import { localePath } from '@/i18n/locales'
import { useLocale, useMessages } from '@/i18n/useLocale'
import { BRAND_NAME } from '@/lib/brand'
import { STORAGE_KEYS } from '@/lib/storage-keys'

/**
 * The frame every page sits in: one masthead across the whole width, the
 * section's rail under it on a desktop (a drawer under `lg`), and one
 * scrolling content column.
 *
 * Not `AppShell` from the package, deliberately. `AppShell` is the admin-console
 * layout — a topbar plus a content well — and this site needs a documentation
 * layout, with its own drawer behaviour and a sidebar that owns a search field.
 * Bending one into the other would have added props to `AppShell` that exist
 * only to serve this site, which is exactly what DESIGN-ARCH-001 forbids.
 * Everything INSIDE the frame is the package's own components.
 */
/**
 * `version` is handed in by the server layout rather than imported: the module
 * that knows it also holds every example's source, and this is a client file.
 */
export function DocsShell({ children, version }: { children: ReactNode; version: string }) {
  return (
    // `1024` is `lg`, the width the rest of this file switches at; the key is
    // `STORAGE_KEYS.sidebar`, and the pre-paint script copies a value saved
    // under its legacy name forward before this mounts. `shortcut={null}`
    // because this site's chord is ⌘K.
    <SidebarProvider
      collapsible="offcanvas"
      breakpoint="lg"
      persist={STORAGE_KEYS.sidebar}
      shortcut={null}
    >
      <Frame version={version}>{children}</Frame>
    </SidebarProvider>
  )
}

function Frame({ children, version }: { children: ReactNode; version: string }) {
  const { open, setOpen, mobile } = useSidebar()
  const docked = !mobile && open
  const pathname = usePathname()
  const locale = useLocale()
  const t = useMessages()
  const section = sectionFor(pathname)
  const sidebar = HAS_SIDEBAR[section]
  // The rail's own name, and what it holds: the themes rail is a set of
  // switches, not an index of documents.
  const railLabel = section === 'themes' ? t.themes.title : t.nav.documentation
  const SECTION_LABEL: Record<SectionId, string> = {
    docs: t.nav.docs,
    components: t.section.components,
    templates: t.nav.templates,
    themes: t.themes.title,
  }

  // Close on navigation: a drawer left open over the page the reader just asked
  // for is the most common mobile-nav bug. Guarded on `mobile`, because at a
  // desktop width the same call means "undock the rail".
  useEffect(() => {
    if (mobile) setOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (!open || !mobile) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, mobile, setOpen])

  return (
    <>
      <CommandPalette />
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-(--z-toast) focus:rounded-(--radius) focus:bg-(--ink) focus:px-4 focus:py-2 focus:text-sm focus:text-(--paper)"
      >
        {t.nav.skip}
      </a>

      {/* One band across the whole width, above the rail rather than beside it.
          The brand used to live in the rail's head and move into the masthead
          when the rail was put away — one fact in two places, and the place
          changed with a toggle. It is in the masthead now, always.

          Three regions: the brand, the sections as one segmented control, and
          the tools. Every control on a coarse pointer gets 44px. */}
      <header className="sticky top-0 z-(--z-sticky) grid h-(--bar-h) grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-(--rule-2) bg-(--paper) px-3 sm:px-5 pointer-coarse:[&_a]:min-h-11 pointer-coarse:[&_button]:min-h-11">
        <div className="flex items-center gap-2">
          {sidebar && (
            <Button
              iconOnly
              size="sm"
              variant="ghost"
              className="lg:hidden"
              aria-label={t.nav.openNav}
              aria-expanded={open}
              aria-controls="docs-sidebar"
              onClick={() => setOpen(true)}
            >
              <RiMenuLine size={18} aria-hidden />
            </Button>
          )}
          {/* The rail's own toggle, beside the brand on a desktop: one control
              whose name says what it will do. */}
          {sidebar && (
            <Button
              iconOnly
              size="sm"
              variant="ghost"
              className="max-lg:hidden"
              aria-label={docked ? t.nav.collapseNav : t.nav.expandNav}
              aria-expanded={docked}
              aria-controls="docs-sidebar"
              onClick={() => setOpen(!docked)}
            >
              {docked ? <RiMenuFoldLine size={17} aria-hidden /> : <RiMenuUnfoldLine size={17} aria-hidden />}
            </Button>
          )}
          <Link
            href={localePath(locale, '/')}
            className="flex items-center gap-2.5 text-(--ink) transition-opacity duration-(--duration-fast) hover:opacity-70"
          >
            <BrandMark size={24} className="shrink-0" />
            <span className="text-[length:var(--fs-item)] leading-none font-medium tracking-tight max-sm:sr-only">
              {BRAND_NAME[locale]}
            </span>
          </Link>
          {/* Outside the link, so the link's name is the brand and nothing else. */}
          <span className="rounded-(--radius-pill) bg-(--paper-2) px-2 py-0.5 font-mono text-micro text-(--ink-2) max-md:hidden">
            v{version}
          </span>
        </div>

        {/* The four sections as one segmented control. Icon and word from
            `nav` up; the icon alone below it, named for a screen reader, so a
            phone still sees that templates and themes exist without a second
            sticky strip eating 44px under the masthead. The current tab is a
            raised capsule with its own edge — a state that does not rest on
            one step of grey. */}
        <nav
          aria-label={t.nav.sections}
          className="flex justify-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex items-center gap-0.5 rounded-(--radius-pill) bg-(--paper-2) p-1">
            {SECTIONS.map((id) => {
              const Icon = SECTION_ICON[id]
              return (
                <Link
                  key={id}
                  href={localePath(locale, SECTION_ROOT[id])}
                  aria-current={section === id ? 'page' : undefined}
                  className="flex h-9 shrink-0 items-center gap-2 rounded-(--radius-pill) border border-transparent px-3 text-sm whitespace-nowrap text-(--ink-2) transition-colors duration-(--duration-fast) hover:text-(--ink) aria-[current=page]:border-(--rule-2) aria-[current=page]:bg-(--paper) aria-[current=page]:font-medium aria-[current=page]:text-(--ink)"
                >
                  <Icon size={16} aria-hidden />
                  <span className="max-nav:sr-only">{SECTION_LABEL[id]}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          {/* A field, not a button that happens to open one: filled, with the
              icon at the start and the chord at the end, which is the shape of
              every search box this replaces. Below `sm` it is the glyph. */}
          <button
            type="button"
            onClick={() => document.dispatchEvent(new CustomEvent('folio:palette'))}
            className="flex h-9 items-center gap-2.5 rounded-(--radius-pill) bg-(--paper-2) px-3 text-sm text-(--ink-3-aa) transition-colors duration-(--duration-fast) hover:text-(--ink) max-sm:size-9 max-sm:justify-center max-sm:px-0 sm:w-56 lg:w-60"
          >
            <RiSearchLine size={16} aria-hidden />
            <span className="max-sm:sr-only sm:flex-1 sm:text-start">{t.search}</span>
            <Kbd className="max-sm:hidden">⌘K</Kbd>
          </button>
          {/* One capsule for the tools, so four icons read as a group rather
              than as four unrelated buttons trailing off the edge. */}
          <div className="flex items-center rounded-(--radius-pill) border border-(--rule-2) p-0.5">
            <Button
              iconOnly
              size="sm"
              variant="ghost"
              className="rounded-(--radius-pill) max-md:hidden"
              href="https://github.com/Misoto22/folio"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
            >
              <RiGithubFill size={17} aria-hidden />
            </Button>
            <span className="max-sm:hidden">
              <LocaleMenu />
            </span>
            <span className="max-sm:hidden">
              <ThemeMenu />
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* A flex row, not a grid with a computed track list: a collapsed rail is
          `w-0` here, so the row needs no second opinion about how wide it is. */}
      <div className="flex min-h-[calc(100svh-var(--bar-h))]">
        {sidebar && (
          <SidebarRail
            id="docs-sidebar"
            label={railLabel}
            scrimLabel={t.nav.closeNav}
            // `compact`: a dense index driven by a mouse, which is exactly the
            // trade `data-density` documents.
            data-density="compact"
            // `lg:` on all three, so none can win against the drawer's own
            // `fixed` below that width.
            className="lg:sticky lg:top-(--bar-h) lg:h-[calc(100svh-var(--bar-h))]"
          >
            {/* The drawer's own head, on a phone only: the masthead is behind
                the scrim there, so the drawer carries the brand, the two menus
                the masthead has no room for, and its own way out. */}
            <SidebarHeader className="h-(--bar-h) justify-between border-(--rule-2) px-4 lg:hidden">
              <Link
                href={localePath(locale, '/')}
                className="flex items-center gap-2.5 text-(--ink)"
              >
                <BrandMark size={22} className="shrink-0" />
                <span className="text-[length:var(--fs-item)] leading-none font-medium">{BRAND_NAME[locale]}</span>
              </Link>
              <div className="flex items-center gap-1">
                <span className="sm:hidden">
                  <LocaleMenu />
                </span>
                <span className="sm:hidden">
                  <ThemeMenu />
                </span>
                <Button
                  iconOnly
                  size="sm"
                  variant="ghost"
                  aria-label={t.nav.closeNav}
                  onClick={() => setOpen(false)}
                >
                  <RiCloseLine size={16} aria-hidden />
                </Button>
              </div>
            </SidebarHeader>
            <SidebarContent className="gap-2 p-0 px-4 pt-5 pb-6">
              <Sidebar />
            </SidebarContent>
          </SidebarRail>
        )}

        <SidebarInset>
          {/* `flex-1` on the MAIN and `mt-auto` on the footer, so a short page
              pushes the footer to the bottom of the viewport. */}
          <main id="content" className="min-w-0 flex-1 px-5 pb-16 pt-10 sm:px-8 lg:px-14">
            {children}
          </main>

          <DocsFooter />
        </SidebarInset>
      </div>
    </>
  )
}
