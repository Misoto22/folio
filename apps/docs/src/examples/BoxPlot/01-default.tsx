'use client'

import { BoxPlot } from '@misoto22/folio/charts'

// Raw observations, one array per region. The chart does the quartiles and
// Tukey's fences; nothing here has to know what a five-number summary is.
const data = [
  { name: 'Sydney', values: [182, 190, 194, 201, 205, 209, 214, 221, 236, 402] },
  { name: 'Singapore', values: [244, 251, 258, 262, 269, 274, 281, 290, 303, 318] },
  { name: 'Frankfurt', values: [310, 318, 325, 331, 338, 344, 352, 361, 379, 588] },
  { name: 'Oregon', values: [268, 275, 279, 284, 288, 293, 299, 308, 322, 341] },
]

/**
 * Four distributions in the ink four bars would take, handed over as raw
 * observations — the chart sorts them, takes quartiles the R type 7 way, and
 * stops each whisker at the most extreme reading still inside Tukey's 1.5 IQR
 * fence, so Sydney's 402 and Frankfurt's 588 fall out as dots rather than
 * stretching a whisker to a value nobody measured. What five numbers cannot
 * tell you is shape: a region with two humps in it draws the same box as a
 * smooth one centred in the same place. They cannot tell you sample size
 * either, since a box over ten readings and a box over ten thousand are drawn
 * identically — which is what count and BoxPlot.Boxes notch exist to fix. The
 * value axis is not anchored at zero, because dragging it there to be honest
 * about bar length would flatten every box into one band of pixels.
 */
export function Example() {
  return (
    <BoxPlot
      title="Response time by region"
      showTitle
      description="One box per edge location, 24 hours"
      data={data}
    >
      <BoxPlot.Grid />
      <BoxPlot.XAxis />
      <BoxPlot.YAxis label="ms" />
      <BoxPlot.Tooltip />
      <BoxPlot.Boxes />
    </BoxPlot>
  )
}
