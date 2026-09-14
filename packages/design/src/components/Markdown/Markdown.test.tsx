import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EXTERNAL_LINK_ARROW } from '../LinkArrow/LinkArrow'
import { Markdown, parseMarkdown, slugify } from './Markdown'

const DOC = ['# Release notes', '', '## Installation', '', 'Run `pnpm add`.'].join('\n')

describe('Markdown', () => {
  it('renders headings, prose and inline code as system nodes', () => {
    render(<Markdown>{DOC}</Markdown>)

    expect(screen.getByRole('heading', { level: 1, name: 'Release notes' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Installation' })).toBeInTheDocument()
    expect(screen.getByText('pnpm add').tagName).toBe('CODE')
  })

  it('shifts the whole document down by headingLevelStart', () => {
    // Markdown is written as a document, so its `#` is an <h1>. Dropped into a
    // page that already has one, that is two first-level headings and an
    // outline a screen reader cannot navigate.
    render(<Markdown headingLevelStart={3}>{DOC}</Markdown>)

    expect(screen.getByRole('heading', { level: 3, name: 'Release notes' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 4, name: 'Installation' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
  })

  it('clamps at six rather than emitting an element that does not exist', () => {
    render(<Markdown headingLevelStart={6}>{'# One\n\n## Two'}</Markdown>)
    expect(screen.getAllByRole('heading', { level: 6 })).toHaveLength(2)
  })

  it('gives every heading a slug-like id', () => {
    render(<Markdown>{DOC}</Markdown>)

    expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute('id', 'release-notes')
    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('id', 'installation')
  })

  it('keeps the ids stable across a re-render and across the shift', () => {
    // A table of contents links to these. An id that changes when the level
    // does is a set of dead anchors nobody notices until the page is deployed.
    const { rerender } = render(<Markdown>{DOC}</Markdown>)
    const first = screen.getByRole('heading', { level: 2 }).id

    rerender(<Markdown>{DOC}</Markdown>)
    expect(screen.getByRole('heading', { level: 2 }).id).toBe(first)

    rerender(<Markdown headingLevelStart={3}>{DOC}</Markdown>)
    expect(screen.getByRole('heading', { level: 4 }).id).toBe(first)
  })

  it('separates two headings that slug to the same thing', () => {
    render(<Markdown>{'## Notes\n\n## Notes'}</Markdown>)
    const ids = screen.getAllByRole('heading').map((heading) => heading.id)
    expect(ids).toEqual(['notes', 'notes-2'])
  })

  it('namespaces ids with idPrefix', () => {
    render(<Markdown idPrefix="answer">{'## Notes'}</Markdown>)
    expect(screen.getByRole('heading')).toHaveAttribute('id', 'answer-notes')
  })

  it('keeps a heading in a non-Latin script rather than slugging it away', () => {
    render(<Markdown>{'## 设计系统'}</Markdown>)
    expect(screen.getByRole('heading')).toHaveAttribute('id', '设计系统')
  })

  it('falls back to a usable id when a heading slugs to nothing', () => {
    render(<Markdown>{'## ***'}</Markdown>)
    expect(screen.getByRole('heading').id).toBe('section')
  })

  it('renders nothing for an empty string', () => {
    const { container } = render(<Markdown>{''}</Markdown>)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing for whitespace, and does not throw', () => {
    const { container } = render(<Markdown>{'   \n\n\t'}</Markdown>)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders malformed input as the text it is instead of throwing', () => {
    // Every one of these is a real thing a reader types. None of them is an
    // error condition — a component that throws here takes a comment thread
    // down with it.
    const broken = '# \n\n[unclosed](\n\n**never closed\n\n```\nlet x = 1'
    expect(() => render(<Markdown>{broken}</Markdown>)).not.toThrow()
  })

  it('renders a fenced block as a CodeBlock with its language', () => {
    render(<Markdown>{'```bash\npnpm add @misoto22/folio\n```'}</Markdown>)

    expect(screen.getByRole('group', { name: 'Code' })).toBeInTheDocument()
    expect(screen.getByText('Shell')).toBeInTheDocument()
  })

  it('renders an unterminated fence rather than swallowing the rest', () => {
    render(<Markdown>{'```ts\nconst a = 1'}</Markdown>)
    expect(screen.getByRole('group', { name: 'Code' }).textContent).toContain('const a = 1')
  })

  it('renders a list, and a nested list under its item', () => {
    const { container } = render(<Markdown>{'- One\n  - Nested\n- Two'}</Markdown>)

    const lists = container.querySelectorAll('ul')
    expect(lists).toHaveLength(2)
    expect(screen.getByText('Nested')).toBeInTheDocument()
  })

  it('renders links, and refuses a scheme that is not a link', () => {
    render(<Markdown>{'[safe](/changelog) and [unsafe](javascript:alert(1))'}</Markdown>)

    expect(screen.getByRole('link', { name: 'safe' })).toHaveAttribute('href', '/changelog')
    // The text survives; the control does not. A design system that renders a
    // reader's markdown is a place XSS arrives, and this is the boundary.
    expect(screen.queryByRole('link', { name: 'unsafe' })).not.toBeInTheDocument()
    expect(screen.getByText(/unsafe/)).toBeInTheDocument()
  })

  it('sends an outbound link away with neither the page\u2019s referer nor its ranking', () => {
    // Refusing javascript: is half a boundary. The other half is what a link
    // an untrusted author wrote is allowed to take with it.
    render(<Markdown>{'[the paper](https://example.com/paper)'}</Markdown>)
    expect(screen.getByRole('link', { name: 'the paper' })).toHaveAttribute(
      'rel',
      'noreferrer nofollow',
    )
  })

  it('leaves a relative link alone, because it cannot leave the origin', () => {
    render(<Markdown>{'[the changelog](/changelog)'}</Markdown>)
    expect(screen.getByRole('link', { name: 'the changelog' })).not.toHaveAttribute('rel')
  })

  it('marks an outbound link with the system\u2019s arrow only when asked', () => {
    const { rerender } = render(<Markdown>{'[the paper](https://example.com/paper)'}</Markdown>)
    expect(screen.getByRole('link').textContent).toBe('the paper')

    rerender(<Markdown markExternalLinks>{'[the paper](https://example.com/paper)'}</Markdown>)
    expect(screen.getByRole('link').textContent).toContain(EXTERNAL_LINK_ARROW)
    // The mark is a mark, not a word: it is hidden from the accessible name.
    expect(screen.getByRole('link', { name: 'the paper' })).toBeInTheDocument()
  })

  it('renders a tag as text rather than as markup', () => {
    render(<Markdown>{'<img src=x onerror=alert(1)>'}</Markdown>)
    expect(screen.getByText(/<img src=x onerror=alert\(1\)>/)).toBeInTheDocument()
  })

  it('takes a caller-supplied parser', () => {
    render(
      <Markdown parse={() => [{ type: 'paragraph', children: [{ type: 'text', value: 'From remark' }] }]}>
        {'# ignored'}
      </Markdown>,
    )
    expect(screen.getByText('From remark')).toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})

describe('parseMarkdown', () => {
  it('returns no nodes for an empty document', () => {
    expect(parseMarkdown('')).toEqual([])
  })

  it('joins a hard-wrapped paragraph into one', () => {
    expect(parseMarkdown('one\ntwo')).toEqual([
      { type: 'paragraph', children: [{ type: 'text', value: 'one two' }] },
    ])
  })

  it('does not read an underscore inside an identifier as emphasis', () => {
    expect(parseMarkdown('snake_case_name')).toEqual([
      { type: 'paragraph', children: [{ type: 'text', value: 'snake_case_name' }] },
    ])
  })

  it('honours a backslash escape', () => {
    expect(parseMarkdown('\\*not emphasis\\*')).toEqual([
      { type: 'paragraph', children: [{ type: 'text', value: '*not emphasis*' }] },
    ])
  })
})

describe('slugify', () => {
  it('produces the id a table of contents has to arrive at independently', () => {
    expect(slugify('Getting Started — Part 2')).toBe('getting-started-part-2')
    expect(slugify('  Trailing  ')).toBe('trailing')
    expect(slugify('***')).toBe('')
  })
})
