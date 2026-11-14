'use client'

import { useState } from 'react'
import { CollectionControls, CollectionEmpty, CollectionFacet, CollectionIntro, RecordRow } from '@misoto22/folio/website'

/**
 * Search and category state stay with the host, which supplies the filtered records.
 * The controls provide named inputs, clear actions and pressed filter states.
 */
export function Example() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [tag, setTag] = useState<string | null>(null)
  const all = [
    { id: 'attention', category: 'essays', tag: 'places', title: 'A practice of attention', summary: 'Noticing what a familiar place reveals.' },
    { id: 'library', category: 'projects', tag: 'tools', title: 'The shared library', summary: 'A small tool for a growing collection.' },
  ]
  const records = all.filter((record) => (!category || record.category === category) && (!tag || record.tag === tag) && record.title.toLowerCase().includes(query.toLowerCase()))
  const count = (key: 'category' | 'tag', value: string) => all.filter((record) => record[key] === value).length
  const applied = Boolean(category || tag || query)
  return (
    <div className="w-full">
      <CollectionIntro title="Library" description="Essays and projects from the studio." />
      <CollectionControls filterLabel="Category" selected={category} onSelect={setCategory}
        items={[{ value: null, label: 'All', count: all.length }, { value: 'essays', label: 'Essays', count: count('category', 'essays') }, { value: 'projects', label: 'Projects', count: count('category', 'projects') }]}
        tools={<CollectionFacet label="Tags" closeLabel="Close tags" selected={tag} onSelect={setTag}
          options={['places', 'tools'].map((value) => ({ value, label: value, count: count('tag', value) }))} />}
        search={{ value: query, onChange: setQuery, label: 'Search the library', placeholder: 'Search titles', clearLabel: 'Clear search', openLabel: 'Open search', focusShortcut: true }}
        summary={{ active: applied, label: <><b>{records.length}</b> of {all.length} records</>, clearLabel: 'Clear', onClear: () => { setCategory(null); setTag(null); setQuery('') } }} />
      {records.map((record) => <RecordRow key={record.id} variant="compact"
        link={<a href={`#${record.id}`} />} title={record.title} summary={record.summary} context={record.category} />)}
      {records.length === 0 && <CollectionEmpty message="No matching records" hint="Try another title or category." />}
    </div>
  )
}
