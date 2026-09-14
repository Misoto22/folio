'use client'

import {
  Button,
  Checkbox,
  Field,
  Input,
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@misoto22/folio'

const BRANCHES = [
  'main',
  'codex/ui-library',
  'codex/photo-cache',
  'codex/agent-catalog',
  'codex/table-density',
  'codex/rtl-sweep',
]

/**
 * The case a Dialog cannot take: a filter list long enough to scroll. Docked to
 * end, the panel gets the full height of the viewport rather than Dialog's
 * 32rem by 85vh box, and the reader keeps the page edge as an anchor while the
 * list moves. Note the labels: Checkbox renders none of its own, so the words —
 * and the click target they give it — are the call site's job. Both footer
 * controls are SheetClose: closing through Radix is what puts focus back on the
 * trigger instead of leaving it inside a panel that is no longer on the page.
 */
export function Example() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Filter deploys</Button>
      </SheetTrigger>
      <SheetContent side="end" title="Filter deploys" description="Six branches, one search.">
        <div className="mt-4 flex flex-col gap-4">
          <Field label="Search">
            <Input type="search" placeholder="Branch or commit" />
          </Field>
          <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
            <legend className="mb-2 p-0 eyebrow text-(--ink-3-aa)">Branch</legend>
            {BRANCHES.map((branch) => (
              <label key={branch} className="flex cursor-pointer items-center gap-2.5 text-sm text-(--ink-2)">
                <Checkbox defaultChecked={branch === 'main'} />
                {branch}
              </label>
            ))}
          </fieldset>
          <div className="flex justify-end gap-3 pt-2">
            <SheetClose asChild>
              <Button variant="secondary">Cancel</Button>
            </SheetClose>
            <SheetClose asChild>
              <Button>Apply</Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
