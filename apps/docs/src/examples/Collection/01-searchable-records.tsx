'use client'

import { useState } from 'react'
import { CollectionControls, CollectionEmpty, CollectionIntro, RecordRow } from '@misoto22/folio/website'

/**
 * Search and category state stay with the host, which supplies the filtered records.
 * The controls provide named inputs, clear actions and pressed filter states.
 */
export function Example() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const records = [
    { id: 'attention', category: 'essays', title: 'A practice of attention', summary: 'Noticing what a familiar place reveals.' },
    { id: 'library', category: 'projects', title: 'The shared library', summary: 'A small tool for a growing collection.' },
  ].filter((record) => (!category || record.category === category) && record.title.toLowerCase().includes(query.toLowerCase()))
  return (
    <div className="w-full">
      <CollectionIntro title="Library" description="Essays and projects from the studio." />
      <CollectionControls filterLabel="Category" selected={category} onSelect={setCategory}
        items={[{ value: null, label: 'All' }, { value: 'essays', label: 'Essays' }, { value: 'projects', label: 'Projects' }]}
        search={{ value: query, onChange: setQuery, label: 'Search the library', placeholder: 'Search titles', clearLabel: 'Clear search' }} />
      {records.map((record) => <RecordRow key={record.id} variant="compact"
        link={<a href={`#${record.id}`} />} title={record.title} summary={record.summary} context={record.category} />)}
      {records.length === 0 && <CollectionEmpty message="No matching records" hint="Try another title or category." />}
    </div>
  )
}
