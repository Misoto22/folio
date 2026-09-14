'use client'

import { Sparkline, type SparklineVariant } from '@misoto22/folio/charts'

const data = [12, 18, 9, 24, 30, 22, 41, 36, 48, 44, 57, 61]

const VARIANTS: SparklineVariant[] = ['line', 'area', 'bars']

/**
 * The three marks the same run can be drawn with: line reads a trend, area weights
 * that trend toward volume, and bars separate the readings, which is what a
 * discrete count wants. All three are axis-less, gridless and label-less by
 * design — every piece of chrome that would let one answer "what value exactly"
 * also makes it too big to sit inline, which was the only reason to reach for it.
 * The exact figure is printed beside the run by value instead, and on line and
 * area the last point is dotted, since that is usually the one being asked
 * about.
 */
export function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex items-center gap-4">
          <span className="w-12 shrink-0 mono-meta text-(--ink-3-aa)">{variant}</span>
          <Sparkline label={`Weekly signups, ${variant}`} data={data} variant={variant} value="61" />
        </div>
      ))}
    </div>
  )
}
