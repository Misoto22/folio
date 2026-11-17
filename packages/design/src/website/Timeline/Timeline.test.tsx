import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { CareerRecord, CareerRecordProjects } from './Timeline'

const base = { title: 'Software Engineer', organization: 'Inovit', period: '2025 — Now', periodLabel: 'Period', location: 'Sydney', locationLabel: 'Location', description: ['Built things.'], tagsLabel: 'Technologies' }

describe('CareerRecord tags', () => {
  it('renders plain strings as text chips', () => {
    render(<CareerRecord {...base} tags={['Agile', 'Git']} />)
    const list = screen.getByRole('list', { name: 'Technologies' })
    expect(within(list).getAllByRole('listitem').map((item) => item.textContent)).toEqual(['Agile', 'Git'])
  })

  it('draws a mark beside a label without adding it to the accessible name', () => {
    const { container } = render(<CareerRecord {...base} tags={[{ label: 'React', icon: <svg data-testid="react-mark" /> }, 'Agile']} />)
    const items = within(screen.getByRole('list', { name: 'Technologies' })).getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('React')
    expect(screen.getByTestId('react-mark').parentElement).toHaveAttribute('aria-hidden', 'true')
    expect(items[1].querySelector('[aria-hidden]')).toBeNull()
    expect(container.querySelectorAll('.folio-career-record__tag-mark')).toHaveLength(1)
  })

  it('renders no tag row when there are no tags', () => {
    render(<CareerRecord {...base} tags={[]} />)
    expect(screen.queryByRole('list', { name: 'Technologies' })).toBeNull()
  })
})

describe('CareerRecordProjects', () => {
  const groups = [
    { id: 'platform', label: 'Platform', projects: [{ id: 'efficient', title: 'EFFICIENT System', summary: 'The engineering contract.', link: <a href="/projects/efficient-system" /> }] },
    { id: 'apps', label: 'Apps', projects: [{ id: 'dealer', title: 'Dealer Portal' }] },
    { id: 'empty', label: 'Empty', projects: [] },
  ]

  it('renders under the record as a named section with one group per kind of work', () => {
    render(<CareerRecord {...base} tags={[]}><CareerRecordProjects headingId="inovit-projects" title="Projects" groups={groups} /></CareerRecord>)
    const section = screen.getByRole('region', { name: 'Projects' })
    expect(within(section).getByRole('heading', { level: 4, name: 'Projects' })).toBeInTheDocument()
    expect(within(section).getByText('Platform')).toBeInTheDocument()
    expect(within(section).queryByText('Empty')).toBeNull()
    expect(within(section).getAllByRole('listitem')).toHaveLength(2)
  })

  it('puts the title inside the host link and leaves an unlinked title as text', () => {
    render(<CareerRecordProjects headingId="p" title="Projects" groups={groups} />)
    expect(screen.getByRole('link', { name: 'EFFICIENT System' })).toHaveAttribute('href', '/projects/efficient-system')
    expect(screen.queryByRole('link', { name: 'Dealer Portal' })).toBeNull()
    expect(screen.getByText('The engineering contract.')).toBeInTheDocument()
  })

  it('renders nothing when every group is empty', () => {
    const { container } = render(<CareerRecordProjects headingId="p" title="Projects" groups={[{ id: 'x', label: 'X', projects: [] }]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
