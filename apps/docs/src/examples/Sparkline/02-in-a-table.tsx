'use client'

import { TBody, TD, TH, THead, TR, Table } from '@misoto22/folio'
import { Sparkline } from '@misoto22/folio/charts'

const ROWS = [
  { channel: 'Organic search', trend: [42, 48, 44, 57, 61, 66, 71], now: '71k' },
  { channel: 'Paid social', trend: [61, 55, 58, 44, 39, 34, 28], now: '28k' },
  { channel: 'Direct', trend: [22, 24, 23, 26, 25, 27, 29], now: '29k' },
  { channel: 'Referral', trend: [8, 9, 14, 11, 19, 17, 24], now: '24k' },
]

// Every row shares one domain. On independent domains each row would peak and
// trough identically, which is how a table of sparklines becomes actively
// misleading — and it is the single most common way they are misused.
const DOMAIN: [number, number] = [0, 80]

/**
 * A column of sparklines, every one of them pinned to the same domain. That is the
 * whole lesson: on domains derived per row, each run peaks and troughs at the same
 * heights, so a channel that halved and a channel that doubled draw the same
 * picture — the single way a table of sparklines becomes actively misleading. Each
 * run also carries its own label, because a screen reader meets four of these in
 * four cells and nothing else in the row names them.
 */
export function Example() {
  return (
    <Table caption="Visitors by channel, last seven weeks">
      <THead>
        <TR>
          <TH>Channel</TH>
          <TH>Trend</TH>
          <TH align="end">This week</TH>
        </TR>
      </THead>
      <TBody>
        {ROWS.map((row) => (
          <TR key={row.channel}>
            <TD>{row.channel}</TD>
            <TD>
              <Sparkline
                label={`${row.channel}, last seven weeks`}
                data={row.trend}
                domain={DOMAIN}
                height={22}
              />
            </TD>
            <TD align="end" className="font-mono tabular-nums">
              {row.now}
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  )
}
