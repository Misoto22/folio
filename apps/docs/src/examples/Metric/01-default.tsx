import { Metric } from '@misoto22/folio'

/**
 * Four across, which is the arrangement this exists for. The figures are
 * monospace and tabular by construction, so the same magnitude is the same
 * width in every tile and the column reads as a column rather than as four
 * unrelated numbers. Each tone dot is aria-hidden, so whatever it means is in
 * the line under the figure as well — a tile whose only account of a failure is
 * that it is red says nothing at all to a screen reader, and nothing in
 * greyscale. Every value arrives already formatted: the locale, the unit and
 * the currency are the application's decision, made once rather than guessed
 * four times.
 */
export function Example() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Metric label="Rows" value="63,851" detail="newest yesterday" tone="success" />
      <Metric label="Sync" value="0" detail="failing since Tuesday" tone="danger" />
      <Metric label="Queue" value="12" detail="3 waiting on approval" tone="warning" />
      <Metric label="Accounts" value="7" detail="all reconciled" />
    </div>
  )
}
