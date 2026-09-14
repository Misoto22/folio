'use client'

import { useRef } from 'react'
import { Button } from '@misoto22/folio'
import { ArchitectureFigure, DiagramCanvas, type DiagramCanvasHandle } from '@misoto22/folio/diagrams'
import { RiAddLine, RiResetLeftLine, RiSubtractLine } from '@remixicon/react'

const SPEC = {
  meta: { title: 'Request path' },
  components: [
    { id: 'edge', type: 'cloud' as const, label: 'CloudFront', sublabel: 'CDN', row: 0, col: 0 },
    { id: 'api', type: 'backend' as const, label: 'API', sublabel: 'FastAPI', row: 0, col: 1 },
    { id: 'db', type: 'database' as const, label: 'Postgres', row: 0, col: 2 },
  ],
  connections: [
    { id: 'a', from: 'edge', to: 'api', label: 'HTTPS' },
    { id: 'b', from: 'api', to: 'db', label: 'SQL' },
  ],
}

/**
 * controls={false} removes the plate in the corner, and everything it did has to
 * be put back somewhere: zoomIn, zoomOut and reset live on the handle, and a ref
 * is the only way to reach them. Turn the built-in controls off when the page
 * already has a toolbar and two sets of zoom buttons would compete for the same
 * job. Turning them off and supplying nothing leaves zoom to the modifier-wheel
 * and the keyboard, neither of which a reader has any way to discover.
 */
export function Example() {
  const canvas = useRef<DiagramCanvasHandle>(null)

  return (
    <div className="flex flex-col gap-3">
      <DiagramCanvas ref={canvas} controls={false} height="13rem" label="Request path">
        <ArchitectureFigure spec={SPEC} heading={false} legend="hidden" cards={false} />
      </DiagramCanvas>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" iconOnly aria-label="Zoom out" onClick={() => canvas.current?.zoomOut()}>
          <RiSubtractLine size={14} aria-hidden />
        </Button>
        <Button size="sm" variant="ghost" iconOnly aria-label="Zoom in" onClick={() => canvas.current?.zoomIn()}>
          <RiAddLine size={14} aria-hidden />
        </Button>
        <Button size="sm" variant="secondary" onClick={() => canvas.current?.reset()}>
          <RiResetLeftLine size={14} aria-hidden /> Reset
        </Button>
      </div>
    </div>
  )
}
