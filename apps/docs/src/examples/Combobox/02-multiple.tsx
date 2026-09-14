'use client'

import { Combobox, Field } from '@misoto22/folio'

const TAGS = [
  { value: 'film', label: 'Film' },
  { value: 'digital', label: 'Digital' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'landscape', label: 'Landscape' },
  { value: 'street', label: 'Street' },
  { value: 'night', label: 'Night' },
]

/**
 * Several at once, with the trigger summarising rather than listing: two labels,
 * then a count. That threshold is what stops the field growing with its value
 * and reflowing the form on every pick. The panel stays open while you choose,
 * and the clear control beside the chevron is a span with a button role — a
 * real nested button inside the trigger is invalid markup that browsers
 * reparent out of the field entirely. The trigger is named by its label and
 * its summary together — aria-labelledby pointing at both — so a screen reader
 * hears “Tags 3 selected” rather than only the label, and the count is
 * confirmable without opening the panel.
 */
export function Example() {
  return (
    <Field
      label="Tags"
      hint="The panel stays open while you pick; past two it counts instead of listing."
      className="w-full max-w-xs"
    >
      <Combobox multiple label="Tags" options={TAGS} defaultValue={['film']} placeholder="Add tags" />
    </Field>
  )
}
