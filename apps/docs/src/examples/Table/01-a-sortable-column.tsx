'use client'

import { Badge, TBody, TD, TH, THead, TR, Table, type SortDirection } from '@misoto22/folio'
import { useState } from 'react'

const ROWS = [
  { sha: 'a1b2c3d', branch: 'main', seconds: 134, state: 'passed' as const },
  { sha: '9f8e7d6', branch: 'codex/ui-library', seconds: 161, state: 'passed' as const },
  { sha: '4c5b6a7', branch: 'codex/photo-cache', seconds: 62, state: 'failed' as const },
  { sha: '77aa2b1', branch: 'main', seconds: 140, state: 'passed' as const },
]

const format = (seconds: number) => `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, '0')}s`

/**
 * Sorting is opt-in per column, because a table where every header is a button
 * invites sorting a column the data cannot be ordered by. A sortable header
 * renders a real button INSIDE the th — a click handler on the cell would not
 * be focusable and would not be announced, so the sort would exist for a mouse
 * and for nothing else — and sets aria-sort from sortDirection, which is the
 * only way a screen reader learns the table is ordered at all. Each header
 * carries its own aria-sort and nothing coordinates them, so reset the others
 * to none when the sort moves. caption is required and hidden by default: it
 * names the scroll region as well as the table.
 */
export function Example() {
  const [sort, setSort] = useState<SortDirection>('none')

  const rows =
    sort === 'none'
      ? ROWS
      : [...ROWS].sort((a, b) => (sort === 'ascending' ? a.seconds - b.seconds : b.seconds - a.seconds))

  return (
    <Table caption="Recent deploys">
      <THead>
        <TR>
          <TH>Commit</TH>
          <TH>Branch</TH>
          {/* Sorting is opt-in per column: a table where every header is a
              button invites sorting a column the data cannot be ordered by. */}
          <TH
            align="end"
            sortable
            sortDirection={sort}
            onSort={() => setSort(sort === 'ascending' ? 'descending' : 'ascending')}
          >
            Duration
          </TH>
          <TH align="center">State</TH>
        </TR>
      </THead>
      <TBody>
        {rows.map((row) => (
          <TR key={row.sha}>
            <TD className="font-mono text-xs">{row.sha}</TD>
            <TD>{row.branch}</TD>
            {/* Numbers belong at the end edge, so their digits line up. */}
            <TD align="end" className="tabular-nums">
              {format(row.seconds)}
            </TD>
            <TD align="center">
              <Badge tone={row.state === 'passed' ? 'success' : 'danger'}>{row.state}</Badge>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  )
}
