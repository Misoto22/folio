'use client'

import { Check, X } from '../../icons'
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Button } from '../../components/Button/Button'
import { CollapsibleSection } from '../../components/Collapsible/Collapsible'
import { DescriptionList } from '../../components/DescriptionList/DescriptionList'
import type { DescriptionListItem } from '../../components/DescriptionList/DescriptionList'
import { Heading } from '../../components/Heading/Heading'
import { Progress } from '../../components/Progress/Progress'
import { StatusDot } from '../../components/StatusDot/StatusDot'
import { Text } from '../../components/Text/Text'

export type EvidenceState = 'idle' | 'running' | 'done' | 'failed' | 'restored'

export interface EvidenceStatusProps extends HTMLAttributes<HTMLElement> { state: EvidenceState }

export function EvidenceStatus({ state, children, className, ...rest }: EvidenceStatusProps) {
  return <Text size="xs" tone="muted" className={cn('folio-evidence-status', className)} data-state={state} {...rest}><StatusDot size="sm" tone={state === 'failed' ? 'danger' : state === 'done' ? 'success' : 'neutral'} pulse={state === 'running'} /><span>{children}</span></Text>
}

export interface ActivityTraceItem {
  id: string
  state: 'running' | 'done' | 'failed'
  label: ReactNode
  detail?: ReactNode
  summary?: ReactNode
}

export interface ActivityTraceProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  items: ActivityTraceItem[]
  waiting?: boolean
  waitingLabel?: string
}

/** Tool and job traces share one presentation; the caller supplies truthful, localized labels. */
export function ActivityTrace({ label, items, waiting, waitingLabel, className, ...rest }: ActivityTraceProps) {
  if (items.length === 0 && !waiting) return null
  return <div role={waiting ? 'status' : undefined} aria-live={waiting ? 'polite' : undefined} className={cn('folio-activity-trace', className)} {...rest}>
    {items.length === 0 ? <EvidenceStatus state="running">{waitingLabel}</EvidenceStatus> : <ul aria-label={label}>{items.map((item) => <li key={item.id} data-state={item.state}>
      {item.state === 'running' ? <StatusDot tone="neutral" size="sm" /> : item.state === 'done' ? <Check size={12} aria-hidden /> : <X size={12} aria-hidden />}
      <Text as="span" size="xs"><span>{item.label}</span>{item.detail && <Text as="span" size="xs" tone="muted"> {item.detail}</Text>}</Text>
      {item.summary != null && <Text as="span" size="xs" tone="muted" className="folio-activity-trace__summary">{item.summary}</Text>}
    </li>)}</ul>}
  </div>
}

export interface EvidencePanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: string
  eyebrow: ReactNode
  state: EvidenceState
  stateLabel: string
}

export function EvidencePanel({ title, eyebrow, state, stateLabel, children, className, ...rest }: EvidencePanelProps) {
  return <aside aria-label={title} className={cn('folio-evidence-panel', className)} {...rest}>
    <header><div><Text size="xs" tone="muted">{eyebrow}</Text><Heading level={2} size="sub">{title}</Heading></div><EvidenceStatus state={state}>{stateLabel}</EvidenceStatus></header>
    {children}
  </aside>
}

export interface EvidenceSelectionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  label: string
  selectedId: string | null
  options: { id: string; label: string }[]
  onSelect: (id: string) => void
}

export function EvidenceSelection({ label, selectedId, options, onSelect, className, ...rest }: EvidenceSelectionProps) {
  return <div className={cn('folio-evidence-selection', className)} {...rest}><Text size="xs" tone="muted">{label}</Text><div role="group" aria-label={label}>{options.map((option) => <Button key={option.id} variant="ghost" aria-pressed={selectedId === option.id} onClick={() => onSelect(option.id)}>{option.label}</Button>)}</div></div>
}

export interface EvidenceFactsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode
  description?: ReactNode
  items: DescriptionListItem[]
}

export function EvidenceFacts({ title, description, items, className, ...rest }: EvidenceFactsProps) {
  return <div className={cn('folio-evidence-facts', className)} {...rest}>
    {title && <Text size="xs" tone="muted">{title}</Text>}{description && <Text size="sm" className="mt-2">{description}</Text>}
    <DescriptionList items={items} layout="stacked" className={title || description ? 'mt-4' : undefined} />
  </div>
}

export interface EvidenceDisclosureProps extends HTMLAttributes<HTMLDivElement> { label: string }

export function EvidenceDisclosure({ label, children, className, ...rest }: EvidenceDisclosureProps) {
  return <CollapsibleSection title={label} role="group" aria-label={label} className={cn('folio-evidence-disclosure', className)} {...rest}>{children}</CollapsibleSection>
}

export interface EvidenceQueryProps extends HTMLAttributes<HTMLDivElement> { label: string; query: string; fingerprint: string }

export function EvidenceQuery({ label, query, fingerprint, className, ...rest }: EvidenceQueryProps) {
  return <div className={cn('folio-evidence-query', className)} {...rest}><Text as="span" size="xs" tone="muted">{label}</Text><Text as="span" size="xs" tone="strong">{query}</Text><Text as="span" size="xs" tone="muted">{fingerprint}</Text></div>
}

export function EvidenceStages({ className, ...rest }: HTMLAttributes<HTMLOListElement>) { return <ol className={cn('folio-evidence-stages', className)} {...rest} /> }

export interface EvidenceStageProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title'> {
  number: string
  state: 'idle' | 'active' | 'done'
  stateLabel: string
  title: ReactNode
  description: ReactNode
  time: ReactNode
}

export function EvidenceStage({ number, state, stateLabel, title, description, time, children, className, ...rest }: EvidenceStageProps) {
  return <li className={cn('folio-evidence-stage', className)} data-state={state} {...rest}>
    <Text as="span" size="xs" tone="muted" aria-hidden>{number}</Text>
    <div><div className="folio-evidence-stage__header"><Text as="span" size="sm" tone="strong">{title}</Text><EvidenceStatus state={state === 'active' ? 'running' : state}>{stateLabel}</EvidenceStatus></div>
      <div className="folio-evidence-stage__description"><Text as="span" size="xs" tone="muted">{description}</Text><Text as="span" size="xs" tone="muted">{time}</Text></div>{children}
    </div>
  </li>
}

export interface EvidenceScore {
  id: string
  label: string
  value: number
  valueText: string
  /** The numeral the answer cites this passage by. Its presence marks the row as cited: ink rather than muted, numeral in the accent. */
  citation?: ReactNode
}

export interface EvidenceScoresProps extends HTMLAttributes<HTMLDivElement> { items: EvidenceScore[] }

/** Similarity per retrieved passage. Rows arrive one stagger step apart; cited ones carry their numeral. */
export function EvidenceScores({ items, className, ...rest }: EvidenceScoresProps) {
  return <div className={cn('folio-evidence-scores', className)} {...rest}>{items.map((item, index) => <div key={item.id} data-cited={item.citation != null || undefined} style={{ '--n': index } as CSSProperties}>
    <div><Text as="span" size="xs">{item.citation != null && <sup className="folio-evidence-scores__citation">{item.citation}</sup>}{item.label}</Text><Text as="span" size="xs" tone="muted">{item.valueText}</Text></div>
    <Progress label={item.label} value={item.value} max={1} aria-valuetext={item.valueText} />
  </div>)}</div>
}

export interface SignalFigureProps extends HTMLAttributes<HTMLDivElement> {
  bars: { height: number; opacity: number }[]
  running?: boolean
  settled?: boolean
  caption: ReactNode
  detail: ReactNode
}

/** A decorative signature supplied by the host, kept out of the evidence's accessibility tree. */
export function SignalFigure({ bars, running, settled, caption, detail, className, ...rest }: SignalFigureProps) {
  return <div className={cn('folio-signal-figure', className)} {...rest}>
    <div aria-hidden className="folio-signal-figure__bars" data-running={running || undefined}>{bars.map((bar, index) => <span key={index} style={{ height: settled && !running ? bar.height : undefined, opacity: settled && !running ? bar.opacity : undefined, animationDelay: `${index * 16}ms` }} />)}</div>
    <div className="folio-evidence-meter__labels"><Text as="span" size="xs" tone="muted">{caption}</Text><Text as="span" size="xs" tone="muted">{detail}</Text></div>
  </div>
}

export interface EvidenceMeterProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  /** Leave unset while the total is unknown. */
  value?: number | null
  valueText: ReactNode
  detail: ReactNode
}

export function EvidenceMeter({ label, value, valueText, detail, className, ...rest }: EvidenceMeterProps) {
  return <div className={cn('folio-evidence-meter', className)} {...rest}><Progress label={label} value={value} /><div className="folio-evidence-meter__labels"><Text as="span" size="xs" tone="muted">{valueText}</Text><Text as="span" size="xs" tone="muted">{detail}</Text></div></div>
}

export interface EvidenceDuration { id: string; label: string; value: number | null; valueText: string }

export interface EvidenceDurationsProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  total: number | null
  totalText: string
  items: EvidenceDuration[]
  /**
   * How far a live run has come, from 0 to 1. While set, the bar is one clock
   * filling as the stream runs — linearly while below 1, settling at 1 — in place
   * of the per-stage segments, which return once it is unset.
   */
  progress?: number | null
}

const share = (value: number | null, total: number | null) => total != null && total > 0 && value != null ? `${Math.min(100, Math.max(0, value / total * 100))}%` : '0%'

/** Where the time went, stage by stage, under one total. */
export function EvidenceDurations({ label, total, totalText, items, progress, className, ...rest }: EvidenceDurationsProps) {
  const live = progress != null
  const fill = { '--folio-progress': Math.min(1, Math.max(0, progress ?? 0)) } as CSSProperties
  return <div className={cn('folio-evidence-durations', className)} {...rest}>
    <div className="folio-evidence-durations__header"><Text size="xs" tone="muted">{label}</Text><Text size="sm" tone="strong">{totalText}</Text></div>
    <div className="folio-evidence-durations__bar" aria-hidden data-live={live || undefined}>{live
      ? <span className="folio-evidence-durations__fill" data-running={(progress ?? 0) < 1 || undefined} style={fill} />
      : items.map((item) => <span key={item.id} style={{ width: share(item.value, total) }} />)}</div>
    <DescriptionList aria-label={label} items={items.map((item) => ({ id: item.id, term: item.label, description: item.valueText }))} layout="stacked" divided={false} className="folio-evidence-durations__legend" />
  </div>
}

export interface EvidenceSummaryProps extends HTMLAttributes<HTMLDListElement> { items: DescriptionListItem[] }

export function EvidenceSummary({ items, className, ...rest }: EvidenceSummaryProps) { return <DescriptionList items={items} layout="stacked" divided={false} className={cn('folio-evidence-summary', className)} {...rest} /> }
