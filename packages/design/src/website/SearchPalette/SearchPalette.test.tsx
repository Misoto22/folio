import { useState } from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SearchPalette, type SearchPaletteGroup, type SearchPaletteProps } from './SearchPalette'

const LABELS = { close: 'Close search', navigate: 'Navigate', select: 'Open', back: 'Back' }

/** A palette behind a real trigger, so focus has somewhere to come back to. */
function Launcher({ groups = [], detail, onCloseAutoFocus }: {
  groups?: SearchPaletteGroup[]
  detail?: (back: () => void) => SearchPaletteProps['detail']
  onCloseAutoFocus?: SearchPaletteProps['onCloseAutoFocus']
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [inDetail, setInDetail] = useState(Boolean(detail))
  return <>
    <button onClick={() => setOpen(true)}>Launch search</button>
    <SearchPalette open={open} onOpenChange={setOpen} label="Search the archive" inputLabel="Query" placeholder="Search"
      query={query} onQueryChange={setQuery} groups={groups} emptyLabel="Nothing found" labels={LABELS}
      detail={detail && inDetail ? detail(() => setInDetail(false)) : undefined} onCloseAutoFocus={onCloseAutoFocus} />
  </>
}

describe('SearchPalette', () => {
  it('opens as one named dialog with the combobox focused', async () => {
    const user = userEvent.setup()
    render(<Launcher />)
    await user.click(screen.getByRole('button', { name: 'Launch search' }))
    const dialog = screen.getByRole('dialog', { name: 'Search the archive' })
    expect(within(dialog).getByRole('combobox', { name: 'Query' })).toHaveFocus()
    // One dialog and one scrim: the palette is CommandDialog, not a second modal around it.
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    expect(document.querySelectorAll('[data-m22-animated]')).toHaveLength(2)
  })

  it('uses externally filtered results and selects with the keyboard', async () => {
    const user = userEvent.setup()
    const selected = vi.fn()
    function Example() {
      const [query, setQuery] = useState('')
      return <SearchPalette open onOpenChange={() => {}} label="Search the archive" inputLabel="Query" placeholder="Search" query={query} onQueryChange={setQuery}
        groups={[{ id: 'pages', label: 'Pages', items: [{ id: 'remote-hit', title: 'A distant place', onSelect: selected }] }]}
        emptyLabel="Nothing found" labels={LABELS} />
    }
    render(<Example />)
    // Nothing in the title matches the query; a palette that filtered again would hide it.
    await user.type(screen.getByRole('combobox', { name: 'Query' }), 'mountains')
    expect(screen.getByRole('option', { name: 'A distant place' })).toBeVisible()
    expect(screen.queryByText('Nothing found')).not.toBeInTheDocument()
    await user.keyboard('{ArrowDown}{Enter}')
    expect(selected).toHaveBeenCalledOnce()
  })

  it('names each group by its heading', () => {
    render(<SearchPalette open onOpenChange={() => {}} label="Search" inputLabel="Query" placeholder="Search" query="" onQueryChange={() => {}}
      groups={[{ id: 'pages', label: 'Pages', items: [{ id: 'a', title: 'About', meta: 'Page', onSelect: () => {} }] }]}
      emptyLabel="Nothing found" labels={LABELS} />)
    expect(screen.getByRole('group', { name: 'Pages' })).toContainElement(screen.getByRole('option', { name: /About/ }))
  })

  it('says so when the host has no results', async () => {
    const user = userEvent.setup()
    render(<Launcher groups={[]} />)
    await user.click(screen.getByRole('button', { name: 'Launch search' }))
    expect(screen.getByText('Nothing found')).toBeVisible()
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })

  it('closes from the list with Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup()
    render(<Launcher />)
    const trigger = screen.getByRole('button', { name: 'Launch search' })
    await user.click(trigger)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })

  it('leaves focus to a host that places it itself', async () => {
    const user = userEvent.setup()
    const placed = vi.fn((event: Event) => event.preventDefault())
    render(<><Launcher onCloseAutoFocus={placed} /><button>Elsewhere</button></>)
    await user.click(screen.getByRole('button', { name: 'Launch search' }))
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(placed).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: 'Launch search' })).not.toHaveFocus()
  })

  it('returns from detail with Escape, then closes and restores focus', async () => {
    const user = userEvent.setup()
    render(<Launcher detail={(back) => ({ label: 'Answer', content: <a href="/source">Read source</a>, onBack: back, onSubmit: () => {} })} />)
    const trigger = screen.getByRole('button', { name: 'Launch search' })
    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(screen.getByRole('dialog', { name: 'Search the archive' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Query' })).toHaveFocus()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })

  it('submits the detail question with Enter, which the command list would otherwise take', async () => {
    const user = userEvent.setup()
    const submitted = vi.fn()
    render(<Launcher detail={(back) => ({ label: 'Answer', content: 'An answer', onBack: back, onSubmit: submitted })} />)
    await user.click(screen.getByRole('button', { name: 'Launch search' }))
    const field = screen.getByRole('textbox', { name: 'Query' })
    await user.click(field)
    await user.keyboard('{Enter}')
    expect(submitted).not.toHaveBeenCalled()
    await user.type(field, 'why{Enter}')
    expect(submitted).toHaveBeenCalledOnce()
  })

  it('goes back from detail with Enter on the back button', async () => {
    const user = userEvent.setup()
    render(<Launcher detail={(back) => ({ label: 'Answer', content: 'An answer', onBack: back, onSubmit: () => {} })} />)
    await user.click(screen.getByRole('button', { name: 'Launch search' }))
    screen.getByRole('button', { name: 'Back' }).focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('combobox', { name: 'Query' })).toBeInTheDocument()
  })
})
