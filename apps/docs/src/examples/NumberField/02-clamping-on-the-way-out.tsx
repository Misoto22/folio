'use client'

import { Field, NumberField, Text } from '@misoto22/folio'
import { useState } from 'react'

/**
 * The range is applied when the field is left, not on every keystroke. It has
 * to be: with a minimum of 10, clamping as you type makes 50 unreachable — the
 * 5 is pushed up to 10 before the 0 arrives. So the live figure below can sit
 * outside the range for as long as somebody is mid-number, and the value that
 * settles never does. Type 4, then tab away.
 */
export function Example() {
  const [retries, setRetries] = useState(30)

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <Field label="Retries" hint="Between 10 and 100.">
        <NumberField value={retries} onValueChange={setRetries} min={10} max={100} step={5} />
      </Field>
      <Text size="sm" tone="muted">
        Reported: {retries}
      </Text>
    </div>
  )
}
