import { Button, EmptyState, ERROR_ACTION_CLASS, ErrorState } from '@misoto22/folio'
import { RiFileTextLine } from '@remixicon/react'

/**
 * Nothing here yet, against something went wrong. The pair is asymmetric, which
 * is why the distinction matters: a reader told a request failed retries, but a
 * reader told a collection is empty acts on it — creating the record they
 * already have, or reporting a data loss that never happened. So when the
 * request errored, say so, even on the day the list would have been empty
 * anyway. Both are view-sized in real use — the error side is a full viewport
 * and the empty side carries 160px of vertical padding; each is shortened here
 * to share one canvas.
 */
export function Example() {
  return (
    <div className="grid w-full gap-8 md:grid-cols-2">
      <EmptyState
        className="py-10"
        icon={RiFileTextLine}
        title="No invoices yet"
        description="The first invoice you issue for this client will appear here."
        action={<Button>New invoice</Button>}
      />
      <ErrorState
        className="min-h-0 pt-0"
        level={2}
        code="503"
        heading="Invoices could not be loaded"
        message="The billing service did not answer. Your invoices are not affected."
        action={<a href="/status" className={ERROR_ACTION_CLASS}>Check service status</a>}
      />
    </div>
  )
}
