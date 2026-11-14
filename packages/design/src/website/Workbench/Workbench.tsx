'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { revealOnScroll } from './reveal-on-scroll'

export interface WorkbenchSectionProps {
  /** The heading's first, ink-coloured clause. */
  title: ReactNode
  /** The muted continuation that follows the title in the same line. */
  lead?: ReactNode
  /** One accent link under the heading, such as "All projects →". */
  action?: ReactNode
  /** Heading level; sections on a page are h2. */
  level?: 2 | 3
  id?: string
  children: ReactNode
}

/** The units a section reveals: its heading, then each card or entry, else its body. */
function revealUnits(section: HTMLElement): HTMLElement[] {
  const head = section.querySelector<HTMLElement>(':scope > .folio-wb-section-head')
  const body = section.querySelector<HTMLElement>(':scope > .folio-wb-section-body')
  const items = body ? [...body.querySelectorAll<HTMLElement>(':scope > :is(.folio-wb-card-grid, .folio-wb-entries) > *')] : []
  return [head, ...(items.length ? items : [body])].filter((node): node is HTMLElement => node != null)
}


/**
 * The Workbench section: a hairline, a two-tone heading in the first four
 * columns, and the content on an eight-column subgrid beside it. Every section
 * on a Workbench page uses this one rhythm, which is what keeps them aligned.
 *
 * Below the fold its heading and each card or entry reveal on their own as
 * they scroll in — 8px over a slow step, one stagger step apart, at most four —
 * rather than the whole section at once, which on a phone spent the reveal on
 * the heading while the cards arrived already shown. Inside another reveal it
 * reveals nothing, so the two never compound.
 */
export function WorkbenchSection({ title, lead, action, level = 2, id, children }: WorkbenchSectionProps) {
  const Heading = level === 2 ? 'h2' : 'h3'
  const section = useRef<HTMLElement>(null)
  useEffect(() => {
    const node = section.current
    if (!node || node.closest('.folio-wb-reveal')) return
    return revealOnScroll(revealUnits(node))
  }, [])
  return (
      <section ref={section} className="folio-wb-section" id={id}>
        <div className="folio-wb-section-head">
          <Heading className="folio-wb-heading">
            <span>{title}</span>
            {lead && <> <span className="folio-wb-heading-lead">{lead}</span></>}
          </Heading>
          {action && <div className="folio-wb-section-action">{action}</div>}
        </div>
        <div className="folio-wb-section-body">{children}</div>
      </section>
  )
}
