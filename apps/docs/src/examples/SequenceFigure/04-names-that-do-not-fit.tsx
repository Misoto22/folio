import { SequenceFigure } from '@misoto22/folio/diagrams'

/**
 * column_fit spread, which widens every column to the widest participant name
 * instead of holding the fixed one. Reach for it the moment a real name would
 * be clipped: the plate wraps to two lines and ellipsises the rest, and
 * shortening the name to make it fit is not a repair — the name is the data,
 * and dealer-portal-api is a different service from the api. A message naming a
 * participant that participants does not declare is not drawn at all, because
 * there is no column to draw it between; it stays in the summary list as the
 * raw id, so the text reports a call the picture does not show.
 */
export function Example() {
  return (
    <SequenceFigure
      spec={{
        meta: {
          title: 'Signing in to the dealer portal',
          subtitle: 'Every column as wide as the longest real name.',
          column_fit: 'spread',
        },
        participants: [
          { id: 'browser', type: 'frontend', label: 'Dealer portal (browser)', sublabel: 'Next.js' },
          { id: 'api', type: 'backend', label: 'dealer-portal-api', sublabel: 'Django + DRF' },
          { id: 'db', type: 'database', label: 'SQL Server 2025', sublabel: 'legacy schema' },
        ],
        messages: [
          { id: 'post', from: 'browser', to: 'api', y: 160, label: 'POST /api/v1/token/', variant: 'emphasis' },
          { id: 'lookup', from: 'api', to: 'db', y: 200, label: 'SELECT dealer WHERE email = ?' },
          { id: 'row', from: 'db', to: 'api', y: 240, label: 'one row', variant: 'return' },
          { id: 'pair', from: 'api', to: 'browser', y: 282, label: 'access + refresh', variant: 'return' },
        ],
        activations: [
          { participant: 'api', from: 168, to: 288, type: 'backend' },
          { participant: 'db', from: 196, to: 246, type: 'database' },
        ],
      }}
    />
  )
}
