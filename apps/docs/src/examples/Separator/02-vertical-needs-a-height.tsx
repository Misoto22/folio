import { Separator } from '@misoto22/folio'

/**
 * A meta row divided by vertical rules. The vertical form is h-full, which
 * against a parent with no height of its own resolves to zero — the element
 * renders, occupies nothing, and reads as a component that failed to load. Give
 * it a height, as here, or a row that stretches its children.
 */
export function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-(--ink-2)">
      <span>12 releases</span>
      <Separator orientation="vertical" className="h-4" />
      <span>0 rollbacks</span>
      <Separator orientation="vertical" className="h-4" />
      <span>99.98% uptime</span>
    </div>
  )
}
