'use client'

import { Slider } from '@misoto22/folio'

/**
 * A slider is a control for a neighbourhood, and this is the way out of it.
 * Somebody who needs 1,150 rather than roughly 1,200 was previously dragging a
 * 16px thumb across a hundred steps to get there, or was given a second input
 * beside the track that had to be kept in step by hand; editable puts the box
 * where the number already was.
 *
 * It shows format's output at rest and the bare number while it has focus, so a
 * reader still sees $1,200 and a typist is never asked to type a currency
 * symbol back. On a range, each end gets its own box and each is held inside
 * the other — typing 90 into the lower end of a range sitting at 70 lands on
 * 70, because the two thumbs cannot cross.
 */
export function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Slider
        label="Monthly budget"
        defaultValue={[1200]}
        max={5000}
        step={50}
        editable
        format={(n) => `$${n}`}
      />
      <Slider
        label={['Minimum price', 'Maximum price']}
        defaultValue={[20, 70]}
        max={100}
        step={5}
        editable
        format={(n) => `$${n}`}
      />
    </div>
  )
}
