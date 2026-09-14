'use client'

import { ToggleGroup, ToggleGroupItem } from '@misoto22/folio'

/**
 * The same strip in both of its modes. single has radio semantics and moves one
 * filled pill between its options, so the eye follows a thing travelling;
 * multiple fills each pressed segment on its own, because there is no single
 * selection to travel. The choice is not cosmetic — the wrong one tells a
 * screen reader that picking one format unpicks the others. A single group
 * needs a defaultValue or a value: the pill appears only once it has measured a
 * selected segment, so a group that starts empty is a bare strip with nothing
 * marked in it. Neither wraps nor scrolls, so stop at about five segments.
 */
export function Example() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="m-0 eyebrow text-(--ink-3-aa)">single — one of these</p>
        <ToggleGroup type="single" defaultValue="grid" aria-label="Layout">
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
          <ToggleGroupItem value="map">Map</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex flex-col gap-2">
        <p className="m-0 eyebrow text-(--ink-3-aa)">multiple — any of these</p>
        <ToggleGroup type="multiple" defaultValue={['film']} aria-label="Formats">
          <ToggleGroupItem value="film">Film</ToggleGroupItem>
          <ToggleGroupItem value="digital">Digital</ToggleGroupItem>
          <ToggleGroupItem value="scan">Scan</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  )
}
