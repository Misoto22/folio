'use client'

import { Slider } from '@misoto22/folio'

/**
 * One value, then two, both with the readout on. Always pass defaultValue or
 * value: the thumbs are rendered from this component's own array rather than
 * from Radix's default, so a Slider given neither draws a track with nothing on
 * it to drag. A two-thumb range needs two names — every thumb after the first
 * falls back to the first name, and both ends of a price filter otherwise
 * announce themselves as Minimum. The heading above the numbers prints that
 * first name only, so read it as the start of the pair rather than as a label
 * for both.
 */
export function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Slider label="Quality" defaultValue={[80]} max={100} step={5} showValue format={(n) => `${n}%`} />
      <Slider
        label={['Minimum price', 'Maximum price']}
        defaultValue={[20, 70]}
        max={100}
        step={5}
        showValue
        format={(n) => `$${n}`}
      />
    </div>
  )
}
