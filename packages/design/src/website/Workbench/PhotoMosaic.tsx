import type { ReactNode } from 'react'

export interface PhotoMosaicProps {
  /** Exactly the photographs to show: the first is the large one, the next four fill a 2×2 beside it. */
  children: ReactNode[]
  /** Caption under the large photograph. */
  caption?: ReactNode
}

/** One large photograph beside a 2×2 of smaller ones, all on the content subgrid. */
export function PhotoMosaic({ children, caption }: PhotoMosaicProps) {
  const [lead, ...rest] = children
  return (
    <div className="folio-wb-mosaic">
      <figure className="folio-wb-mosaic-lead">
        <div className="folio-wb-mosaic-frame">{lead}</div>
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
      {rest.slice(0, 4).map((child, index) => (
        <div key={index} className="folio-wb-mosaic-frame">
          {child}
        </div>
      ))}
    </div>
  )
}
