'use client'

import { ColorPicker, Field } from '@misoto22/folio'

/**
 * The panel works in OKLCH, which is the whole argument for it over the native
 * picker. In HSV — what <input type="color"> and most libraries use — a row of
 * constant lightness visibly darkens as it saturates, so somebody building a
 * palette is fighting the instrument. Here two colours at the same height on
 * the plane genuinely match, and the hue strip is taken at the lightness
 * already chosen rather than being a rainbow belonging to some other colour.
 *
 * The plane is a pair of real sliders under a painted canvas, so the arrows
 * move it and a screen reader is told which axis it is on.
 */
export function Example() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-5">
      <Field label="Brand colour">
        <ColorPicker label="Brand colour" defaultValue="#a78bfa" />
      </Field>
      <Field label="Accent" hint="Passed in as OKLCH, so it comes back as OKLCH.">
        <ColorPicker label="Accent" defaultValue="oklch(0.72 0.16 145)" />
      </Field>
    </div>
  )
}
