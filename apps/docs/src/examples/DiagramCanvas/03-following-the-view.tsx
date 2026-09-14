'use client'

import { useRef, useState } from 'react'
import { Button } from '@misoto22/folio'
import {
  ArchitectureFigure,
  DiagramCanvas,
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
  ],
  connections: [
    { id: 'a', from: 'client', to: 'edge' },
    { id: 'b', from: 'edge', to: 'api' },
    { id: 'c', from: 'api', to: 'db', label: 'SQL' },
  ],
}

/**
 * onViewChange fires on every pan, zoom and reset with the same three numbers
 * the canvas is transforming by, which is what a percentage readout, a minimap
 * or a deep link into the diagram is built out of. centerOn goes the other way
 * and takes a point in the artwork’s own coordinate space, not a node id — the
 * canvas is a viewport and knows nothing about nodes, so a caller that wants to
 * jump to one has to know where it was drawn.
 */
export function Example() {
  const canvas = useRef<DiagramCanvasHandle>(null)
  const [view, setView] = useState<CanvasView>({ scale: 1, x: 0, y: 0 })

  return (
    <div className="flex flex-col gap-3">
      <DiagramCanvas ref={canvas} height="13rem" label="Request path" onViewChange={setView}>
        <ArchitectureFigure spec={SPEC} heading={false} legend="hidden" cards={false} />
      </DiagramCanvas>
      <div className="flex flex-wrap items-center gap-4">
        <span className="mono-meta text-(--ink-2)">
          {Math.round(view.scale * 100)}% at {Math.round(view.x)}, {Math.round(view.y)}
        </span>
        <Button size="sm" variant="secondary" onClick={() => canvas.current?.centerOn(820, 84)}>
          Centre on the far end
        </Button>
      </div>
    </div>
  )
}
