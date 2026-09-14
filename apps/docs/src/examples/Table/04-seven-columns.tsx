import { TBody, TD, TH, THead, TR, Table } from '@misoto22/folio'

const HOSTS = [
  { host: 'api', region: 'ap-southeast-2', version: '0.4.0', cpu: '12%', memory: '1.4 GB', p95: '84 ms', uptime: '31d' },
  { host: 'web', region: 'ap-southeast-2', version: '0.4.0', cpu: '7%', memory: '0.9 GB', p95: '41 ms', uptime: '31d' },
  { host: 'worker', region: 'ap-northeast-1', version: '0.3.1', cpu: '38%', memory: '2.1 GB', p95: '—', uptime: '6d' },
]

/**
 * Seven columns, printed caption, and row headers. showCaption turns the hidden
 * caption into an eyebrow above the table; the same string is the scroll
 * region's accessible name either way, so it is heard on the way in and again
 * from the table. Pass scope="row" on each row's first cell — TH writes
 * scope="col" and your props are spread after it, so the override lands, and
 * without it every row header claims to head a column. Nothing here reflows on
 * a phone: the region scrolls sideways behind a hairline bar and the columns
 * past the fold are reachable only by a reader who works out that it scrolls.
 * Narrow this canvas and see. Seven columns at 375px wants a different
 * presentation, not a smaller font.
 */
export function Example() {
  return (
    <Table caption="Fleet at a glance" showCaption density="compact" borders="bordered-grid">
      <THead>
        <TR>
          <TH>Host</TH>
          <TH>Region</TH>
          <TH>Version</TH>
          <TH align="end">CPU</TH>
          <TH align="end">Memory</TH>
          <TH align="end">p95</TH>
          <TH align="end">Uptime</TH>
        </TR>
      </THead>
      <TBody>
        {HOSTS.map((host) => (
          <TR key={host.host}>
            <TH scope="row">{host.host}</TH>
            <TD className="whitespace-nowrap">{host.region}</TD>
            <TD className="tabular-nums">{host.version}</TD>
            <TD align="end" className="tabular-nums">{host.cpu}</TD>
            <TD align="end" className="tabular-nums">{host.memory}</TD>
            <TD align="end" className="tabular-nums">{host.p95}</TD>
            <TD align="end" className="tabular-nums">{host.uptime}</TD>
          </TR>
        ))}
      </TBody>
    </Table>
  )
}
