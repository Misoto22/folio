import type { ReactNode } from 'react'

export interface WorkbenchCardProps {
  /** A cover image, or a `WorkbenchTile` when there is no picture. */
  cover: ReactNode
  /** The title, usually a link; the whole card becomes its hit area. */
  title: ReactNode
  description?: ReactNode
  meta?: ReactNode
}

/**
 * An image-led record. The title's link is stretched over the card, so the
 * card is one target without nesting interactive elements.
 */
export function WorkbenchCard({ cover, title, description, meta }: WorkbenchCardProps) {
  return (
    <article className="folio-wb-card">
      <div className="folio-wb-card-cover">{cover}</div>
      <h3 className="folio-wb-card-title">{title}</h3>
      {description && <p className="folio-wb-card-description">{description}</p>}
      {meta && <p className="folio-wb-card-meta">{meta}</p>}
    </article>
  )
}

export interface WorkbenchCardGridProps {
  children: ReactNode
}

/** Two cards per row on the content subgrid, one on a phone. */
export function WorkbenchCardGrid({ children }: WorkbenchCardGridProps) {
  return <div className="folio-wb-card-grid">{children}</div>
}

export interface WorkbenchTileProps {
  /** Large word set on the tile, such as a product name. */
  label: ReactNode
}

/** A typographic stand-in cover: ink ground, a fine grid, one word. */
export function WorkbenchTile({ label }: WorkbenchTileProps) {
  return (
    <div className="folio-wb-tile">
      <span>{label}</span>
    </div>
  )
}
