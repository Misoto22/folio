'use client'

import { TreemapChart } from '@misoto22/folio/charts'

const packages = [
  { name: 'recharts', size: 480 },
  { name: 'react-dom', size: 310 },
  { name: 'motion', size: 140 },
  { name: '@remixicon/react', size: 96 },
  { name: 'cmdk', size: 62 },
  { name: 'tailwind-merge', size: 41 },
  { name: 'clsx', size: 12 },
  { name: 'sonner', size: 28 },
]

/**
 * Eight packages as one partition of a whole. A treemap encodes value as area,
 * which the eye reads worse than length and far better than angle, and it is the
 * only form here that stays readable at fifty items. Two rules keep it honest: no
 * negative values, because an area cannot be negative, and the tiles have to sum
 * to something the reader recognises as the whole — under a dozen items with a
 * ranking to read, a BarChart is the more precise encoding, since a treemap
 * deliberately does not order its tiles by value alone.
 */
export function Example() {
  return (
    <TreemapChart title="Bundle size by package" data={packages} showLabels>
      <TreemapChart.Tooltip />
    </TreemapChart>
  )
}
