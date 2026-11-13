import { Slot } from '@radix-ui/react-slot'
import type { ReactElement, ReactNode } from 'react'

export interface WorkbenchFigureProps {
  /** The image element (or a host image component); it fills the frame. */
  children: ReactElement
  /** Caption start: the photograph's title. */
  title?: ReactNode
  /** Caption end: place and year, right-aligned. */
  meta?: ReactNode
  /** Frame proportion. */
  ratio?: 'wide' | 'landscape' | 'portrait' | 'panorama'
}

/**
 * A photograph shown as a photograph: its own proportion, an 8px corner, and a
 * caption line beneath — never a backdrop for something else.
 */
export function WorkbenchFigure({ children, title, meta, ratio = 'landscape' }: WorkbenchFigureProps) {
  return (
    <figure className="folio-wb-figure" data-ratio={ratio}>
      <Slot className="folio-wb-figure-frame">{children}</Slot>
      {(title || meta) && (
        <figcaption>
          {title && <span>{title}</span>}
          {meta && <span className="folio-wb-figure-meta">{meta}</span>}
        </figcaption>
      )}
    </figure>
  )
}
