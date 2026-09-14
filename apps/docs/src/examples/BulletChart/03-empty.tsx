import { Button } from '@misoto22/folio'
import { BulletChart } from '@misoto22/folio/charts'

/**
 * The state a status page is in on the morning nobody has filled it in — a new
 * quarter, a filter that matches nothing, an account with no history — and the
 * one most chart libraries hand back as a stack of empty tracks, which a reader
 * cannot tell apart from a chart that failed to load. The figure keeps its title
 * and its description either way, so the page still says what is missing. The
 * copy names what happened rather than saying "no data", and it carries the one
 * thing that changes it: an empty state without an action is a dead end.
 */
export function Example() {
  return (
    <BulletChart
      title="Quarterly targets"
      showTitle
      description="Bar is the measure, rule is the target"
      data={[]}
      empty={{
        title: 'No targets set for this quarter',
        description: 'Targets carry over when a quarter opens. This one has none yet.',
        action: <Button variant="secondary">Set targets</Button>,
      }}
    />
  )
}
