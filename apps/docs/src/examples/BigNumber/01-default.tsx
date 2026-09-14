'use client'

import { BigNumber } from '@misoto22/folio/charts'

/**
 * Three deltas, each with its direction stated by the call site rather than
 * inferred from the sign: errors down 12 percent is good news and revenue down 12
 * percent is not, and no component can tell which one it is holding, so intent is
 * what decides whether a change is tinted ok or danger. The arrow and the
 * screen-reader word carry that same reading, which is what keeps it legible in
 * greyscale, under forced colours, and to a reader who cannot separate the two
 * tints. A delta of zero is flat — a sideways arrow and no tint at all — which is
 * why a neutral intent still has something to say.
 */
export function Example() {
  return (
    <div className="grid w-full gap-10 sm:grid-cols-3">
      <BigNumber
        label="Monthly revenue"
        value="$48,210"
        delta={{ value: 0.124, label: 'vs last month', intent: 'up-is-good' }}
      />
      <BigNumber
        label="Error rate"
        value="2.4%"
        delta={{ value: 0.08, label: 'vs last week', intent: 'down-is-good' }}
      />
      <BigNumber
        label="Active projects"
        value="1,204"
        delta={{ value: 0, label: 'vs last month', intent: 'neutral' }}
      />
    </div>
  )
}
