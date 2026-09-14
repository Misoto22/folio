import type { Metadata } from 'next'
import { Home } from '@/views/Home'
import { getMessages } from '@/i18n/messages'
import { BRAND_NAME } from '@/lib/brand'

export const metadata: Metadata = {
  // Absolute, so the layout's template does not append the site name twice.
  title: { absolute: `${BRAND_NAME.zh} — ${getMessages('zh').tagline}` },
}

export default function Page() {
  return <Home locale="zh" />
}
