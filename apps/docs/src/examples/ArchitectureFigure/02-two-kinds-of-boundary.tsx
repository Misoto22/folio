import { ArchitectureFigure } from '@misoto22/folio/diagrams'

/**
 * The two boundary kinds, one nested inside the other. A region is a solid frame
 * around where something runs and a security-group is dashed around what may
 * reach it, so a reader who came for one of those two questions can tell which
 * frame answers it before reading either caption. The security variant marks the
 * single hop that crosses the dashed line, and the queue-to-worker arrow inside
 * it carries no wording at all — affordable only because exactly one arrow leaves
 * that box, and a guess the moment a second one does.
 */
export function Example() {
  return (
    <ArchitectureFigure
      spec={{
        meta: { title: 'An inbound webhook', subtitle: 'Where it runs, and what is allowed to reach it.' },
        components: [
          { id: 'partner', type: 'external', label: 'Partner', sublabel: 'webhook sender', row: 0, col: 0 },
          { id: 'gateway', type: 'security', label: 'Gateway', sublabel: 'signature check', row: 0, col: 1, tag: 'mTLS' },
          { id: 'queue', type: 'messagebus', label: 'Ingest queue', sublabel: 'SQS', row: 0, col: 2 },
          { id: 'worker', type: 'backend', label: 'Worker', sublabel: 'consumer', row: 0, col: 3 },
        ],
        boundaries: [
          { kind: 'region', label: 'ap-southeast-2', wraps: ['gateway', 'queue', 'worker'], pad: 38 },
          { kind: 'security-group', label: 'Reachable only from the gateway', wraps: ['queue', 'worker'], pad: 16 },
        ],
        connections: [
          { id: 'a', from: 'partner', to: 'gateway', label: 'signed POST' },
          { id: 'b', from: 'gateway', to: 'queue', label: 'verified', variant: 'security' },
          { id: 'c', from: 'queue', to: 'worker' },
        ],
      }}
    />
  )
}
