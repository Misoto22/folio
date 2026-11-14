import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Suspense, useState, type ReactElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CollectionControls, CollectionFacet, CollectionSearch, HighlightedText, RecordRow, RecordArrow } from './Collection'

/** Answers one media query `true` for the test's duration; the setup stub answers `false` to all. */
function matchOnly(query: string) {
  vi.spyOn(window, 'matchMedia').mockImplementation((media: string) => ({
    media, matches: media === query, onchange: null, dispatchEvent: () => false,
    addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {},
  }) as MediaQueryList)
}
afterEach(() => { vi.restoreAllMocks() })

describe('Collection compositions', () => {
  it('reports the chosen filter and exposes the current choice', () => {
    const onSelect = vi.fn()
    render(<CollectionControls items={[{ value: null, label: 'All', count: 9 }, { value: 'writing', label: 'Writing', count: 8 }]} selected={null} onSelect={onSelect} filterLabel="Filter records" />)
    const group = screen.getByRole('group', { name: 'Filter records' })
    // The count is read as part of the name, not hidden from it.
    expect(within(group).getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
    expect(within(group).getByRole('button', { name: 'Writing' })).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(screen.getByRole('button', { name: 'Writing' }))
    expect(onSelect).toHaveBeenCalledWith('writing')
    // The label names the group; it is no longer printed beside the pills.
    expect(screen.queryByText('Filter records')).toBeNull()
  })
  it('marks the pressed filter for the sliding marker and moves the mark with the choice', () => {
    const view = render(<CollectionControls items={[{ value: null, label: 'All' }, { value: 'iot', label: 'IoT' }]} selected={null} onSelect={() => {}} />)
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('data-indicator-active', 'true')
    view.rerender(<CollectionControls items={[{ value: null, label: 'All' }, { value: 'iot', label: 'IoT' }]} selected="iot" onSelect={() => {}} />)
    expect(screen.getByRole('button', { name: 'IoT' })).toHaveAttribute('data-indicator-active', 'true')
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('data-indicator-active', 'false')
  })
  it('says the result in a live line only while something is applied, and clears from it', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    const view = render(<CollectionControls items={[{ value: null, label: 'All' }]} selected={null} onSelect={() => {}} summary={{ active: false, label: '6 of 6 projects', clearLabel: 'Clear', onClear }} />)
    const status = screen.getByRole('status')
    expect(status).toBeEmptyDOMElement()
    view.rerender(<CollectionControls items={[{ value: null, label: 'All' }]} selected={null} onSelect={() => {}} tools={<span>Tools</span>} summary={{ active: true, label: '3 of 6 projects', clearLabel: 'Clear', onClear, applied: <button type="button">Remove tag AI</button> }} />)
    expect(screen.getByRole('status')).toHaveTextContent('3 of 6 projects')
    expect(screen.getByRole('button', { name: 'Remove tag AI' })).toBeInTheDocument()
    expect(screen.getByText('Tools').closest('.folio-collection-tools')).not.toBeNull()
    await user.click(screen.getByRole('button', { name: 'Clear' }))
    expect(onClear).toHaveBeenCalledOnce()
  })
  it('fades only the far edge at rest, even when snapping leaves the rail inside its padding', () => {
    render(<CollectionControls filterLabel="Filter" items={[{ label: 'All', value: null }, { label: 'iOS', value: 'ios' }]} selected={null} onSelect={() => {}} />)
    const rail = screen.getByRole('group', { name: 'Filter' })
    Object.defineProperty(rail, 'scrollWidth', { configurable: true, value: 600 })
    Object.defineProperty(rail, 'clientWidth', { configurable: true, value: 300 })
    rail.style.paddingInlineStart = '6px'
    // Snapping the first pill leaves the rail 6px in: still the start.
    rail.scrollLeft = 6
    fireEvent.scroll(rail)
    expect(rail).toHaveAttribute('data-fade', 'end')
    rail.scrollLeft = 150
    fireEvent.scroll(rail)
    expect(rail).toHaveAttribute('data-fade', 'both')
    rail.scrollLeft = 300
    fireEvent.scroll(rail)
    expect(rail).toHaveAttribute('data-fade', 'start')
  })

  it('shows each count beside its filter but keeps it out of the control name', () => {
    render(<CollectionControls filterLabel="Filter" items={[{ label: 'All', value: null, count: 6 }, { label: 'Still life', value: 'still', count: 3 }]} selected={null} onSelect={() => {}} />)
    const pill = screen.getByRole('button', { name: 'Still life' })
    expect(pill).toHaveTextContent('Still life 3')
    expect(pill.querySelector('.folio-collection-count')).toHaveAttribute('aria-hidden', 'true')
  })

  it('keeps search named after typing and reports clear without submitting', () => {
    const onQueryChange = vi.fn()
    render(<CollectionControls items={[]} selected={null} onSelect={() => {}} search={{ value: 'test', onChange: onQueryChange, label: 'Search records', clearLabel: 'Clear search' }} />)
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search records' }), { target: { value: 'hello' } })
    expect(onQueryChange).toHaveBeenCalledWith('hello')
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(onQueryChange).toHaveBeenCalledWith('')
  })
  it('folds search to an opener on a phone, opens it on demand and returns focus to it when cleared', async () => {
    matchOnly('(max-width: 640px)')
    const user = userEvent.setup()
    function Search() {
      const [value, setValue] = useState('')
      return <CollectionSearch value={value} onChange={setValue} label="Search projects" clearLabel="Clear search" openLabel="Open search" />
    }
    const { container } = render(<Search />)
    const opener = screen.getByRole('button', { name: 'Open search' })
    const field = screen.getByRole('searchbox', { name: 'Search projects' })
    expect(opener).toHaveAttribute('aria-expanded', 'false')
    expect(opener).toHaveAttribute('aria-controls', field.id)
    await user.click(opener)
    expect(field).toHaveFocus()
    expect(opener).toHaveAttribute('aria-expanded', 'true')
    expect(container.querySelector('.folio-collection-search')).toHaveAttribute('data-open', 'true')
    await user.type(field, 'next')
    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(field).toHaveValue('')
    expect(opener).toHaveFocus()
    expect(opener).toHaveAttribute('aria-expanded', 'false')
  })
  it('keeps the field open at every width without an opener label, and clears on Escape', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CollectionSearch value="next" onChange={onChange} label="Search posts" clearLabel="Clear search" focusShortcut />)
    expect(screen.queryByRole('button', { name: /open/i })).toBeNull()
    expect(screen.getByText('/').tagName).toBe('KBD')
    await user.click(screen.getByRole('searchbox', { name: 'Search posts' }))
    await user.keyboard('{Escape}')
    expect(onChange).toHaveBeenCalledWith('')
  })
  it('matches repeated literal query characters without treating them as a regex', () => {
    const { container } = render(<HighlightedText text="[a] plus [A]" query="[a]" />)
    expect([...container.querySelectorAll('mark')].map((mark) => mark.textContent)).toEqual(['[a]', '[A]'])
  })
  it('preserves a host navigation element and the selected heading level', () => {
    render(<RecordRow link={<a href="/zh/notes/one" />} title="A note" headingLevel={3} summary="Its summary" />)
    expect(screen.getByRole('link', { name: /A note/ })).toHaveAttribute('href', '/zh/notes/one')
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('A note')
  })
  it('resolves a deferred server navigation slot before adding the record content', async () => {
    // React Server Components transport a suspended element as a lazy payload.
    const element = <a href="/zh/notes/deferred">Placeholder</a>
    let ready = false
    let release: () => void = () => {}
    const payload = new Promise<void>((resolve) => { release = () => { ready = true; resolve() } })
    const link = { $$typeof: Symbol.for('react.lazy'), _payload: payload, _init: () => { if (!ready) throw payload; return element } } as unknown as ReactElement
    render(<Suspense fallback="Loading"><RecordRow link={link} title="Deferred note" /></Suspense>)
    expect(screen.getByText('Loading')).toBeInTheDocument()
    await act(async () => release())
    expect(await screen.findByRole('link', { name: 'Deferred note' })).toHaveAttribute('href', '/zh/notes/deferred')
    expect(screen.queryByText('Placeholder')).not.toBeInTheDocument()
  })
})

describe('RecordArrow', () => {
  it('ends a row’s trailing action with a hidden arrow the row can nudge, pointing out for an external link', () => {
    const { container } = render(<RecordRow link={<a href="/projects/revala" />} title="Revala" trailing={<span>Open project <RecordArrow /></span>} />)
    const arrow = container.querySelector('.folio-record-link .folio-record-trailing .folio-record-arrow')!
    expect(arrow).toHaveAttribute('aria-hidden', 'true')
    expect(arrow).not.toHaveAttribute('data-external')
    expect(screen.getByRole('link')).toHaveAccessibleName(/Open project/)
    const { container: away } = render(<RecordArrow external />)
    expect(away.querySelector('.folio-record-arrow')).toHaveAttribute('data-external', 'true')
  })
})


describe('CollectionFacet', () => {
  const options = [{ value: 'ai', label: 'AI', count: 4 }, { value: 'tmux', label: 'tmux', count: 2 }]

  it('opens a named popover on a desk and selects in place, choosing the applied option again to remove it', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const view = render(<CollectionFacet label="Tags" closeLabel="Close" options={options} onSelect={onSelect} />)
    const trigger = screen.getByRole('button', { name: 'Tags' })
    expect(trigger).not.toHaveAttribute('data-active')
    await user.click(trigger)
    const panel = screen.getByRole('dialog', { name: 'Tags' })
    await user.click(within(panel).getByRole('button', { name: 'AI' }))
    expect(onSelect).toHaveBeenLastCalledWith('ai')
    expect(screen.queryByRole('dialog')).toBeNull()
    view.rerender(<CollectionFacet label="Tags" closeLabel="Close" options={options} onSelect={onSelect} selected="ai" />)
    expect(trigger).toHaveAttribute('data-active', 'true')
    await user.click(trigger)
    expect(screen.getByRole('button', { name: 'AI' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'AI' }))
    expect(onSelect).toHaveBeenLastCalledWith(null)
  })

  it('renders linked options as the host links, marking the current one', async () => {
    const user = userEvent.setup()
    render(<CollectionFacet label="Tags" closeLabel="Close" selected="tmux" options={options.map((option) => ({ ...option, link: <a href={`/blog/tag/${option.value}`} /> }))} />)
    await user.click(screen.getByRole('button', { name: 'Tags' }))
    expect(screen.getByRole('link', { name: 'AI' })).toHaveAttribute('href', '/blog/tag/ai')
    expect(screen.getByRole('link', { name: 'tmux' })).toHaveAttribute('aria-current', 'page')
  })

  it('opens a bottom sheet with its own close on a phone', async () => {
    matchOnly('(max-width: 640px)')
    const user = userEvent.setup()
    render(<CollectionFacet label="Tags" closeLabel="Close tags" options={options} onSelect={() => {}} />)
    await user.click(screen.getByRole('button', { name: 'Tags' }))
    const sheet = screen.getByRole('dialog', { name: 'Tags' })
    expect(sheet).toHaveAttribute('data-side', 'bottom')
    await user.click(within(sheet).getByRole('button', { name: 'Close tags' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
