'use client'

import { Histogram } from '@misoto22/folio/charts'

// A fixed sample with two humps in it — a warm cache path and a cold one. A
// box plot of these numbers draws one tidy box and says nothing about that.
const samples = [
  62, 64, 65, 65, 66, 67, 67, 68, 68, 68, 69, 69, 70, 70, 70, 71, 71, 72, 72, 73, 73, 74, 74, 75,
  75, 76, 77, 78, 79, 80, 82, 84, 86, 88, 91, 95, 99, 104, 110, 118, 126, 134, 141, 147, 152, 156,
  159, 162, 164, 166, 167, 168, 169, 170, 170, 171, 172, 172, 173, 174, 175, 176, 178, 180, 183,
  187, 192, 198, 205, 214, 226, 241, 259, 281, 308,
]

/**
 * The shape of one distribution, which is what a box plot structurally cannot
 * show: these 75 samples have two humps in them — a warm cache path and a cold
 * one — and the same numbers draw a single tidy box that says nothing about
 * either. Left to itself the chart bins by Freedman–Diaconis, 2 times IQR times
 * n to the power of minus a third, which reads the interquartile range rather
 * than the range, so one far outlier cannot stretch the picture into one tall
 * bar and forty empty ones. Say which rule drew the histogram, as the
 * description does here, because the shape is a property of the bin width as
 * much as of the data.
 */
export function Example() {
  return (
    <Histogram
      title="Request duration"
      showTitle
      description="Binned by Freedman–Diaconis"
      values={samples}
    >
      <Histogram.Grid />
      <Histogram.XAxis label="ms" />
      <Histogram.YAxis />
      <Histogram.Tooltip />
      <Histogram.Bars />
    </Histogram>
  )
}
