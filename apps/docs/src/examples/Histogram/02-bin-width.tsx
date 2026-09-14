'use client'

import { ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import { Histogram } from '@misoto22/folio/charts'
import { useState } from 'react'
import { ExampleControls } from '@/components/ExampleControls'

const samples = [
  62, 64, 65, 65, 66, 67, 67, 68, 68, 68, 69, 69, 70, 70, 70, 71, 71, 72, 72, 73, 73, 74, 74, 75,
  75, 76, 77, 78, 79, 80, 82, 84, 86, 88, 91, 95, 99, 104, 110, 118, 126, 134, 141, 147, 152, 156,
  159, 162, 164, 166, 167, 168, 169, 170, 170, 171, 172, 172, 173, 174, 175, 176, 178, 180, 183,
  187, 192, 198, 205, 214, 226, 241, 259, 281, 308,
]

const WIDTHS = ['auto', '5', '14', '40'] as const

/**
 * The same numbers, four times. bins takes a count of equal-width buckets, and
 * moving it moves the picture: at five the two humps merge into one, at forty
 * the shape dissolves into a row of one-count bars, and auto hands the choice
 * back to Freedman–Diaconis. That is not a defect to be tuned away — binning IS
 * this — so the defences are to name the rule that drew the picture, as the
 * title does, and to look at more than one width before believing a feature
 * such as the gap between two humps.
 */
export function Example() {
  const [choice, setChoice] = useState<(typeof WIDTHS)[number]>('auto')

  return (
    <div className="flex w-full flex-col gap-4">
      <ExampleControls>
        <ToggleGroup
          type="single"
          value={choice}
          onValueChange={(next) => next && setChoice(next as (typeof WIDTHS)[number])}
          aria-label="Bin count"
        >
          {WIDTHS.map((option) => (
            <ToggleGroupItem key={option} value={option}>
              {option === 'auto' ? 'auto' : `${option} bins`}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </ExampleControls>

      <Histogram
        title={`Request duration — ${choice === 'auto' ? 'Freedman–Diaconis' : `${choice} bins`}`}
        values={samples}
        bins={choice === 'auto' ? undefined : Number(choice)}
      >
        <Histogram.Grid />
        <Histogram.XAxis label="ms" />
        <Histogram.YAxis />
        <Histogram.Tooltip />
        <Histogram.Bars />
      </Histogram>
    </div>
  )
}
