import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LiveCount, MetricDelta, MetricValue, MetricsEmptyState, MetricsList, MetricsRange } from './Metrics'

describe('metric controls', () => {
  it('retains the loaded selection until the host confirms a new range', async () => {
    const user = userEvent.setup()
    const change = vi.fn()
    render(<MetricsRange label="Range" value="30" options={[{ value: '7', label: '7 days' }, { value: '30', label: '30 days' }]} onChange={change} />)
    await user.click(screen.getByRole('radio', { name: '7 days' }))
    expect(change).toHaveBeenCalledWith('7')
    expect(screen.getByRole('radio', { name: '30 days' })).toHaveAttribute('aria-checked', 'true')
  })

  it('does not turn an unknown live count into zero', () => {
    const view = render(<LiveCount value={null} label="reading now" />)
    expect(screen.queryByText(/reading now/)).not.toBeInTheDocument()
    view.rerender(<LiveCount value={0} label="reading now" />)
    expect(screen.getByText('0 reading now')).toBeInTheDocument()
  })

  it('gives an empty chart a useful, semantic placeholder', () => {
    render(<MetricsEmptyState title="The first reading will appear here" description="Visits fill the chart." />)
    expect(screen.getByRole('status')).toHaveTextContent('The first reading will appear here')
    expect(screen.getByText('Visits fill the chart.')).toBeInTheDocument()
  })

  it('keeps the placeholder plot out of the accessibility tree, under a section-level heading', () => {
    render(<MetricsEmptyState title="Nothing yet" description="Visits fill the chart." />)
    const status = screen.getByRole('status')
    expect(status.querySelector('.folio-metrics-empty__plot')).toHaveAttribute('aria-hidden', 'true')
    expect(within(status).getByRole('heading', { level: 3, name: 'Nothing yet' })).toBeInTheDocument()
  })
})

describe('MetricsList', () => {
  const ITEMS = [
    { id: 'au', label: 'Australia', icon: <span data-testid="flag" aria-hidden />, value: '61.2%' },
    { id: 'nz', label: 'New Zealand', value: '38.8%' },
  ]

  it('pairs each label with its value as a named description list', () => {
    render(<MetricsList label="Countries" empty="No data" items={ITEMS} />)

    const list = screen.getByLabelText('Countries')
    expect(list.tagName).toBe('DL')
    expect(list).toHaveClass('folio-metrics-list')
    expect(within(list).getAllByRole('term').map((term) => term.textContent)).toEqual(['Australia', 'New Zealand'])
    expect(within(list).getAllByRole('definition').map((value) => value.textContent)).toEqual(['61.2%', '38.8%'])
    // Every pair keeps its own row wrapper, which is what the row styles target.
    expect([...list.children].map((row) => row.tagName)).toEqual(['DIV', 'DIV'])
    expect(within(within(list).getAllByRole('term')[0]!).getByTestId('flag')).toBeInTheDocument()
  })

  it('says it is empty in words rather than rendering an empty list', () => {
    const { container } = render(<MetricsList label="Countries" empty="No readings yet" items={[]} />)

    expect(screen.getByText('No readings yet')).toBeInTheDocument()
    expect(container.querySelector('dl')).toBeNull()
  })
})

describe('metric values', () => {
  it('sets units on the supporting step and keeps the reading in order', () => {
    const { container } = render(<p><MetricValue segments={[{ text: '12.4' }, { text: 'k', unit: true }]} /></p>)

    expect(container.textContent).toBe('12.4k')
    expect(screen.getByText('k')).toHaveClass('folio-metric-unit')
    expect(screen.getByText('12.4')).not.toHaveClass('folio-metric-unit')
  })

  it('draws direction as decoration and leaves the judgement to the words', () => {
    const view = render(<MetricDelta direction="up">12% vs previous</MetricDelta>)
    const glyph = view.container.querySelector('[aria-hidden]')
    expect(glyph).toHaveTextContent('▲')
    expect(screen.getByText('12% vs previous')).toBeInTheDocument()

    view.rerender(<MetricDelta direction="down">4% lower</MetricDelta>)
    expect(view.container.querySelector('[aria-hidden]')).toHaveTextContent('▼')
    view.rerender(<MetricDelta direction="steady">Steady</MetricDelta>)
    expect(view.container.querySelector('[aria-hidden]')).toHaveTextContent('—')
  })
})
