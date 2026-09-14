import type { ReactElement, ReactNode } from 'react'
import { Button } from '../../components/Button/Button'
import { ErrorState, type ErrorStateProps } from '../../components/ErrorState/ErrorState'
import { Heading } from '../../components/Heading/Heading'
import { SkeletonBlock, SkeletonCircle, SkeletonLine, SkeletonPage } from '../../components/Skeleton/Skeleton'
import { cn } from '../../lib/cn'

export interface RecoveryStateProps extends ErrorStateProps {
  elsewhere?: ReactNode
}

/** A recovery page composed from the system error primitive and caller-owned destinations. */
export function RecoveryState({ action, elsewhere, ...props }: RecoveryStateProps) {
  return <ErrorState {...props} action={<><div className="folio-recovery-actions">{action}</div>{elsewhere}</>} />
}

export interface RecoveryLinksProps {
  label: string
  items: { id: string; link: ReactElement }[]
}

/** Suggested destinations, with routing supplied by the host. */
export function RecoveryLinks({ label, items }: RecoveryLinksProps) {
  return <nav aria-label={label} className="folio-recovery-links"><Heading level={2} size="label">{label}</Heading><ul>{items.map((item) => <li key={item.id}><Button asChild variant="ghost" className="min-h-11 w-full justify-start">{item.link}</Button></li>)}</ul></nav>
}

export interface LoadingRouteIntroProps {
  titleClassName?: string
}

/** The shared masthead geometry, drawn from the core loading primitives. */
export function LoadingRouteIntro({ titleClassName = 'w-[min(100%,18rem)]' }: LoadingRouteIntroProps) {
  return <header className="folio-loading-intro folio-loading-container"><div><SkeletonLine className="h-2.5 w-28" /><SkeletonBlock className={cn('mt-6 h-[clamp(2.5rem,4.6vw,3.375rem)]', titleClassName)} /><SkeletonLine className="mt-7 h-3.5 w-[min(100%,34rem)]" /><SkeletonLine className="mt-2.5 h-3.5 w-[min(100%,26rem)]" /></div><SkeletonLine className="hidden h-2.5 w-40 justify-self-end md:block" /></header>
}

export interface LoadingRecordsProps {
  rows?: number
  media?: boolean
}

/** A collection skeleton with or without a media column. */
export function LoadingRecords({ rows = 4, media = true }: LoadingRecordsProps) {
  return <div data-loading-content className="folio-loading-records folio-loading-container">{Array.from({ length: rows }, (_, index) => <div key={index} className="folio-loading-records__row" data-media={media || undefined}><SkeletonLine className="hidden h-2.5 w-8 sm:block" />{media && <SkeletonBlock className="h-[clamp(140px,20vw,154px)]" />}<div className="min-w-0"><SkeletonLine className="h-2.5 w-24" /><SkeletonBlock className="mt-4 h-6 w-[min(100%,20rem)]" /><SkeletonLine className="mt-5 h-3 w-full max-w-(--measure-record)" /><SkeletonLine className="mt-2.5 h-3 w-[min(100%,26rem)]" /></div></div>)}</div>
}

export interface WebsiteLoadingProps extends LoadingRecordsProps, LoadingRouteIntroProps {
  label: string
  layout?: 'records' | 'gallery' | 'media' | 'metrics' | 'identity'
  filters?: boolean
}

/** Named loading layouts for the website's reusable page shapes. */
export function WebsiteLoading({ label, layout = 'records', titleClassName, rows = 4, media = true, filters = false }: WebsiteLoadingProps) {
  return <SkeletonPage label={label}>
    {layout === 'identity' ? <header className="folio-loading-identity folio-loading-container"><div><div className="flex items-center gap-5"><SkeletonCircle className="size-12" /><SkeletonBlock className="h-12 w-64" /></div><SkeletonLine className="mt-9 h-3.5 w-full" /><SkeletonLine className="mt-3 h-3.5 w-4/5" /><SkeletonLine className="mt-10 h-3 w-2/3" /></div><SkeletonBlock className="aspect-square w-full" /></header> : <LoadingRouteIntro titleClassName={titleClassName} />}
    {filters && <div className="folio-loading-filters folio-loading-container" data-loading-content><div className="flex flex-wrap gap-6">{[8, 16, 12, 20].map((width) => <SkeletonLine key={width} className="h-3 w-12" />)}</div><SkeletonBlock className="h-11 w-56" /></div>}
    {(layout === 'records' || layout === 'identity') && <LoadingRecords rows={rows} media={media} />}
    {layout === 'gallery' && <section data-loading-content className="folio-loading-gallery folio-loading-container">{Array.from({ length: rows }, (_, index) => <div key={index}><SkeletonBlock className="aspect-[4/5] w-full" /><SkeletonLine className="mt-3 h-3 w-3/4" /></div>)}</section>}
    {layout === 'media' && <section data-loading-content className="folio-loading-media"><div data-loading-now-playing className="folio-media-feature folio-loading-container"><div className="folio-media-feature__artwork"><SkeletonBlock data-loading-artwork className="h-full w-full" /></div><div><SkeletonLine className="h-2.5 w-28" /><SkeletonBlock className="mt-5 h-16 w-4/5" /><SkeletonLine className="mt-5 h-3.5 w-2/3" /><SkeletonLine className="mt-6 h-1 w-full" /></div></div></section>}
    {layout === 'metrics' && <div data-loading-content className="folio-loading-metrics folio-loading-container"><div className="folio-loading-filters"><SkeletonLine className="h-2.5 w-12" /><SkeletonBlock className="h-11 w-72" /></div><div className="folio-loading-metrics__figures">{[0, 1, 2, 3].map((cell) => <div key={cell}><SkeletonLine className="h-2.5 w-24" /><SkeletonBlock className="mt-4 h-9 w-20" /><SkeletonLine className="mt-4 h-2.5 w-16" /></div>)}</div><SkeletonLine className="mt-16 h-3 w-28" /><SkeletonBlock className="mt-6 h-[220px] w-full" /></div>}
  </SkeletonPage>
}
