import type { ReactNode } from 'react'

export interface WorkbenchStat {
  id: string
  value: ReactNode
  label: ReactNode
}

export interface WorkbenchHeroProps {
  /** The ink clause of the statement; it is the page's h1. */
  statement: ReactNode
  /** The muted continuation of the statement. */
  lead?: ReactNode
  /** Up to two buttons or links, primary first. */
  actions?: ReactNode
  /** Small counts beside the statement, such as projects and posts. */
  stats?: WorkbenchStat[]
  /** One captioned photograph under the statement — a `WorkbenchFigure`. */
  figure?: ReactNode
}

/** The Workbench opening: a two-tone statement, its actions, a few counts and one photograph. */
export function WorkbenchHero({ statement, lead, actions, stats = [], figure }: WorkbenchHeroProps) {
  return (
    <section className="folio-wb-hero">
      <div className="folio-wb-hero-copy">
        <h1 className="folio-wb-heading folio-wb-hero-statement">
          <span>{statement}</span>
          {lead && <> <span className="folio-wb-heading-lead">{lead}</span></>}
        </h1>
        {actions && <div className="folio-wb-hero-actions">{actions}</div>}
      </div>
      {stats.length > 0 && (
        <dl className="folio-wb-hero-stats">
          {stats.map((stat) => (
            <div key={stat.id}>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {figure && <div className="folio-wb-hero-figure">{figure}</div>}
    </section>
  )
}
