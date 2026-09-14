'use client'

import {
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandHint,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@misoto22/design'
import { RiBox3Line, RiCircleLine, RiColorFilterLine, RiContrastLine, RiDragMove2Line, RiHistoryLine, RiHome5Line, RiLayoutGridLine, RiLayoutLine, RiPaletteLine, RiRulerLine, RiScales3Line, RiText } from '@remixicon/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ACCENTS, SWATCH, useAccent } from './AccentProvider'
import { FOUNDATIONS } from '@/content/foundations'
import { COMPONENTS } from '@/content/registry'
import { SEARCH_TERMS } from '@/content/haystack'
import { componentName, foundationCopy, groupName } from '@/i18n/content'
import { localePath } from '@/i18n/locales'
import { useLocale, useMessages } from '@/i18n/useLocale'

/**
 * ⌘K, on every page.
 *
 * The site already has a sidebar filter, and this is not a duplicate of it: the
 * sidebar narrows a list you are looking at, and the palette answers "take me
 * to X" without your hands leaving the keyboard. It also carries the things
 * that are not pages — the theme, the accent — which a nav cannot.
 *
 * The list is the same registry the sidebar reads, so a new component appears
 * in both or in neither.
 *
 * Every row carries a glyph and, for a component, its group. Forty rows of bare
 * text cannot be scanned — the eye sorts by shape before it reads, and the
 * first version gave it nothing to sort.
 */

/** One icon per foundation page, keyed by slug. */
const FOUNDATION_ICON: Record<string, typeof RiPaletteLine> = {
  colour: RiPaletteLine,
  typography: RiText,
  space: RiRulerLine,
  motion: RiDragMove2Line,
}

/**
 * The website compositions under a heading of their own, and every other
 * family under one shared heading.
 *
 * Their pages are in the component catalogue like everyone else's. They are
 * looked for by the page they build rather than by the control they are, so
 * they keep their own heading here, named for the group they are in.
 */
const PRIMITIVES = COMPONENTS.filter((entry) => entry.group !== 'Website')
const WEBSITE = COMPONENTS.filter((entry) => entry.group === 'Website')

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { accent, setAccent } = useAccent()
  const locale = useLocale()
  const t = useMessages()

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'k' || !(event.metaKey || event.ctrlKey)) return
      // Claimed before the browser sees it: ⌘K is Chrome's search-bar focus,
      // and a palette that only works when the page happens to have focus in
      // the right place is a palette nobody trusts.
      //
      // In the CAPTURE phase, and that is the fix for the second palette. The
      // Command component's own example registers the same shortcut on
      // `document` to demonstrate it, so on `/components/command/` ⌘K used to
      // open two dialogs — the example's little two-row list first, and this
      // one behind it. A capture listener on `document` always runs before any
      // bubble listener on `document`, whatever order they were added in, so
      // this one marks the event handled and the example stands down.
      event.preventDefault()
      setOpen((previous) => !previous)
    }
    const onRequest = () => setOpen((previous) => !previous)
    document.addEventListener('keydown', onKey, true)
    // The header's search button asks for the palette by name rather than
    // faking a ⌘K: a synthetic KeyboardEvent is not trusted, cannot be
    // prevented meaningfully, and reached every other ⌘K listener on the page.
    document.addEventListener('m22:palette', onRequest)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      document.removeEventListener('m22:palette', onRequest)
    }
  }, [])

  const go = (href: string) => {
    setOpen(false)
    router.push(localePath(locale, href))
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen} label={t.palette.label}>
      <CommandInput placeholder={t.palette.placeholder} />
      <CommandList>
        <CommandEmpty>{t.palette.empty}</CommandEmpty>

        <CommandGroup heading={t.palette.goTo}>
          <CommandItem value="overview" icon={<RiHome5Line aria-hidden />} onSelect={() => go('/')}>
            {t.nav.overview}
          </CommandItem>
          <CommandItem value="principles" icon={<RiScales3Line aria-hidden />} onSelect={() => go('/principles/')}>
            {t.nav.principles}
          </CommandItem>
          <CommandItem
            value="components index"
            icon={<RiLayoutGridLine aria-hidden />}
            meta={String(COMPONENTS.length)}
            onSelect={() => go('/components/')}
          >
            {t.nav.allComponents}
          </CommandItem>
          <CommandItem value="templates" icon={<RiLayoutLine aria-hidden />} onSelect={() => go('/templates/')}>
            {t.nav.templates}
          </CommandItem>
          <CommandItem value="themes" icon={<RiColorFilterLine aria-hidden />} onSelect={() => go('/themes/')}>
            {t.themes.title}
          </CommandItem>
          <CommandItem value="changelog" icon={<RiHistoryLine aria-hidden />} onSelect={() => go('/changelog/')}>
            {t.nav.changelog}
          </CommandItem>
          {FOUNDATIONS.map((page) => {
            const Icon = FOUNDATION_ICON[page.slug] ?? RiBox3Line
            return (
              <CommandItem
                key={page.slug}
                // The title, and the section on the ROW rather than inside the
                // searchable value — the same rule the components list below is
                // built on, arrived at the same way. cmdk scores one string, so
                // a section word glued onto the front of a title is searched as
                // part of the title: typing "dark" took d and a out of
                // "foundations" and r and k out of "Working", and ranked
                // "Working with AI" above the theme switch this palette's own
                // empty state tells the reader to type "dark" to find. The
                // group it sat in renders before Appearance and cmdk does not
                // reorder groups, so one junk match at the top of an early
                // group is the top of the whole list.
                value={page.title}
                icon={<Icon aria-hidden />}
                meta={page.group === 'guide' ? t.nav.guide : t.nav.foundations}
                onSelect={() => go(`/foundations/${page.slug}/`)}
              >
                {foundationCopy(locale, page.slug).title ?? page.title}
              </CommandItem>
            )
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t.palette.appearance}>
          <CommandItem
            value="toggle theme light dark"
            icon={<RiContrastLine aria-hidden />}
            onSelect={() => {
              const next = document.documentElement.dataset.mode === 'dark' ? 'light' : 'dark'
              document.documentElement.dataset.mode = next
              try {
                localStorage.setItem('m22-mode', next)
              } catch {
                // A private window still toggles; it just does not remember.
              }
              setOpen(false)
            }}
          >
            {t.palette.toggleTheme}
          </CommandItem>
          {ACCENTS.map((option) => (
            <CommandItem
              key={option.id}
              value={`accent ${option.name}`}
              icon={
                <RiCircleLine
                  // The swatch IS the answer to "what does this one look like",
                  // which a row of six names cannot give. `data-accent` on the
                  // glyph itself is what makes each one paint its OWN accent:
                  // `--accent` holds only the chosen one, and the package
                  // re-derives the chain on any element that names an accent.
                  data-accent={option.id}
                  className="fill-current"
                  style={{ color: SWATCH }}
                  aria-hidden
                />
              }
              meta={accent === option.id ? t.appearance.current : undefined}
              onSelect={() => {
                setAccent(option.id)
                setOpen(false)
              }}
            >
              {t.appearance.accentTitle}: {option.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />

        {/* One group, not one per section. cmdk ranks WITHIN a group and renders
            groups in DOM order, so with a group per section an exact match on a
            late section sank below loose matches in an early one — typing
            "table" listed Tag, FigureBand and Alert above Table. The section is
            still on every row, as its meta. */}
        <CommandGroup heading={t.palette.components}>
          {PRIMITIVES.map((entry) => (
            <CommandItem
              key={entry.slug}
              // The summary is searchable but not printed: a palette that shows
              // a sentence per option stops being scannable at about six.
              value={entry.name}
              // Prop names, types, descriptions and keyboard keys, not just the
              // title — the reach the sidebar's own filter used to have, moved
              // here when that second search box was removed.
              keywords={[
                ...(SEARCH_TERMS.get(entry.slug) ?? []),
                groupName(locale, entry.group),
                // The Chinese name too, so typing 按钮 finds Button on the
                // Chinese pages — the whole point of naming it in both.
                componentName(locale, entry.slug, entry.name),
              ]}
              icon={<RiBox3Line aria-hidden />}
              // The group again on the row, because a filtered list has no
              // headings to read it from.
              meta={groupName(locale, entry.group)}
              onSelect={() => go(`/components/${entry.slug}/`)}
            >
              {componentName(locale, entry.slug, entry.name)}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={groupName(locale, 'Website')}>
          {WEBSITE.map((entry) => (
            <CommandItem
              key={entry.slug}
              value={entry.name}
              keywords={[
                ...(SEARCH_TERMS.get(entry.slug) ?? []),
                groupName(locale, entry.group),
                componentName(locale, entry.slug, entry.name),
              ]}
              icon={<RiLayoutGridLine aria-hidden />}
              meta={groupName(locale, entry.group)}
              onSelect={() => go(`/components/${entry.slug}/`)}
            >
              {componentName(locale, entry.slug, entry.name)}
            </CommandItem>
          ))}
        </CommandGroup>

      </CommandList>

      <CommandFooter>
        <CommandHint keys={['↑', '↓']}>{t.palette.navigate}</CommandHint>
        <CommandHint keys={['↵']}>{t.palette.open}</CommandHint>
        <CommandHint keys={['esc']}>{t.palette.close}</CommandHint>
      </CommandFooter>
    </CommandDialog>
  )
}

export const COMPONENT_COUNT = COMPONENTS.length
