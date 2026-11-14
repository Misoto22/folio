import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { CareerRecord } from './Timeline'

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
