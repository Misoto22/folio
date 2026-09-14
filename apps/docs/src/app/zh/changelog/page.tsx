import type { Metadata } from 'next'
import { Changelog } from '@/views/Changelog'

export const metadata: Metadata = {
  title: '更新日志',
  description: '@misoto22/folio 改了什么，以及为什么。',
}

export default function Page() {
  return <Changelog locale="zh" />
}
