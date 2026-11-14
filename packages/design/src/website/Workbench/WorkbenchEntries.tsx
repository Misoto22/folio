import type { ReactNode } from 'react'

export interface WorkbenchEntry {
  id: string
  /** The title, usually a link. */
  title: ReactNode
  excerpt?: ReactNode
  /** A short date such as "Jun 25". */
  date?: ReactNode
  /** Category and reading time. */
  meta?: ReactNode
  /**
   * The post's cover, usually an image that fills its box. Drawn only on the
   * featured tile, above the title, which then sits a step lower; the stacked
   * entries beside it stay text.
   */
  cover?: ReactNode
}

export interface WorkbenchEntriesProps {
  /** Shown as a typographic notebook tile; the rest list beside it. */
  featured?: WorkbenchEntry
  entries: WorkbenchEntry[]
}

/** A featured entry set as a tile, with the next few entries stacked beside it. */
export function WorkbenchEntries({ featured, entries }: WorkbenchEntriesProps) {
  return (
    <div className="folio-wb-entries" data-has-featured={featured ? true : undefined}>
      {featured && (
        <article className="folio-wb-entry-featured" data-has-cover={featured.cover ? true : undefined}>
          {featured.cover && <div className="folio-wb-entry-cover">{featured.cover}</div>}
          <h3>{featured.title}</h3>
          {featured.excerpt && <p>{featured.excerpt}</p>}
          <p className="folio-wb-entry-meta">
            {featured.meta}
            {featured.meta && featured.date && ' · '}
            {featured.date}
          </p>
        </article>
      )}
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            <article className="folio-wb-entry">
              {entry.date && <p className="folio-wb-entry-date">{entry.date}</p>}
              <h3>{entry.title}</h3>
              {entry.excerpt && <p className="folio-wb-entry-excerpt">{entry.excerpt}</p>}
              {entry.meta && <p className="folio-wb-entry-meta">{entry.meta}</p>}
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}
