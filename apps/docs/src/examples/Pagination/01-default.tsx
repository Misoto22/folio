'use client'

import { Pagination } from '@misoto22/folio'
import { useState } from 'react'

/**
 * Twenty pages, fully controlled. Move page in the same state update that
 * fetches: a handler that loads the next page without setting page leaves the
 * pager marking the page the reader just left. The current page is a button
 * with aria-current rather than a styled span, because a reader jumping by
 * control has to be able to find it — and the filled pill travels between the
 * numbers rather than one ground switching off while another switches on, which
 * reads as the one thing that actually changed. It renders nothing at one page
 * or fewer, so a footer built to a fixed height shows an empty strip on the day
 * the list gets short.
 */
export function Example() {
  const [page, setPage] = useState(1)

  return (
    <div className="flex flex-col items-center gap-5">
      <Pagination page={page} pageCount={20} onPageChange={setPage} />
      <p className="m-0 mono-meta text-(--ink-3-aa)">page {page} of 20</p>
    </div>
  )
}
