'use client'

import { Combobox, Field } from '@misoto22/folio'

const CAMERAS = [
  { value: 'x100v', label: 'Fujifilm X100V', keywords: ['fuji', 'compact'] },
  { value: 'xt5', label: 'Fujifilm X-T5', keywords: ['fuji'] },
  { value: 'a7iv', label: 'Sony α7 IV', keywords: ['sony', 'alpha'] },
  { value: 'r6', label: 'Canon EOS R6', keywords: ['canon'] },
  { value: 'z6', label: 'Nikon Z6 III', keywords: ['nikon'] },
  { value: 'gr3', label: 'Ricoh GR III', keywords: ['ricoh', 'compact'] },
  { value: 'm11', label: 'Leica M11', keywords: ['leica', 'rangefinder'] },
]

/**
 * Seven bodies behind a filter that matches more than it prints: type compact
 * and two come up though neither says the word. Put readable text in label and
 * anything else worth matching in keywords — cmdk scores against the option's
 * value as well, so a list keyed by UUID is being ranked on a string no reader
 * will ever type. The highlight moves through aria-activedescendant while focus
 * stays in the input, which is why the typed text stays editable. Nothing
 * virtualises here: every option renders on open and stays there behind the
 * filter, so a thousand of them is a DOM cost, not a search cost.
 */
export function Example() {
  return (
    <Field label="Camera" hint="Type to filter — “compact” matches two of them." className="w-full max-w-xs">
      <Combobox label="Camera" options={CAMERAS} placeholder="Pick a body" />
    </Field>
  )
}
