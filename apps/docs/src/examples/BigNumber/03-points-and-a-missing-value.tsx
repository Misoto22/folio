'use client'

import { BigNumber } from '@misoto22/folio/charts'

/** A change in percentage POINTS, which is not what the default prints. */
const points = (value: number): string => `${value > 0 ? '+' : ''}${value.toFixed(1)} pts`

/**
 * Two things this component refuses to guess. The default delta format is a
 * signed percentage, so 0.6 would print as plus 60 percent — right for a ratio
 * and wrong for a rate that is already a percentage, where the change is 0.6
 * percentage points; format is how a call site says which of the two it is
 * holding. The second card has no figure yet and no delta at all: value takes a
 * node rather than a number precisely so the call site can print an em dash
 * there, because a zero would be a claim and a change against nothing has no
 * direction to point in.
 */
export function Example() {
  return (
    <div className="grid w-full gap-10 sm:grid-cols-2">
      <BigNumber
        label="Checkout conversion"
        value="4.8%"
        delta={{ value: 0.6, label: 'vs last quarter', intent: 'up-is-good', format: points }}
      />
      <BigNumber label="Refund rate" value="—" />
    </div>
  )
}
