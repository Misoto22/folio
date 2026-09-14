'use client'

import type { HTMLAttributes, ReactNode } from 'react'
import { Badge } from '../../components/Badge/Badge'
import { Heading } from '../../components/Heading/Heading'
import { StatusDot } from '../../components/StatusDot/StatusDot'
import { Text } from '../../components/Text/Text'
import { ToggleGroup, ToggleGroupItem } from '../../components/ToggleGroup/ToggleGroup'
import { cn } from '../../lib/cn'

export interface MetricsRangeProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

/** A controlled range selector. Selection represents the data the host successfully loaded. */
export function MetricsRange({ label, value, options, onChange }: MetricsRangeProps) {
  return <div className="folio-metrics-range"><Text as="span" size="xs" tone="muted">{label}</Text><ToggleGroup type="single" aria-label={label} value={value} onValueChange={(next) => { if (next) onChange(next) }} className="max-w-full flex-wrap">{options.map((option) => <ToggleGroupItem value={option.value} key={option.value} className="min-h-11">{option.label}</ToggleGroupItem>)}</ToggleGroup></div>
}

export interface MetricsSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode
  caption?: ReactNode
  action?: ReactNode
  children: ReactNode
}

/** A dashboard section without a dependency on a chart engine or a domain response. */
export function MetricsSection({ title, caption, action, children, className, ...rest }: MetricsSectionProps) {
  return <section className={cn('folio-metrics-section', className)} {...rest}>{title && <header className="folio-metrics-section__header"><div><Heading level={2}>{title}</Heading>{caption && <Text size="xs" tone="muted" className="mb-0 mt-2">{caption}</Text>}</div>{action}</header>}{children}</section>
}

export interface MetricsPanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: string
  caption?: string
  children: ReactNode
}

/** A labeled panel. Children may use the separately imported charts entry. */
export function MetricsPanel({ title, caption, children, className, ...rest }: MetricsPanelProps) {
  return <section className={cn('folio-metrics-panel', className)} {...rest}><header><Heading level={3} size="sub">{title}</Heading>{caption && <Text size="xs" tone="muted" className="mb-0 mt-2">{caption}</Text>}</header>{children}</section>
}

export interface MetricsPanelGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 4
}

/** Responsive grids share their dividers and minimum panel width. */
export function MetricsPanelGrid({ columns = 2, className, ...props }: MetricsPanelGridProps) {
  return <div className={cn('folio-metrics-grid', className)} data-columns={columns} {...props} />
}

export interface MetricsListProps {
  label: string
  items: { id: string; label: ReactNode; value: ReactNode; icon?: ReactNode }[]
  empty: string
}

export interface MetricsEmptyStateProps {
  title: ReactNode
  description: ReactNode
}

/** An empty time series retains its plot space and tells the reader what will appear once the first observation arrives. */
export function MetricsEmptyState({ title, description }: MetricsEmptyStateProps) {
  return <div className="folio-metrics-empty" role="status"><div aria-hidden className="folio-metrics-empty__plot"><span /><span /><span /><span /></div><div><Heading level={3} size="sub">{title}</Heading><Text size="sm" tone="muted" className="mb-0 mt-2">{description}</Text></div></div>
}

/** Already-formatted metric rows, with a named value relation and an explicit empty state. */
export function MetricsList({ label, items, empty }: MetricsListProps) {
  if (items.length === 0) return <Text size="sm" tone="muted">{empty}</Text>
  return <dl aria-label={label} className="folio-metrics-list">{items.map((item) => <div key={item.id}><dt>{item.icon}<Text as="span" size="sm" tone="strong">{item.label}</Text></dt><dd><Text as="span" size="xs" tone="muted">{item.value}</Text></dd></div>)}</dl>
}

export interface MetricValueProps {
  segments: { text: string; unit?: boolean }[]
}

/** A supplied number with its units on the supporting type step. */
export function MetricValue({ segments }: MetricValueProps) {
  return <>{segments.map((segment, index) => <span key={index} className={segment.unit ? 'folio-metric-unit' : undefined}>{segment.text}</span>)}</>
}

export interface MetricDeltaProps {
  direction: 'up' | 'down' | 'steady'
  children: ReactNode
}

/** Neutral direction marks never assume an increase is good or a decrease is an error. */
export function MetricDelta({ direction, children }: MetricDeltaProps) {
  return <Text as="span" size="xs" tone="muted" className="inline-flex items-center gap-1.5"><span aria-hidden>{direction === 'up' ? '▲' : direction === 'down' ? '▼' : '—'}</span>{children}</Text>
}

export interface LiveCountProps {
  value: number | null
  label: string
}

/** Unknown live counts remain absent; a measured zero is a real reading. */
export function LiveCount({ value, label }: LiveCountProps) {
  if (value === null) return null
  return <Badge tone="outline"><StatusDot tone="neutral" /><span>{value} {label}</span></Badge>
}
