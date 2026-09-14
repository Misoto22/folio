'use client'

import { useState } from 'react'
import { Button, Text } from '@misoto22/folio'
import { SearchPalette } from '@misoto22/folio/website'

/**
 * The host filters records and handles selection; the palette supplies modal focus and keyboard navigation.
 * Close the palette to return focus to the button that opened it.
 */
export function Example() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState('Nothing selected')
  const titles = ['A practice of attention', 'The shared library', 'Keeping a field journal']
  // The palette opens inside this card rather than over the page, capped at the
  // card's height, so the card needs room for the whole list or it shows a sliver.
  return (
    <div className="min-h-[26rem]">
      <Button onClick={() => setOpen(true)}>Search the library</Button>
      <Text role="status" size="sm">{selected}</Text>
      <SearchPalette open={open} onOpenChange={setOpen} label="Library search" inputLabel="Search records"
        placeholder="Search titles" query={query} onQueryChange={setQuery} emptyLabel="No matching records"
        labels={{ close: 'Close search', navigate: 'Navigate', select: 'Select', back: 'Back to results' }}
        groups={[{ id: 'records', label: 'Records', items: titles.filter((title) => title.toLowerCase().includes(query.toLowerCase())).map((title) => ({
          id: title, title, onSelect: () => { setSelected(title); setOpen(false) },
        })) }]} />
    </div>
  )
}
