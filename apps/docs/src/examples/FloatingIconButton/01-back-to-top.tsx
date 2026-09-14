import { FloatingIconButton } from '@misoto22/folio'
import { RiArrowUpLine } from '@remixicon/react'

/**
 * A page-level affordance that stays reachable while the reader scrolls.
 * position is required and has no default, and its values are start and end in
 * reading order — end is the right in English and the left in Arabic. label is
 * set as aria-label and never renders, so a screen reader has the name and a
 * sighted reader has the glyph alone: pick a glyph that carries the meaning, or
 * wrap it in a Tooltip. The control is fixed to the viewport in real use; the
 * box around it here is what keeps the preview honest, since a fixed element
 * inside a transformed ancestor pins to that ancestor instead of the screen.
 */
export function Example() {
  return (
    <div className="relative h-32 w-full overflow-hidden rounded-(--radius) border border-(--rule) [&>button]:absolute">
      <FloatingIconButton position="end" label="Back to top">
        <RiArrowUpLine size={16} aria-hidden />
      </FloatingIconButton>
    </div>
  )
}
