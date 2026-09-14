'use client'

import { Field, Input } from '@misoto22/folio'
import { useState } from 'react'

/**
 * hint and error are the same line, and the error wins. Delete the @ and watch
 * the format disappear at the one moment a reader needed it — which is why the
 * error below repeats the shape of a good answer instead of only saying no.
 * Passing error is also all the invalid state this row needs: the field puts
 * aria-invalid on the input, and Input reads either spelling, so adding invalid
 * as well states one fact from two places that can disagree.
 */
export function Example() {
  const [email, setEmail] = useState('maya.chen@studio.example')
  const wrong = email.length > 0 && !email.includes('@')

  return (
    <Field
      label="Work email"
      required
      hint="The receipt goes here — use the address on the invoice."
      error={wrong ? 'Enter a full address, like maya.chen@studio.example.' : undefined}
      className="w-full max-w-sm"
    >
      <Input
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
    </Field>
  )
}
