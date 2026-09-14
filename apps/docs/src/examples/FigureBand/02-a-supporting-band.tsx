import { FigureBand, Heading, Text } from '@misoto22/folio'

/**
 * The same band, one step down. scale="sub" is for figures that SUPPORT the
 * page rather than being it — lead is the band-heading step, so a supporting
 * band set there is competing with the heading above it for the same rung. Two
 * figures fill the row at every width, which is why two and four are the counts
 * worth reaching for.
 */
export function Example() {
  return (
    <div className="flex w-full flex-col gap-5">
      <Heading level={3}>Retrieval rewrite</Heading>
      <Text size="sm">
        Chunking moved from a fixed window to headings, and the citation panel
        started reading the same rows the answer did.
      </Text>
      <FigureBand
        scale="sub"
        label="Retrieval, before and after"
        figures={[
          { id: 'latency', label: 'Median latency', value: '240ms', note: 'from 610ms' },
          { id: 'recall', label: 'Answers with a citation', value: '96%', note: 'from 71%' },
        ]}
      />
    </div>
  )
}
