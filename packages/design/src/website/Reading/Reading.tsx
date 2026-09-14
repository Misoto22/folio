'use client'

import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { RiListUnordered, RiPlayFill, RiPauseFill } from '@remixicon/react'
import { Button } from '../../components/Button/Button'
import { StatusDot } from '../../components/StatusDot/StatusDot'
import { Sheet, SheetContent, SheetTrigger } from '../../components/Sheet/Sheet'
import { CodeBlock } from '../../components/CodeBlock/CodeBlock'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/Tabs/Tabs'
import { cn } from '../../lib/cn'
import { replaceSlotContent } from '../../lib/slot-content'
import type { CollectionLink } from '../Collection/Collection'

export interface ReadingMetadataItem { label: string; value: ReactNode; live?: boolean; dateTime?: string }
export interface DetailMastheadProps { backLink?: ReactNode; title: string; dek?: ReactNode; context?: ReactNode; aside?: ReactNode; actions?: ReactNode; metadata?: ReadingMetadataItem[]; width?: 'page' | 'fill' }
export function DetailMasthead({ backLink, title, dek, context, aside, actions, metadata = [], width = 'page' }: DetailMastheadProps) {
  const stacked = title.length <= 28 || typeof dek !== 'string' || dek.length > 280 || Boolean(aside)
  return <header className="folio-detail-masthead" data-width={width} data-stacked={stacked || undefined} data-display={title.length <= 16 || undefined}>
    {backLink && <div className="folio-detail-back">{backLink}</div>}{context && <p className="folio-detail-context">{context}</p>}
    <div className="folio-detail-opening" data-aside={Boolean(aside) || undefined} data-stacked={stacked || undefined}>{aside ? <div className="folio-detail-copy"><h1>{title}</h1>{dek && <p className="folio-detail-dek">{dek}</p>}</div> : <><h1>{title}</h1>{dek && <p className="folio-detail-dek">{dek}</p>}</>}{aside && <aside>{aside}</aside>}</div>
    {(metadata.length > 0 || actions) && <div className="folio-detail-metabar"><dl>{metadata.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.live && <StatusDot size="sm" pulse={false} />}{item.dateTime ? <time dateTime={item.dateTime}>{item.value}</time> : item.value}</dd></div>)}</dl>{actions && <div className="folio-detail-actions">{actions}</div>}</div>}
  </header>
}
export interface ReadingLayoutProps extends HTMLAttributes<HTMLDivElement> { outline?: ReactNode }
export function ReadingLayout({ children, outline, className, ...rest }: ReadingLayoutProps) { return <div className={cn('folio-reading-layout', className)} {...rest}><div className="folio-reading-body">{children}</div>{outline}</div> }
export interface ReadingSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> { title?: ReactNode; caption?: ReactNode; lead?: ReactNode; compact?: boolean; seamless?: boolean }
/** `seamless` lets a structured child continue directly from the section rule without drawing a second seam. */
export function ReadingSection({ title, caption, lead, compact, seamless, children, className, ...rest }: ReadingSectionProps) {
  return <section className={cn('folio-reading-section', className)} data-compact={compact || undefined} data-seamless={seamless || undefined} {...rest}>{(title || caption) && <div className="folio-reading-heading"><h2>{title}</h2>{caption && <span>{caption}</span>}</div>}{lead && <p className="folio-reading-lead">{lead}</p>}{children}</section>
}
export interface ReadingLeadProps { children: ReactNode; muted?: ReactNode; description?: ReactNode }
export function ReadingLead({ children, muted, description }: ReadingLeadProps) { return <div className="folio-reading-lede"><p>{children}{muted && <span> {muted}</span>}</p>{description && <p>{description}</p>}</div> }
export interface ReadingPagerItem { link: CollectionLink; direction: ReactNode; title: ReactNode; media?: ReactNode }
export interface RecordPagerProps { label: string; previous?: ReadingPagerItem; next?: ReadingPagerItem }
export function RecordPager({ label, previous, next }: RecordPagerProps) {
  if (!previous && !next) return null
  const cell = (item: ReadingPagerItem | undefined, direction: 'prev' | 'next') => item ? <Slot className="folio-record-pager-link" data-direction={direction}>{replaceSlotContent(item.link, <>{item.media && <span className="folio-record-pager-media">{item.media}</span>}<span><span className="folio-record-pager-direction">{item.direction}</span>{' '}<strong>{item.title}</strong></span></>)}</Slot> : <span />
  return <nav className="folio-record-pager" aria-label={label}>{cell(previous, 'prev')}{cell(next, 'next')}</nav>
}
export interface OutlineItem { id: string; label: string; level: number }
const SELF_NUMBERED = /^\s*\d+[a-z]?\s*[.)]\s+/i
export function isSelfNumbered(items: OutlineItem[]): boolean {
  if (!items.length) return false
  const top = Math.min(...items.map((item) => item.level))
  const headings = items.filter((item) => item.level === top)
  return headings.length >= 2 && headings.filter((item) => SELF_NUMBERED.test(item.label)).length * 2 > headings.length
}
export function numberToc(items: OutlineItem[]): string[] {
  const top = items.length ? Math.min(...items.map((item) => item.level)) : 0
  let major = 0; let minor = 0
  return items.map((item) => item.level <= top ? (minor = 0, String(++major)) : `${major}.${++minor}`)
}
export interface TableOfContentsProps { items: OutlineItem[]; label: string; numbering?: 'auto' | 'none'; onNavigate?: (id: string) => void; expanded?: boolean }
export function TableOfContents({ items, label, numbering = 'auto', onNavigate, expanded = false }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')
  const pinnedId = useRef<string | null>(null)
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const numbers = numberToc(items)
  const showNumbers = numbering === 'auto' && !isSelfNumbered(items)
  const top = items.length ? Math.min(...items.map((item) => item.level)) : 0
  useEffect(() => () => clearTimeout(releaseTimer.current), [])
  useEffect(() => {
    const sections = items.map((item) => document.getElementById(item.id)).filter((item): item is HTMLElement => Boolean(item))
    const first = sections[0]
    if (!first) return
    const update = () => {
      let current = first
      for (const section of sections) if (section.getBoundingClientRect().top <= window.innerHeight * .28) current = section
      if (pinnedId.current && current.id !== pinnedId.current) return
      pinnedId.current = null
      setActiveId(current.id)
    }
    window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update); update()
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [items])
  const groups: { item: OutlineItem; index: number; subs: { item: OutlineItem; index: number }[] }[] = []
  items.forEach((item, index) => { const last = groups.at(-1); if (item.level <= top || !last) groups.push({ item, index, subs: [] }); else last.subs.push({ item, index }) })
  if (!items.length) return null
  const link = (item: OutlineItem, index: number, isOpen?: boolean) => <a href={`#${item.id}`} data-toc-id={item.id} aria-current={activeId === item.id ? 'true' : undefined} aria-expanded={isOpen} onClick={(event) => {
    pinnedId.current = item.id; clearTimeout(releaseTimer.current); releaseTimer.current = setTimeout(() => { pinnedId.current = null }, 1200); setActiveId(item.id)
    if (onNavigate) { event.preventDefault(); onNavigate(item.id) }
  }}>{showNumbers && <span aria-hidden>{numbers[index]}</span>}{item.label}</a>
  return <nav className="folio-toc" aria-label={label}><div><p>{label}</p><ul>{groups.map((group) => {
    const open = expanded || group.item.id === activeId || group.subs.some(({ item }) => item.id === activeId)
    return <li key={group.item.id}>{link(group.item, group.index, group.subs.length ? open : undefined)}{group.subs.length > 0 && open && <ul>{group.subs.map(({ item, index }) => <li key={item.id}>{link(item, index)}</li>)}</ul>}</li>
  })}</ul></div></nav>
}
export interface MobileOutlineProps { items: OutlineItem[]; title: string; openLabel: string; closeLabel: string }
export function MobileOutline({ items, title, openLabel, closeLabel }: MobileOutlineProps) {
  const [open, setOpen] = useState(false)
  if (!items.length) return null
  return <Sheet open={open} onOpenChange={setOpen}><SheetTrigger asChild><Button variant="secondary" iconOnly aria-label={openLabel} className="folio-outline-trigger"><RiListUnordered size={18} aria-hidden="true" /></Button></SheetTrigger><SheetContent title={title} closeLabel={closeLabel} side="bottom" className="folio-outline-sheet" aria-describedby={undefined}><TableOfContents items={items} label={title} expanded onNavigate={(id) => {
    setOpen(false)
    requestAnimationFrame(() => { const target = document.getElementById(id); if (target) { target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); window.history.replaceState(null, '', `#${id}`) } })
  }} /></SheetContent></Sheet>
}
export function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => { const doc = document.documentElement; const max = doc.scrollHeight - doc.clientHeight; setProgress(max > 0 ? Math.min(100, Math.max(0, doc.scrollTop / max * 100)) : 0) }
    update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
  return <div className="folio-reading-progress" aria-hidden><div style={{ width: `${progress}%` }} /></div>
}
export interface AuthorPanelProps { avatar?: ReactNode; name: string; role?: ReactNode; bio?: ReactNode; links?: ReactNode }
export function AuthorPanel({ avatar, name, role, bio, links }: AuthorPanelProps) { return <aside className="folio-author-panel">{avatar && <div className="folio-author-avatar" aria-hidden>{avatar}</div>}<div><h2>{name}</h2>{role && <div className="folio-author-role">{role}</div>}{bio && <p>{bio}</p>}{links && <div className="folio-author-links">{links}</div>}</div></aside> }
export interface ReadingFigureProps { media: ReactNode; captionStart?: ReactNode; captionEnd?: ReactNode; width?: 'page' | 'fill'; ratio?: string; fit?: 'cover' | 'contain' }
/** A reading image can preserve its source framing with `fit="contain"`, rather than silently cropping it to a house ratio. */
export function ReadingFigure({ media, captionStart, captionEnd, width = 'page', ratio = '16 / 8', fit = 'cover' }: ReadingFigureProps) { return <figure className="folio-reading-figure" data-width={width} data-fit={fit}><div style={{ aspectRatio: ratio }}>{media}</div>{(captionStart || captionEnd) && <figcaption><span>{captionStart}</span><span>{captionEnd}</span></figcaption>}</figure> }
export interface MediaPlaybackProps { src: string; poster?: string; label: string; playLabel: string; pauseLabel: string; fallback: ReactNode }
export function MediaPlayback({ src, poster, label, playLabel, pauseLabel, fallback }: MediaPlaybackProps) {
  const [reduceMotion, setReduceMotion] = useState(true)
  const [playing, setPlaying] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => { if (typeof window.matchMedia !== 'function') return; const query = window.matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduceMotion(query.matches); update(); query.addEventListener('change', update); return () => query.removeEventListener('change', update) }, [])
  if (reduceMotion) return fallback
  return <div className="folio-media-playback"><video ref={ref} src={src} poster={poster} aria-label={label} autoPlay muted loop playsInline preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} /><Button type="button" variant="secondary" iconOnly aria-label={playing ? pauseLabel : playLabel} onClick={() => { if (playing) ref.current?.pause(); else void ref.current?.play().catch(() => {}) }}>{playing ? <RiPauseFill size={18} aria-hidden /> : <RiPlayFill size={18} aria-hidden />}</Button></div>
}
export interface ActionBandProps { title: ReactNode; description?: ReactNode; actions?: ReactNode; eyebrow?: ReactNode }
/** A terminal project invitation with one strong entry action and quieter supporting actions. */
export function ActionBand({ title, description, actions, eyebrow }: ActionBandProps) { return <section className="folio-action-band">{eyebrow && <span className="folio-action-band__eyebrow">{eyebrow}</span>}<div className="folio-action-band__copy"><h2>{title}</h2>{description && <p>{description}</p>}</div>{actions && <div className="folio-action-band__actions">{actions}</div>}</section> }
export interface FeaturePairsProps { items: { id?: string; label?: ReactNode; title?: ReactNode; description: ReactNode }[] }
export function FeaturePairs({ items }: FeaturePairsProps) { return <div className="folio-feature-pairs">{items.map((item, index) => <div key={item.id ?? index}>{item.label && <span>{item.label}</span>}{item.title && <h3>{item.title}</h3>}<div className="folio-feature-description">{item.description}</div></div>)}</div> }
export interface DevicePreviewProps { kind: 'browser' | 'phone'; label?: string; media: ReactNode; caption?: ReactNode }
export function DevicePreview({ kind, label, media, caption }: DevicePreviewProps) { return <figure className="folio-device-preview" data-kind={kind}><div>{kind === 'browser' && <div className="folio-browser-bar"><span aria-hidden>● ● ●</span><span>{label}</span></div>}<div className="folio-device-screen">{media}</div></div>{caption && <figcaption>{caption}</figcaption>}</figure> }
export interface PreviewPairProps { desktop: ReactNode; mobile?: ReactNode }
export function PreviewPair({ desktop, mobile }: PreviewPairProps) { return <div className="folio-preview-pair" data-mobile={Boolean(mobile) || undefined}>{desktop}{mobile}</div> }
export interface CommandTab { id: string; name: string; commands: string[]; then?: ReactNode; note?: ReactNode; link?: ReactNode }
export interface CommandTabsProps { label: string; tabs: CommandTab[]; copyLabel: string; copiedLabel: string; footer?: ReactNode }
export function CommandTabs({ label, tabs, copyLabel, copiedLabel, footer }: CommandTabsProps) {
  const first = tabs[0]
  if (!first) return null
  return <div className="folio-command-tabs"><Tabs defaultValue={first.id}><TabsList aria-label={label}>{tabs.map((tab) => <TabsTrigger value={tab.id} key={tab.id}>{tab.name}</TabsTrigger>)}</TabsList>{tabs.map((tab) => <TabsContent value={tab.id} key={tab.id}>{tab.commands.map((command) => <CodeBlock key={command} code={command} copyLabel={copyLabel} copiedLabel={copiedLabel} />)}{tab.then && <p>{tab.then}</p>}{tab.note && <p>{tab.note}</p>}{tab.link}</TabsContent>)}</Tabs>{footer && <div className="folio-command-footer">{footer}</div>}</div>
}
export interface ReadingSurfaceProps extends HTMLAttributes<HTMLDivElement> { numbered?: boolean }
export function ReadingSurface({ numbered, children, className, ...rest }: ReadingSurfaceProps) { return <div className={cn('folio-reading-surface', className)} data-folio-article data-numbered={numbered || undefined} {...rest}>{children}</div> }
export interface ReadingFormProps extends React.FormHTMLAttributes<HTMLFormElement> { inline?: boolean }
export function ReadingForm({ inline, className, ...props }: ReadingFormProps) { return <form className={cn('folio-reading-form', className)} data-inline={inline || undefined} {...props} /> }
export interface ArchitectureColumnNode { id: string; title: string; description?: string }
export interface ArchitectureColumnsProps { columns: { title: string; connected?: boolean; nodes: ArchitectureColumnNode[] }[]; foundation?: ArchitectureColumnNode[] }
export function ArchitectureColumns({ columns, foundation }: ArchitectureColumnsProps) {
  return <div className="folio-architecture-columns"><div>{columns.map((column, index) => <div key={index} data-connected={Boolean(foundation?.length && column.connected) || undefined}><h3>{column.title}</h3>{column.nodes.map((node) => <div className="folio-architecture-node" key={node.id}><strong>{node.title}</strong>{node.description && <span>{node.description}</span>}</div>)}</div>)}</div>{foundation && foundation.length > 0 && <div className="folio-architecture-foundation">{foundation.map((node) => <div key={node.id}><strong>{node.title}</strong>{node.description && <span>{node.description}</span>}</div>)}</div>}</div>
}
export interface TokenLineProps { items: { label: ReactNode; strong?: boolean; icon?: ReactNode }[]; label?: ReactNode; separator?: string }
export function TokenLine({ items, label, separator = '·' }: TokenLineProps) {
  return <div className="folio-token-line" data-flow={separator !== '·' || undefined}>
    {label && <span>{label}</span>}
    <ul role="list" aria-label={typeof label === 'string' ? label : undefined}>
      {items.map((item, index) => <li key={index}>
        {index > 0 && <span aria-hidden className="folio-token-separator">{separator}</span>}
        {item.icon && <span className="folio-token-icon" aria-hidden>{item.icon}</span>}{item.strong ? <strong>{item.label}</strong> : item.label}
      </li>)}
    </ul>
  </div>
}
export interface ContentFigureProps { children: ReactNode; caption?: ReactNode; wide?: boolean }
export function ContentFigure({ children, caption, wide }: ContentFigureProps) { return <figure className="folio-content-figure" data-wide={wide || undefined}>{children}{caption && <figcaption>{caption}</figcaption>}</figure> }
export interface ReadingPageProps extends HTMLAttributes<HTMLElement> { children: ReactNode }
export function ReadingPage({ children, className, ...props }: ReadingPageProps) { return <section className={cn('folio-reading-page', className)} {...props}>{children}</section> }
export interface CommandPiece { text: string; emphasis?: 'strong' | 'normal' | 'muted' }
export interface CommandSnippetProps { code: string; pieces?: CommandPiece[]; copyLabel: string; copiedLabel: string; className?: string }
export function CommandSnippet({ code, pieces, copyLabel, copiedLabel, className }: CommandSnippetProps) {
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  // Only use the highlighting when it describes the exact source being copied.
  const highlighted = pieces?.map((piece) => piece.text).join('') === code ? pieces : undefined
  const html = highlighted ? `<pre><code>${highlighted.map((piece) => `<span class="folio-command-${piece.emphasis ?? 'normal'}">${escape(piece.text)}</span>`).join('')}</code></pre>` : undefined
  return <div className={cn('folio-command-snippet', className)}><CodeBlock code={code} html={html} copyLabel={copyLabel} copiedLabel={copiedLabel} /></div>
}
