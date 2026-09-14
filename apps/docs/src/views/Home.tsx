import { Badge, Button, FigureBand, StatusPill } from '@misoto22/folio'
import { RiRulerLine, RiShapesLine } from '@remixicon/react'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { HomeBand } from '@/components/HomeBand'
import { SectionHeading } from '@/components/PageIntro'
import { FOUNDATIONS } from '@/content/foundations'
import { COMPONENTS, groupedComponents } from '@/content/registry'
import STACK from '@/generated/stack.json'
import { foundationCopy, groupName, PAGE_ZH } from '@/i18n/content'
import { localePath, type Locale } from '@/i18n/locales'
import { fill, getMessages } from '@/i18n/messages'
import { BRAND_NAME } from '@/lib/brand'
import { packageVersion, radiusSteps, snippet, tokenCount, WARNING_CODES } from '@/lib/docs'

const EN = {
  eyebrow: BRAND_NAME.en,
  title: 'The White Reset',
  summary:
    'A pure-white monochrome design system for software, writing and photography. The ground is paper-white, the mark is near-black, and the only chroma left in the file is status — which is bound to state and never to brand.',
  browse: 'Browse components',
  readPrinciples: 'Read the principles',
  componentsCount: '{count} components',
  builtOn: 'Built on',
  figures: {
    components: 'Components',
    tokens: 'Tokens',
    tokensNote: 'light and dark',
    radius: 'Radius steps',
    radiusNote: 'one factor moves them all',
    shadow: 'Blurred shadows',
    shadowNote: 'depth is a hairline',
  },
  installNote:
    'Six runtime dependencies — Radix for the behaviour nobody should re-implement, cmdk for the combobox pattern, react-day-picker for the calendar, Remix Icon for icons, sonner for toasts, and clsx + tailwind-merge to resolve a class conflict in the caller’s favour. No router, no state library, no CSS-in-JS.',
  tailwindNote:
    'Take the portable token layers on their own and skip the second copy of the utilities. The mode is an attribute on <html>, so it can be written before the first paint and never flashes the wrong theme.',
} as const

export function Home({ locale }: { locale: Locale }) {
  const t = getMessages(locale)
  const copy = locale === 'zh' ? PAGE_ZH.home : EN
  const groups = groupedComponents()

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-16">
      {/* The landing page's own masthead rather than `PageIntro`, which every
          other route shares. This is the one page with nothing above it and
          nothing to navigate back to, so it takes the title step the ladder
          reserves for a page's single largest thing, and it spends the room a
          breadcrumb would have taken on the two links a first visit wants.

          The version, the component count and the stack strip are all read from
          the build rather than typed here. A landing page is the surface most
          likely to be edited last and least likely to be checked, and every
          number on this one goes stale by itself otherwise. */}
      <header className="flex flex-col gap-8 border-b border-(--rule) pb-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <p className="m-0 eyebrow text-(--ink-3-aa)">{copy.eyebrow}</p>
            <Badge tone="outline">v{packageVersion()}</Badge>
          </div>
          <h1 className="m-0 font-heading text-[length:var(--fs-title)] font-normal leading-[1.05] tracking-[-0.02em] text-(--ink)">
            {copy.title}
          </h1>
          <p className="m-0 max-w-(--w-reading) text-[17px] leading-relaxed text-(--ink-2)">
            {copy.summary}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* The icon goes INSIDE the slotted child. `asChild` hands the styles
              to the router's Link and does not inject a Button's own slots into
              it, so an icon written as a sibling would not render at all. */}
          <Button asChild>
            <Link href={localePath(locale, '/components/')}>
              <RiShapesLine size={16} aria-hidden />
              {copy.browse}
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={localePath(locale, '/principles/')}>
              <RiRulerLine size={16} aria-hidden />
              {copy.readPrinciples}
            </Link>
          </Button>
          <StatusPill>{fill(copy.componentsCount, { count: COMPONENTS.length })}</StatusPill>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <span className="eyebrow text-(--ink-3-aa)">{copy.builtOn}</span>
          {STACK.map((row) => (
            <span key={row.name} className="flex items-baseline gap-1.5">
              <span className="text-[13px] text-(--ink-2)">{row.name}</span>
              {'version' in row && (
                <span className="mono-meta text-(--ink-3-aa)">v{row.version}</span>
              )}
            </span>
          ))}
        </div>
      </header>

      <HomeBand />

      <FigureBand
        label={copy.figures.components}
        scale="sub"
        figures={[
          { id: 'components', label: copy.figures.components, value: String(COMPONENTS.length) },
          {
            id: 'tokens',
            label: copy.figures.tokens,
            value: String(tokenCount()),
            note: copy.figures.tokensNote,
          },
          {
            id: 'radius',
            label: copy.figures.radius,
            value: String(radiusSteps()),
            note: copy.figures.radiusNote,
          },
          { id: 'shadow', label: copy.figures.shadow, value: '0', note: copy.figures.shadowNote },
        ]}
      />

      <section className="flex flex-col gap-5">
        <SectionHeading id="install">{t.section.install}</SectionHeading>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
          <div className="flex flex-col gap-4">
            <CodeBlock {...snippet('install')} label="install" />
            <p className="m-0 text-sm leading-relaxed text-(--ink-3-aa)">{copy.installNote}</p>
          </div>
          <CodeBlock {...snippet('usage')} label="usage" />
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <SectionHeading id="foundations">{t.nav.foundations}</SectionHeading>
        {/* The hairlines are the container's ground showing through a 1px gap,
            which means an unfilled cell is not empty — it is a rule-coloured
            rectangle. The last card spans both columns when the count is odd,
            so the grid stays whole however many foundations there are. It was
            four for a long time and is nine now; the next one should not need
            a layout change. */}
        <div className="grid gap-px overflow-hidden rounded-(--radius-lg) border border-(--rule) bg-(--rule) sm:grid-cols-2 sm:[&>:last-child:nth-child(odd)]:col-span-2">
          {FOUNDATIONS.map((page) => {
            const zh = foundationCopy(locale, page.slug)
            return (
              <Link
                key={page.slug}
                href={localePath(locale, `/foundations/${page.slug}/`)}
                className="group flex flex-col gap-2 bg-(--paper) p-6 transition-colors duration-(--duration-fast) hover:bg-(--paper-2)"
              >
                <span className="font-heading text-[length:var(--fs-item)] text-(--ink)">
                  {zh.title ?? page.title}
                </span>
                <span className="text-[13px] leading-relaxed text-(--ink-3-aa)">
                  {zh.summary ?? page.summary}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <SectionHeading id="components">{t.section.components}</SectionHeading>
        <div className="flex flex-col divide-y divide-(--rule) border-y border-(--rule)">
          {groups.map((section) => (
            <div key={section.group} className="grid gap-4 py-6 md:grid-cols-[10rem_minmax(0,1fr)]">
              <p className="m-0 eyebrow text-(--ink-3-aa)">{groupName(locale, section.group)}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {section.entries.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={localePath(locale, `/components/${entry.slug}/`)}
                    className="text-sm text-(--ink-2) underline decoration-transparent underline-offset-4 transition-colors duration-(--duration-fast) hover:text-(--ink) hover:decoration-(--rule-2)"
                  >
                    {entry.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <SectionHeading id="tailwind">{t.section.tailwind}</SectionHeading>
        <p className="m-0 max-w-(--w-reading) text-sm leading-relaxed text-(--ink-2)">
          {copy.tailwindNote}
        </p>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2">
          <CodeBlock {...snippet('tailwind')} label="tailwind" />
          <div className="flex flex-col gap-4">
            <CodeBlock {...snippet('theme')} label="theme" />
            <CodeBlock {...snippet('override')} label="override" />
          </div>
        </div>
      </section>

      {/* Two audiences, and by now two SOURCES for the second one. The files
          under this site answer a reader that arrived at it; the package
          answers one working in a project that installed it, which is the
          commoner case and the only one that is version-locked. Listing only
          the URLs — which is all this section did until the CLI shipped —
          pointed every agent at the copy that goes stale. */}
      <section className="flex flex-col gap-5">
        <SectionHeading id="agents">{t.section.agents}</SectionHeading>
        <p className="m-0 max-w-(--w-reading) text-sm leading-relaxed text-(--ink-2)">
          {t.agents.note}
        </p>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-3">
            <h3 className="m-0 font-heading text-[length:var(--fs-item)] text-(--ink)">
              {t.agents.installedTitle}
            </h3>
            <CodeBlock {...snippet('agent')} label="agent" />
            <p className="m-0 text-sm leading-relaxed text-(--ink-3-aa)">
              {fill(t.agents.installed, { count: COMPONENTS.length })}
            </p>
            <p className="m-0 text-sm leading-relaxed text-(--ink-3-aa)">{t.agents.skill}</p>
            <p className="m-0 text-sm leading-relaxed text-(--ink-3-aa)">{t.agents.skillsAdd}</p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="m-0 font-heading text-[length:var(--fs-item)] text-(--ink)">
              {t.agents.siteTitle}
            </h3>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {[
                { href: '/llms.txt', note: t.agents.index },
                { href: '/llms-full.txt', note: t.agents.full },
                { href: '/components/button/llms.txt', note: t.agents.perComponent },
                { href: '/components/button.md', note: t.agents.markdown },
              ].map((row) => (
                <li key={row.href} className="flex flex-col gap-0.5">
                  <a
                    href={row.href}
                    className="font-mono text-[13px] text-(--ink) underline decoration-(--rule-2) underline-offset-4 hover:decoration-(--ink)"
                  >
                    {row.href}
                  </a>
                  <span className="text-[13px] text-(--ink-3-aa)">{row.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The codes are read from the package's own emitted catalog, not
            listed here. A hand-kept copy of someone else's constants is how
            this section came to be three features behind twice already. */}
        <div className="flex flex-col gap-3 border-t border-(--rule) pt-5">
          <h3 className="m-0 font-heading text-[length:var(--fs-item)] text-(--ink)">
            {t.agents.warningsTitle}
          </h3>
          <p className="m-0 max-w-(--w-reading) text-sm leading-relaxed text-(--ink-3-aa)">
            {t.agents.warnings}
          </p>
          <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0">
            {WARNING_CODES.map((code) => (
              <li key={code} className="font-mono text-[13px] text-(--ink-2)">
                {code}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
