import type { Metadata } from 'next'
import type { ReactNode } from 'react'

/**
 * The Chinese subtree's own metadata.
 *
 * A nested layout can set the title and description but cannot change the
 * `<html lang>` — that element belongs to the root layout, which sits above
 * the locale routes and has no params. The inline script there sets it from
 * the path instead, before first paint.
 */
export const metadata: Metadata = {
  // Description only. The root layout already carries the `%s · Folio`
  // template, and declaring a second one here stacked them — the
  // Chinese home page came out with the site name twice.
  description:
    '一套给软件、写作与摄影用的纯白单色设计系统：可移植的 token，以及 48 个无障碍的 React 组件。',
}

export default function ZhLayout({ children }: { children: ReactNode }) {
  return children
}
