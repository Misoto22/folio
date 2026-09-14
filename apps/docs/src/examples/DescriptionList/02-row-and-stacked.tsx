import { DescriptionList } from '@misoto22/folio'

const FIELDS = [
  { term: 'Runtime', description: 'Node 24 on Cloudflare Workers' },
  { term: 'Region', description: 'ap-southeast-2' },
  { term: 'Build', description: 'pnpm --filter @misoto22/folio build' },
]

/**
 * The same three fields under both layouts. row is the record-page shape — the
 * labels line up down one edge and a reader scans them rather than reading
 * them — and it collapses to one column under the sm breakpoint, because a
 * 12rem label column on a phone leaves the value about eight characters wide.
 * stacked keeps the value under its label at every width, which is the answer
 * for a container that is narrow by design rather than by viewport: a card, a
 * sidebar, a popover. Pick by the container, not by the number of fields.
 */
export function Example() {
  return (
    <div className="grid w-full gap-8 sm:grid-cols-2">
      <DescriptionList items={FIELDS} />
      <DescriptionList layout="stacked" items={FIELDS} />
    </div>
  )
}
