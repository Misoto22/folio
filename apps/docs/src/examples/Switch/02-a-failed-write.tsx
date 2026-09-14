'use client'

import { Alert, Switch } from '@misoto22/folio'
import { useEffect, useRef, useState } from 'react'

/**
 * The flip has already claimed the change happened, so a write that fails has
 * to be handled at the control: put the thumb back, and say why. Turn this one
 * on — the request behind it fails a moment later, the switch returns to off
 * and the reason appears beneath it. A switch left on over a write that never
 * landed is a page showing a setting the server does not have. Keep the flip
 * itself instant even when the write is not: an optimistic thumb with a quiet
 * undo beats a spinner on a control whose whole claim is that it already took
 * effect.
 */
export function Example() {
  const [on, setOn] = useState(false)
  const [failed, setFailed] = useState(false)
  const pending = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(pending.current), [])

  const save = (next: boolean) => {
    setOn(next)
    setFailed(false)
    if (!next) return
    // Stands in for the write. The thumb moved first, optimistically; this is
    // the half most implementations leave out.
    pending.current = setTimeout(() => {
      setOn(false)
      setFailed(true)
    }, 900)
  }

  return (
    <div className="flex max-w-sm flex-col gap-3">
      <label className="flex cursor-pointer items-center gap-3 text-sm text-(--ink-2)">
        <Switch checked={on} onCheckedChange={save} />
        Two-factor authentication
      </label>
      {failed && (
        <Alert tone="danger" title="Could not reach the authentication service.">
          Two-factor authentication is still off. Try again in a moment.
        </Alert>
      )}
    </div>
  )
}
