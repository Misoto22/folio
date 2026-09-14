'use client'

import { Pagination, Text } from '@misoto22/folio'
import { useState } from 'react'

/**
 * siblings is how many numbered pages sit either side of the current one. Raise
 * it rather than lowering it: below 2 × siblings + 5 pages every page is
 * printed anyway, so the prop does nothing on a short list and is the only
 * lever you have on a long one. Both pagers here share one page, so a click on
 * either moves both. A wider window is more targets at the same small size and
 * not a better one — the pills are --control-h-sm, 36px comfortable and 30px
 * under compact density, which is well under the 44px WCAG 2.5.5 asks of a
 * pointer target.
 */
export function Example() {
  const [page, setPage] = useState(12)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Text size="xs" tone="muted">
          One sibling, the default
        </Text>
        <Pagination label="Default window" page={page} pageCount={24} onPageChange={setPage} />
      </div>
      <div className="flex flex-col gap-2">
        <Text size="xs" tone="muted">
          Two siblings
        </Text>
        <Pagination
          label="Wider window"
          siblings={2}
          page={page}
          pageCount={24}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
