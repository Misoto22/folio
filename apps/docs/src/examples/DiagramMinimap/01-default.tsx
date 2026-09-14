'use client'

import { useRef, useState } from 'react'
import {
  ArchitectureFigure,
  DiagramCanvas,
  DiagramMinimap,
  type CanvasView,
  type DiagramCanvasHandle,
} from '@misoto22/folio/diagrams'

const SPEC = {
  meta: { title: 'Request path' },
  components: [
    { id: 'client', type: 'external' as const, label: 'Browser', row: 0, col: 0 },
    { id: 'edge', type: 'cloud' as const, label: 'CloudFront', row: 0, col: 1 },
    { id: 'api', type: 'backend' as const, label: 'API', row: 0, col: 2 },
    { id: 'db', type: 'database' as const, label: 'Postgres', row: 0, col: 3 },
    { id: 'queue', type: 'messagebus' as const, label: 'SQS', row: 1, col: 2 },
  ],
  connections: [
    { id: 'a', from: 'client', to: 'edge' },
    { id: 'b', from: 'edge', to: 'api' },
    { id: 'c', from: 'api', to: 'db' },
    { id: 'd', from: 'api', to: 'queue' },
  ],
}

/**
 * A map is only worth drawing when the frame is smaller than the artwork, so
 * frame carries the canvas’s own box in CSS pixels and content the figure at its
 * natural size. The rectangle is derived from the canvas’s view on every change
 * rather than stored, which is why the two can never come to disagree. Clicking
 * or dragging on the map reports a point in the artwork’s coordinates and
 * centerOn does the moving — the minimap has no authority over the view, it only
 * says where the reader pointed.
 */
export function Example() {
  const canvas = useRef<DiagramCanvasHandle>(null)
  const [view, setView] = useState<CanvasView>({ scale: 1, x: 0, y: 0 })

  return (
    <div className="flex flex-col gap-3">
      <DiagramCanvas ref={canvas} height="14rem" label="Request path" onViewChange={setView}>
        <ArchitectureFigure spec={SPEC} heading={false} legend="hidden" cards={false} />
      </DiagramCanvas>
      <DiagramMinimap
        content={{ width: 900, height: 340 }}
        frame={{ width: 640, height: 224 }}
        view={view}
        width={180}
        onSeek={(x, y) => canvas.current?.centerOn(x, y)}
      >
        <ArchitectureFigure spec={SPEC} heading={false} legend="hidden" cards={false} />
      </DiagramMinimap>
    </div>
  )
}
