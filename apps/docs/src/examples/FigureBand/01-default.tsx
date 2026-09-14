import { FigureBand } from '@misoto22/folio'

/**
 * Four figures, which with two is one of the only counts that fits: the grid is
 * two columns until the wrapper reaches @3xl and four after, so three leaves a
 * hole in both arrangements and five leaves three. id is required rather than
 * optional because it is the React key — an index would put the next render's
 * number under the previous label as soon as the list reordered.
 */
export function Example() {
  return (
    <FigureBand
      label="Deploys, last 30 days"
      figures={[
        { id: 'releases', label: 'Releases', value: '12' },
        { id: 'duration', label: 'Median build', value: '2m 14s', note: 'down from 3m 40s' },
        { id: 'rollbacks', label: 'Rollbacks', value: '0' },
        { id: 'uptime', label: 'Uptime', value: '99.98%', note: 'measured at the edge' },
      ]}
    />
  )
}
