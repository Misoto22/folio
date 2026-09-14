import { Tag } from '@misoto22/folio'

/**
 * A facet row with one facet chosen. The accent fill is the system's one
 * pointer at a choice, so a row needs an off state to come back to — every tag
 * active spends the mark that means "this one" on all of them. Nothing here is
 * clickable: without onRemove a Tag is a plain span, and the button, the focus
 * ring and the aria-pressed that makes the selection audible belong at the call
 * site, as the next example shows.
 */
export function Example() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tag active>All</Tag>
      <Tag>TypeScript</Tag>
      <Tag>Rust</Tag>
      <Tag>Photography</Tag>
    </div>
  )
}
