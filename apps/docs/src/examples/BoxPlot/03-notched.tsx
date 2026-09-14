'use client'

import { BoxPlot } from '@misoto22/folio/charts'

// Summaries that arrived already computed — with `count`, which is what a
// notch needs and what tells a box over 40 readings from a box over 4,000.
const data = [
  { name: 'Control', min: 180, q1: 214, median: 236, q3: 262, max: 318, count: 4200 },
  { name: 'Variant A', min: 176, q1: 208, median: 229, q3: 255, max: 310, count: 4180 },
  { name: 'Variant B', min: 184, q1: 226, median: 258, q3: 291, max: 356, count: 190 },
]

/**
 * Summaries that arrived already computed, which is the other shape this takes
 * — a warehouse hands back percentiles, never rows. count is what a notch
 * needs: the pinch is 1.58 times IQR over the square root of n, so two notches
 * that do not overlap are roughly a 95 percent test that those medians differ,
 * and Variant B's notch is wide because its sample is 190 against the others'
 * 4,000. That is the comparison the plain box hides, since a box over 190
 * readings and a box over 4,200 are drawn identically. The notch is clamped to
 * the quartiles rather than allowed to fold the box inside out, so a sample too
 * small for the comparison pinches to a sliver instead of reading as a
 * rendering fault.
 */
export function Example() {
  return (
    <BoxPlot
      title="Checkout latency by variant"
      showTitle
      description="Notch width falls with the square root of the sample"
      data={data}
    >
      <BoxPlot.Grid />
      <BoxPlot.XAxis />
      <BoxPlot.YAxis label="ms" />
      <BoxPlot.Tooltip />
      <BoxPlot.Boxes notch />
    </BoxPlot>
  )
}
