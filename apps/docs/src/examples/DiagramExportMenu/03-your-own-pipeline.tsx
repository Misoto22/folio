'use client'

import { useRef, useState } from 'react'
import { Button } from '@misoto22/folio'
import { ArchitectureFigure, DiagramExportMenu } from '@misoto22/folio/diagrams'
import { RiDownloadLine } from '@remixicon/react'

const SPEC = {
  meta: { title: 'Request path' },
  components: [
    { id: 'edge', type: 'cloud' as const, label: 'CloudFront', sublabel: 'CDN', row: 0, col: 0 },
    { id: 'api', type: 'backend' as const, label: 'API', sublabel: 'FastAPI', row: 0, col: 1 },
  ],
  connections: [{ id: 'a', from: 'edge', to: 'api', label: 'HTTPS' }],
}

/**
 * onExport takes the whole job over: the serialise, rasterise and download steps
 * never run, so nothing is written to disk unless this handler writes it. Reach
 * for it when the file has to come from somewhere the browser cannot go — a
 * server renderer, a frame size of your own, a queue. onResult still fires
 * either way and is the seam a page raises a toast from; trigger replaces the
 * button but not the menu, so an icon-only trigger still needs its aria-label.
 */
export function Example() {
  const figure = useRef<HTMLDivElement>(null)
  const [note, setNote] = useState('Nothing exported yet.')

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <DiagramExportMenu
          targetRef={figure}
          title="Request path"
          trigger={
            <Button size="sm" variant="ghost" iconOnly aria-label="Export this diagram">
              <RiDownloadLine size={14} aria-hidden />
            </Button>
          }
          onExport={(format) => setNote(`Queued a ${format} render on the server.`)}
          onResult={(result) => {
            if (!result.ok) setNote(`The ${result.format} export failed: ${result.error?.message}`)
          }}
        />
        <span className="mono-meta text-(--ink-2)">{note}</span>
      </div>
      <div ref={figure} className="w-full">
        <ArchitectureFigure spec={SPEC} heading={false} legend="hidden" />
      </div>
    </div>
  )
}
