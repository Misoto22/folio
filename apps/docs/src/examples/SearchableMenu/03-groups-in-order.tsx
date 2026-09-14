'use client'

import { SearchableMenu, type MenuAction } from '@misoto22/folio'
import { useState } from 'react'

/**
 * Groups are built by walking the array once and extending only the LAST one,
 * so a group name that appears again after other rows produces a second heading
 * with identical text rather than joining the first. Keep the members of a
 * group adjacent, as they are here, and the arrangement is controlled by the
 * order you write them in — there is no ordering prop, deliberately. Two other
 * things travel with the row: shortcut prints as a keycap at its end, and
 * destructive paints it. The trigger's accessible name is label, not the text
 * you passed as children, so make the two say the same thing.
 */
export function Example() {
  const [last, setLast] = useState<string>()

  const actions: MenuAction[] = [
    { id: 'copy-link', label: 'Copy link', group: 'Share', shortcut: 'C', onSelect: () => setLast('Copy link') },
    { id: 'copy-embed', label: 'Copy embed code', group: 'Share', keywords: ['iframe'], onSelect: () => setLast('Copy embed code') },
    { id: 'invite', label: 'Invite a collaborator', group: 'Share', onSelect: () => setLast('Invite a collaborator') },
    { id: 'duplicate', label: 'Duplicate', group: 'Manage', shortcut: 'D', onSelect: () => setLast('Duplicate') },
    { id: 'archive', label: 'Archive', group: 'Manage', onSelect: () => setLast('Archive') },
    { id: 'transfer', label: 'Transfer ownership', group: 'Manage', disabled: true, onSelect: () => setLast('Transfer ownership') },
    { id: 'delete', label: 'Delete', group: 'Manage', destructive: true, onSelect: () => setLast('Delete') },
  ]

  return (
    <div className="flex flex-col items-center gap-4">
      <SearchableMenu
        label="Collection actions"
        actions={actions}
        searchPlaceholder="Filter actions…"
        emptyMessage="Nothing here matches. Try share, or delete."
      >
        Collection actions
      </SearchableMenu>
      <p className="m-0 mono-meta text-(--ink-3-aa)">{last ? `ran: ${last}` : 'two groups, written adjacent'}</p>
    </div>
  )
}
