'use client'

import { useRef } from 'react'
import { ArchitectureFigure, DiagramExportMenu } from '@misoto22/folio/diagrams'

const SPEC = {
  meta: { title: 'Request path' },
  components: [
    { id: 'edge', type: 'cloud' as const, label: 'CloudFront', sublabel: 'CDN', row: 0, col: 0 },
    { id: 'api', type: 'backend' as const, label: 'API', sublabel: 'FastAPI', row: 0, col: 1 },
  ],
  connections: [{ id: 'a', from: 'edge', to: 'api', label: 'HTTPS' }],
}

/**
 * Five files behind one trigger, grouped by what they are for: PNG, JPEG and
 * WebP are the artwork rasterised at 2x, SVG is the artwork itself with every
 * custom property resolved to a real colour, and the share card is a 1200 x 630
 * PNG with the title printed above the diagram. targetRef points at the wrapper
 * around the figure rather than at the svg, and the menu finds the figure’s own
 * artwork inside it. title is what names the download, slugged — Request path
 * arrives as request-path.png.
 */
export function Example() {
  const figure = useRef<HTMLDivElement>(null)

  return (
    <div className="flex flex-col items-start gap-4">
      <DiagramExportMenu targetRef={figure} title="Request path" />
      <div ref={figure} className="w-full">
        <ArchitectureFigure spec={SPEC} heading={false} legend="hidden" />
      </div>
    </div>
  )
}
