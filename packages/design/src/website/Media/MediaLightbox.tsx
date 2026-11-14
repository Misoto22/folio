'use client'

import { useLayoutEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { X } from '../../icons'
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
  /** The print on the page. The viewer paints it at once, so it never opens on an empty stage. */
  media: ReactNode
  /** A larger rendering, cross-faded over the print once it has loaded. */
  expandedMedia?: ReactNode
}

/**
 * Writes the transform that takes the stage back onto the print's own frame.
 *
 * The viewer grows from that rectangle on open and returns to it on close, so
 * the photograph is seen to be the one that was on the page. Measured on every
 * open, because the page may have scrolled since the last one.
 */
function useFrameOrigin(node: HTMLDivElement | null) {
  useLayoutEffect(() => {
    // The trigger names the dialog it controls, so the frame is found from it.
    const dialog = node?.closest('[role="dialog"]')
    const from = dialog?.id ? document.querySelector(`[aria-controls="${dialog.id.replace(/["\\]/g, '\\$&')}"]`)?.getBoundingClientRect() : undefined
    if (!from || !node) return
    const to = node.getBoundingClientRect()
    if (to.width === 0 || to.height === 0) return
    node.style.setProperty('--folio-lightbox-x', `${from.left + from.width / 2 - (to.left + to.width / 2)}px`)
    node.style.setProperty('--folio-lightbox-y', `${from.top + from.height / 2 - (to.top + to.height / 2)}px`)
    node.style.setProperty('--folio-lightbox-scale', `${from.width / to.width}`)
  }, [node])
}

/** Tracks whether the larger rendering has loaded, including one the browser already had. */
function useLoaded(node: HTMLDivElement | null) {
  const [loaded, setLoaded] = useState(false)
  useLayoutEffect(() => {
    if (!node) return
    const images = [...node.querySelectorAll('img')]
    const settle = () => { if (images.every((image) => image.complete && image.naturalWidth > 0)) setLoaded(true) }
    node.addEventListener('load', settle, true)
    settle()
    return () => { node.removeEventListener('load', settle, true); setLoaded(false) }
  }, [node])
  return loaded
}

/**
 * A print and its controlled, focus-trapped full-screen dialog.
 *
 * The viewer opens on the print the page has already painted and grows it from
 * its frame on the page; the larger rendering cross-fades over it when it has
 * loaded. Closing returns the photograph to its frame while the scrim lifts,
 * rather than cutting. Reduced motion keeps the fades and drops the growth.
 */
export function MediaLightbox({ open, onOpenChange, title, triggerLabel, closeLabel, aspectRatio, media, expandedMedia }: MediaLightboxProps) {
  const ratio = Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : 1.5
  const style = { '--folio-media-aspect': ratio } as CSSProperties
  // State rather than refs: the dialog's content mounts a commit after `open`
  // turns true, and the measurements have to run when the nodes exist.
  const [stage, setStage] = useState<HTMLDivElement | null>(null)
  const [layer, setLayer] = useState<HTMLDivElement | null>(null)
  useFrameOrigin(stage)
  const loaded = useLoaded(layer)

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
        <div ref={setStage} className="folio-media-lightbox-stage">
          <div className="folio-media-lightbox-print" aria-hidden={expandedMedia != null || undefined}>{media}</div>
          {expandedMedia != null && <div ref={setLayer} className="folio-media-lightbox-full" data-loaded={loaded}>{expandedMedia}</div>}
        </div>
        <DialogClose asChild><Button variant="secondary" iconOnly aria-label={closeLabel} className="folio-media-lightbox-close"><X size={18} aria-hidden="true" /></Button></DialogClose>
        <p className="folio-media-lightbox-caption" aria-hidden="true">{title}</p>
      </DialogContent>
    </Dialog>
  )
}
