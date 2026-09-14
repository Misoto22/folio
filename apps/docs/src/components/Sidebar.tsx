'use client'

import {
  SidebarGroup,
  SidebarItem,
} from '@misoto22/design'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { groupedComponents } from '@/content/registry'
import { foundationsInGroup } from '@/content/foundations'
import { TEMPLATES } from '@/content/templates'
import { sectionFor } from '@/content/sections'
import { ThemeRail } from './ThemeRail'
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
        {/* The group holding the page you are on opens itself. Everything else
            stays rolled up until asked for: forty-nine rows under seven headings
            is a column taller than most screens, and a reader looking at Button
            has no use for the other forty-eight being permanently unrolled. */}
        {groupedComponents().map((group) => (
          <Section
            key={group.group}
            title={groupName(locale, group.group)}
            count={group.entries.length}
            defaultOpen={group.entries.some((entry) =>
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
        <Section title={t.nav.templates} count={TEMPLATES.length} defaultOpen>
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
        { title: t.nav.guide, rows: guide },
        { title: t.nav.foundations, rows: foundations },
      ].map((group) => (
        <Section
          key={group.title}
          title={group.title}
          count={group.rows.length}
          defaultOpen={group.rows.some((row) => row.href === pathname)}
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
 * A group in the rail.
 *
 * A thin pass to the package's own `SidebarGroup`: this site was carrying its
 * own heading, chevron, count and indent rule, which is how three rails that
 * render the same component ended up looking like three components. What is
 * left here is the one thing the package cannot know — whether the page being
 * read is inside this group.
 */
function Section({
  title,
  count,
  defaultOpen = false,
  children,
}: {
  title: string
  count?: number
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  return (
    <SidebarGroup label={title} count={count} defaultOpen={defaultOpen}>
      {children}
    </SidebarGroup>
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
