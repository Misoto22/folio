'use client'

import { WaterfallChart, formatNumber, type WaterfallStep } from '@misoto22/folio/charts'

// The closing bar carries no value of its own: it is whatever the deltas add
// up to, so it can never disagree with the steps above it.
const steps: WaterfallStep[] = [
  { name: 'FY24 ARR', value: 4200, type: 'total' },
  { name: 'New business', value: 1180 },
  { name: 'Expansion', value: 640 },
  { name: 'Downgrades', value: -310 },
  { name: 'Churn', value: -820 },
  { name: 'FY25 ARR', type: 'total' },
]

/**
 * An opening total, four signed contributions, and a closing bar that carries no
 * value of its own: it is whatever the deltas add up to, so it can never disagree
 * with the steps above it. Decreases take the 45 degree hatch and increases the
 * solid fill — texture rather than a second colour, so the reading survives
 * greyscale and forced colours — and a total is told from an increase by geometry,
 * since it is the only kind of bar standing on the baseline. The steps here are
 * simultaneous and their order is editorial, which is what the description says
 * out loud: the arithmetic survives any order, but the connectors draw a sequence
 * and a reader will take the leftmost bar as the first cause.
 */
export function Example() {
  return (
    <WaterfallChart
      title="ARR bridge, FY24 to FY25"
      showTitle
      description="Thousands of AUD. The steps are simultaneous; the order is editorial."
      data={steps}
      formatValue={formatNumber({ style: 'compact' })}
    >
      <WaterfallChart.Grid />
      <WaterfallChart.XAxis />
      <WaterfallChart.YAxis />
      <WaterfallChart.Tooltip />
      <WaterfallChart.Bars showValues />
    </WaterfallChart>
  )
}
