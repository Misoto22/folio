import FrameLayout from './FrameLayout'
import { Slot } from '@radix-ui/react-slot'
import type { ReactElement, ReactNode } from 'react'
import { Heading } from '../../components/Heading/Heading'

export interface PortfolioProps {
  name: string
  monogram?: string
  biography: ReactNode
  facts?: ReactNode[]
  quotation?: ReactNode
  feature?: ReactNode
}
/** An introduction and a chosen photograph, with content supplied by the host. */
export function Portfolio({ name, monogram, biography, facts = [], quotation, feature }: PortfolioProps) {
  return <section className="folio-portfolio-intro" aria-label={name}><div className="folio-portfolio-intro-copy"><div className="folio-portfolio-byline">{monogram && <span aria-hidden className="folio-portfolio-monogram">{monogram}</span>}<Heading level={1}>{name}</Heading></div><div className="folio-portfolio-biography">{biography}</div><div className="folio-portfolio-facts">{facts.map((fact, index) => <div key={index}>{fact}</div>)}</div>{quotation && <blockquote>{quotation}</blockquote>}</div>{feature && <div className="folio-portfolio-feature">{feature}</div>}</section>
}

export interface PortfolioImageProps {
  children: ReactElement
  title?: ReactNode
  metadata?: ReactNode
  index?: string
  size?: 'feature' | 'tile' | 'thumbnail'
  /** Preserve the supplied image's intrinsic dimensions instead of cropping. */
  natural?: boolean
}
export function PortfolioImage({ children, title, metadata, index, size = 'tile', natural = false }: PortfolioImageProps) {
  return <figure className="folio-portfolio-image" data-size={size} data-natural={natural || undefined}><Slot className="folio-portfolio-image-frame">{children}</Slot>{(title || metadata) && <figcaption>{index && <span aria-hidden>{index}</span>}<span>{title}</span>{metadata && <small>{metadata}</small>}</figcaption>}</figure>
}

export interface PortfolioRecordProps {
  title: ReactNode
  description?: ReactNode
  context?: ReactNode
  image?: ReactNode
  action?: ReactNode
  metadata?: ReactNode
}
export function PortfolioRecord({ title, description, context, image, action, metadata }: PortfolioRecordProps) {
  return <article className="folio-portfolio-record" data-has-image={!!image || undefined}>{image}<div>{context && <div className="folio-portfolio-record-context">{context}</div>}<Heading level={2} size="sub">{title}</Heading>{description && <p className="folio-portfolio-record-description">{description}</p>}{(action || metadata) && <div className="folio-portfolio-record-meta">{action}{metadata && <span>{metadata}</span>}</div>}</div></article>
}

export interface PortfolioListProps {
  children: ReactNode
  variant?: 'records' | 'frames' | 'thumbnails'
  label?: string
}
export function PortfolioList({ children, variant = 'records', label }: PortfolioListProps) {
  return <div className="folio-portfolio-list" data-variant={variant}>{label && <h2>{label}</h2>}{variant === 'frames' ? <FrameLayout>{children}</FrameLayout> : <div>{children}</div>}</div>
}

export interface PortfolioCategoriesProps {
  label: string
  items: { id: string; label: ReactNode; count: number }[]
}
export function PortfolioCategories({ label, items }: PortfolioCategoriesProps) {
  if (!items.length) return null
  return <section className="folio-portfolio-categories" aria-label={label}><h2>{label}</h2><dl>{items.map(item => <div key={item.id}><dt>{item.label}</dt><dd>{item.count}</dd></div>)}</dl></section>
}
