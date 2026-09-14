import { ActivityTrace, EvidenceDisclosure, EvidenceFacts, EvidencePanel, EvidenceStage, EvidenceStages } from '@misoto22/folio/website'

/**
 * A recorded sample trace separates stage status, source facts and optional detail.
 * Labels and measurements are supplied by the host rather than inferred from decorative progress.
 */
export function Example() {
  return (
    <EvidencePanel title="Reading-list evidence" eyebrow="Recorded sample" state="done" stateLabel="Complete">
      <EvidenceFacts title="Source summary" items={[
        { term: 'Collection', description: 'Studio library' },
        { term: 'Records reviewed', description: '12' },
      ]} />
      <EvidenceStages>
        <EvidenceStage number="1" state="done" stateLabel="Complete" title="Find records" description="Matched the supplied collection query." time="120 ms" />
        <EvidenceStage number="2" state="done" stateLabel="Complete" title="Review sources" description="Checked titles and publication dates." time="80 ms" />
      </EvidenceStages>
      <EvidenceDisclosure label="View recorded activity">
        <ActivityTrace label="Recorded activity" items={[
          { id: 'find', state: 'done', label: 'Collection lookup', summary: '12 records' },
          { id: 'review', state: 'done', label: 'Source review', summary: '12 records retained' },
        ]} />
      </EvidenceDisclosure>
    </EvidencePanel>
  )
}
