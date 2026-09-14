'use client'

import { Tag } from '@misoto22/folio'
import { useState } from 'react'

/**
 * The removable form: a chip for something the reader has already chosen. This
 * is where a separate Token component would have gone, and the difference
 * between the two is one prop rather than one component. removeLabel is
 * required alongside onRemove rather than defaulting to "Remove", because eight
 * controls all called Remove are eight controls a screen reader cannot tell
 * apart — name the subject in it.
 */
export function Example() {
  const [chosen, setChosen] = useState(['TypeScript', 'Rust', 'Postgres'])

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chosen.map((facet) => (
        <Tag
          key={facet}
          onRemove={() => setChosen((current) => current.filter((item) => item !== facet))}
          removeLabel={`Remove the ${facet} filter`}
        >
          {facet}
        </Tag>
      ))}
      {chosen.length === 0 && <span className="text-sm text-(--ink-3-aa)">No filters</span>}
    </div>
  )
}
