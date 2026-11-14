'use client'

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ComponentProps, type ElementType, type HTMLAttributes, type ReactElement, type ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Search, Tag, X } from '../../icons'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import { Kbd } from '../../components/Kbd/Kbd'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '../../components/Popover/Popover'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../../components/Sheet/Sheet'
import { useSelectionIndicator } from '../../lib/useSelectionIndicator'
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
export interface CollectionSearchProps {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder?: string
  clearLabel: string
  focusShortcut?: boolean
  /**
   * Names the button the field folds to on a phone. With it the search is a
   * 44px icon at the end of the row until asked for, then runs across the row;
   * clearing closes it and returns focus to the icon. Without it the field is
   * open at every width.
   */
  openLabel?: string
}

const PHONE = '(max-width: 640px)'
const subscribePhone = (onChange: () => void) => {
  const query = window.matchMedia?.(PHONE)
  query?.addEventListener('change', onChange)
  return () => query?.removeEventListener('change', onChange)
}
const readPhone = () => window.matchMedia?.(PHONE).matches ?? false
const readPhoneOnServer = () => false

/** Whether the viewport is phone-sized, read where the stylesheet folds the controls. */
function usePhone() {
  return useSyncExternalStore(subscribePhone, readPhone, readPhoneOnServer)
}

export function CollectionSearch({ value, onChange, label, placeholder, clearLabel, focusShortcut = false, openLabel }: CollectionSearchProps) {
  const ref = useRef<HTMLInputElement>(null)
  const opener = useRef<HTMLButtonElement>(null)
  const inputId = useId()
  const foldable = openLabel != null
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!focusShortcut) return
    const onKey = (event: KeyboardEvent) => {
      const target = event.target
      const typing = target instanceof HTMLElement && (target.matches('input,textarea,select') || target.isContentEditable)
      if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) { event.preventDefault(); ref.current?.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focusShortcut])
  // Clearing ends the search. On a phone the field folds back to its icon and
  // the caret goes to the icon; on a desk it stays in the field.
  const clear = (fromKeyboard: boolean) => {
    onChange('')
    if (foldable && readPhone()) { setOpen(false); opener.current?.focus() }
    else if (fromKeyboard) ref.current?.blur()
    else ref.current?.focus()
  }
  return <div className="folio-collection-search" data-foldable={foldable || undefined} data-open={(foldable && open) || undefined} data-has-value={value !== '' || undefined}
    onBlur={(event) => { if (foldable && value === '' && !event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false) }}>
    <Search className="folio-collection-search__glyph" aria-hidden="true" size={16} />
    {foldable && <button ref={opener} type="button" className="folio-collection-search__open" aria-label={openLabel} aria-expanded={open} aria-controls={inputId} onClick={() => { setOpen(true); ref.current?.focus() }}><Search size={19} aria-hidden="true" /></button>}
    <Input ref={ref} id={inputId} aria-label={label} type="search" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)}
      onFocus={() => { if (foldable) setOpen(true) }}
      onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); clear(true) } }} />
    {focusShortcut && <Kbd className="folio-collection-search__key" aria-hidden="true">/</Kbd>}
    {(value !== '' || (foldable && open)) && <Button type="button" variant="ghost" iconOnly aria-label={clearLabel} className="folio-collection-search__clear" onClick={() => clear(false)}><X size={15} aria-hidden="true" /></Button>}
  </div>
}

/** One quiet line under the bar while something is applied: how many are left, and the way back. */
export interface CollectionSummaryProps {
  /** Whether a filter, a search or a facet is applied. The line folds away when not. */
  active: boolean
  /** The result, e.g. "3 of 6 projects", already localized by the host. */
  label: ReactNode
  clearLabel: string
  onClear: () => void
  /** An applied facet, e.g. a removable tag chip, between the result and the clear action. */
  applied?: ReactNode
}

function CollectionSummary({ active, label, clearLabel, onClear, applied }: CollectionSummaryProps) {
  return <div className="folio-collection-summary" data-active={active || undefined}>
    <div role="status" aria-live="polite">
      {active && <><span className="folio-collection-summary__label">{label}</span>{applied}<button type="button" className="folio-collection-summary__clear" onClick={onClear}>{clearLabel}</button></>}
    </div>
  </div>
}

export interface CollectionControlsProps {
  items: CollectionFilter[]
  selected: string | null
  onSelect: (value: string | null) => void
  /** Names the filter group for assistive tech. */
  filterLabel?: string
  search?: CollectionSearchProps
  quiet?: boolean
  showCounts?: boolean
  /** More controls between the filters and the search, such as a `CollectionFacet`. */
  tools?: ReactNode
  /** The result line under the bar, shown while something is applied. */
  summary?: CollectionSummaryProps
}

/**
 * One row of controls: the filters as a rail of pills, with an ink marker that
 * slides to the choice, then any tools, then search.
 *
 * The rail scrolls sideways on a phone instead of wrapping, with its far edge
 * faded while there is more; its height is the same at any number of filters.
 */
export function CollectionControls({ items, selected, onSelect, filterLabel, search, quiet, showCounts = true, tools, summary }: CollectionControlsProps) {
  const [rail, marker] = useSelectionIndicator<HTMLDivElement>(selected ?? '')
  const [fade, setFade] = useState<'none' | 'start' | 'end' | 'both'>('none')
  useEffect(() => {
    const node = rail.current
    if (!node) return
    const update = () => {
      // An edge counts as reached within the rail's own inline padding: snapping
      // the first pill can leave the rail a few pixels in, and fading the
      // selected pill at rest reads as a broken control.
      const slack = Number.parseFloat(getComputedStyle(node).paddingInlineStart) || 1
      const max = node.scrollWidth - node.clientWidth
      const at = Math.abs(node.scrollLeft)
      setFade(max <= slack ? 'none' : at <= slack ? 'end' : at >= max - slack ? 'start' : 'both')
    }
    update()
    node.addEventListener('scroll', update, { passive: true })
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    observer?.observe(node)
    return () => { node.removeEventListener('scroll', update); observer?.disconnect() }
  }, [rail, items.length])
  return <>
    <div className="folio-collection-controls" data-quiet={quiet || undefined}>
      {items.length > 0 && <div ref={rail} className="folio-collection-filters" role="group" aria-label={filterLabel} data-fade={fade}>
        {marker.ready && <span aria-hidden className="folio-collection-marker" data-folio-animated style={{ transform: `translateX(${marker.offset}px)`, inlineSize: marker.width }} />}
        {items.map((item) => {
          const pressed = item.value === selected
          return <button key={item.value ?? '__all'} type="button" className="folio-collection-filter" aria-pressed={pressed} data-indicator-active={pressed} onClick={() => onSelect(item.value)}>
            {item.label}{showCounts && item.count !== undefined && <>{' '}<span className="folio-collection-count">{item.count}</span></>}
          </button>
        })}
      </div>}
      {tools && <div className="folio-collection-tools">{tools}</div>}
      {search && <CollectionSearch {...search} />}
    </div>
    {summary && <CollectionSummary {...summary} />}
  </>
}

export interface CollectionFacetOption {
  value: string
  label: string
  count?: number
  /** A host router link. With it the option navigates rather than selecting in place. */
  link?: CollectionLink
}

export interface CollectionFacetProps {
  /** Names the trigger and the panel, e.g. "Tags". */
  label: string
  options: CollectionFacetOption[]
  /** The applied option, marked in the list and on the trigger. */
  selected?: string | null
  /** Called with an option's value, or `null` when the applied one is chosen again. Ignored by linked options. */
  onSelect?: (value: string | null) => void
  closeLabel: string
  /** The trigger's glyph. A tag by default. */
  icon?: ReactNode
}

/**
 * One more way to narrow a collection, behind a single button beside search:
 * a popover list on a desk, a bottom sheet of pills on a phone. Options either
 * select in place or, given a host `link`, go to that facet's own page.
 */
export function CollectionFacet({ label, options, selected = null, onSelect, closeLabel, icon }: CollectionFacetProps) {
  const phone = usePhone()
  const [open, setOpen] = useState(false)
  const Close = phone ? SheetClose : PopoverClose
  const list = <ul className="folio-collection-facet__options">
    {options.map((option) => {
      const current = option.value === selected
      const body = <><Check size={15} aria-hidden="true" className="folio-collection-facet__check" /><span>{option.label}</span>{option.count !== undefined && <>{' '}<span className="folio-collection-count">{option.count}</span></>}</>
      return <li key={option.value}>
        {option.link
          ? <Close asChild><Slot className="folio-collection-facet__option" aria-current={current ? 'page' : undefined} data-current={current || undefined}>{replaceSlotContent(option.link, body)}</Slot></Close>
          : <Close asChild><button type="button" className="folio-collection-facet__option" aria-pressed={current} data-current={current || undefined} onClick={() => onSelect?.(current ? null : option.value)}>{body}</button></Close>}
      </li>
    })}
  </ul>
  const trigger = <button type="button" className="folio-collection-facet" aria-label={label} data-active={selected != null || undefined}>
    {icon ?? <Tag size={16} aria-hidden="true" />}<span className="folio-collection-facet__label">{label}</span><ChevronDown size={14} aria-hidden="true" className="folio-collection-facet__chevron" />
  </button>
  return phone
    ? <Sheet open={open} onOpenChange={setOpen}><SheetTrigger asChild>{trigger}</SheetTrigger><SheetContent side="bottom" title={label} closeLabel={closeLabel} className="folio-collection-facet__sheet" aria-describedby={undefined}>{list}</SheetContent></Sheet>
    : <Popover open={open} onOpenChange={setOpen}><PopoverTrigger asChild>{trigger}</PopoverTrigger><PopoverContent label={label} align="end" className="folio-collection-facet__panel">{list}</PopoverContent></Popover>
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
export interface RecordArrowProps {
  /** Leaves the site: the arrow points up and out, and nudges that way on hover. */
  external?: boolean
}

/**
 * The trailing arrow a record row's link ends on, as a part the row can move.
 *
 * Put it inside `trailing` after the action's words. On hover the row nudges it
 * 2px toward where it goes — right, or up and right for a link that leaves.
 */
export function RecordArrow({ external }: RecordArrowProps) {
  return <span aria-hidden className="folio-record-arrow" data-external={external || undefined}>{external ? <ArrowUpRight size={12} /> : <ArrowRight size={12} />}</span>
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
export function ReferenceLink({ children, className, ...props }: ComponentProps<'a'>) { return <a {...props} className={cn('folio-reference-link', className)}><span>{children}</span><ArrowUpRight size={14} aria-hidden /></a> }
export function ReferenceRows({ items }: ReferenceRowsProps) { return <dl className="folio-reference-rows">{items.map((item, index) => <div key={item.id ?? index}><dt>{item.label}{item.hint && <p>{item.hint}</p>}</dt><dd>{item.content}</dd></div>)}</dl> }
export interface CollectionTallyProps { children: ReactNode }
export function CollectionTally({ children }: CollectionTallyProps) { return <p className="folio-collection-tally">{children}</p> }
export interface CollectionListProps extends HTMLAttributes<HTMLUListElement> { children: ReactNode }
export function CollectionList({ className, ...props }: CollectionListProps) { return <ul className={cn('folio-collection-list', className)} {...props} /> }
