import { fireEvent, render, screen } from '@testing-library/react'
import { Suspense, type ReactElement } from 'react'
import { describe, expect, it } from 'vitest'
import { DetailMasthead, DevicePreview, DeviceRow, RecordPager, TableOfContents, TokenLine, isSelfNumbered, numberToc } from './Reading'

describe('Reading compositions', () => {
  it('retains semantic dates and host navigation in its masthead', () => {
    render(<DetailMasthead title="An article" backLink={<a href="/zh/blog">All posts</a>} metadata={[{ label: 'Published', value: '7 September 2026', dateTime: '2026-09-07' }]} />)
    expect(screen.getByText('7 September 2026').tagName).toBe('TIME')
    expect(screen.getByText('7 September 2026')).toHaveAttribute('datetime', '2026-09-07')
    expect(screen.getByRole('link')).toHaveAttribute('href', '/zh/blog')
  })
  it('numbers relative to the top heading level and detects authored step numbers', () => {
    expect(numberToc([{ id: 'a', label: 'A', level: 3 }, { id: 'b', label: 'B', level: 4 }])).toEqual(['1', '1.1'])
    expect(isSelfNumbered([{ id: 'a', label: '1. First', level: 2 }, { id: 'b', label: '2. Second', level: 2 }])).toBe(true)
  })
  it('activates a clicked section and unfolds its children', () => {
    render(<TableOfContents label="Contents" items={[{ id: 'a', label: 'First', level: 2 }, { id: 'b', label: 'Second', level: 2 }, { id: 'c', label: 'Nested', level: 3 }]} />)
    expect(screen.queryByRole('link', { name: /Nested/ })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('link', { name: /Second/ }))
    expect(screen.getByRole('link', { name: /Nested/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Second/ })).toHaveAttribute('aria-current', 'true')
  })
  it('renders one-sided pagination without a fake navigation target', () => {
    render(<RecordPager label="Article navigation" next={{ link: <a href="/next" />, direction: 'Next', title: 'Next article' }} />)
    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/next')
  })
  it('resolves deferred server navigation before adding the pager labels', async () => {
    const element = <a href="/next">Placeholder</a>
    const link = { $$typeof: Symbol.for('react.lazy'), _payload: Promise.resolve(element), _init: () => element } as unknown as ReactElement
    render(<Suspense fallback="Loading"><RecordPager label="Article navigation" next={{ link, direction: 'Next', title: 'Deferred article' }} /></Suspense>)
    expect(await screen.findByRole('link', { name: 'Next Deferred article' })).toHaveAttribute('href', '/next')
    expect(screen.queryByText('Placeholder')).not.toBeInTheDocument()
  })
  it('retains each supplied token as a separate list entry', () => {
    render(<TokenLine items={[{ label: 'SQL Server' }, { label: 'mssql-django' }]} />)
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['SQL Server', '·mssql-django'])
  })
})

import { CodeBlock } from '../../components/CodeBlock/CodeBlock'
import { Sheet, SheetContent, SheetTrigger } from '../../components/Sheet/Sheet'
import { Button } from '../../components/Button/Button'
import { vi } from 'vitest'
import { waitFor } from '@testing-library/react'

describe('localized reading controls', () => {
  it('uses translated copy labels and copies the source rather than markup', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    render(<CodeBlock code="pnpm add example" copyLabel="复制" copiedLabel="已复制" />)
    fireEvent.click(screen.getByRole('button', { name: '复制' }))
    await waitFor(() => expect(screen.getByRole('button', { name: '已复制' })).toBeInTheDocument())
    expect(writeText).toHaveBeenCalledWith('pnpm add example')
  })
  it('names the sheet close action in the host locale', () => {
    render(<Sheet><SheetTrigger asChild><Button>Open outline</Button></SheetTrigger><SheetContent title="目录" closeLabel="关闭" aria-describedby={undefined}>Content</SheetContent></Sheet>)
    fireEvent.click(screen.getByRole('button', { name: 'Open outline' }))
    expect(screen.getByRole('button', { name: '关闭' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '关闭' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

import { CommandSnippet } from './Reading'
describe('CommandSnippet', () => {
  it('renders literal untrusted code without evaluating its markup', () => {
    const code = '<script>alert(1)</script>'
    const { container } = render(<CommandSnippet code={code} pieces={[{ text: code, emphasis: 'strong' }]} copyLabel="Copy source" copiedLabel="Copied source" />)
    expect(container.querySelector('script')).toBeNull()
    expect(container.querySelector('code')).toHaveTextContent(code)
  })
  it('falls back to exact source when highlighting does not match', () => {
    const { container } = render(<CommandSnippet code="actual" pieces={[{ text: 'wrong' }]} copyLabel="Copy source" copiedLabel="Copied source" />)
    expect(container.querySelector('code')).toHaveTextContent('actual')
    expect(screen.queryByText('wrong')).not.toBeInTheDocument()
  })

  it('draws a row of phones as one labelled group, each with its own caption', () => {
    render(<DeviceRow label="Revala on iPhone">{['Map', 'Trip'].map((name) => <DevicePreview key={name} kind="phone" media={<img alt={`${name} screen`} />} caption={name} />)}</DeviceRow>)
    const group = screen.getByRole('group', { name: 'Revala on iPhone' })
    expect(group.querySelectorAll('figure[data-kind="phone"]')).toHaveLength(2)
    expect(screen.getByText('Trip').tagName).toBe('FIGCAPTION')
    expect(screen.getByAltText('Map screen').closest('.folio-device-screen')).not.toBeNull()
  })

  it('leaves an unlabelled row without a group role', () => {
    const { container } = render(<DeviceRow><DevicePreview kind="phone" media={<span />} /></DeviceRow>)
    expect(container.firstElementChild).not.toHaveAttribute('role')
  })
})
