import type { Metadata } from 'next'
import { ComponentsIndex } from '@/views/ComponentsIndex'
import { COMPONENTS } from '@/content/registry'

export const metadata: Metadata = {
  title: 'Components',
  description: `All ${COMPONENTS.length} components in @misoto22/folio, grouped by what they do.`,
}

export default function Page() {
  return <ComponentsIndex locale="en" />
}
