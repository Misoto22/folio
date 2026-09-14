import { TBody, TD, TH, THead, TR, Table } from '@misoto22/folio'

const RUNS = Array.from({ length: 24 }, (_, index) => ({
  sha: (0x9a2f41c + index * 7919).toString(16).slice(0, 7),
  branch: index % 4 === 0 ? 'main' : `codex/step-${index}`,
  seconds: 48 + ((index * 37) % 140),
}))

const format = (seconds: number) => `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, '0')}s`

/**
 * stickyHeader needs a bounded height on a container the component does not
 * own. Every prop, className included, lands on the table element itself — not
 * on the scrolling div wrapped around it — so only a constraining PARENT gives
 * that div something to stick within. This is the arrangement that works: a
 * flex column with a fixed height. The scroll region is a flex item and a
 * scroll container, so its automatic minimum size is zero and it shrinks to the
 * height on offer. A max-height on a plain block wrapper does not do it, and
 * the header simply travels up the page with everything else.
 */
export function Example() {
  return (
    <div className="flex h-72 w-full max-w-md flex-col overflow-hidden rounded-(--radius) border border-(--rule-2)">
      <Table caption="Every run on this branch" stickyHeader density="compact">
        <THead>
          <TR>
            <TH>Commit</TH>
            <TH>Branch</TH>
            <TH align="end">Duration</TH>
          </TR>
        </THead>
        <TBody>
          {RUNS.map((run) => (
            <TR key={run.sha}>
              <TD className="font-mono text-xs">{run.sha}</TD>
              <TD>{run.branch}</TD>
              <TD align="end" className="tabular-nums">
                {format(run.seconds)}
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}
