import type { Metadata } from 'next'
import { Changelog } from '@/views/Changelog'

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'What changed in @misoto22/folio, and why.',
}

export default function Page() {
  return <Changelog locale="en" />
}
