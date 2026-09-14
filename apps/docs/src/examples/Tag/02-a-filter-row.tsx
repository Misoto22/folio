'use client'

import { Tag } from '@misoto22/folio'
import { useState } from 'react'

const FACETS = ['TypeScript', 'Rust', 'Postgres', 'Photography']

/**
 * The same row, filtering. The button is OUTSIDE the tag: the span carries the
 * 10px of padding, so a button nested inside it is a target the size of the
 * words with dead margin around it that still looks clickable. aria-pressed is
 * set in the same breath as active, because active paints the accent and
 * reaches assistive tech in no other way — without it the chosen facet is a
 * state only a sighted reader can see.
 */
export function Example() {
  const [chosen, setChosen] = useState<string[]>(['Rust'])

  const toggle = (facet: string) =>
    setChosen((current) =>
      current.includes(facet) ? current.filter((item) => item !== facet) : [...current, facet],
    )

  return (
    <div className="flex flex-wrap items-center gap-2">
      {FACETS.map((facet) => (
        <button
          key={facet}
          type="button"
          aria-pressed={chosen.includes(facet)}
          onClick={() => toggle(facet)}
          className="rounded-(--radius-sm)"
        >
          <Tag active={chosen.includes(facet)}>{facet}</Tag>
        </button>
      ))}
    </div>
  )
}
