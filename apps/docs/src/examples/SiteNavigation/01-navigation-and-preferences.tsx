'use client'

import { useState } from 'react'
import { RiTranslate2 } from '@remixicon/react'
import { PreferenceMenu, SiteNavigation } from '@misoto22/folio/website'

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
      links={[
        { id: 'writing', active: true, content: <a href="#writing">Writing</a> },
        { id: 'work', content: <a href="#work">Work</a> },
        { id: 'about', content: <a href="#about">About</a> },
      ]}
      actions={<PreferenceMenu label="Language" value={language} onValueChange={setLanguage}
        icon={<RiTranslate2 size={18} aria-hidden="true" />}
        options={[{ value: 'en', label: 'English' }, { value: 'zh', label: '中文' }]} />}
    />
  )
}
