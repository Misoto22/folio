'use client'

import { useState } from 'react'
import { Languages } from '@misoto22/folio/icons'
import { NavigationSearchTrigger, PreferenceMenu, PreferenceSegment, SiteNavigation } from '@misoto22/folio/website'

/**
 * Navigation receives real link elements and a controlled language preference.
 * Narrow the canvas to use the mobile sheet and its localized close action.
 */
export function Example() {
  const [language, setLanguage] = useState('en')
  return (
    <SiteNavigation
      brand={<a href="#journal">Field Notes</a>}
      label="Journal navigation"
      openLabel="Open navigation"
      closeLabel="Close navigation"
      currentLabel="You are here"
      links={[
        { id: 'writing', active: true, content: <a href="#writing">Writing</a> },
        { id: 'work', content: <a href="#work">Work</a> },
        { id: 'about', content: <a href="#about">About</a> },
      ]}
      secondaryLabel="More pages"
      secondaryLinks={[{ id: 'contact', content: <a href="#contact">Contact</a> }]}
      barActions={<NavigationSearchTrigger label="Search" onClick={() => {}} />}
      actions={<><NavigationSearchTrigger label="Search" onClick={() => {}} /><PreferenceMenu label="Language" value={language} onValueChange={setLanguage}
        icon={<Languages size={18} aria-hidden="true" />}
        options={[{ value: 'en', label: 'English' }, { value: 'zh', label: '中文' }]} /></>}
      footer={<PreferenceSegment label="Language" value={language} onValueChange={setLanguage}
        options={[{ value: 'en', label: 'English' }, { value: 'zh', label: '中文' }]} />}
    />
  )
}
