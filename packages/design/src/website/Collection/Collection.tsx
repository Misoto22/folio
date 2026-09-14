'use client'

import { useEffect, useRef, type ComponentProps, type ElementType, type HTMLAttributes, type ReactElement, type ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { RiArrowRightUpLine, RiCloseLine, RiSearchLine } from '@remixicon/react'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import { cn } from '../../lib/cn'
import { replaceSlotContent } from '../../lib/slot-content'

/** An element supplied by a host router. The composition owns its children and appearance. */
export type CollectionLink = ReactElement<{ children?: ReactNode }>

export interface ContentBandProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  tone?: 'base' | 'muted' | 'feature'
  bleed?: boolean
  spacing?: 'none' | 'content' | 'section'
}
export function ContentBand({ as: Component = 'section', tone = 'base', bleed = false, spacing = 'none', className, children, ...rest }: ContentBandProps) {
  return <Component className={cn('folio-content-band', className)} data-tone={tone} data-bleed={bleed || undefined} data-spacing={spacing} {...rest}>{bleed ? children : <div className="folio-collection-frame">{children}</div>}</Component>
}
export interface CollectionIntroProps {
  title: ReactNode
  description?: ReactNode
  context?: ReactNode
  media?: ReactNode
  actions?: ReactNode
  compact?: boolean
}
export function CollectionIntro({ title, description, context, media, actions, compact = false }: CollectionIntroProps) {
  return <header className="folio-collection-intro" data-compact={compact || undefined}>
    <div>{context != null && <div className="folio-collection-context">{context}</div>}<h1>{title}</h1>{description && <p>{description}</p>}{actions && <div className="folio-collection-actions">{actions}</div>}</div>
    {media && <div className="folio-collection-intro-media">{media}</div>}
  </header>
}
export interface CollectionMetadataItem { id?: string; label: ReactNode; value: ReactNode }
export interface CollectionMetadataProps { items: CollectionMetadataItem[] }
export function CollectionMetadata({ items }: CollectionMetadataProps) {
  if (!items.length) return null
  return <dl className="folio-collection-metadata">{items.map((item, index) => <div key={item.id ?? index}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
}
export interface CollectionGroupProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> { title?: ReactNode; caption?: ReactNode; headingId?: string; compact?: boolean }
export function CollectionGroup({ title, caption, headingId, compact, children, className, ...rest }: CollectionGroupProps) {
  return <section className={cn('folio-collection-group', className)} data-compact={compact || undefined} {...rest}>
    {(title || caption) && <div className="folio-collection-group-heading"><h2 id={headingId}>{title}</h2>{caption && <span>{caption}</span>}</div>}{children}
  </section>
}
export interface CollectionFilter { value: string | null; label: string; count?: number }
export interface CollectionSearchProps { value: string; onChange: (value: string) => void; label: string; placeholder?: string; clearLabel: string; focusShortcut?: boolean }
export function CollectionSearch({ value, onChange, label, placeholder, clearLabel, focusShortcut = false }: CollectionSearchProps) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!focusShortcut) return
    const onKey = (event: KeyboardEvent) => {
      const target = event.target
      const typing = target instanceof HTMLElement && (target.matches('input,textarea,select') || target.isContentEditable)
      if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) { event.preventDefault(); ref.current?.focus() }
      if (event.key === 'Escape' && document.activeElement === ref.current) { onChange(''); ref.current?.blur() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focusShortcut, onChange])
  return <div className="folio-collection-search"><RiSearchLine aria-hidden="true" size={15} /><Input ref={ref} aria-label={label} type="search" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />{value && <Button type="button" variant="ghost" iconOnly aria-label={clearLabel} onClick={() => onChange('')}><RiCloseLine size={15} aria-hidden="true" /></Button>}</div>
}
export interface CollectionControlsProps { items: CollectionFilter[]; selected: string | null; onSelect: (value: string | null) => void; filterLabel?: string; search?: CollectionSearchProps; quiet?: boolean; showCounts?: boolean }
export function CollectionControls({ items, selected, onSelect, filterLabel, search, quiet, showCounts = true }: CollectionControlsProps) {
  return <div className="folio-collection-controls" data-quiet={quiet || undefined}>
    {items.length > 0 && <div className="folio-collection-filters" role="group" aria-label={filterLabel}>{filterLabel && <span className="folio-collection-context">{filterLabel}</span>}{items.map((item) => <Button key={item.value ?? '__all'} type="button" variant={item.value === selected ? 'secondary' : 'ghost'} aria-pressed={item.value === selected} onClick={() => onSelect(item.value)}>{item.label}{showCounts && item.count !== undefined && <span aria-hidden className="folio-collection-count">{item.count}</span>}</Button>)}</div>}
    {search && <CollectionSearch {...search} />}
  </div>
}
export interface HighlightedTextProps { text: string; query: string; className?: string }
export function HighlightedText({ text, query, className }: HighlightedTextProps) {
  const needle = query.trim()
  if (!needle) return <span className={className}>{text}</span>
  const parts = text.split(new RegExp(`(${needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'))
  return <span className={className}>{parts.map((part, index) => index % 2 ? <mark className="folio-collection-highlight" key={index}>{part}</mark> : part)}</span>
}
export interface RecordRowProps {
  link?: CollectionLink
  title: ReactNode
  summary?: ReactNode
  context?: ReactNode
  media?: ReactNode
  index?: ReactNode
  metadata?: ReactNode
  trailing?: ReactNode
  subtitle?: ReactNode
  headingLevel?: 2 | 3
  variant?: 'editorial' | 'media' | 'compact'
}
export function RecordRow({ link, title, summary, context, media, index, metadata, trailing, subtitle, headingLevel = 2, variant = 'editorial' }: RecordRowProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  const body = <>{index != null && <span className="folio-record-index" aria-hidden>{index}</span>}{variant !== 'compact' && <div className="folio-record-media" data-empty={!media || undefined}>{media}</div>}<div className="folio-record-copy">{context && <div className="folio-record-context">{context}</div>}<Heading>{title}</Heading>{subtitle && <div className="folio-record-subtitle">{subtitle}</div>}{summary && <p className="folio-record-summary">{summary}</p>}{metadata && <div className="folio-record-metadata">{metadata}</div>}</div>{trailing && <div className="folio-record-trailing">{trailing}</div>}</>
  return <article className="folio-record" data-variant={variant} data-indexed={index != null || undefined}>{link ? <Slot className="folio-record-link">{replaceSlotContent(link, body)}</Slot> : <div className="folio-record-link">{body}</div>}</article>
}
export interface FeaturedRecordProps { media: ReactNode; title: ReactNode; context?: ReactNode; summary?: ReactNode; action?: ReactNode }
export function FeaturedRecord({ media, title, context, summary, action }: FeaturedRecordProps) {
  return <article className="folio-featured-record"><div className="folio-featured-record-media">{media}</div><div>{context && <div className="folio-record-context">{context}</div>}<h2>{title}</h2>{summary && <p>{summary}</p>}{action && <div className="folio-collection-actions">{action}</div>}</div></article>
}
export interface CollectionEmptyProps { message: string; hint?: string; action?: ReactNode }
export function CollectionEmpty({ message, hint, action }: CollectionEmptyProps) { return <EmptyState title={message} description={hint} action={action} /> }
export interface CollectionFooterProps { children?: ReactNode; feedback?: ReactNode }
export function CollectionFooter({ children, feedback }: CollectionFooterProps) { return <div className="folio-collection-footer">{feedback && <div role="status">{feedback}</div>}<div>{children}</div></div> }
export interface TaxonomyLinksProps { children: ReactNode; label?: string }
export function TaxonomyLinks({ children, label }: TaxonomyLinksProps) { return <nav className="folio-taxonomy-links" aria-label={label}>{children}</nav> }
export interface ReferenceRowsProps { items: { id?: string; label: ReactNode; hint?: ReactNode; content: ReactNode }[] }
/** A quiet resource link for references, separate from action buttons. */
export function ReferenceLink({ children, className, ...props }: ComponentProps<'a'>) { return <a {...props} className={cn('folio-reference-link', className)}><span>{children}</span><RiArrowRightUpLine size={14} aria-hidden /></a> }
export function ReferenceRows({ items }: ReferenceRowsProps) { return <dl className="folio-reference-rows">{items.map((item, index) => <div key={item.id ?? index}><dt>{item.label}{item.hint && <p>{item.hint}</p>}</dt><dd>{item.content}</dd></div>)}</dl> }
export interface CollectionTallyProps { children: ReactNode }
export function CollectionTally({ children }: CollectionTallyProps) { return <p className="folio-collection-tally">{children}</p> }
export interface CollectionListProps extends HTMLAttributes<HTMLUListElement> { children: ReactNode }
export function CollectionList({ className, ...props }: CollectionListProps) { return <ul className={cn('folio-collection-list', className)} {...props} /> }
