'use client'

import { TreemapChart, type TreemapNode } from '@misoto22/folio/charts'

// A route's payload: two files carry it, and eighteen more are the tail.
const files: TreemapNode[] = [
  { name: 'editor.chunk.js', bytes: 412 },
  { name: 'framework.js', bytes: 268 },
  { name: 'charts.chunk.js', bytes: 96 },
  { name: 'markdown.js', bytes: 74 },
  { name: 'highlight.js', bytes: 58 },
  { name: 'icons.js', bytes: 41 },
  { name: 'router.js', bytes: 33 },
  { name: 'forms.js', bytes: 28 },
  { name: 'dates.js', bytes: 24 },
  { name: 'toast.js', bytes: 19 },
  { name: 'dialog.js', bytes: 17 },
  { name: 'popover.js', bytes: 15 },
  { name: 'tooltip.js', bytes: 12 },
  { name: 'menu.js', bytes: 11 },
  { name: 'tabs.js', bytes: 9 },
  { name: 'avatar.js', bytes: 7 },
  { name: 'badge.js', bytes: 5 },
  { name: 'kbd.js', bytes: 4 },
  { name: 'spinner.js', bytes: 3 },
  { name: 'clsx.js', bytes: 2 },
]

/**
 * The long tail, which is where a treemap earns its place and also where it
 * stops naming itself: a tile is only labelled once it is wider than 56 pixels
 * and taller than 26, so the two files that carry this route are named and most
 * of the other eighteen are anonymous rectangles. The tooltip names one at a
 * time under the pointer, and the hidden data table — generated from the same
 * leaves the tiles are drawn from, so the two cannot disagree — is what makes
 * the small ones reachable without one. dataKey is the leaf field the area is
 * measured from, and it is the column that table prints.
 */
export function Example() {
  return (
    <TreemapChart
      title="Route payload by file"
      showTitle
      description="Kilobytes, gzipped"
      data={files}
      dataKey="bytes"
      showLabels
    >
      <TreemapChart.Tooltip />
    </TreemapChart>
  )
}
