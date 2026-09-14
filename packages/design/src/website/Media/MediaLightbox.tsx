'use client'

import type { CSSProperties, ReactNode } from 'react'
import { RiCloseLine } from '@remixicon/react'
import { Button } from '../../components/Button/Button'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '../../components/Dialog/Dialog'

export interface MediaLightboxProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  triggerLabel: string
  closeLabel: string
  /** Intrinsic width divided by height; invalid dimensions use a safe fallback. */
  aspectRatio: number
  media: ReactNode
  expandedMedia?: ReactNode
}

/** A print and its controlled, focus-trapped full-screen dialog. */
export function MediaLightbox({ open, onOpenChange, title, triggerLabel, closeLabel, aspectRatio, media, expandedMedia = media }: MediaLightboxProps) {
  const ratio = Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : 1.5
  const style = { '--folio-media-aspect': ratio } as CSSProperties

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" aria-label={triggerLabel} className="folio-media-frame" style={style} data-photo-frame>
          {media}
        </Button>
      </DialogTrigger>
      <DialogContent
        title={title}
        hideTitle
        showClose={false}
        aria-modal="true"
        aria-describedby={undefined}
        data-photo-lightbox
        data-mode="dark"
        className="folio-media-lightbox translate-x-0 translate-y-0"
        style={style}
        onClick={(event) => { if (event.target === event.currentTarget) onOpenChange(false) }}
      >
        <div className="folio-media-lightbox-stage">{expandedMedia}</div>
        <DialogClose asChild><Button variant="secondary" iconOnly aria-label={closeLabel} className="folio-media-lightbox-close"><RiCloseLine size={18} aria-hidden="true" /></Button></DialogClose>
        <p className="folio-media-lightbox-caption" aria-hidden="true">{title}</p>
      </DialogContent>
    </Dialog>
  )
}
