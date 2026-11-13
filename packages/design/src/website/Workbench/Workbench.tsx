import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

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

/**
 * The Workbench section: a hairline, a two-tone heading in the first four
 * columns, and the content on an eight-column subgrid beside it. Every section
 * on a Workbench page uses this one rhythm, which is what keeps them aligned.
 */
export function WorkbenchSection({ title, lead, action, level = 2, id, children }: WorkbenchSectionProps) {
  const Heading = level === 2 ? 'h2' : 'h3'
  return (
    <Reveal>
      <section className="folio-wb-section" id={id}>
        <div className="folio-wb-section-head">
          <Heading className="folio-wb-heading">
            <span>{title}</span>
            {lead && <> <span className="folio-wb-heading-lead">{lead}</span></>}
          </Heading>
          {action && <div className="folio-wb-section-action">{action}</div>}
        </div>
        <div className="folio-wb-section-body">{children}</div>
      </section>
    </Reveal>
  )
}
