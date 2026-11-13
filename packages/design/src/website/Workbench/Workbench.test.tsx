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

type ObserverCallback = (entries: { isIntersecting: boolean }[]) => void

function stubViewport({ reduced = false, top = 2000 }: { reduced?: boolean; top?: number }) {
  let fire: ObserverCallback = () => {}
  const disconnect = vi.fn()
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: ObserverCallback) {
        fire = callback
      }
      observe() {}
      disconnect = disconnect
    },
  )
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduced && query.includes('reduce') }))
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ top } as DOMRect)
  return { fire: (isIntersecting: boolean) => act(() => fire([{ isIntersecting }])), disconnect }
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
