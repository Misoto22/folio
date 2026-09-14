'use client'

import { ScrollArea } from '@misoto22/folio'

const COLUMNS = ['timestamp', 'level', 'service', 'region', 'request id', 'message']

const ROWS = Array.from({ length: 14 }, (_, index) => [
  `2026-09-06T04:${String(12 + index).padStart(2, '0')}:31Z`,
  index % 6 === 4 ? 'warn' : 'info',
  index % 3 === 0 ? 'api' : 'worker',
  'ap-southeast-2',
  (0x7f2a1b + index * 8117).toString(16),
  index % 6 === 4 ? 'retrying upstream after 502' : 'request completed',
])

/**
 * orientation defaults to both, and it is written out here because the axis
 * WITHOUT a bar is set to overflow: hidden — so narrowing this to vertical
 * would leave content wider than the box not merely unmarked but clipped, with
 * no key and no gesture reaching it. Narrow it only when one axis genuinely
 * cannot overflow. The corner square only exists at both. Do not nest one of
 * these inside another on the same axis, either:
 * the inner viewport consumes the wheel until it reaches its own end, so a
 * reader aiming at the outer list moves the inner one instead.
 */
export function Example() {
  return (
    <ScrollArea
      label="Request log"
      orientation="both"
      className="h-48 w-full max-w-md rounded-(--radius) border border-(--rule)"
    >
      <table className="w-max border-collapse text-start">
        <caption className="sr-only">Request log</caption>
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <th key={column} scope="col" className="whitespace-nowrap px-3 py-2 text-start eyebrow text-(--ink-3-aa)">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row[4]}>
              {row.map((cell, index) => (
                <td key={index} className="whitespace-nowrap px-3 py-1 mono-meta text-(--ink-2)">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  )
}
