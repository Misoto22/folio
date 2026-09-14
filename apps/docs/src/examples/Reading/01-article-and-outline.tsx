import { Text } from '@misoto22/folio'
import { DetailMasthead, ReadingLayout, ReadingSection, RecordPager, TableOfContents } from '@misoto22/folio/website'

/**
 * A reading layout combines semantic publication metadata, sections and an outline.
 * Adjacent-record links remain ordinary host links with descriptive titles.
 */
export function Example() {
  return (
    <div className="w-full">
      <DetailMasthead title="A practice of attention" dek="A few observations from the daily walk."
        width="fill" metadata={[{ label: 'Published', value: '7 September 2026', dateTime: '2026-09-07' }]} />
      <ReadingLayout outline={<TableOfContents label="Example article sections" items={[
        { id: 'reading-notice', label: 'Notice', level: 2 },
        { id: 'reading-return', label: 'Return', level: 2 },
      ]} />}>
        <ReadingSection id="reading-notice" title="Notice"><Text>A familiar route still changes with the light. Record one detail before naming the whole scene.</Text></ReadingSection>
        <ReadingSection id="reading-return" title="Return"><Text>Compare what you wrote on the next visit. The difference often matters more than the first impression.</Text></ReadingSection>
        <RecordPager label="Essay navigation" next={{ link: <a href="#next-essay" />, direction: 'Next', title: 'Keeping a field journal' }} />
      </ReadingLayout>
    </div>
  )
}
