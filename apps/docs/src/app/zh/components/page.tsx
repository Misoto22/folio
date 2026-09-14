import type { Metadata } from 'next'
import { ComponentsIndex } from '@/views/ComponentsIndex'
import { COMPONENTS } from '@/content/registry'

export const metadata: Metadata = {
  title: '组件',
  description: `@misoto22/folio 里全部 ${COMPONENTS.length} 个组件，按用途分组。`,
}

export default function Page() {
  return <ComponentsIndex locale="zh" />
}
