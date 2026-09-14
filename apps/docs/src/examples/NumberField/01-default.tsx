'use client'

import { Field, NumberField } from '@misoto22/folio'

/**
 * The grip at the start of each field is the reason to reach for this rather
 * than an Input: drag it and the value sweeps through its neighbours, one step
 * every few pixels, ten steps at a time with Shift held. That is how a line
 * height or a radius is actually found — by passing through the wrong answers
 * until one looks right, not by typing candidates one at a time. The arrows do
 * the same journey from the keyboard, which is why the grip is not announced.
 */
export function Example() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-5">
      <Field label="Line height" hint="Between 1 and 3.">
        <NumberField defaultValue={1.5} min={1} max={3} step={0.1} />
      </Field>
      <Field label="Corner radius">
        <NumberField defaultValue={12} min={0} max={64} unit="px" />
      </Field>
    </div>
  )
}
