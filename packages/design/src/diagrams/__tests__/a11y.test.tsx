import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { SURFACE } from './surface'
import { ARCHITECTURE } from './fixtures'
import { ArchitectureFigure } from '../index'

/**
 * Runs axe over every component in `@misoto22/folio/diagrams`.
 *
 * What it CANNOT catch is the half that matters most here: jsdom has no layout,
 * so `color-contrast` cannot run at all, and no automated rule can tell whether
 * a picture's meaning survived being turned into a list. The second is checked
 * below by asserting on the list itself.
 */
const PAGE_LEVEL_RULES = ['region', 'page-has-heading-one', 'landmark-one-main'] as const

async function analyse(container: HTMLElement) {
  const results = await axe.run(container, {
    resultTypes: ['violations'],
    rules: Object.fromEntries(PAGE_LEVEL_RULES.map((rule) => [rule, { enabled: false }])),
  })
  return results.violations
}

describe.each(SURFACE)('$dir', (entry) => {
  it('has no axe violations', async () => {
    const { container } = render(entry.render())
    if (entry.opensWith) {
      await userEvent.click(screen.getByText(entry.opensWith))
    }
    const violations = await analyse(container)
    expect(
      violations.map((violation) => `${violation.id}: ${violation.nodes[0]?.html ?? ''}`),
    ).toEqual([])
  })
})

/**
 * The accessibility decision this package makes about diagrams, asserted rather
 * than described in a comment.
 *
 * The `<svg>` is a picture — `role="img"` with a name — and its content is
 * published beside it as an ordinary list. That list is where the meaning lives
 * for anyone not looking at the picture, so it is the thing worth testing: a
 * regression that dropped it would leave every axe rule passing and the diagram
 * unreadable to a screen reader.
 */
describe('a figure publishes its content as text', () => {
  it('names the picture and marks it as one', () => {
    render(<ArchitectureFigure spec={ARCHITECTURE} />)
    expect(screen.getByRole('img', { name: /Request path/ })).toBeInTheDocument()
  })

  it('lists every node with what kind of thing it is', () => {
    render(<ArchitectureFigure spec={ARCHITECTURE} />)
    for (const component of ARCHITECTURE.components) {
      expect(screen.getByText(new RegExp(`${component.label}.*${component.type}`))).toBeInTheDocument()
    }
  })

  it('lists every relationship in the direction it runs', () => {
    render(<ArchitectureFigure spec={ARCHITECTURE} />)
    expect(screen.getByText(/CloudFront → API: HTTPS/)).toBeInTheDocument()
    expect(screen.getByText(/API → Postgres: SQL/)).toBeInTheDocument()
  })

  it('turns the list into controls when the caller can act on a selection', () => {
    const { rerender } = render(<ArchitectureFigure spec={ARCHITECTURE} />)
    expect(screen.queryAllByRole('button')).toHaveLength(0)

    rerender(<ArchitectureFigure spec={ARCHITECTURE} onSelectNode={() => {}} />)
    // Three nodes, three keyboard-reachable ways to select one — which is the
    // whole point: the plates in the picture are presentational, so this list
    // is the only route a keyboard has.
    expect(screen.getAllByRole('button')).toHaveLength(ARCHITECTURE.components.length)
  })

  it('reports the selection to a caller that asked for it', async () => {
    const picked: string[] = []
    render(<ArchitectureFigure spec={ARCHITECTURE} onSelectNode={(id) => picked.push(id)} />)
    await userEvent.click(screen.getByRole('button', { name: /Postgres/ }))
    expect(picked).toEqual(['db'])
  })
})
