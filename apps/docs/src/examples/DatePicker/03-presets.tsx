'use client'

import { DatePicker, Field } from '@misoto22/folio'

/**
 * The rail beside the grid — off by default on a single picker and on by
 * default for a range, because “last 30 days” is most of what a range picker is
 * ever asked for while a single date is usually a specific one. They are plain
 * buttons rather than a menu, so they set the same value the grid sets and Tab
 * in the same pass as it. Each shortcut is computed on the click, not at render:
 * a list built once freezes “today” at whenever the page loaded.
 */
export function Example() {
  return (
    <Field
      label="Remind me on"
      hint="Shortcuts are computed when clicked, so “today” means today even on a tab left open overnight."
      className="w-full max-w-xs"
    >
      <DatePicker label="Remind me on" presets />
    </Field>
  )
}
