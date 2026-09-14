import { FigureBand } from '@misoto22/folio'

/**
 * The same four figures in a 24rem column, still two across. The band reads a
 * CONTAINER query, not the viewport, so it is deciding how wide this band is
 * rather than how wide the window is — which is why a sm:grid-cols-4 written on
 * it through className would be wrong in a sidebar of a 1440px page. Widen the
 * column and the same markup goes four across on its own.
 */
export function Example() {
  return (
    <div className="w-full max-w-96 rounded-(--radius-lg) border border-(--rule) p-4">
      <FigureBand
        scale="sub"
        label="This release"
        figures={[
          { id: 'components', label: 'Components', value: '61' },
          { id: 'tokens', label: 'Tokens', value: '145' },
          { id: 'examples', label: 'Examples', value: '147' },
          { id: 'size', label: 'Peer deps', value: '2' },
        ]}
      />
    </div>
  )
}
