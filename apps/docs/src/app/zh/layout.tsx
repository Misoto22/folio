import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getMessages } from '@/i18n/messages'
import { BRAND_NAME } from '@/lib/brand'

/**
 * The Chinese subtree's own metadata.
 *
 * A nested layout can set the title and description but cannot change the
 * `<html lang>` — that element belongs to the root layout, which sits above
 * the locale routes and has no params. The inline script there sets it from
 * the path instead, before first paint.
 */
export const metadata: Metadata = {
  // The Chinese name under Chinese pages, rather than the root layout's
  // `%s · Folio`. Next applies only the nearest template to a page, so this
  // replaces the English one rather than stacking on it. It once did stack —
  // the Chinese home page came out with the site name twice — which is why
  // that page sets an `absolute` title and never passes through a template.
  title: {
    default: `${BRAND_NAME.zh} — ${getMessages('zh').tagline}`,
    template: `%s · ${BRAND_NAME.zh}`,
  },
  description:
    '一套给软件、写作与摄影用的纯白单色设计系统：可移植的 token，以及 48 个无障碍的 React 组件。',
}

export default function ZhLayout({ children }: { children: ReactNode }) {
  return children
}
