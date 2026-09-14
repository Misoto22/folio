import { DiagramLegend, variantLegend } from '@misoto22/folio/diagrams'

/**
 * variantLegend keys the RELATIONSHIPS rather than the boxes, drawing each entry
 * as the stroke itself — the heavier weight of a main path, the long dash of a
 * line that crosses a trust boundary, the short dash of one that does not block.
 * Leave the return variant out of a key like this: it is painted exactly as
 * dashed is and told apart in the figure by an open arrowhead, which a 14 by 14
 * sample has no room to show, so listing both gives a reader two identical marks
 * with different names. The second row overrides one label and passes title null
 * for a bare row, since the key above it has already said Key.
 */
export function Example() {
  return (
    <div className="flex flex-col gap-6">
      <DiagramLegend title="Lines" entries={variantLegend(['default', 'emphasis', 'security', 'dashed'])} />
      <DiagramLegend
        title={null}
        entries={variantLegend(['emphasis', 'dashed'], {
          dashed: { label: 'Published to a topic' },
        })}
      />
    </div>
  )
}
