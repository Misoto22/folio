import { Badge, TBody, TD, TH, THead, TR, Table, Timestamp } from '@misoto22/folio'

const DEPLOYS = [
  { sha: 'a1b2c3d', at: '2026-09-06T04:12:00.000Z', state: 'success' as const, label: 'Deployed' },
  { sha: '9f8e7d6', at: '2026-09-05T21:48:00.000Z', state: 'success' as const, label: 'Deployed' },
  { sha: '4c5b6a7', at: '2026-08-30T09:03:00.000Z', state: 'danger' as const, label: 'Rolled back' },
  { sha: '77aa2b1', at: '2026-07-19T13:27:00.000Z', state: 'success' as const, label: 'Deployed' },
]

/**
 * The real use, and the reason the component exists rather than a call to
 * toLocaleString at each site. auto is doing the work down this column: the
 * recent rows read as a relative gap and the older ones as calendar dates, and
 * the switch happens at a week, because past that the date is both the more
 * useful fact and the one that stops changing. It formats once per mount — a hundred
 * rows each holding a ticking interval to keep three hours ago honest is a cost
 * nobody asked for, so a list that must tick re-renders from above.
 */
export function Example() {
  return (
    <Table caption="Recent deploys">
      <THead>
        <TR>
          <TH>Commit</TH>
          <TH>Finished</TH>
          <TH align="end">Outcome</TH>
        </TR>
      </THead>
      <TBody>
        {DEPLOYS.map((deploy) => (
          <TR key={deploy.sha}>
            <TD className="font-mono text-xs">{deploy.sha}</TD>
            <TD>
              <Timestamp value={deploy.at} />
            </TD>
            <TD align="end">
              <Badge tone={deploy.state}>{deploy.label}</Badge>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  )
}
