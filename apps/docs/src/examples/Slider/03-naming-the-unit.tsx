'use client'

import { Slider } from '@misoto22/folio'

/**
 * format prints, and nothing more: it renders the readout above the track, and
 * nothing here sets aria-valuetext, so a thumb showing 12s announces the bare
 * number 12. The unit belongs in the name, which is announced — “Request
 * timeout in seconds”, read together with 12, is a fact, while “Timeout” read
 * with 12 is a riddle. The second slider carries no format at all, which is
 * what a plain count should look like.
 */
export function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Slider
        label="Request timeout in seconds"
        defaultValue={[12]}
        min={1}
        max={60}
        showValue
        format={(n) => `${n}s`}
      />
      <Slider label="Retries before giving up" defaultValue={[3]} max={10} showValue />
    </div>
  )
}
