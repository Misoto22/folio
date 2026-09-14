'use client'

import { RiPauseFill, RiPlayFill } from '@remixicon/react'
import { useId, type HTMLAttributes, type ReactNode } from 'react'
import { Badge } from '../../components/Badge/Badge'
import { Button } from '../../components/Button/Button'
import { Heading } from '../../components/Heading/Heading'
import { Progress } from '../../components/Progress/Progress'
import { StatusDot } from '../../components/StatusDot/StatusDot'
import { Text } from '../../components/Text/Text'
import { cn } from '../../lib/cn'

export interface MediaPreviewAction {
  label: string
  disabled?: boolean
  playing?: boolean
  onToggle: () => void
}

function PreviewAction({ action, children, overlay = false }: { action: MediaPreviewAction; children?: ReactNode; overlay?: boolean }) {
  return (
    <Button type="button" iconOnly variant="ghost" onClick={action.onToggle} disabled={action.disabled} aria-label={action.label} title={action.disabled ? action.label : undefined} className={cn('folio-media-preview min-h-11 min-w-11', overlay && 'folio-media-preview--overlay')}>
      {children}
      <span className="folio-media-preview__control" data-playing={action.playing || undefined} aria-hidden>
        {action.disabled ? '—' : action.playing ? <RiPauseFill size={16} aria-hidden /> : <RiPlayFill size={16} aria-hidden />}
      </span>
    </Button>
  )
}

export interface MediaListRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  index: number
  artwork?: ReactNode
  title: ReactNode
  description?: ReactNode
  trailing?: ReactNode
  preview: MediaPreviewAction
  active?: boolean
  artworkShape?: 'square' | 'circle'
}

/** A ranked recording or artist, controlled by the host's one media player. */
export function MediaListRow({ index, artwork, title, description, trailing, preview, active = false, artworkShape = 'square', className, ...rest }: MediaListRowProps) {
  return (
    <div className={cn('folio-media-row', className)} data-active={active || undefined} data-artwork-shape={artworkShape} {...rest}>
      <Text as="span" size="xs" tone={active ? 'strong' : 'muted'}>{index}</Text>
      <PreviewAction action={preview}>{artwork}</PreviewAction>
      <div className="folio-media-row__copy"><div>{title}</div>{description && <Text as="span" size="sm" tone="muted" className="block truncate">{description}</Text>}</div>
      {trailing && <div className="folio-media-row__trailing">{trailing}</div>}
    </div>
  )
}

export interface MusicFeatureProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  label: string
  title: ReactNode
  description?: ReactNode
  artwork?: ReactNode
  artworkFallback: string
  live?: boolean
  notice?: string
  action?: ReactNode
  progress?: { label: string; value: number; max: number; currentLabel: string; endLabel: string }
}

/** The same media feature geometry for playing, recent and unavailable recordings. */
export function MusicFeature({ label, title, description, artwork, artworkFallback, live = false, notice, action, progress, className, ...rest }: MusicFeatureProps) {
  return (
    <section role="region" aria-label={label} className={cn('folio-media-feature', className)} {...rest}>
      <div className="folio-media-feature__artwork">{artwork ?? <Text size="sm" tone="muted" className="m-0 max-w-[16ch]">{artworkFallback}</Text>}</div>
      <div className="folio-media-feature__copy">
        <Text as="span" size="xs" tone="muted" className="mb-5 inline-flex items-center gap-2"><StatusDot tone="neutral" pulse={live} />{label}</Text>
        {notice && <Text role="status" size="sm" className="mb-5 max-w-[42ch]">{notice}</Text>}
        <Heading level={2} size="lead" className="mb-3">{title}</Heading>
        {description && <Text size="lead" className="mb-5">{description}</Text>}
        {progress && <div className="folio-media-feature__progress"><Text as="span" size="xs" tone="muted">{progress.currentLabel}</Text><Progress label={progress.label} value={progress.value} max={progress.max} /><Text as="span" size="xs" tone="muted">{progress.endLabel}</Text></div>}
        {action && <div className="mt-8">{action}</div>}
      </div>
    </section>
  )
}

export interface MediaCollectionCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode
  artwork?: ReactNode
  tag?: string | null
  description?: string | null
  metadata?: ReactNode
  preview: MediaPreviewAction
}

/** A playlist, album or other media collection with one explicit preview action. */
export function MediaCollectionCard({ title, artwork, tag, description, metadata, preview, className, ...rest }: MediaCollectionCardProps) {
  const id = useId()
  return (
    <article aria-labelledby={id} className={cn('folio-media-collection', className)} {...rest}>
      <div className="folio-media-collection__artwork">{artwork}{tag && <Badge className="absolute start-2 top-2">{tag}</Badge>}<PreviewAction action={preview} overlay /></div>
      <div className="folio-media-collection__copy"><Heading level={3} id={id}>{title}</Heading>{description && <Text size="sm" className="mb-3 line-clamp-2">{description}</Text>}{metadata && <div className="folio-media-collection__metadata">{metadata}</div>}</div>
    </article>
  )
}

export interface MusicSectionProps extends HTMLAttributes<HTMLElement> {
  title: string
  caption?: string
  children: ReactNode
  layout?: 'list' | 'collections'
}

/** A media list's heading, caption and collection layout. */
export function MusicSection({ title, caption, children, layout = 'list', className, ...rest }: MusicSectionProps) {
  const id = useId()
  return (
    <section aria-labelledby={id} className={cn('folio-music-section', className)} {...rest}>
      <header className="folio-music-section__header"><Heading level={2} id={id}>{title}</Heading>{caption && <Text as="span" size="xs" tone="muted">{caption}</Text>}</header>
      <div className={layout === 'collections' ? 'folio-music-section__collections' : undefined}>{children}</div>
    </section>
  )
}
