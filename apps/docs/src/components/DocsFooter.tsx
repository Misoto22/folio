'use client'

import Link from 'next/link'
import { BrandMark } from './BrandMark'
import { FOUNDATIONS } from '@/content/foundations'
import { SECTIONS, SECTION_ROOT, type SectionId } from '@/content/sections'
import { foundationCopy } from '@/i18n/content'
import { localePath } from '@/i18n/locales'
import { useLocale, useMessages } from '@/i18n/useLocale'
import changelog from '@/generated/changelog.json'

/** The version on the front of the changelog — the package's newest release. */
const VERSION = (changelog as { version: string }[])[0]?.version ?? ''

const REPO = 'https://github.com/Misoto22/misoto22-design'
const NPM = 'https://www.npmjs.com/package/@misoto22/design'

/**
 * The page's floor.
 *
 * There wasn't one: every page ran out of content and simply stopped, which on
 * a short page left a reader staring at half a screen of nothing with no way
 * onward and no statement of what they had been reading.
 *
 * It sits INSIDE the content column rather than under the whole grid, so the
 * sidebar runs past it to the bottom of the viewport — the rail is the page's
 * furniture and the footer is the document's end, and stacking the rail on top
 * of the footer would say the opposite.
 *
 * Everything in it is a fact the repository already holds: the four sections,
 * the four foundations, the release on the front of the changelog, the licence
 * in `package.json`. Nothing here is a second copy that can drift.
 */
export function DocsFooter() {
  const locale = useLocale()
  const t = useMessages()

  const SECTION_LABEL: Record<SectionId, string> = {
    docs: t.nav.docs,
    components: t.section.components,
    templates: t.nav.templates,
    themes: t.themes.title,
  }

  return (
    <footer className="mt-auto border-t border-(--rule-2) bg-(--paper-2)">
      {/* The measure, and the gutter around it, in the same order `main` puts
          them: padding outside, `max-w-5xl` inside. Nested the other way the
          footer sat a gutter's width inside the page's own left edge, which
          is visible the moment a heading is above it. */}
      <div className="px-5 pb-8 pt-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-8 gap-y-9 lg:grid-cols-[1.5fr_repeat(3,1fr)] lg:gap-x-10">
          {/* The link columns pair up under `lg`; the brand keeps the full width
              above them. Four groups stacked one per row turned a phone footer
              into three screens of scrolling. */}
          <div className="col-span-2 flex flex-col gap-3.5 lg:col-span-1">
            <Link
              href={localePath(locale, '/')}
              className="flex w-fit items-center gap-2.5 text-(--ink) transition-opacity duration-(--duration-fast) hover:opacity-70"
            >
              <BrandMark size={24} ground="var(--paper-2)" className="shrink-0" />
              <span className="font-heading text-[17px] leading-tight">misoto22 design</span>
            </Link>
            <p className="max-w-[38ch] text-[13.5px] leading-relaxed text-(--ink-2)">{t.footer.blurb}</p>
            {/* The site is published twice — once for people, once for a reader
                that does not render CSS. The second one is only discoverable if
                something says so out loud. */}
            <p className="mono-meta flex flex-wrap items-center gap-x-2 gap-y-1 text-(--ink-3-aa)">
              <span>{t.footer.forAgents}</span>
              <a href="/llms.txt" className="underline underline-offset-2 hover:text-(--ink)">
                llms.txt
              </a>
              <span aria-hidden>·</span>
              <a href="/llms-full.txt" className="underline underline-offset-2 hover:text-(--ink)">
                llms-full.txt
              </a>
            </p>
          </div>

          <FooterColumn title={t.nav.sections}>
            {SECTIONS.map((id) => (
              <FooterLink key={id} href={localePath(locale, SECTION_ROOT[id])}>
                {SECTION_LABEL[id]}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t.nav.foundations}>
            {FOUNDATIONS.map((page) => (
              <FooterLink key={page.slug} href={localePath(locale, `/foundations/${page.slug}/`)}>
                {foundationCopy(locale, page.slug).title ?? page.title}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t.footer.theSystem}>
            <FooterLink href={localePath(locale, '/principles/')}>{t.nav.principles}</FooterLink>
            <FooterLink href={localePath(locale, '/changelog/')}>{t.nav.changelog}</FooterLink>
            <FooterLink href={REPO} external>
              GitHub
            </FooterLink>
            <FooterLink href={NPM} external>
              npm
            </FooterLink>
          </FooterColumn>
        </div>
      </div>

      <div className="px-5 sm:px-8 lg:px-12">
        <div className="mono-meta mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-(--rule) py-4 pb-6 text-(--ink-3-aa)">
          <span>© {new Date().getFullYear()} Henry Chen · MIT</span>
          <Link
            href={localePath(locale, '/changelog/')}
            className="hover:text-(--ink)"
          >
            @misoto22/design v{VERSION}
          </Link>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <h2 className="eyebrow text-(--ink-3-aa)">{title}</h2>
      {children}
    </div>
  )
}

function FooterLink({
  href,
  external,
  children,
}: {
  href: string
  external?: boolean
  children: React.ReactNode
}) {
  const className =
    'w-fit text-[13.5px] text-(--ink-2) transition-colors duration-(--duration-fast) hover:text-(--ink) hover:underline hover:underline-offset-2'

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
