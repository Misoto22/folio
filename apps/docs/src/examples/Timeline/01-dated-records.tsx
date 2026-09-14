import { CareerRecord, RecordSection, Timeline, TimelineItem } from '@misoto22/folio/website'

/**
 * A chronological record retains its supplied dates, organization and supporting details.
 * The host decides ordering and date formatting before rendering the timeline.
 */
export function Example() {
  return (
    <RecordSection title="Experience" count="1 role" headingId="timeline-experience">
      <Timeline><TimelineItem><CareerRecord
        title="Product designer" organization={<a href="#studio">Independent studio</a>}
        period="2023 — present" periodLabel="Period" location="Remote" locationLabel="Location" currentLabel="Current"
        description={['Designing practical tools for research and publishing.', 'Working with small teams from prototype to delivery.']}
        tags={['Research', 'Design systems']} tagsLabel="Areas of practice"
      /></TimelineItem></Timeline>
    </RecordSection>
  )
}
