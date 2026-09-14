import { Button } from '@misoto22/folio'

/**
 * The three sizes on one variant, so the box is the only thing changing. Reach
 * for md nearly always: sm is 36px at the default density, under the 44px md
 * clears on its own, so a toolbar built out of it is a row of targets a thumb
 * misses (WCAG 2.5.5) — and lg is for the one action a page is actually about.
 */
export function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm" variant="secondary">Small</Button>
      <Button size="md" variant="secondary">Medium</Button>
      <Button size="lg" variant="secondary">Large</Button>
    </div>
  )
}
