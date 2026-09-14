import { Slot } from '@radix-ui/react-slot'
import { RiAddLine, RiSubtractLine } from '@remixicon/react'
import type { ComponentPropsWithRef, HTMLAttributes, ReactElement, ReactNode } from 'react'
import { Badge } from '../../components/Badge/Badge'
import { Button, type ButtonProps } from '../../components/Button/Button'
import { DescriptionList, type DescriptionListItem } from '../../components/DescriptionList/DescriptionList'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import { SkeletonBlock, SkeletonLine, SkeletonPage } from '../../components/Skeleton/Skeleton'
import { cn } from '../../lib/cn'
import { replaceSlotContent } from '../../lib/slot-content'

export interface MediaMastheadProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** The title level when this page composition sits inside another document. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

/** The quiet opening to an image collection, before its controls and prints. */
export function MediaMasthead({ eyebrow, title, description, headingLevel = 1, className, ...rest }: MediaMastheadProps) {
  const Heading = `h${headingLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  return (
    <header className={cn('folio-media-masthead', className)} {...rest}>
      {eyebrow && <p className="folio-media-eyebrow">{eyebrow}</p>}
      <Heading className="folio-media-masthead-title">{title}</Heading>
      {description && <p className="folio-media-description">{description}</p>}
    </header>
  )
}

export interface PhotographFeatureProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  image: ReactNode
  title: ReactNode
  eyebrow?: ReactNode
  description?: ReactNode
  caption?: ReactNode
  action?: ReactNode
}

/** A photograph and an editorial introduction, with the original image ratio. */
export function PhotographFeature({ image, title, eyebrow, description, caption, action, className, ...rest }: PhotographFeatureProps) {
  return (
    <section className={cn('folio-photograph-feature', className)} {...rest}>
      <div className="folio-photograph-feature-copy">
        {eyebrow && <p className="folio-media-eyebrow">{eyebrow}</p>}
        <h2 className="folio-photograph-feature-title">{title}</h2>
        {description && <div className="folio-media-description">{description}</div>}
        {action && <div className="folio-photograph-feature-action">{action}</div>}
      </div>
      <figure className="folio-photograph-feature-figure">
        <div className="folio-photograph-feature-image">{image}</div>
        {caption && <figcaption className="folio-photograph-feature-caption">{caption}</figcaption>}
      </figure>
    </section>
  )
}

export interface MediaCollectionProps extends HTMLAttributes<HTMLDivElement> {
  masthead: ReactNode
  controls?: ReactNode
  collectionId?: string
  footer?: ReactNode
}

/** Page-level gallery composition; the host owns its filters and collection. */
export function MediaCollection({ masthead, controls, collectionId, footer, children, className, ...rest }: MediaCollectionProps) {
  return (
    <div className={cn('folio-media-gallery-page', className)} {...rest}>
      {masthead}
      {controls && <div className="folio-media-container">{controls}</div>}
      <section id={collectionId} className="folio-media-gallery-content">{children}</section>
      {footer}
    </div>
  )
}

export interface MediaGalleryProps extends HTMLAttributes<HTMLUListElement> {
  children?: ReactNode
  /** Supply localized empty copy when the collection may have no children. */
  emptyTitle?: ReactNode
  emptyAction?: ReactNode
}

/** Level mounts keep unlike aspect ratios aligned without cropping the prints. */
export function MediaGallery({ children, emptyTitle, emptyAction, className, ...rest }: MediaGalleryProps) {
  return (
    <div className="folio-media-container">
      {emptyTitle ? <EmptyState title={emptyTitle} action={emptyAction} /> : (
        <ul role="list" className={cn('folio-media-gallery', className)} {...rest}>{children}</ul>
      )}
    </div>
  )
}

export interface MediaGalleryItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title'> {
  /** A host link containing its image. The package supplies the print layout. */
  children: ReactElement
  title: ReactNode
  index?: ReactNode
  location?: ReactNode
  orientation?: 'portrait' | 'landscape' | 'square'
}

export function MediaGalleryItem({ children, title, index, location, orientation, className, ...rest }: MediaGalleryItemProps) {
  return (
    <li className={cn('folio-media-gallery-item', className)} {...rest}>
      <figure>
        <Slot className="folio-media-gallery-link" data-photo-orientation={orientation}>{children}</Slot>
        <figcaption className="folio-media-gallery-caption">
          {index != null && <span className="folio-media-gallery-index" aria-hidden="true">{index}</span>}
          <span className="folio-media-gallery-title">{title}</span>
          {location && <span className="folio-media-gallery-location">{location}</span>}
        </figcaption>
      </figure>
    </li>
  )
}

export interface MediaGallerySkeletonProps {
  label: string
  count?: number
}

export function MediaGallerySkeleton({ label, count = 6 }: MediaGallerySkeletonProps) {
  return (
    <SkeletonPage label={label} aria-label={label}>
      <header className="folio-media-masthead">
        <SkeletonLine className="w-24" />
        <SkeletonBlock className="mt-4 h-9 w-[min(560px,90%)]" />
        <SkeletonBlock className="mt-2.5 h-9 w-[min(380px,70%)]" />
      </header>
      <div className="folio-media-container"><SkeletonLine className="h-11 w-full" /></div>
      <section data-loading-content className="folio-media-gallery-content">
        <MediaGallery>
          {Array.from({ length: count }, (_, index) => (
            <li key={index}>
              <SkeletonBlock className="folio-media-gallery-mount" />
              <SkeletonLine className="mt-3 w-3/4" />
            </li>
          ))}
        </MediaGallery>
      </section>
    </SkeletonPage>
  )
}

export interface MediaDetailLayoutProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode
  titleId: string
  /** The title level when this page composition sits inside another document. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  category?: ReactNode
  notesLabel: string
  orientation: 'portrait' | 'landscape' | 'square'
  backLink: ReactElement
  index?: ReactNode
  media: ReactNode
  light?: ReactNode
  actions?: ReactNode
  metadata?: ReactNode
  location?: ReactNode
  pager?: ReactNode
  related?: ReactNode
}

/** Portraits share a spread with their notes; landscapes lead a full-width spread. */
export function MediaDetailLayout({ title, titleId, headingLevel = 1, category, notesLabel, orientation, backLink, index, media, light, actions, metadata, location, pager, related, className, ...rest }: MediaDetailLayoutProps) {
  const Heading = `h${headingLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  return (
    <div className="folio-media-detail-page">
      <article className={cn('folio-media-detail', className)} aria-labelledby={titleId} data-photo-detail {...rest}>
        <header className="folio-media-index-bar">
          <Button asChild variant="ghost">{backLink}</Button>
          {index && <span className="folio-media-index">{index}</span>}
        </header>
        <div className="folio-media-spread" data-photo-spread={orientation === 'landscape' ? 'wide' : 'tall'}>
          <div className="folio-media-well" data-photo-media>{media}</div>
          <aside className="folio-media-ledger" aria-label={notesLabel} data-photo-ledger>
            <div className="folio-media-ledger-narrative">
              <div className="folio-media-ledger-lead">
                {category && <p className="folio-media-eyebrow">{category}</p>}
                <Heading id={titleId} className="folio-media-detail-title">{title}</Heading>
              </div>
              {light}
              {actions && <div className="folio-media-actions" data-photo-actions>{actions}</div>}
            </div>
            <div className="folio-media-ledger-data">{metadata}{location}</div>
          </aside>
        </div>
        {pager}
        {related}
      </article>
    </div>
  )
}

export interface MediaMetadataProps extends HTMLAttributes<HTMLDListElement> {
  items: DescriptionListItem[]
}

export function MediaMetadata({ items, className, ...rest }: MediaMetadataProps) {
  return <DescriptionList items={items} className={cn('folio-media-metadata', className)} data-photo-specs {...rest} />
}

export interface MediaPagerProps extends HTMLAttributes<HTMLElement> {
  label: string
  previous?: ReactNode
  next?: ReactNode
}

export function MediaPager({ label, previous, next, className, ...rest }: MediaPagerProps) {
  if (!previous && !next) return null
  return <nav aria-label={label} className={cn('folio-media-pager', className)} data-photo-pager {...rest}>{previous || <span />}{next || <span />}</nav>
}

export interface MediaPagerItemProps {
  link: ReactElement
  direction: 'previous' | 'next'
  label: ReactNode
  title: ReactNode
  image?: ReactNode
}

export function MediaPagerItem({ link, direction, label, title, image }: MediaPagerItemProps) {
  return (
    <Slot className="folio-media-pager-link" data-direction={direction}>
      {/** Slot composes the host link while retaining its routing behavior. */}
      {replaceSlotContent(link, <>
        {image && direction === 'previous' && <span className="folio-media-pager-image">{image}</span>}
        <span className="folio-media-pager-copy">
          <span className="folio-media-pager-label">{label}</span>{' '}
          <strong className="folio-media-pager-title">{title}</strong>
        </span>
        {image && direction === 'next' && <span className="folio-media-pager-image">{image}</span>}
      </>)}
    </Slot>
  )
}

export interface MediaThumbnailStripProps extends HTMLAttributes<HTMLElement> {
  heading: ReactNode
}

export function MediaThumbnailStrip({ heading, children, className, ...rest }: MediaThumbnailStripProps) {
  return <section className={cn('folio-media-thumbnails', className)} data-photo-related {...rest}><h2>{heading}</h2><div className="folio-media-thumbnail-list">{children}</div></section>
}

export interface MediaThumbnailProps {
  children: ReactElement
}

export function MediaThumbnail({ children }: MediaThumbnailProps) {
  return <Slot className="folio-media-thumbnail">{children}</Slot>
}

export interface MediaLightNoteLine {
  id: string
  icon?: ReactNode
  text: ReactNode
  detail?: ReactNode
}

export interface MediaLightNoteProps {
  label: ReactNode
  lines: MediaLightNoteLine[]
}

/** The host supplies observations and formatted labels; this is presentation only. */
export function MediaLightNote({ label, lines }: MediaLightNoteProps) {
  return <div className="folio-media-light"><Badge tone="outline">{label}</Badge>{lines.map((line) => <div className="folio-media-light-line" key={line.id}>{line.icon}<span>{line.text}</span>{line.detail && <span className="folio-media-light-detail">{line.detail}</span>}</div>)}</div>
}

export interface MediaMapSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode
  hint?: ReactNode
  /** An optional legacy anchor, owned and named by the host. */
  aliasId?: string
  map: ReactNode
  preview: ReactNode
}

export function MediaMapSection({ title, hint, aliasId, map, preview, className, ...rest }: MediaMapSectionProps) {
  return <section className={cn('folio-media-map-section', className)} {...rest}><div className="folio-media-container">{aliasId && <span id={aliasId} className="folio-media-anchor" aria-hidden="true" />}<header><h2>{title}</h2>{hint && <p>{hint}</p>}</header><div className="folio-media-map-grid">{map}{preview}</div></div></section>
}

export interface MediaMapFrameProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode
  hint?: ReactNode
  navigation?: ReactNode
  compact?: boolean
}

export function MediaMapFrame({ label, hint, navigation, compact = false, children, className, ...rest }: MediaMapFrameProps) {
  return <div className={cn('folio-media-map-frame', compact && 'folio-media-map-frame-compact', className)} {...rest}>{label && <span className="folio-media-map-label">{label}</span>}<div className="folio-media-map-stage">{children}{hint && <div className="folio-media-map-hint">{hint}</div>}{navigation && <div className="folio-media-map-navigation">{navigation}</div>}</div></div>
}

export interface MediaMapNavigationProps {
  zoomInLabel: string
  zoomOutLabel: string
  onZoomIn: () => void
  onZoomOut: () => void
}

export function MediaMapNavigation({ zoomInLabel, zoomOutLabel, onZoomIn, onZoomOut }: MediaMapNavigationProps) {
  return <><Button variant="secondary" iconOnly aria-label={zoomInLabel} onClick={onZoomIn}><RiAddLine size={18} aria-hidden="true" /></Button><Button variant="secondary" iconOnly aria-label={zoomOutLabel} onClick={onZoomOut}><RiSubtractLine size={18} aria-hidden="true" /></Button></>
}

export type MediaMapCanvasProps = ComponentPropsWithRef<'div'>

/** A sized provider container. Map creation, themes and geographic math stay in the host. */
export function MediaMapCanvas({ className, ...rest }: MediaMapCanvasProps) {
  return <div className={cn('folio-media-map-canvas', className)} {...rest} />
}

export interface MediaMapPreviewProps {
  title: ReactNode
  image?: ReactNode
  action?: ReactNode
  place?: ReactNode
  coordinates?: ReactNode
  children?: ReactNode
}

export function MediaMapPreview({ title, image, action, place, coordinates, children }: MediaMapPreviewProps) {
  return <aside className="folio-media-map-preview"><div className="folio-media-map-preview-image">{image}{action && <div className="folio-media-map-preview-action">{action}</div>}</div><div className="folio-media-map-preview-copy"><h3>{title}</h3>{place && <p className="folio-media-map-place">{place}</p>}{coordinates && <div className="folio-media-map-coordinates">{coordinates}</div>}{children}</div></aside>
}

export interface MediaMapArea {
  id: string
  label: ReactNode
  count: ReactNode
}

export interface MediaMapAreaListProps {
  items: MediaMapArea[]
  value?: string
  onValueChange: (value: string) => void
}

export function MediaMapAreaList({ items, value, onValueChange }: MediaMapAreaListProps) {
  return (
    <div className="folio-media-map-areas">
      {items.map((item) => (
        <Button key={item.id} variant="ghost" aria-pressed={value === item.id} onClick={() => onValueChange(item.id)} className="folio-media-map-area">
          <span className="folio-media-map-area-name"><span aria-hidden="true" />{item.label}</span>{' '}
          <span className="folio-media-map-area-count">{item.count}</span>
        </Button>
      ))}
    </div>
  )
}

export interface MediaMapMarkerProps extends Omit<Extract<ButtonProps, { href?: undefined }>, 'children' | 'iconOnly'> {
  label: string
  active?: boolean
}

/** A keyboard-operable 44px marker for a host's map-provider portal. */
export function MediaMapMarker({ label, active = false, className, ...rest }: MediaMapMarkerProps) {
  return <Button {...rest} variant="ghost" iconOnly aria-label={label} aria-pressed={active} className={cn('folio-media-map-marker', className)} style={{ width: 44, height: 44, ...rest.style }}><MediaMapPin active={active} /></Button>
}

export interface MediaMapPinProps {
  active?: boolean
}

export function MediaMapPin({ active = false }: MediaMapPinProps) {
  return <span className="folio-media-map-pin" data-active={active || undefined} aria-hidden="true"><span /></span>
}

export function MediaMapSkeleton() {
  return <div className="folio-media-map-skeleton folio-media-container" aria-hidden="true"><SkeletonBlock className="folio-media-map-canvas" /></div>
}
