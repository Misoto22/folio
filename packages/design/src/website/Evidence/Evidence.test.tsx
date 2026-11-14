import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EvidenceDurations, EvidenceMeter, EvidenceScores } from './Evidence'

describe('evidence values', () => {
  it('announces progress as indeterminate while its total is unknown', () => {
    const view = render(<EvidenceMeter label="Generating" value={null} valueText="34 tokens" detail="— tok/s" />)
    expect(screen.getByRole('progressbar', { name: 'Generating' })).not.toHaveAttribute('aria-valuenow')
    view.rerender(<EvidenceMeter label="Generating" value={100} valueText="40 tokens" detail="20 tok/s" />)
    expect(screen.getByRole('progressbar', { name: 'Generating' })).toHaveAttribute('aria-valuenow', '100')
  })

  it('preserves a measured zero score with the same accessible value', () => {
    render(<EvidenceScores items={[{ id: 'one', label: 'A source', value: 0, valueText: '0.00' }]} />)
    expect(screen.getByRole('progressbar', { name: 'A source' })).toHaveAttribute('aria-valuenow', '0')
    expect(screen.getByRole('progressbar', { name: 'A source' })).toHaveAttribute('aria-valuetext', '0.00')
  })

  it('keeps unknown durations explicit and never divides by a zero total', () => {
    const { container } = render(<EvidenceDurations label="Duration" total={0} totalText="0ms" items={[{ id: 'fetch', label: 'Fetch', value: 0, valueText: '0ms' }, { id: 'render', label: 'Render', value: null, valueText: '—' }]} />)
    expect(screen.getByLabelText('Duration')).toHaveTextContent('Render—')
    expect(container.querySelectorAll('[style*="NaN"]')).toHaveLength(0)
    expect(container.querySelectorAll('[style*="Infinity"]')).toHaveLength(0)
  })
})

describe('live evidence', () => {
  const stages = [{ id: 'embed', label: 'Embed', value: 38, valueText: '38ms' }, { id: 'generate', label: 'Generate', value: 1840, valueText: '1,840ms' }]

  it('fills one clock while a run is live, and returns to its stage segments once settled', () => {
    const { container, rerender } = render(<EvidenceDurations label="Latency" total={null} totalText="—" progress={0.4} items={stages} />)
    const bar = container.querySelector('.folio-evidence-durations__bar')!
    const fill = container.querySelector<HTMLElement>('.folio-evidence-durations__fill')!
    expect(bar).toHaveAttribute('data-live')
    expect(fill).toHaveAttribute('data-running')
    expect(fill.style.getPropertyValue('--folio-progress')).toBe('0.4')
    rerender(<EvidenceDurations label="Latency" total={null} totalText="—" progress={1.4} items={stages} />)
    expect(fill).not.toHaveAttribute('data-running')
    expect(fill.style.getPropertyValue('--folio-progress')).toBe('1')
    rerender(<EvidenceDurations label="Latency" total={1878} totalText="1,878ms" items={stages} />)
    expect(container.querySelector('.folio-evidence-durations__fill')).toBeNull()
    expect(bar.children).toHaveLength(2)
  })

  it('marks cited passages with their numeral and staggers every row by position', () => {
    const { container } = render(<EvidenceScores items={[
      { id: 'a', label: 'Revala — Overview', value: 0.84, valueText: '0.84', citation: '1' },
      { id: 'b', label: 'Experience', value: 0.58, valueText: '0.58' },
    ]} />)
    const rows = [...container.querySelectorAll<HTMLElement>('.folio-evidence-scores > div')]
    expect(rows.map((row) => row.hasAttribute('data-cited'))).toEqual([true, false])
    expect(rows.map((row) => row.style.getPropertyValue('--n'))).toEqual(['0', '1'])
    expect(container.querySelector('.folio-evidence-scores__citation')).toHaveTextContent('1')
  })
})
