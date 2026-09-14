import { Breadcrumb, type Crumb } from '@misoto22/folio'
import type { ReactNode } from 'react'

export interface PageIntroProps {
  eyebrow?: string
  title: string
  summary?: string
  crumbs?: Crumb[]
  children?: ReactNode
}

/**
 * Every page's masthead: the trail, the kicker, the title, the one-line summary.
 *
 * One component rather than a heading written per route, so `<h1>` appears
 * exactly once per page and always at the same step of the type ladder.
 */
export function PageIntro({ eyebrow, title, summary, crumbs, children }: PageIntroProps) {
  return (
    // No bottom margin: every page that uses this sets its own gap on the
    // column, and the two stacked into a gap half a screen tall on any page
    // without a "when to reach for it" note under the rule.
    <header className="flex flex-col gap-4 border-b border-(--rule) pb-8">
      {crumbs && <Breadcrumb items={crumbs} />}
      <div className="flex flex-col gap-3">
        {eyebrow && <p className="m-0 eyebrow text-(--ink-3-aa)">{eyebrow}</p>}
        <h1 className="m-0 font-heading text-[length:var(--fs-lead)] font-normal leading-tight text-(--ink)">
          {title}
        </h1>
        {summary && (
          <p className="m-0 max-w-(--w-reading) text-[17px] leading-relaxed text-(--ink-2)">
            {summary}
          </p>
        )}
      </div>
      {children}
    </header>
  )
}

/** A section heading inside a page, one step below the title. */
export function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="m-0 scroll-mt-(--scroll-offset) font-heading text-[length:var(--fs-sub)] font-normal text-(--ink)"
    >
      {children}
    </h2>
  )
}
