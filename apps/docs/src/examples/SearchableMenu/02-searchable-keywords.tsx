'use client'

import { SearchableMenu, Text, type MenuAction } from '@misoto22/folio'
import { useState } from 'react'

/**
 * The filter matches on the row's value, and this component passes action.id as
 * that value — so with ids like act_7f2 the visible label matches nothing and
 * typing what you can see returns the empty state. keywords is the fix, and it
 * is also where the words a reader would reach for but nobody wrote go: someone
 * looking for the CSV export types spreadsheet, and someone rolling a release
 * back types undo. Type either into the filter below and watch the right row
 * survive.
 */
export function Example() {
  const [last, setLast] = useState<string>()

  const actions: MenuAction[] = [
    {
      id: 'act_7f2',
      label: 'Export as CSV',
      keywords: ['spreadsheet', 'excel', 'download'],
      group: 'Export',
      onSelect: () => setLast('Export as CSV'),
    },
    {
      id: 'act_a10',
      label: 'Export as JSON',
      keywords: ['api', 'download', 'raw'],
      group: 'Export',
      onSelect: () => setLast('Export as JSON'),
    },
    {
      id: 'act_c04',
      label: 'Roll back the release',
      keywords: ['undo', 'revert', 'previous'],
      group: 'Release',
      destructive: true,
      onSelect: () => setLast('Roll back the release'),
    },
    {
      id: 'act_e91',
      label: 'Promote to production',
      keywords: ['ship', 'deploy', 'live'],
      group: 'Release',
      onSelect: () => setLast('Promote to production'),
    },
  ]

  return (
    <div className="flex flex-col items-center gap-4">
      <SearchableMenu label="Release actions" actions={actions} searchPlaceholder="Try spreadsheet…">
        Release actions
      </SearchableMenu>
      <Text size="sm" tone="muted">
        {last ? `ran: ${last}` : 'four opaque ids, matched by their keywords'}
      </Text>
    </div>
  )
}
