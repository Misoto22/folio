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
} from '@misoto22/design'
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
import { HAS_SIDEBAR, SECTIONS, SECTION_ROOT, sectionFor, type SectionId } from '@/content/sections'
import { localePath } from '@/i18n/locales'
import { useLocale, useMessages } from '@/i18n/useLocale'

/**
 * The frame every page sits in: a fixed sidebar on a desktop, a drawer under
 * `lg`, and one scrolling content column.
 *
 * Not `AppShell` from the package, deliberately. `AppShell` is the admin-console
 * layout — a topbar plus a content well — and this site needs a documentation
 * layout, with its own drawer behaviour and a sidebar that owns a search field.
 * Bending one into the other would have added props to `AppShell` that exist
 * only to serve this site, which is exactly what DESIGN-ARCH-001 forbids.
 * Everything INSIDE the frame is the package's own components.
 */
export function DocsShell({ children }: { children: ReactNode }) {
  return (
    // Everything this used to keep by hand — which media query makes the rail a
    // drawer, whether a closed one is `inert`, where the docked state is
    // remembered — is the component's now. `1024` is `lg`, the width the rest
    // of this file already switches at; `m22-sidebar` is the key the shell was
    // already writing, so a reader who had put the rail away keeps it away
    // across this change. `shortcut={null}` because this site's chord is ⌘K and
    // taking a second one nobody asked for is not a refactor.
    <SidebarProvider
      collapsible="offcanvas"
      breakpoint="lg"
      persist="m22-sidebar"
      shortcut={null}
    >
      <Frame>{children}</Frame>
    </SidebarProvider>
  )
}

function Frame({ children }: { children: ReactNode }) {
  const { open, setOpen, mobile } = useSidebar()
  const docked = !mobile && open
  const pathname = usePathname()
  const locale = useLocale()
  const t = useMessages()
  const section = sectionFor(pathname)
  const sidebar = HAS_SIDEBAR[section]
  // The rail's own name. It used to be the aside's, with a second `<nav>`
  // inside it carrying a second name — two landmarks for one column. There is
  // one now, and it is called what it holds: the themes rail is a set of
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
  // desktop width the same call means "undock the rail" — one `open` answering
  // two questions, and this is the call site where the difference bites.
  useEffect(() => {
    if (mobile) setOpen(false)
    // The rail's own rows close it; this is for everything else that navigates
    // — the palette, the section strip, a link inside the page.
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
    {/* A flex row, not a grid with a computed track list. The grid had to be
        told the sidebar's width AND told to drop the track when the sidebar
        went away, in two places that could disagree — and they did: with a
        fixed first track and the aside hidden, the CONTENT landed in the 272px
        column. A collapsed rail is `w-0` here, so the row needs no second
        opinion about how wide it is. */}
    <div className="flex min-h-svh">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-(--z-toast) focus:rounded-(--radius) focus:bg-(--ink) focus:px-4 focus:py-2 focus:text-sm focus:text-(--paper)"
      >
        {t.nav.skip}
      </a>

      {sidebar && (
      <SidebarRail
        id="docs-sidebar"
        label={railLabel}
        scrimLabel={t.nav.closeNav}
        // `compact`, and it is the system's own axis rather than a number
        // invented here: this is a dense index driven by a mouse, which is
        // exactly the trade `data-density` documents. Ten groups at the
        // comfortable 44px floor is four hundred pixels of mostly nothing, and
        // a reader looking for Breadcrumb scrolls past it.
        data-density="compact"
        // `lg:` on both, so neither can win against the drawer's own `fixed`
        // below that width — a bare `sticky` here is merged as the same
        // property and takes the drawer off the page it is supposed to cover.
        className="lg:sticky lg:top-0 lg:h-svh"
      >
        {/* The same 4rem as the header beside it, and its own bottom rule, so
            the two run as one line across the page. They used to be a
            content-height block against a fixed-height bar, and the rules did
            not meet.

            4rem rather than 3.5: the lockup is two lines of type beside a
            26px mark, and at 56px that stack had no air above or below it —
            the band read as thin because it was being asked to hold more than
            it had room for. The rule under it is the EDGE weight, not the
            hairline, which is this system's own way of saying "this is a band,
            not a row". */}
        {/* The wordmark, and the control that puts this column away.
            The collapse button lives HERE, on the thing it collapses, rather
            than out in the masthead among five other icons with nothing
            connecting it to the column it operates.
            It used to be in both places depending on the state, which is how
            neither ended up findable. The rule now is one control per state and
            never two at once: this one closes the rail while the rail is on
            screen, and the masthead's own button — the same button a phone uses
            to open the drawer — brings it back once there is no rail left to
            put it in. */}
        <SidebarHeader className="h-(--bar-h) justify-between border-(--rule-2) px-4">
          <Link
            href={localePath(locale, '/')}
            className="flex items-center gap-2.5 text-(--ink) transition-opacity duration-(--duration-fast) hover:opacity-70"
          >
            <BrandMark size={26} className="shrink-0" />
            <span className="flex flex-col leading-none">
              <span className="font-heading text-[17px] leading-tight">misoto22 design</span>
              <span className="mono-meta text-(--ink-3-aa)">{t.tagline}</span>
            </span>
          </Link>
          <Button
            iconOnly
            size="sm"
            variant="ghost"
            className="lg:hidden"
            aria-label={t.nav.closeNav}
            onClick={() => setOpen(false)}
          >
            <RiCloseLine size={16} aria-hidden />
          </Button>
          {sidebar && (
            <Button
              iconOnly
              size="sm"
              variant="ghost"
              className="max-lg:hidden"
              aria-label={t.nav.collapseNav}
              aria-expanded
              aria-controls="docs-sidebar"
              onClick={() => setOpen(false)}
            >
              <RiMenuFoldLine size={16} aria-hidden />
            </Button>
          )}
        </SidebarHeader>
        {/* The four sections used to be repeated here, on the grounds that they
            live in the masthead on a desktop and had nowhere to go on a phone.
            They have somewhere to go now — the strip under the masthead — so
            the drawer is back to one job: the open section's own index, rather
            than sixteen rows of tree behind four rows of something else. */}
        <SidebarContent className="gap-2 p-0 px-4 pt-4 pb-6">
          <Sidebar />
        </SidebarContent>
      </SidebarRail>
      )}

      <SidebarInset>
        {/* `size="sm"` is 36px, which the Button docs are explicit about being
            below the pointer-target floor — a deliberate density for a mouse.
            A finger is not a mouse, so every control in this bar gets 44px on a
            coarse pointer. */}
        <header className="sticky top-0 z-(--z-sticky) flex h-(--bar-h) items-center justify-between gap-3 border-b border-(--rule-2) bg-(--paper)/85 px-5 backdrop-blur pointer-coarse:[&_a]:min-h-11 pointer-coarse:[&_button]:min-h-11">
          <Button
            iconOnly
            size="sm"
            variant="ghost"
            className="-ms-2 lg:hidden"
            aria-label={t.nav.openNav}
            aria-expanded={open}
            aria-controls="docs-sidebar"
            onClick={() => setOpen(true)}
          >
            <RiMenuLine size={18} aria-hidden />
          </Button>

          {/* The brand, wherever the sidebar's own head is not on screen.
              That is not only the phone: collapsing the sidebar on a desktop
              took the aside away with `lg:hidden`, and the site's name went
              with it — the one state where a reader could not tell what they
              were reading. The tagline is dropped here; below `sm` even the
              wordmark goes, because at 390px the bar has a hamburger and four
              controls to seat first and the mark alone still says whose site
              this is. */}
          <Link
            href={localePath(locale, '/')}
            className={`flex items-center gap-2 text-(--ink) transition-opacity duration-(--duration-fast) hover:opacity-70 ${
              sidebar && docked ? 'lg:hidden' : ''
            }`}
          >
            <BrandMark size={24} className="shrink-0" />
            <span className="font-heading text-[16px] leading-none max-sm:sr-only">
              misoto22 design
            </span>
          </Link>
          {/* Only while there is no rail to hold its own control. Shown in
              both states, this was the same action in two places at once. */}
          {sidebar && !docked && (
            <Button
              iconOnly
              size="sm"
              variant="ghost"
              className="max-lg:hidden"
              aria-label={t.nav.expandNav}
              aria-expanded={false}
              aria-controls="docs-sidebar"
              onClick={() => setOpen(true)}
            >
              <RiMenuUnfoldLine size={16} aria-hidden />
            </Button>
          )}

          {/* The four sections, in the masthead rather than as four rows among
              sixteen in the sidebar. A reader arriving on a component page had
              no way to see that templates and themes existed at all. */}
          {/* Full-height items, so the current section's underline lands ON
              the masthead's bottom rule rather than floating above it. Colour
              alone was carrying the state before, and one step of grey is not
              a state anyone can see. */}
          <nav
            aria-label={t.nav.sections}
            className="-mb-px flex h-(--bar-h) items-stretch gap-1 self-stretch max-nav:hidden"
          >
            {SECTIONS.map((id) => {
              const href = localePath(locale, SECTION_ROOT[id])
              return (
                <Link
                  key={id}
                  href={href}
                  aria-current={section === id ? 'page' : undefined}
                  className="flex items-center border-b-2 border-transparent px-3 text-sm text-(--ink-3-aa) transition-colors duration-(--duration-fast) hover:text-(--ink) aria-[current=page]:border-(--ink) aria-[current=page]:text-(--ink)"
                >
                  {SECTION_LABEL[id]}
                </Link>
              )
            })}
          </nav>

          <div className="flex-1" />
          <div className="flex items-center gap-1">
            {/* A visible way in, because a shortcut nobody is told about is a
                shortcut for the person who built it. */}
            {/* `secondary`, so it reads as the FIELD it opens rather than as a
                third ghost link in a row of ghost links. Same bordered box the
                system gives an input, at the toolbar's own height. */}
            {/* Wide enough to read as the FIELD it opens. Sized to its own
                contents it was a button with three things crammed against each
                other — narrower than the word "Search" needs, with the shortcut
                pressed onto its end — and nothing about it said a search box
                was one click away. The label takes the slack so the icon stays
                at the start and the key stays at the end, which is the shape of
                every search field this replaces. */}
            <Button
              size="sm"
              variant="secondary"
              onClick={() => document.dispatchEvent(new CustomEvent('m22:palette'))}
              className="gap-2 text-(--ink-3-aa) sm:w-56 sm:justify-start max-sm:border-transparent max-sm:px-2"
            >
              <RiSearchLine size={14} aria-hidden />
              <span className="max-sm:sr-only sm:flex-1 sm:text-start">{t.search}</span>
              <Kbd className="max-sm:hidden">⌘K</Kbd>
            </Button>
            {/* The mark, not the word. Four of the five controls beside it are
                icons, and spelling this one out made the row read as a link
                that had wandered in from the page.

                It is an import again. Remix Icon ships the brand marks lucide
                dropped, so the octocat this site carried as a hand-drawn path
                for two years is `RiGithubFill` — filled with `currentColor`,
                so it still follows the button into dark mode. */}
            <Button
              iconOnly
              size="sm"
              variant="ghost"
              href="https://github.com/Misoto22/misoto22-design"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
            >
              <RiGithubFill size={17} aria-hidden />
            </Button>
            <LocaleMenu />
            <ThemeMenu />
            <ThemeToggle />
          </div>
        </header>

        {/* The masthead's four sections, for the widths the masthead cannot
            seat them at. Below `nav` they were reachable only by opening the
            drawer — which is the exact failure the sections were lifted out of
            the sidebar to fix: a reader on a component page could not see that
            templates and themes existed at all.

            Sticky under the masthead rather than scrolling away with the page.
            It costs 44px of a phone screen, and it buys the same contract the
            desktop already has: the top-level nav is reachable from anywhere in
            a document, not only from its first screen. Scrolling it away while
            the drawer no longer carries the sections would have left the middle
            of a long page with no way across the site at all.

            It scrolls sideways in its own box when the four labels do not fit —
            English is the tight case at 390px — which is why the page itself
            still does not. */}
        <nav
          aria-label={t.nav.sections}
          className="sticky top-16 z-(--z-sticky) flex items-stretch gap-1 overflow-x-auto border-b border-(--rule) bg-(--paper)/85 px-3 backdrop-blur [scrollbar-width:none] nav:hidden [&::-webkit-scrollbar]:hidden"
        >
          {SECTIONS.map((id) => {
            const href = localePath(locale, SECTION_ROOT[id])
            return (
              <Link
                key={id}
                href={href}
                aria-current={section === id ? 'page' : undefined}
                className="flex h-11 shrink-0 items-center border-b-2 border-transparent px-3 text-sm whitespace-nowrap text-(--ink-3-aa) transition-colors duration-(--duration-fast) hover:text-(--ink) aria-[current=page]:border-(--ink) aria-[current=page]:text-(--ink)"
              >
                {SECTION_LABEL[id]}
              </Link>
            )
          })}
        </nav>

        {/* `flex-1` on the MAIN and `mt-auto` on the footer, so a short page
            pushes the footer to the bottom of the viewport instead of leaving
            it stranded halfway up. The bottom padding drops from 24 to 16:
            the footer's own top rule is the ending now, and 96px of nothing
            in front of it just reads as the same void with a line under it. */}
        <main id="content" className="min-w-0 flex-1 px-5 pb-16 pt-8 sm:px-8 lg:px-12">
          {children}
        </main>

        <DocsFooter />
      </SidebarInset>
    </div>
    </>
  )
}
