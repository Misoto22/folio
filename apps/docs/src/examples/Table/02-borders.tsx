import { TBody, TD, TH, THead, TR, Table, type TableBorders } from '@misoto22/folio'

const OPTIONS: { value: TableBorders; note: string }[] = [
  { value: 'rows', note: 'the default — read down a column' },
  { value: 'grid', note: 'dense numbers, columns kept apart' },
  { value: 'bordered', note: 'loose on a page, not inside a card' },
  { value: 'bordered-grid', note: 'both' },
]

/**
 * The four border settings on the same two rows, so the rules are the only
 * thing changing. rows is the default and the right answer for reading down a
 * column: one hairline between records and nothing competing with the line the
 * eye is tracking. grid adds the vertical rules a dense numeric table needs;
 * bordered draws an edge around the whole thing, for a table loose on a page
 * rather than inside a card that already has one. There is no zebra striping at
 * any setting — in a monochrome system a striped row is a second surface
 * competing with the page ground. density compact halves the row padding from
 * 14px to 8px, which is what a table that is mostly numbers wants.
 */
export function Example() {
  return (
    <div className="flex w-full flex-col gap-8">
      {OPTIONS.map((option) => (
        <div key={option.value} className="flex flex-col gap-2">
          <p className="m-0 eyebrow text-(--ink-3-aa)">
            {option.value} — {option.note}
          </p>
          <Table caption={`${option.value} example`} borders={option.value} density="compact">
            <THead>
              <TR>
                <TH>Region</TH>
                <TH align="end">Orders</TH>
                <TH align="end">Revenue</TH>
              </TR>
            </THead>
            <TBody>
              <TR>
                <TD>Australia</TD>
                <TD align="end" className="tabular-nums">1,204</TD>
                <TD align="end" className="tabular-nums">$48,210</TD>
              </TR>
              <TR>
                <TD>Japan</TD>
                <TD align="end" className="tabular-nums">862</TD>
                <TD align="end" className="tabular-nums">$31,940</TD>
              </TR>
            </TBody>
          </Table>
        </div>
      ))}
    </div>
  )
}
