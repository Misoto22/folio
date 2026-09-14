'use client'

import { Text, ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import { useState } from 'react'

/**
 * type="single" has radio semantics but not radio behaviour: pressing the
 * selected segment deselects it and commits an empty string, so a view switcher
 * built on it can be switched off into no view at all. Controlled, the guard is
 * one line — ignore the empty string and the strip keeps the value it had.
 * Press the selected segment and watch it stay.
 */
export function Example() {
  const [view, setView] = useState('grid')

  return (
    <div className="flex flex-col gap-3">
      <ToggleGroup
        type="single"
        value={view}
        onValueChange={(next) => {
          if (next) setView(next)
        }}
        aria-label="Layout"
      >
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
        <ToggleGroupItem value="list">List</ToggleGroupItem>
        <ToggleGroupItem value="map">Map</ToggleGroupItem>
      </ToggleGroup>
      <Text size="sm" tone="muted">
        Showing the {view} view.
      </Text>
    </div>
  )
}
