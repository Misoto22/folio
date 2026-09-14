'use client'

import { PieChart, type ChartConfig } from '@misoto22/folio/charts'

const data = [
  { browser: 'chrome', visitors: 275 },
  { browser: 'safari', visitors: 200 },
  { browser: 'firefox', visitors: 187 },
  { browser: 'edge', visitors: 173 },
]

const config = {
  chrome: { label: 'Chrome' },
  safari: { label: 'Safari' },
  firefox: { label: 'Firefox' },
  edge: { label: 'Edge' },
} satisfies ChartConfig

/**
 * Two answers to the same weakness, side by side. On the left, PieChart.Label
 * prints the value on each wedge: a pie's whole weakness is that an angle is
 * hard to read, and a printed number removes the guess entirely. On the right
 * the question is not the ranking but one wedge — glowingSectors haloes Chrome,
 * and isClickable on both the pie and the legend lets a click drop every other
 * sector to 15 percent opacity so the chosen one stands alone. Reach for the
 * labels when the numbers matter, and for the glow when only one of them does.
 */
export function Example() {
  return (
    <div className="grid w-full gap-8 lg:grid-cols-2">
      <PieChart
        title="Labelled"
        showTitle
        config={config}
        data={data}
        dataKey="visitors"
        nameKey="browser"
      >
        <PieChart.Pie innerRadius="45%">
          <PieChart.Label />
        </PieChart.Pie>
        <PieChart.Legend />
      </PieChart>

      <PieChart
        title="One wedge is the point"
        showTitle
        config={config}
        data={data}
        dataKey="visitors"
        nameKey="browser"
      >
        <PieChart.Background variant="overlapping-circles" />
        <PieChart.Pie innerRadius="50%" glowingSectors={['chrome']} isClickable />
        <PieChart.Tooltip />
        <PieChart.Legend isClickable />
      </PieChart>
    </div>
  )
}
