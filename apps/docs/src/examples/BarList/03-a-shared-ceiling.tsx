'use client'

import { BarList, formatNumber } from '@misoto22/folio/charts'

const thisQuarter = [
  { name: 'Enterprise', value: 92_400 },
  { name: 'Mid-market', value: 61_200 },
  { name: 'Self-serve', value: 28_900 },
  { name: 'Education', value: 9_600 },
]

const lastQuarter = [
  { name: 'Enterprise', value: 41_800 },
  { name: 'Mid-market', value: 33_500 },
  { name: 'Self-serve', value: 26_100 },
  { name: 'Education', value: 11_200 },
]

/** The larger of the two quarters, so neither list sets its own ceiling. */
const CEILING = 92_400

const money = formatNumber({ style: 'currency', currency: 'AUD', fractionDigits: 0 })

/**
 * Two lists that have to be read against each other, so both are given the same
 * max. Left to derive it, each takes its ceiling from its own largest row and
 * Enterprise fills its track in both — a quarter that more than doubled would
 * draw exactly like a quarter that stood still, and nothing on the page would say
 * otherwise. formatValue makes the numbers money; the default is the same compact
 * form the axes use, which is right for a count of visits and silent about a
 * currency.
 */
export function Example() {
  return (
    <div className="grid w-full gap-8 sm:grid-cols-2">
      <BarList
        label="New ARR this quarter"
        showLabel
        items={thisQuarter}
        max={CEILING}
        formatValue={money}
      />
      <BarList
        label="New ARR last quarter"
        showLabel
        items={lastQuarter}
        max={CEILING}
        formatValue={money}
      />
    </div>
  )
}
