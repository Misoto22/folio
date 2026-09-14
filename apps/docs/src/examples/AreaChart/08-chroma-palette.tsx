'use client'

import { AreaChart, type ChartConfig } from '@misoto22/folio/charts'

const data = [
  { month: 'Jan', desktop: 186, mobile: 80, tablet: 40 },
  { month: 'Feb', desktop: 305, mobile: 200, tablet: 72 },
  { month: 'Mar', desktop: 237, mobile: 120, tablet: 55 },
  { month: 'Apr', desktop: 273, mobile: 190, tablet: 88 },
  { month: 'May', desktop: 209, mobile: 130, tablet: 61 },
  { month: 'Jun', desktop: 314, mobile: 240, tablet: 96 },
]

const config = {
  desktop: { label: 'Desktop' },
  mobile: { label: 'Mobile' },
  tablet: { label: 'Tablet' },
} satisfies ChartConfig

/**
 * The sanctioned way to add hue, and the only one: the attribute on any ancestor
 * re-points the eight series custom properties at a categorical palette validated
 * against both grounds, and nothing in the chart below mentions a colour. The
 * alternative is hand-picked hexes in a config's colors array, which is where an
 * unvalidated, colour-blind-hostile palette gets born. Three of the light steps
 * sit below 3:1 on paper, which is the documented reason the legend is not
 * optional above one series.
 */
export function Example() {
  return (
    <div data-chart-palette="chroma" className="w-full">
      <AreaChart title="Visitors per month" config={config} data={data} xDataKey="month">
        <AreaChart.Grid />
        <AreaChart.XAxis dataKey="month" />
        <AreaChart.Legend />
        <AreaChart.Tooltip />
        <AreaChart.Area dataKey="desktop" variant="gradient" />
        <AreaChart.Area dataKey="mobile" variant="solid" />
        <AreaChart.Area dataKey="tablet" variant="lines" />
      </AreaChart>
    </div>
  )
}
