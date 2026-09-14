import { Metric } from '@misoto22/folio'

/**
 * asChild hands the whole plate to the caller's own element, which is how a
 * tile becomes a link without this package importing a router. The slotted
 * child takes no children of its own — the label, the figure and the line under
 * them are injected into it, so an anchor written as a self-closing tag is the
 * whole call. Because the tile IS the link, its accessible name is every word
 * in it read in order, which is the reason to keep the detail line short here
 * even where a longer one would read fine on a plain tile.
 */
export function Example() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      <Metric asChild label="Jobs" value="12" detail="3 waiting">
        <a href="#/jobs" />
      </Metric>
      <Metric asChild label="Approvals" value="4" detail="oldest 2 days">
        <a href="#/approvals" />
      </Metric>
    </div>
  )
}
