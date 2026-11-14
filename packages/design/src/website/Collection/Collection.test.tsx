import { act, fireEvent, render, screen } from '@testing-library/react'
import { Suspense, type ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { CollectionControls, HighlightedText, RecordRow, RecordArrow } from './Collection'

describe('Collection compositions', () => {
  it('reports the chosen filter and exposes the current choice', () => {
    const onSelect = vi.fn()
    render(<CollectionControls items={[{ value: null, label: 'All' }, { value: 'writing', label: 'Writing', count: 8 }]} selected={null} onSelect={onSelect} filterLabel="Filter records" />)
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Writing' }))
    expect(onSelect).toHaveBeenCalledWith('writing')
  })
  it('keeps search named after typing and reports clear without submitting', () => {
    const onQueryChange = vi.fn()
    render(<CollectionControls items={[]} selected={null} onSelect={() => {}} search={{ value: 'test', onChange: onQueryChange, label: 'Search records', clearLabel: 'Clear search' }} />)
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search records' }), { target: { value: 'hello' } })
    expect(onQueryChange).toHaveBeenCalledWith('hello')
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(onQueryChange).toHaveBeenCalledWith('')
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

