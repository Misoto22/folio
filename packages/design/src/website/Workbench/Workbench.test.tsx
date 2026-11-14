import { act, render, screen, within } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import axe from 'axe-core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Chronology } from './Chronology'
import { Reveal } from './Reveal'
import { ToolStrip } from './ToolStrip'
import { WorkbenchCard, WorkbenchCardGrid, WorkbenchTile } from './WorkbenchCard'
import { WorkbenchEntries } from './WorkbenchEntries'
import { WorkbenchHero } from './WorkbenchHero'
import { WorkbenchSection } from './Workbench'

type ObserverCallback = (entries: { isIntersecting: boolean; target: Element }[]) => void

function stubViewport({ reduced = false, top = 2000 }: { reduced?: boolean; top?: number }) {
  let fire: ObserverCallback = () => {}
  const observed: Element[] = []
  const disconnect = vi.fn()
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: ObserverCallback) {
        fire = callback
      }
      observe(node: Element) { observed.push(node) }
      unobserve(node: Element) { observed.splice(observed.indexOf(node), 1) }
      disconnect = disconnect
    },
  )
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduced && query.includes('reduce') }))
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ top } as DOMRect)
  return {
    observed,
    fire: (isIntersecting: boolean, targets: Element[] = [...observed]) => act(() => fire(targets.map((target) => ({ isIntersecting, target })))),
    disconnect,
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('Reveal', () => {
  it('renders its child visible on the server, so nothing is hidden without JavaScript', () => {
    const html = renderToString(<Reveal><p>Shown</p></Reveal>)
    expect(html).toBe('<p class="folio-wb-reveal">Shown</p>')
  })

  it('hides an element below the fold and shows it once it intersects', () => {
    const viewport = stubViewport({})
    render(<Reveal><p>Later</p></Reveal>)
    const node = screen.getByText('Later')
    expect(node).toHaveAttribute('data-reveal', 'hidden')
    viewport.fire(false)
    expect(node).toHaveAttribute('data-reveal', 'hidden')
    viewport.fire(true)
    expect(node).toHaveAttribute('data-reveal', 'shown')
    expect(viewport.disconnect).toHaveBeenCalled()
  })

  it('never hides anything already on screen or when motion is reduced', () => {
    stubViewport({ top: 10 })
    render(<Reveal><p>Above</p></Reveal>)
    expect(screen.getByText('Above')).not.toHaveAttribute('data-reveal')
    vi.restoreAllMocks()
    stubViewport({ reduced: true })
    render(<Reveal><p>Still</p></Reveal>)
    expect(screen.getByText('Still')).not.toHaveAttribute('data-reveal')
  })
})

describe('Chronology', () => {
  const items = [
    { id: 'tutor', title: 'Tutor', organisation: 'HD', start: 2019.5, end: 2023, kind: 'role' as const },
    { id: 'degree', title: 'Bachelor', start: 2020, end: 2023, kind: 'study' as const },
    { id: 'now', title: 'Engineer', organisation: 'Inovit', start: 2025.4, kind: 'role' as const },
  ]

  it('places each bar on the year axis and marks the current item', () => {
    render(<Chronology label="Career" from={2019} to={2026} items={items} currentLabel="Now" />)
    const list = within(screen.getByRole('figure', { name: 'Career' })).getAllByRole('listitem')
    expect(list).toHaveLength(3)
    expect(list[0]).toHaveStyle({ '--start': '6.250%', '--end': '50.000%' })
    expect(list[2]).toHaveAttribute('data-current')
    expect(list[2]).toHaveStyle({ '--end': '100.000%' })
    expect(list[2]).toHaveTextContent('Engineer · Inovit · Now')
    expect(list[1]).not.toHaveAttribute('data-current')
  })
})

describe('Workbench compositions', () => {
  it('names every tool for assistive technology while showing only its mark', () => {
    render(<ToolStrip label="Tools" items={[{ id: 'react', name: 'React', icon: <svg /> }]} />)
    expect(screen.getByRole('region', { name: 'Tools' })).toBeVisible()
    expect(screen.getByText('React')).toHaveClass('folio-wb-visually-hidden')
  })

  it('renders nothing for an empty tool strip', () => {
    const { container } = render(<ToolStrip label="Tools" items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('lists entries beside a featured tile only when one is given', () => {
    const { container, rerender } = render(
      <WorkbenchEntries featured={{ id: 'a', title: 'Lead', meta: 'Dev', date: 'Jul 31' }} entries={[{ id: 'b', title: 'Next' }]} />,
    )
    expect(screen.getByText('Dev · Jul 31')).toBeVisible()
    expect(container.firstChild).toHaveAttribute('data-has-featured')
    rerender(<WorkbenchEntries entries={[{ id: 'b', title: 'Next' }]} />)
    expect(container.firstChild).not.toHaveAttribute('data-has-featured')
  })

  it('leads the featured tile with its cover, above the title, and keeps the others text', () => {
    const { container } = render(
      <WorkbenchEntries featured={{ id: 'a', title: 'Lead', cover: <img alt="Cover" src="/c.png" /> }} entries={[{ id: 'b', title: 'Next', cover: <img alt="Other" src="/o.png" /> }]} />,
    )
    const tile = container.querySelector('.folio-wb-entry-featured')!
    expect(tile).toHaveAttribute('data-has-cover')
    expect(tile.firstElementChild).toHaveClass('folio-wb-entry-cover')
    expect(tile.firstElementChild?.nextElementSibling?.tagName).toBe('H3')
    expect(screen.queryByAltText('Other')).toBeNull()
  })

  it('has no axe violations across a composed page', async () => {
    const { container } = render(
      <main>
        <WorkbenchHero statement="Henry Chen." lead="Engineer." stats={[{ id: 'p', value: 8, label: 'Projects' }]} />
        <WorkbenchSection title="Work" lead="Four projects." action={<a href="/projects">All projects</a>}>
          <WorkbenchCardGrid>
            <WorkbenchCard cover={<WorkbenchTile label="Efficient" />} title={<a href="/p">Efficient</a>} description="ERP" meta="2026" />
          </WorkbenchCardGrid>
        </WorkbenchSection>
      </main>,
    )
    const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } })
    expect(results.violations).toEqual([])
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Henry Chen. Engineer.')
  })
})

describe('Reveal without matchMedia', () => {
  it('still reveals in an environment that has no matchMedia', () => {
    const viewport = stubViewport({})
    vi.stubGlobal('matchMedia', undefined)
    render(<Reveal><p>Plain</p></Reveal>)
    expect(screen.getByText('Plain')).toHaveAttribute('data-reveal', 'hidden')
    viewport.fire(true)
    expect(screen.getByText('Plain')).toHaveAttribute('data-reveal', 'shown')
  })
})

describe('WorkbenchSection reveal', () => {
  it('reveals the heading and each card on its own, one stagger step apart and capped at four', () => {
    const viewport = stubViewport({})
    const { container } = render(<WorkbenchSection title="Work"><WorkbenchCardGrid>
      {['A', 'B', 'C', 'D', 'E'].map((name) => <WorkbenchCard key={name} title={name} cover={<span />} />)}
    </WorkbenchCardGrid></WorkbenchSection>)
    const units = [...container.querySelectorAll<HTMLElement>('.folio-wb-reveal')]
    expect(units).toHaveLength(6)
    expect(units[0]).toHaveClass('folio-wb-section-head')
    expect(container.querySelector('.folio-wb-section')).not.toHaveClass('folio-wb-reveal')
    expect(units.every((unit) => unit.dataset.reveal === 'hidden')).toBe(true)
    viewport.fire(true, units.slice(0, 3))
    expect(units.slice(0, 3).map((unit) => unit.style.getPropertyValue('--folio-reveal-step'))).toEqual(['0', '1', '2'])
    expect(units[3]).toHaveAttribute('data-reveal', 'hidden')
    viewport.fire(true, units.slice(3))
    expect(units.slice(3).map((unit) => unit.style.getPropertyValue('--folio-reveal-step'))).toEqual(['0', '1', '2'])
    expect(viewport.disconnect).toHaveBeenCalled()
    viewport.fire(false)
  })

  it('reveals nothing of its own inside another reveal, so the two never compound', () => {
    stubViewport({})
    const { container } = render(<Reveal><div><WorkbenchSection title="Work"><p>Body</p></WorkbenchSection></div></Reveal>)
    expect(container.querySelectorAll('.folio-wb-reveal')).toHaveLength(1)
    expect(container.querySelector('.folio-wb-section-head')).not.toHaveAttribute('data-reveal')
  })
})

