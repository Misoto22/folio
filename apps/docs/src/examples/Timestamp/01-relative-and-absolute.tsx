import { DescriptionList, Timestamp } from '@misoto22/folio'

/** An instant a fixed distance behind now, so the page reads the same whenever it is opened. */
const ago = (ms: number) => new Date(Date.now() - ms)

const MINUTE = 60_000
const HOUR = 3_600_000
const DAY = 86_400_000

/**
 * The same instant, three ways. Every page here is statically exported, so the
 * first paint — the one the build produces and the browser has to reproduce
 * exactly while hydrating — is the UTC calendar date, sliced out of the ISO
 * string with no Intl involved. The relative and locale-aware forms are applied
 * after mount, where there is a reader to be local to. The datetime attribute
 * is the full ISO instant from the first render and never changes.
 */
export function Example() {
  return (
    <DescriptionList
      layout="row"
      items={[
        { term: 'Thirty seconds ago', description: <Timestamp value={ago(30_000)} /> },
        { term: 'Ninety seconds ago', description: <Timestamp value={ago(90 * 1000)} /> },
        { term: 'Three hours ago', description: <Timestamp value={ago(3 * HOUR)} /> },
        { term: 'Yesterday', description: <Timestamp value={ago(DAY)} /> },
        {
          term: 'Past auto’s window',
          description: <Timestamp value={ago(30 * DAY)} />,
        },
        {
          term: 'Forced absolute, with the time',
          description: <Timestamp value={ago(5 * MINUTE)} format="absolute" showTime />,
        },
        {
          term: 'A value nothing can parse',
          description: <Timestamp value="tomorrow-ish" />,
        },
      ]}
    />
  )
}
