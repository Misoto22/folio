import { Breadcrumb, type Crumb } from '@misoto22/folio'
import type { RemixiconComponentType } from '@remixicon/react'
import type { ReactNode } from 'react'
import { IconTile } from './IconTile'
import { HEADING_ICON } from '@/content/icons'

export interface PageIntroProps {
  eyebrow?: string
  title: string
  summary?: string
  crumbs?: Crumb[]
  /** The page's own glyph, drawn as the one ink tile on the page. */
  icon?: RemixiconComponentType
  children?: ReactNode
}

/**
 * Every page's masthead: the trail, the title, the one-line summary, and
 * whatever facts the page wants pinned under it.
 *
 * One component rather than a heading written per route, so `<h1>` appears
 * exactly once per page and always at the same step.
 *
 * With an icon, the trail and the title sit beside it as one block — the tile
 * is the page's "you are here", in ink, and the only ink tile in view. The
 * eyebrow is dropped when there is a trail: it named the same group twice.
 */
export function PageIntro({ eyebrow, title, summary, crumbs, icon, children }: PageIntroProps) {
  const heading = (
    <h1 className="m-0 font-heading text-title font-medium tracking-tight text-(--ink)">{title}</h1>
  )

  return (
    <header className="flex flex-col gap-5">
      {icon ? (
        <div className="flex items-center gap-4">
          <IconTile icon={icon} size="lg" current />
          <div className="flex min-w-0 flex-col gap-1">
            {crumbs && <Breadcrumb items={crumbs} />}
            {heading}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {crumbs && <Breadcrumb items={crumbs} />}
          {!crumbs && eyebrow && <p className="m-0 eyebrow text-(--ink-3-aa)">{eyebrow}</p>}
          {heading}
        </div>
      )}
      {summary && <p className="m-0 max-w-(--w-reading) text-lede text-(--ink-2)">{summary}</p>}
      {children}
    </header>
  )
}

/**
 * A section heading inside a page, one step below the title.
 *
 * It carries the section's glyph when the site has one for that anchor — the
 * same glyph the contents rail draws beside it, so the two read as one thing.
 */
export function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  const icon = HEADING_ICON[id]
  return (
    <h2
      id={id}
      className="m-0 flex scroll-mt-(--scroll-offset) items-center gap-3 font-heading text-[length:var(--fs-heading)] font-medium tracking-tight text-(--ink)"
    >
      {icon && <IconTile icon={icon} />}
      {children}
    </h2>
  )
}
