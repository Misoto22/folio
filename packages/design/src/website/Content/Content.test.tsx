import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Steps } from '../../components/Steps/Steps'
import { StepSequence, type StepSequenceSpec } from './Content'

const SPEC: StepSequenceSpec = {
  steps: [
    { n: '00', label: 'Preflight', note: 'always — prints the plan', anchor: true },
    { n: '01', label: 'Branch off base', note: 'on the base branch' },
    { n: '02', label: 'Merge', tags: ['squash', 'rebase'] },
  ],
  caption: 'Preflight marks every step RUN or SKIP.',
  label: 'The steps ship runs',
}

describe('StepSequence', () => {
  it('lists every step with its host counter, name, note, tags and caption', () => {
    render(<StepSequence spec={SPEC} />)

    const rail = screen.getByRole('group', { name: 'The steps ship runs' })
    const items = within(rail).getAllByRole('listitem')
    expect(items).toHaveLength(3)
    // The counters are the host's, not a recount from one.
    expect([...rail.querySelectorAll('.m22-sequence-counter')].map((marker) => marker.textContent)).toEqual(['00', '01', '02'])
    expect(within(rail).getByText('on the base branch')).toBeInTheDocument()
    const chip = within(rail).getByText('squash')
    expect(chip.parentElement).toHaveClass('m22-sequence-tags')
    expect(within(rail).getByText('Preflight marks every step RUN or SKIP.')).toBeInTheDocument()
  })

  it('fills only the anchor marker, and does not announce it as the current step', () => {
    render(<StepSequence spec={SPEC} />)

    const [anchor, plain] = screen.getAllByRole('listitem')
    expect(anchor).toHaveAttribute('data-anchor', 'true')
    expect(plain).not.toHaveAttribute('data-anchor')
    expect(anchor!.querySelector('.m22-sequence-counter')!.className).toContain('bg-(--accent)')
    expect(plain!.querySelector('.m22-sequence-counter')!.className).not.toContain('bg-(--accent)')
    // Hosts mark a terminal or preflight step for emphasis; "current step" would be untrue.
    expect(screen.getByRole('group').querySelector('[aria-current]')).toBeNull()
  })

  it('draws the rail with the core Steps rendering, marker for marker', () => {
    const { container: core } = render(<Steps steps={[{ title: 'Collect', current: true }, { title: 'Review' }]} />)
    const { container: site } = render(<StepSequence spec={{ steps: [{ n: '1', label: 'Collect', anchor: true }, { n: '2', label: 'Review' }] }} />)

    const coreMarkers = [...core.querySelectorAll('li > span.rounded-full')].map((marker) => marker.className)
    const siteMarkers = [...site.querySelectorAll('.m22-sequence-counter')].map((marker) => marker.className.replace(' m22-sequence-counter', ''))
    expect(siteMarkers).toEqual(coreMarkers)
    expect(site.querySelector('[role="list"]')!.className).toBe(core.querySelector('ol')!.className)
  })

  it('keeps list semantics as roles, so article prose does not restyle the rail', () => {
    const { container } = render(<div data-m22-article><StepSequence spec={SPEC} /></div>)

    expect(container.querySelector('ol, ul, li')).toBeNull()
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('draws a connector under every step but the last', () => {
    render(<StepSequence spec={SPEC} />)

    const connectors = screen.getAllByRole('listitem').map((item) => item.querySelectorAll(':scope > span.w-px').length)
    expect(connectors).toEqual([1, 1, 0])
  })

  it('holds the note line open when a step has none, and names itself by caption without a label', () => {
    render(<StepSequence spec={{ caption: 'Two stops', steps: [{ n: '1', label: 'Only' }] }} />)

    const rail = screen.getByRole('group', { name: 'Two stops' })
    const item = within(rail).getByRole('listitem')
    expect(item.textContent).toContain('Only ')
    expect(item.querySelector(':scope > span.w-px')).toBeNull()
    expect(rail.querySelector('.m22-sequence-tags')).toBeNull()
  })
})
