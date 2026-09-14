import { Button, EmptyState } from '@misoto22/folio'
import { RiInboxLine } from '@remixicon/react'

/**
 * A collection that is new, and the one thing to do next. The copy says what to
 * do rather than what failed, which is the whole difference from ErrorState and
 * the reason they are two components rather than one with a variant. The frame
 * carries no role and no live region, so replacing a SkeletonPage with this
 * removes the region that said Loading projects and puts nothing in its place —
 * announce the arrival yourself. title opens a heading at level 2, which is
 * right directly under a page's h1; inside a section that already has its own
 * h2, pass level={3} rather than leaving a hole in heading navigation.
 */
export function Example() {
  return (
    <EmptyState
      icon={RiInboxLine}
      title="No projects yet"
      description="Everything you publish will show up here. Start with the one you are already building."
      action={<Button>New project</Button>}
    />
  )
}
