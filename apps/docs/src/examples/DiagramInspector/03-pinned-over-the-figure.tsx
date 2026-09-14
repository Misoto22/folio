'use client'

import { useState } from 'react'
import { Button } from '@misoto22/folio'
import { ArchitectureFigure, DiagramInspector } from '@misoto22/folio/diagrams'

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
 * floating turns the panel into a plate pinned to the bottom-left of the nearest
 * positioned ancestor, so the wrapper has to establish one or it will pin itself
 * to something further up the page. Pin it when the figure owns the viewport and
 * a panel in the flow underneath would be off-screen at the moment it is needed;
 * leave it inline when the figure is one item in an article. activeIds lights the
 * same node the panel is about, and neither reaches into the other — the picture
 * and the panel are two consumers of one selection. actions is where what a
 * reader does with the selection goes. The region takes its accessible name from
 * title, so two panels on one page must not inspect the same node — this one
 * selects the datastore rather than the service the first example is about.
 */
export function Example() {
  const [copied, setCopied] = useState(false)

  return (
    <div className="relative">
      <ArchitectureFigure spec={SPEC} heading={false} legend="hidden" cards={false} activeIds={['db']} />
      <DiagramInspector
        floating
        eyebrow="Datastore"
        title="Postgres"
        description="The primary, and the end of the request path above it."
        facts={[
          { label: 'Id', value: 'db', mono: true },
          { label: 'Links', value: '1' },
        ]}
        actions={
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              void navigator.clipboard?.writeText('#db')
              setCopied(true)
            }}
          >
            {copied ? 'Copied' : 'Copy link'}
          </Button>
        }
      />
    </div>
  )
}
