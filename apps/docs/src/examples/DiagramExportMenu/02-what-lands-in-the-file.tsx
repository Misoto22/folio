'use client'

import { useRef } from 'react'
import { Button } from '@misoto22/folio'
import {
  ArchitectureFigure,
  DiagramExportMenu,
  DiagramToolbar,
  DiagramToolbarGroup,
} from '@misoto22/folio/diagrams'
import { RiInformationLine } from '@remixicon/react'

const SPEC = {
  meta: { title: 'Order pipeline' },
  components: [
    { id: 'api', type: 'backend' as const, label: 'Checkout', sublabel: 'Django', row: 0, col: 0 },
    { id: 'queue', type: 'messagebus' as const, label: 'Orders topic', sublabel: 'Kafka', row: 0, col: 1 },
    { id: 'psp', type: 'external' as const, label: 'Payments', sublabel: 'Stripe', row: 0, col: 2 },
  ],
  connections: [
    { id: 'a', from: 'api', to: 'queue', label: 'publish', variant: 'dashed' as const },
    { id: 'b', from: 'queue', to: 'psp', label: 'capture', variant: 'dashed' as const },
  ],
}

/**
 * The ref here wraps the toolbar as well as the figure, and every icon in that
 * toolbar is an svg of its own — the menu looks for the figure’s own artwork
 * marker first, which is what stops an export of a diagram from being a picture
 * of the info button. What leaves the page is the artwork alone: the toolbar,
 * the panel and anything else drawn in HTML are not in the file. The colours are
 * read off the live element, so the download comes out in whichever theme the
 * reader is looking at, but web fonts do not travel with it and a machine
 * without the family will set the labels in something else.
 */
export function Example() {
  const stage = useRef<HTMLDivElement>(null)

  return (
    <div ref={stage} className="flex flex-col gap-4">
      <DiagramToolbar label="Diagram actions">
        <DiagramToolbarGroup>
          <Button size="sm" variant="ghost" iconOnly aria-label="About this diagram">
            <RiInformationLine size={14} aria-hidden />
          </Button>
        </DiagramToolbarGroup>
        <DiagramToolbarGroup>
          <DiagramExportMenu targetRef={stage} title="Order pipeline" />
        </DiagramToolbarGroup>
      </DiagramToolbar>
      <ArchitectureFigure spec={SPEC} heading={false} legend="hidden" />
    </div>
  )
}
