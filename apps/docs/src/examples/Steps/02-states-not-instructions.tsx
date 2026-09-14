import { Steps } from '@misoto22/folio'

/**
 * The same rail without the digits. marker="rule" is for a sequence of STATES —
 * queued, building, published is an order the process moves through, and a
 * number in front of each one tells the reader they are steps to perform. The
 * filled marker says where it has got to; a second current would put the
 * release in two places at once.
 */
export function Example() {
  return (
    <Steps
      label="Release 0.4.1"
      marker="rule"
      steps={[
        { title: 'Queued', note: 'Behind one earlier build' },
        { title: 'Building', note: 'pnpm build · 1m 20s so far', current: true },
        { title: 'Published', note: 'npm registry, then the docs site' },
      ]}
    />
  )
}
