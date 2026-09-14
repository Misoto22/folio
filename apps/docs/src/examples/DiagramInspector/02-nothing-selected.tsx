'use client'

import { useState } from 'react'
import { Button } from '@misoto22/folio'
import { DiagramInspector } from '@misoto22/folio/diagrams'

// Two nodes the other examples on this page do not inspect. The panel is a
// landmark named from `title`, so a page carrying three of them needs three
// subjects — two panels called "API details" are one landmark as far as a
// screen reader's list of regions is concerned.
const NODES = [
  {
    id: 'worker',
    eyebrow: 'Service',
    title: 'Worker',
    description: 'Consumes the queue and warms the cache ahead of the morning peak.',
    port: '9000',
  },
  {
    id: 'cache',
    eyebrow: 'Cache',
    title: 'Redis',
    description: 'Read-through, in front of the primary. Every miss becomes a query.',
    port: '6379',
  },
]

/**
 * The panel has no empty state of its own — title is required, so there is no
 * way to render one with nothing in it, and what a reader sees before they pick
 * anything is the caller’s to draw. Draw something: a column that vanishes when
 * the selection clears takes the rest of the layout with it every time somebody
 * closes the panel. The relationship row is a real button because it carries
 * onSelect, which is what lets a keyboard walk the graph peer by peer without
 * ever reaching the picture; onClose returns to the empty case.
 */
export function Example() {
  const [selected, setSelected] = useState<string | null>(null)
  const node = NODES.find((entry) => entry.id === selected)
  const peer = NODES.find((entry) => entry.id !== selected)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {NODES.map((entry) => (
          <Button key={entry.id} size="sm" variant="secondary" onClick={() => setSelected(entry.id)}>
            {entry.title}
          </Button>
        ))}
      </div>
      {node && peer ? (
        <DiagramInspector
          eyebrow={node.eyebrow}
          title={node.title}
          description={node.description}
          facts={[
            { label: 'Port', value: node.port, mono: true },
            { label: 'Id', value: node.id, mono: true },
          ]}
          links={[
            {
              direction: node.id === 'worker' ? 'out' : 'in',
              label: 'read-through',
              peer: peer.title,
              onSelect: () => setSelected(peer.id),
            },
          ]}
          onClose={() => setSelected(null)}
        />
      ) : (
        <p className="m-0 rounded-(--radius-lg) border border-dashed border-(--rule-2) p-4 text-[13px] leading-[1.55] text-(--ink-3-aa)">
          Pick a component to see what it is and what reaches it.
        </p>
      )}
    </div>
  )
}
