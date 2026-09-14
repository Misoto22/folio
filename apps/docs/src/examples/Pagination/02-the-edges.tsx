'use client'

import { Pagination, Text } from '@misoto22/folio'
import { useState } from 'react'

/**
 * The same twenty-four pages seen from both ends and from the middle, which is
 * where a pager is usually wrong. Previous is disabled at page one and Next at
 * the last, which takes each out of the tab order rather than leaving a control
 * that does nothing when pressed. The ellipsis appears only where the sequence
 * skips more than one page — a single skipped page is printed instead, because
 * 1 … 3 is longer than 1 2 3 and tells the reader less. Three pagers means
 * three nav landmarks, so each one here is named.
 */
export function Example() {
  const [first, setFirst] = useState(1)
  const [middle, setMiddle] = useState(12)
  const [last, setLast] = useState(24)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Text size="xs" tone="muted">
          At the first page
        </Text>
        <Pagination label="First page" page={first} pageCount={24} onPageChange={setFirst} />
      </div>
      <div className="flex flex-col gap-2">
        <Text size="xs" tone="muted">
          In the middle, elided on both sides
        </Text>
        <Pagination label="Middle pages" page={middle} pageCount={24} onPageChange={setMiddle} />
      </div>
      <div className="flex flex-col gap-2">
        <Text size="xs" tone="muted">
          At the last page
        </Text>
        <Pagination label="Last page" page={last} pageCount={24} onPageChange={setLast} />
      </div>
    </div>
  )
}
