'use client'

import { CollapsibleSection, Field, Input } from '@misoto22/folio'

/**
 * One thing that opens, on its own. CollapsibleSection is the composed root —
 * trigger, marker and panel already wired — and is what most call sites want.
 * The marker is a chevron rather than the accordion's plus, deliberately: this
 * reveals more of the same thing, where an accordion row opens a distinct
 * answer. The trigger is wrapped in no heading at all, unlike an accordion's,
 * so a page built out of these gives heading navigation nothing to stop at —
 * add a heading of your own when the section is a section. And do not flip the
 * title between Show more and Show less: aria-expanded already carries the
 * state, so the row would be announced with its state twice and under a new
 * name each time it is pressed.
 */
export function Example() {
  return (
    <div className="w-full max-w-md divide-y divide-(--rule) border-y border-(--rule)">
      <CollapsibleSection title="Advanced settings">
        <Field label="Retries" hint="How many times a failed job is tried again.">
          <Input type="number" defaultValue={3} />
        </Field>
      </CollapsibleSection>
    </div>
  )
}
