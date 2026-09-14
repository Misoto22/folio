import { WorkflowFigure } from '@misoto22/folio/diagrams'

/**
 * Four edge roles on one deploy, each paired with the variant that draws it.
 * role says what a line MEANS and the renderer reads exactly one of its values
 * — return, for the open arrowhead — so branch, async and error change nothing
 * about the stroke on their own. An error edge left at the default variant is
 * drawn at the weight and the solidity of the happy path, which is the one
 * thing a runbook must not do. A lane is sized to what it holds, too, so an
 * empty one does not act as a spacer — it collapses to about a column beside
 * the gutter with its name still set.
 */
export function Example() {
  return (
    <WorkflowFigure
      spec={{
        schema_version: 2,
        meta: { title: 'Canary deploy', subtitle: 'One path forward, three ways off it.' },
        lanes: [
          { id: 'pipeline', label: 'Pipeline' },
          { id: 'side', label: 'Out of band' },
          { id: 'oncall', label: 'On call', variant: 'exception' },
        ],
        nodes: [
          { id: 'build', lane: 'pipeline', col: 0, type: 'backend', label: 'Build', sublabel: 'container image' },
          { id: 'canary', lane: 'pipeline', col: 1, type: 'cloud', label: 'Canary', sublabel: '5% of traffic' },
          { id: 'full', lane: 'pipeline', col: 2, type: 'cloud', label: 'Full rollout', sublabel: 'all regions' },
          { id: 'notify', lane: 'side', col: 1, type: 'messagebus', label: 'Announce', sublabel: '#deploys' },
          { id: 'page', lane: 'oncall', col: 2, type: 'security', label: 'Page the on-call', sublabel: 'PagerDuty' },
        ],
        mainPath: ['build', 'canary', 'full'],
        edges: [
          { id: 'a', from: 'build', to: 'canary', role: 'main' },
          { id: 'b', from: 'canary', to: 'full', label: 'healthy for 10m', role: 'main' },
          { id: 'c', from: 'canary', to: 'notify', label: 'posts the diff', role: 'async', variant: 'dashed' },
          { id: 'd', from: 'canary', to: 'page', label: 'errors above 2%', role: 'error', variant: 'dashed' },
          { id: 'e', from: 'page', to: 'build', label: 'previous image restored', role: 'return', variant: 'dashed' },
        ],
      }}
    />
  )
}
