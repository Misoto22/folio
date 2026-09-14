'use client'

import { Button, Combobox, Field, Text } from '@misoto22/folio'
import { useState } from 'react'

const REVIEWERS = [
  { value: 'maya', label: 'Maya Chen', keywords: ['design'] },
  { value: 'tomas', label: 'Tomás Ferreira', keywords: ['platform'] },
  { value: 'priya', label: 'Priya Nair', keywords: ['platform', 'security'] },
  { value: 'jonas', label: 'Jonas Wirth', keywords: ['design'] },
]

/**
 * A controlled Combobox, and the one correct way to empty it. Spell “nothing
 * chosen” as an empty string: value={undefined} is precisely how this component
 * decides it is UNCONTROLLED, so clearing that way hands it back its own state
 * and it stops following the parent from then on — the bug reads as a picker
 * that ignores every reset after the first. The readout below is the state,
 * which is the point of holding it out here.
 */
export function Example() {
  const [reviewer, setReviewer] = useState('')

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <Field label="Reviewer" className="w-full">
        <Combobox
          label="Reviewer"
          options={REVIEWERS}
          value={reviewer}
          onValueChange={setReviewer}
          placeholder="Unassigned"
          searchPlaceholder="Search by name or team"
          emptyMessage="Nobody by that name — try a team, like platform."
        />
      </Field>
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          disabled={reviewer === ''}
          onClick={() => setReviewer('')}
        >
          Unassign
        </Button>
        <Text size="xs" tone="muted">
          value is {reviewer === '' ? 'an empty string' : reviewer}
        </Text>
      </div>
    </div>
  )
}
