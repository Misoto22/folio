'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@misoto22/folio'
import { useEffect, useRef, useState, type ReactNode } from 'react'

export interface PageTab {
  value: string
  label: string
  /**
   * The heading ids this panel owns.
   *
   * An inactive panel is not in the document — Radix renders `present && children`
   * — so the browser cannot jump to a heading inside one, and a link that has
   * worked since the page existed would quietly stop working. This is the list
   * the strip consults to open the right panel first.
   */
  anchors: string[]
  panel: ReactNode
}

/**
 * A page split into panels, without losing the anchors it already published.
 *
 * The split is worth doing: a component page is a reference and a sandbox
 * stacked into one column, and the reader arriving with "what does `variant`
 * do" has to scroll past everything the reader arriving with "how do I use this
 * at all" came for. Two panels is the honest shape.
 *
 * What a naive split costs is every deep link into the half that is now hidden.
 * So the strip reads the fragment on arrival and on every `hashchange`, opens
 * the panel that owns it, and performs the jump itself once that panel exists.
 * Read in an effect and not during render, deliberately: the server has no
 * fragment, and choosing a panel from one before hydration is a mismatch.
 */
export function PageTabs({ tabs, label }: { tabs: PageTab[]; label: string }) {
  const [value, setValue] = useState(tabs[0]?.value ?? '')

  // The panels are server-rendered nodes, so `tabs` is a new array on every
  // render and cannot be an effect dependency without re-subscribing forever.
  const latest = useRef(tabs)
  useEffect(() => {
    latest.current = tabs
  })

  useEffect(() => {
    const follow = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (!id) return
      const owner = latest.current.find((tab) => tab.anchors.includes(id))
      if (!owner) return
      setValue(owner.value)
      // The heading was not in the document when the browser tried to reach it,
      // so the jump has to happen here, after the panel holding it exists.
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
    }

    follow()
    window.addEventListener('hashchange', follow)
    return () => window.removeEventListener('hashchange', follow)
  }, [])

  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList aria-label={label}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="flex flex-col gap-12 pt-8">
          {tab.panel}
        </TabsContent>
      ))}
    </Tabs>
  )
}
