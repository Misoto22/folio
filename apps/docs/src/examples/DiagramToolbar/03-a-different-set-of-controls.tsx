'use client'

import { useState } from 'react'
import { Button } from '@misoto22/folio'
import { DiagramToolbar, DiagramToolbarGroup } from '@misoto22/folio/diagrams'

const CHAPTERS = [
  { id: 'overview', label: 'Overview' },
  { id: 'data', label: 'Data path' },
  { id: 'trust', label: 'Trust' },
]

/**
 * The same bar carrying controls that change WHAT the figure says rather than
 * how it is being looked at — a guided reading, one chapter at a time. The
 * current chapter is marked with aria-pressed as well as with the secondary
 * variant, because the variant is a difference in paint and a screen reader
 * cannot see paint. The second group holds a readout rather than a control: a
 * group is an ordinary div, and the hairline is what says the count belongs to
 * the bar instead of trailing after it.
 */
export function Example() {
  const [active, setActive] = useState('overview')
  const position = CHAPTERS.findIndex((chapter) => chapter.id === active) + 1

  return (
    <DiagramToolbar label="Chapters">
      <DiagramToolbarGroup>
        {CHAPTERS.map((chapter) => (
          <Button
            key={chapter.id}
            size="sm"
            variant={chapter.id === active ? 'secondary' : 'ghost'}
            aria-pressed={chapter.id === active}
            onClick={() => setActive(chapter.id)}
          >
            {chapter.label}
          </Button>
        ))}
      </DiagramToolbarGroup>
      <DiagramToolbarGroup>
        <span className="mono-meta px-1.5 text-(--ink-3-aa)">
          {position} of {CHAPTERS.length}
        </span>
      </DiagramToolbarGroup>
    </DiagramToolbar>
  )
}
