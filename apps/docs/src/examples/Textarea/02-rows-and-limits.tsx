'use client'

import { Field, Textarea } from '@misoto22/folio'
import { useState } from 'react'

const LIMIT = 280

/**
 * rows sizes the box, maxLength caps it, and the hint says so. maxLength on its
 * own swallows the keystroke without explaining and truncates a paste one
 * character too long in silence, so the count below is not decoration — it is
 * the only warning a reader gets before the box stops accepting what they type.
 * Enter still means newline here, and should: a textarea that submits on Enter
 * has taken the one key the control exists to accept.
 */
export function Example() {
  const [notes, setNotes] = useState(
    'Front element has light cleaning marks. Glass is otherwise clear, shutter accurate at all speeds.',
  )

  return (
    <Field
      label="Condition notes"
      hint={`${LIMIT - notes.length} characters left of ${LIMIT}.`}
      className="w-full max-w-sm"
    >
      <Textarea
        rows={4}
        maxLength={LIMIT}
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />
    </Field>
  )
}
