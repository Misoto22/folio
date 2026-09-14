'use client'

import type { ReactNode } from 'react'
import { Badge } from '../../components/Badge/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/Tabs/Tabs'

export interface PortfolioIndexItem {
  value: string
  label: string
  count?: number
  content: ReactNode
  aside?: ReactNode
  more?: ReactNode
}
export interface PortfolioIndexProps {
  label: string
  items: PortfolioIndexItem[]
  aside?: ReactNode
  defaultValue?: string
}

/** A portfolio index whose categories and context follow the selected tab. */
export function PortfolioIndex({ label, items, aside, defaultValue }: PortfolioIndexProps) {
  const first = items[0]
  if (!first) return null
  return <section className="folio-portfolio-index" aria-label={label}><Tabs defaultValue={defaultValue ?? first.value}><TabsList aria-label={label}>{items.map(item => <TabsTrigger key={item.value} value={item.value}>{item.label}{item.count !== undefined && <>{' '}<Badge className="ms-2">{item.count}</Badge></>}</TabsTrigger>)}</TabsList>{items.map(item => <TabsContent key={item.value} value={item.value}><div className="folio-portfolio-columns"><div>{item.content}{item.more && <div className="folio-portfolio-more">{item.more}</div>}</div><aside className="folio-portfolio-aside">{item.aside}{aside}</aside></div></TabsContent>)}</Tabs></section>
}
