import { Breadcrumb, Button, PageHeader } from '@misoto22/folio'

/**
 * The whole opening, in the order it is fixed in: trail, kicker, title, then
 * the sentence under it. The range picker sits beside the title rather than
 * above the content because it qualifies what the title refers to — it says
 * which slice of the archive this page is about, and below the rule it would
 * become a toolbar arguing with whatever strip the page starts with. The title
 * is --fs-heading at every level, because moving an opening down the outline is
 * a fact about the document and not a request for smaller type — level={2} here
 * only because this documentation page already owns the h1. The trail carries a
 * label of its own for the same reason: two navigation landmarks with the same
 * name are indistinguishable to anyone navigating by landmark, which is also
 * why the guidance is to leave breadcrumb off inside a shell that pins a trail.
 */
export function Example() {
  return (
    <PageHeader
      breadcrumb={
        <Breadcrumb
          label="Page trail"
          items={[{ label: 'Living', href: '#/living' }, { label: 'Money' }]}
        />
      }
      eyebrow="04"
      level={2}
      title="Money"
      description="Balances and flows across every account, as at the last sync."
      actions={
        <Button size="sm" variant="secondary">
          Last 7 days
        </Button>
      }
    />
  )
}
