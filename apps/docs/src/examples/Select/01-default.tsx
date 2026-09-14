'use client'

import { Field, Select, SelectGroup, SelectItem, SelectLabel, SelectSeparator } from '@misoto22/folio'

/**
 * Two groups under mono headings, divided by a hairline. Reach for SelectGroup
 * and SelectLabel rather than a disabled item used as a heading: a disabled
 * item is still an option, so a screen reader counts it and announces a list
 * one longer than it is. The panel is ours the whole way down, which is the
 * point — it does not change typeface, spacing and selection colour the moment
 * it opens. Past roughly a dozen options this becomes a Combobox, because a
 * list nobody can filter is slower to scan than one you can type into.
 */
export function Example() {
  return (
    <Field label="Region" hint="The list is ours, not the platform’s — open it." className="w-full max-w-xs">
      <Select label="Region" defaultValue="au">
        <SelectGroup>
          <SelectLabel>Oceania</SelectLabel>
          <SelectItem value="au">Australia</SelectItem>
          <SelectItem value="nz">New Zealand</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="jp">Japan</SelectItem>
          <SelectItem value="sg">Singapore</SelectItem>
          <SelectItem value="cn">China</SelectItem>
        </SelectGroup>
      </Select>
    </Field>
  )
}
