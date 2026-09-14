'use client'

import { Button, Checkbox, Text } from '@misoto22/folio'
import { useState } from 'react'

/**
 * What a submitted form actually carries. An unticked box sends no entry at all
 * — not false, nothing — so a field the reader deliberately cleared and one
 * that was never rendered arrive at the server identically, and the default has
 * to be decided there rather than inferred from the payload. Untick both and
 * save to watch the keys disappear. Each box needs a name to send anything;
 * value is what it sends when it is on.
 */
export function Example() {
  const [sent, setSent] = useState<string>()

  return (
    <form
      className="flex max-w-sm flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        const keys = [...new FormData(event.currentTarget).keys()]
        setSent(keys.length > 0 ? keys.join(', ') : 'nothing at all')
      }}
    >
      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-(--ink-2)">
        <Checkbox name="backups" value="nightly" defaultChecked /> Nightly backups
      </label>
      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-(--ink-2)">
        <Checkbox name="telemetry" value="anonymous" /> Share anonymous usage data
      </label>
      <Button type="submit" variant="secondary" className="self-start">
        Save
      </Button>
      {sent !== undefined && (
        <Text size="sm" tone="muted">
          The form sent: {sent}
        </Text>
      )}
    </form>
  )
}
