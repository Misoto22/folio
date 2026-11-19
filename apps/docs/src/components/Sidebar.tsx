'use client'

import { SidebarItem } from '@misoto22/folio'
import type { RemixiconComponentType } from '@remixicon/react'
import Link from 'next/link'
import { useId } from 'react'
import { usePathname } from 'next/navigation'
import { groupedComponents } from '@/content/registry'
import { foundationsInGroup } from '@/content/foundations'
import { TEMPLATES } from '@/content/templates'
import { sectionFor } from '@/content/sections'
import { ThemeRail } from './ThemeRail'
import { IconTile } from './IconTile'
import { FOUNDATIONS_ICON, GROUP_ICON, SECTION_ICON } from '@/content/icons'
import { componentName, foundationCopy, groupName, templateCopy } from '@/i18n/content'
import { localePath } from '@/i18n/locales'
import { useLocale, useMessages } from '@/i18n/useLocale'

/**
 * The current section's index, and only the current section's.
 *
 * It used to carry every page the site has, in one column: six "start" rows, the
 * four foundations, and seven collapsed component groups. That answered "what
 * is in this site" only for a reader willing to read all of it, and it put the
 * templates and the themes among the six rows at the top where nobody looked.
 * The masthead now names the four sections; this narrows to whichever one is
 * open, so the column has one job instead of four.
 *
 * It used to carry its own search field too. That was a second search box beside
 * ⌘K answering the same question with less reach, and two of them meant neither
 * was obviously the one to use — so the field is gone and everything it could
 * match moved into the palette (see `content/haystack.ts`).
 */
export function Sidebar() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useMessages()
  const section = sectionFor(pathname)

  // One page, so there is nothing to INDEX — but plenty to do. The rail is the
  // switch itself rather than a list of links to one destination.
  if (section === 'themes') return <ThemeRail />

  if (section === 'components') {
    return (
      <>
        {/* Every group unrolled. Rolled up, the rail was eleven chevrons and a
            reader opened them one at a time to find a name; unrolled it is a
            list the eye runs down, with a glyph per heading to land on. The
            rail scrolls in its own box, so its length costs the page nothing,
            and the group holding the open page is marked by its ink tile. */}
        {groupedComponents().map((group) => (
          <Section
            key={group.group}
            title={groupName(locale, group.group)}
            icon={GROUP_ICON[group.group]}
            count={group.entries.length}
            current={group.entries.some((entry) =>
              pathname.includes(`/components/${entry.slug}/`),
            )}
          >
            {group.entries.map((entry) => (
              <Row
                key={entry.slug}
                href={localePath(locale, `/components/${entry.slug}/`)}
                pathname={pathname}
              >
                {componentName(locale, entry.slug, entry.name)}
              </Row>
            ))}
          </Section>
        ))}
      </>
    )
  }

  if (section === 'templates') {
    return (
      <>
        <Section title={t.nav.templates} icon={SECTION_ICON.templates} count={TEMPLATES.length} current>
          {TEMPLATES.map((template) => (
            <Row
              key={template.slug}
              href={localePath(locale, `/templates/${template.slug}/`)}
              pathname={pathname}
            >
              {templateCopy(locale, template.slug).name ?? template.name}
            </Row>
          ))}
        </Section>
      </>
    )
  }

  // Built as data rather than written as JSX, so the group can be counted and
  // can know whether the page being read is inside it — the two things every
  // other rail's groups already do, and the whole of what made this one look
  // like a different component.
  //
  // "Getting started" and "Working with AI" live at /foundations/… like every
  // other page in this file: they are foundations entries carrying prose
  // instead of a token category. They belong in Guide rather than under
  // Foundations, because a reader looking for the install command is not
  // looking for a scale.
  const guide = [
    { href: localePath(locale, '/'), label: t.nav.overview },
    ...foundationsInGroup('guide').map((page) => ({
      href: localePath(locale, `/foundations/${page.slug}/`),
      label: foundationCopy(locale, page.slug).title ?? page.title,
    })),
    { href: localePath(locale, '/principles/'), label: t.nav.principles },
    { href: localePath(locale, '/changelog/'), label: t.nav.changelog },
  ]
  const foundations = foundationsInGroup('foundations').map((page) => ({
    href: localePath(locale, `/foundations/${page.slug}/`),
    label: foundationCopy(locale, page.slug).title ?? page.title,
  }))

  return (
    <>
      {[
        { title: t.nav.guide, icon: SECTION_ICON.docs, rows: guide },
        { title: t.nav.foundations, icon: FOUNDATIONS_ICON, rows: foundations },
      ].map((group) => (
        <Section
          key={group.title}
          title={group.title}
          icon={group.icon}
          count={group.rows.length}
          current={group.rows.some((row) => row.href === pathname)}
        >
          {group.rows.map((row) => (
            <Row key={row.href} href={row.href} pathname={pathname}>
              {row.label}
            </Row>
          ))}
        </Section>
      ))}
    </>
  )
}

/**
 * A group in the rail: its glyph, its name, how many rows it holds, and the
 * rows — always open.
 *
 * Not the package's `SidebarGroup`, which folds and has no place for a glyph.
 * Folding was the rail's worst habit: eleven headings with chevrons and
 * counts, and a reader had to open each to learn what was inside. The rows are
 * short enough to scan unrolled, and the glyph beside each heading is what
 * lets an eye find "Charts" without reading eleven words. The tile is ink for
 * the group holding the open page and stone for the rest — the rail's "you are
 * here" before the row itself is found.
 */
function Section({
  title,
  icon,
  count,
  current = false,
  children,
}: {
  title: string
  icon: RemixiconComponentType
  count?: number
  current?: boolean
  children: React.ReactNode
}) {
  const id = useId()
  return (
    <div role="group" aria-labelledby={id} className="flex flex-col gap-0.5 pb-4">
      <p id={id} className="m-0 flex items-center gap-2.5 px-2 pb-1 text-sm font-medium text-(--ink)">
        <IconTile icon={icon} size="sm" current={current} />
        {title}
        {count !== undefined && (
          <span className="ms-auto font-normal text-meta text-(--ink-3-aa) tabular-nums">{count}</span>
        )}
      </p>
      <div className="flex flex-col gap-0.5 ps-8">{children}</div>
    </div>
  )
}

function Row({
  href,
  pathname,
  children,
}: {
  href: string
  pathname: string
  children: React.ReactNode
}) {
  // Exact match: `/components/` must not light up while `/components/button/`
  // is open, or two rows claim to be the current page at once.
  const active = pathname === href
  return (
    // The component's own 14px, not a bump to 15. The rail was carrying one
    // size for its rows and another for its headings, which is two type scales
    // in a 16rem column — and the argument for 15 was against `font-light` at
    // 14, which this has never used.
    <SidebarItem asChild href={href} active={active}>
      <Link href={href}>
        {children}
      </Link>
    </SidebarItem>
  )
}
