import type { ReactNode } from 'react'

export interface ToolStripItem {
  id: string
  /** The tool's name; it is the tile's accessible label and tooltip. */
  name: string
  /** A monochrome mark drawn in `currentColor`. */
  icon: ReactNode
}

export interface ToolStripProps {
  label: ReactNode
  items: ToolStripItem[]
}

/** A row of equal tiles, one monochrome tool mark each, under a centred caption. */
export function ToolStrip({ label, items }: ToolStripProps) {
  if (!items.length) return null
  return (
    <section className="folio-wb-tools" aria-label={typeof label === 'string' ? label : undefined}>
      <p className="folio-wb-tools-label">{label}</p>
      <ul>
        {items.map((item) => (
          <li key={item.id} title={item.name}>
            <span aria-hidden>{item.icon}</span>
            <span className="folio-wb-visually-hidden">{item.name}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
