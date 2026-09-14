import { CodePanel, StepSequence } from '@misoto22/folio/website'

/**
 * A process rail and a code panel share the same reading surface.
 * Step order and highlighted code nodes come from the host; copying uses the rendered source text.
 */
export function Example() {
  return (
    <div className="w-full">
      <StepSequence spec={{ label: 'Publish a reading list', caption: 'Review each step before publishing.', steps: [
        { n: '1', label: 'Collect', note: 'Gather the records.' },
        { n: '2', label: 'Review', note: 'Check titles and links.', anchor: true },
        { n: '3', label: 'Publish', note: 'Share the finished list.' },
      ] }} />
      <CodePanel languageLabel="JavaScript" copyLabel="Copy example" copiedLabel="Example copied">
        <code>{'const readingList = records.filter(record => record.reviewed)'}</code>
      </CodePanel>
    </div>
  )
}
