import { Code, DescriptionList, Timestamp } from '@misoto22/folio'

const AT = '2026-01-14T09:30:00.000Z'

/**
 * The same instant three times, beside the string every one of them is built
 * from. This page is statically exported, so the first paint — the one the
 * build produces and the browser has to reproduce exactly while hydrating — is
 * the UTC calendar date sliced straight out of that string, with no Intl
 * anywhere near it: both sides compute it from the same characters, so they
 * cannot disagree. The locale-aware and relative forms are applied after mount,
 * where there is a reader to be local to. The datetime attribute is the full
 * instant from the first render onwards and never changes, which is what a
 * screen reader or a crawler reads whether or not the effect has run.
 */
export function Example() {
  return (
    <DescriptionList
      items={[
        { term: 'The value passed in', description: <Code>{AT}</Code> },
        { term: 'auto, past its window', description: <Timestamp value={AT} /> },
        { term: 'absolute, with the time', description: <Timestamp value={AT} format="absolute" showTime /> },
        { term: 'relative, however old', description: <Timestamp value={AT} format="relative" /> },
      ]}
    />
  )
}
