'use client'

import { Button, Field, Select, SelectItem, Text } from '@misoto22/folio'
import { useState } from 'react'

/**
 * name, and what it is for. The trigger is a button, and Radix renders the
 * hidden native select carrying the value only when the control is inside a
 * form — and only a named one sends anything, so a select without name submits
 * nothing at all and the server sees a field nobody filled in. Save, and the
 * line below prints what FormData actually received.
 */
export function Example() {
  const [sent, setSent] = useState<string>()

  return (
    <form
      className="flex w-full max-w-xs flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        setSent(String(new FormData(event.currentTarget).get('currency') ?? 'nothing'))
      }}
    >
      <Field label="Currency" className="w-full">
        <Select label="Currency" name="currency" defaultValue="aud">
          <SelectItem value="aud">Australian dollar</SelectItem>
          <SelectItem value="jpy">Japanese yen</SelectItem>
          <SelectItem value="usd">United States dollar</SelectItem>
        </Select>
      </Field>
      <Button type="submit" variant="secondary" className="self-start">
        Save
      </Button>
      {sent !== undefined && (
        <Text size="sm" tone="muted">
          The form sent currency = {sent}
        </Text>
      )}
    </form>
  )
}
