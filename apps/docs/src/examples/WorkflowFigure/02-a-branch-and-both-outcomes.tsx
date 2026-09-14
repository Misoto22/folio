import { WorkflowFigure } from '@misoto22/folio/diagrams'

/**
 * One check with two outcomes, which is the shape most of a workflow is. The
 * heavy run through Checks to Merge is mainPath, and the branch that leaves it
 * is dashed — but the key names a dashed line Asynchronous by default, so this
 * spec renames that entry rather than let the key contradict the picture. The
 * edge back from the author carries role return, the one role that changes how a
 * line is drawn: an open arrowhead, so a reader sees the loop close without
 * having to trace it.
 */
export function Example() {
  return (
    <WorkflowFigure
      spec={{
        schema_version: 2,
        meta: {
          title: 'A pull request',
          subtitle: 'One gate, two ways out, and the way back in.',
          legend: { entries: { dashed: { label: 'Failed check' } } },
        },
        lanes: [
          { id: 'bot', label: 'Automation' },
          { id: 'author', label: 'Author' },
        ],
        groups: [{ id: 'gate', label: 'Merge gate', lane: 'bot', fromCol: 1, toCol: 2 }],
        nodes: [
          { id: 'open', lane: 'bot', col: 0, type: 'frontend', label: 'PR opened', sublabel: 'branch pushed' },
          { id: 'check', lane: 'bot', col: 1, type: 'backend', label: 'Checks', sublabel: 'lint and tests' },
          { id: 'merge', lane: 'bot', col: 2, type: 'cloud', label: 'Merge', sublabel: 'squash' },
          { id: 'changes', lane: 'author', col: 1, type: 'external', label: 'Changes requested', sublabel: 'review comment' },
        ],
        mainPath: ['open', 'check', 'merge'],
        edges: [
          { id: 'a', from: 'open', to: 'check' },
          { id: 'b', from: 'check', to: 'merge', label: 'all green' },
          { id: 'c', from: 'check', to: 'changes', label: 'a check failed', role: 'branch', variant: 'dashed' },
          { id: 'd', from: 'changes', to: 'check', label: 'pushed a fix', role: 'return' },
        ],
      }}
    />
  )
}
