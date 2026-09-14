'use client'

import { useState } from 'react'
import { RiMoreLine } from '@remixicon/react'
import { Text } from '@misoto22/folio'
import { ActionMenu } from '@misoto22/folio/website'

/**
 * An accessible action menu delegates each choice to a host callback.
 * This record's read state changes locally while the menu handles focus and dismissal.
 */
export function Example() {
  const [open, setOpen] = useState(false)
  const [read, setRead] = useState(false)
  return (
    <div className="flex items-center gap-4">
      <Text role="status">{read ? 'Read' : 'Unread'}</Text>
      <ActionMenu label="Record actions" icon={<RiMoreLine size={18} aria-hidden="true" />}
        open={open} onOpenChange={setOpen} items={[
          { id: 'read', label: 'Mark as read', onSelect: () => setRead(true) },
          { id: 'unread', label: 'Mark as unread', onSelect: () => setRead(false) },
        ]} />
    </div>
  )
}
