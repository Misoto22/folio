import { Button, EmptyState, Tag } from '@misoto22/folio'
import { RiFilterOffLine } from '@remixicon/react'

/**
 * The same component, saying which kind of empty this is. No projects yet shown
 * over an active filter tells the reader their projects are gone, and the
 * recovery from that belief costs more than the sentence would have — so name
 * the filters that are on, say what clearing them brings back, and make the
 * action the way out of the state rather than a second way in. description is
 * capped at 24rem and centred, so it stays a sentence: longer copy becomes a
 * narrow ragged column the eye returns from before the part that mattered.
 */
export function Example() {
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2 border-b border-(--rule) pb-4">
        <Tag active>Archived</Tag>
        <Tag active>2019</Tag>
      </div>
      <EmptyState
        icon={RiFilterOffLine}
        title="No projects match these filters"
        description="Archived and 2019 are both on. Clearing them brings back 34 projects."
        action={<Button variant="secondary">Clear filters</Button>}
      />
    </div>
  )
}
