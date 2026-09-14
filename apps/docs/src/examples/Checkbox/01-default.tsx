'use client'

import { Checkbox } from '@misoto22/folio'
import { useState } from 'react'

const JOBS = ['Ship on merge', 'Notify the channel', 'Run the smoke tests']

/**
 * A select-all header over the rows it summarises. Some-but-not-all is the
 * indeterminate state, and it has to be driven through the controlled checked
 * prop: the glyph is chosen from props.checked, so an uncontrolled box never
 * draws the dash and reports the opposite of the truth. The state means “some
 * of the things under this one”, so it only belongs on a header — a leaf that
 * draws a dash is claiming a state its own value cannot hold. Note the labels:
 * the control renders none of its own, so the words, and the click target they
 * give it, are the call site's job.
 */
export function Example() {
  const [checked, setChecked] = useState<string[]>([JOBS[0]!])

  // "Some, but not all" is the indeterminate state — the one a plain unchecked
  // box would report as the opposite of the truth.
  const all = checked.length === JOBS.length
  const some = checked.length > 0 && !all

  return (
    <div className="flex flex-col gap-3 text-sm text-(--ink-2)">
      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox
          checked={some ? 'indeterminate' : all}
          onCheckedChange={(next) => setChecked(next === true ? JOBS : [])}
        />
        Select all
      </label>

      <div className="ms-6 flex flex-col gap-3 border-s border-(--rule) ps-4">
        {JOBS.map((job) => (
          <label key={job} className="flex cursor-pointer items-center gap-2.5">
            <Checkbox
              checked={checked.includes(job)}
              onCheckedChange={(next) =>
                setChecked((previous) =>
                  next === true ? [...previous, job] : previous.filter((item) => item !== job),
                )
              }
            />
            {job}
          </label>
        ))}
      </div>

      <label className="flex items-center gap-2.5 text-(--ink-3-aa)">
        <Checkbox disabled /> Requires admin
      </label>
    </div>
  )
}
