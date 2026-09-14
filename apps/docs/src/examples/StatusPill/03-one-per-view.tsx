import { Badge, Separator, StatusPill } from '@misoto22/folio'

/**
 * One pill for the view, badges for the rows under it. The label is an
 * uppercase eyebrow at 0.12em tracking — the loudest small type the system has
 * — so a column of pills down a list is every row shouting the same way. Badge
 * carries the same status tones in plain 12px mono, which is what a per-record
 * state should look like.
 */
export function Example() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <span className="font-heading text-[length:var(--fs-item)] text-(--ink)">
          Deploy pipeline
        </span>
        <StatusPill tone="warning">Degraded</StatusPill>
      </div>
      <Separator />
      <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm text-(--ink-2)">
        <li className="flex items-center justify-between gap-4">
          Build <Badge tone="success">Passed</Badge>
        </li>
        <li className="flex items-center justify-between gap-4">
          Typecheck <Badge tone="success">Passed</Badge>
        </li>
        <li className="flex items-center justify-between gap-4">
          Visual diff <Badge tone="warning">2 changed</Badge>
        </li>
      </ul>
    </div>
  )
}
