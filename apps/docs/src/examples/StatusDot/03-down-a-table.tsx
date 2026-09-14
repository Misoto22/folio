import { StatusDot, Table, TBody, TD, TH, THead, TR } from '@misoto22/folio'

/**
 * A column of states, at the size the dot is for. sm is 7px against md's 8px —
 * an optical adjustment for sitting beside smaller type, not a size scale, so
 * nothing in a layout should be built on the difference. The dot sits directly
 * in the flex row beside its label: shrink-0 is what keeps it round, and one
 * wrapped in a box that can shrink comes out an ellipse as soon as the label
 * runs long.
 */
export function Example() {
  return (
    <Table caption="Service health" density="compact">
      <THead>
        <TR>
          <TH>Service</TH>
          <TH>State</TH>
          <TH align="end">Last check</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD>api.misoto22.com</TD>
          <TD>
            <span className="inline-flex items-center gap-2">
              <StatusDot size="sm" pulse={false} /> Healthy
            </span>
          </TD>
          <TD align="end">30s ago</TD>
        </TR>
        <TR>
          <TD>Search index</TD>
          <TD>
            <span className="inline-flex items-center gap-2">
              <StatusDot size="sm" tone="warning" pulse={false} /> Rebuilding
            </span>
          </TD>
          <TD align="end">2m ago</TD>
        </TR>
        <TR>
          <TD>Image pipeline</TD>
          <TD>
            <span className="inline-flex items-center gap-2">
              <StatusDot size="sm" tone="neutral" pulse={false} /> Paused
            </span>
          </TD>
          <TD align="end">1h ago</TD>
        </TR>
      </TBody>
    </Table>
  )
}
