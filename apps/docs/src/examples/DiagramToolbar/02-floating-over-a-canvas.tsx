'use client'

import { useRef } from 'react'
import { Button } from '@misoto22/folio'
import {
  ArchitectureFigure,
  DiagramCanvas,
  DiagramExportMenu,
  DiagramToolbar,
  DiagramToolbarGroup,
  type DiagramCanvasHandle,
} from '@misoto22/folio/diagrams'
import { RiFullscreenLine, RiResetLeftLine } from '@remixicon/react'

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
 * placement="floating" pins the bar over the surface it acts on, and align picks
 * which top corner. It has to be a SIBLING of the canvas inside a positioned
 * wrapper, not a child of it: everything passed to DiagramCanvas as children
 * goes inside the transformed stage, so a toolbar handed to it would zoom and
 * pan along with the diagram it is meant to control. The same wrapper is what
 * the export menu takes a ref to, so the picture and the button that saves it
 * are one object.
 */
export function Example() {
  const canvas = useRef<DiagramCanvasHandle>(null)
  const stage = useRef<HTMLDivElement>(null)

  return (
    <div className="relative" ref={stage}>
      <DiagramCanvas ref={canvas} height="14rem" label="Request path">
        <ArchitectureFigure spec={SPEC} heading={false} legend="hidden" cards={false} />
      </DiagramCanvas>
      <DiagramToolbar label="Diagram actions" placement="floating" align="start">
        <DiagramToolbarGroup>
          <Button size="sm" variant="ghost" iconOnly aria-label="Reset the view" onClick={() => canvas.current?.reset()}>
            <RiResetLeftLine size={14} aria-hidden />
          </Button>
          <Button size="sm" variant="ghost" iconOnly aria-label="Centre the diagram" onClick={() => canvas.current?.centerOn(420, 84)}>
            <RiFullscreenLine size={14} aria-hidden />
          </Button>
        </DiagramToolbarGroup>
        <DiagramToolbarGroup>
          <DiagramExportMenu targetRef={stage} title="Request path" />
        </DiagramToolbarGroup>
      </DiagramToolbar>
    </div>
  )
}
