import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { resetWarnings } from '../../lib/warn'
import {
  ArchitectureFigure,
  DataflowFigure,
  DiagramCanvas,
  DiagramInspector,
  DiagramMinimap,
  LifecycleFigure,
  SequenceFigure,
  WorkflowFigure,
  type ArchitectureSpec,
  type DataflowSpec,
  type LifecycleSpec,
  type SequenceSpec,
  type WorkflowSpec,
} from '../index'
import { ARCHITECTURE, LIFECYCLE } from './fixtures'

/**
 * What a specification that TYPECHECKS is entitled to assume.
 *
 * Every case below was a field the type accepted and the renderer answered with
 * a different picture — a lane id nothing declared resolving to lane 0, a
 * `cellW` that moved plates without widening them, a message to a participant
 * that does not exist vanishing from the artwork and surviving in the text. The
 * failure mode they share is silence: nothing throws, nothing warns, and the
 * only way to find out is to look at the drawing and know what it should have
 * been.
 *
 * So these tests assert one of exactly two outcomes per field — the renderer
 * does what the type implies, or the author is told in development. Neither of
 * them is "nothing happens".
 */
const warnings: string[] = []

beforeEach(() => {
  warnings.length = 0
  resetWarnings()
  vi.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
    warnings.push(args.map(String).join(' '))
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

const said = () => warnings.join('\n')

/** The plate a figure drew for one node, by its data-node marker. */
const plateOf = (container: HTMLElement, id: string) =>
  container.querySelector(`[data-node="${id}"] rect, [data-node="${id}"] path`)

describe('ArchitectureFigure placement', () => {
  it('says so when the spec it was handed was mutated in place', () => {
    const spec = structuredClone(ARCHITECTURE)
    const { rerender } = render(<ArchitectureFigure spec={spec} />)

    spec.components[0]!.label = 'Fastly'
    rerender(<ArchitectureFigure spec={spec} />)

    expect(said()).toContain('DIAGRAM_SPEC_MUTATED')
  })

  it('says so when two components claim one cell', () => {
    const spec: ArchitectureSpec = {
      meta: { title: 'Collision' },
      components: [
        { id: 'a', type: 'backend', label: 'A', row: 0, col: 0 },
        { id: 'b', type: 'backend', label: 'B', row: 0, col: 0 },
      ],
    }
    render(<ArchitectureFigure spec={spec} />)

    expect(said()).toContain('DIAGRAM_CELL_COLLISION')
  })

  it('flows components that declare no placement across layout.cols', () => {
    const spec: ArchitectureSpec = {
      meta: { title: 'Unplaced' },
      layout: { cols: 2 },
      components: [
        { id: 'a', type: 'backend', label: 'A' },
        { id: 'b', type: 'backend', label: 'B' },
        { id: 'c', type: 'backend', label: 'C' },
      ],
    }
    const { container } = render(<ArchitectureFigure spec={spec} />)

    const at = (id: string) => {
      const plate = plateOf(container, id)
      return [plate?.getAttribute('x'), plate?.getAttribute('y')]
    }

    // Three components, three cells: across the row first, then wrapped.
    expect(at('a')).toEqual(['40', '48'])
    expect(at('b')).toEqual(['288', '48'])
    expect(at('c')).toEqual(['40', '196'])
  })

  it('widens a plate to the cell width the layout declares', () => {
    const spec: ArchitectureSpec = {
      meta: { title: 'Wide cells' },
      layout: { cellW: 240 },
      components: [{ id: 'a', type: 'backend', label: 'A', row: 0, col: 0 }],
    }
    const { container } = render(<ArchitectureFigure spec={spec} />)

    expect(plateOf(container, 'a')?.getAttribute('width')).toBe('240')
  })
})

describe('WorkflowFigure', () => {
  it('says so when a node names a lane the spec does not declare', () => {
    const spec: WorkflowSpec = {
      meta: { title: 'Lanes' },
      lanes: [{ id: 'ci', label: 'CI' }],
      nodes: [{ id: 'a', lane: 'nowhere', col: 0, label: 'A' }],
    }
    render(<WorkflowFigure spec={spec} />)

    expect(said()).toContain('DIAGRAM_LANE_UNKNOWN')
  })

  it('draws a phase across its own span rather than across the figure', () => {
    const spec: WorkflowSpec = {
      meta: { title: 'Phases' },
      lanes: [{ id: 'ci', label: 'CI' }],
      phases: [
        { id: 'build', label: 'Build', fromCol: 0, toCol: 0 },
        { id: 'ship', label: 'Ship', fromCol: 1, toCol: 2, variant: 'security' },
      ],
      nodes: [
        { id: 'a', lane: 'ci', col: 0, label: 'A' },
        { id: 'b', lane: 'ci', col: 2, label: 'B' },
      ],
    }
    const { container } = render(<WorkflowFigure spec={spec} />)

    const build = container.querySelector('[data-phase="build"] path')
    const ship = container.querySelector('[data-phase="ship"] path')
    expect(build).not.toBeNull()
    expect(ship).not.toBeNull()
    expect(build?.getAttribute('d')).not.toBe(ship?.getAttribute('d'))
    // A security phase is dashed, the way a security group is.
    expect(ship?.getAttribute('stroke-dasharray')).toBeTruthy()
    expect(build?.getAttribute('stroke-dasharray')).toBeFalsy()
  })

  it('draws an error edge dashed and soft, the way the docstring says', () => {
    const spec: WorkflowSpec = {
      meta: { title: 'Roles' },
      lanes: [
        { id: 'ci', label: 'CI' },
        { id: 'fail', label: 'Recovery', variant: 'exception' },
      ],
      nodes: [
        { id: 'a', lane: 'ci', col: 0, label: 'A' },
        { id: 'b', lane: 'fail', col: 1, label: 'B' },
      ],
      edges: [{ id: 'boom', from: 'a', to: 'b', role: 'error' }],
    }
    const { container } = render(<WorkflowFigure spec={spec} />)

    const edge = container.querySelector('[data-edge="boom"]')
    expect(edge?.getAttribute('stroke-dasharray')).toBeTruthy()
    expect(edge?.getAttribute('class')).toContain('diagram-line-soft')
  })
})

describe('DataflowFigure', () => {
  it('says so when a node sits past the stages the spec declares', () => {
    const spec: DataflowSpec = {
      meta: { title: 'Pipeline' },
      stages: [{ label: 'Sources' }, { label: 'Store' }],
      nodes: [
        { id: 'web', type: 'frontend', label: 'Web', stage: 0, row: 0 },
        { id: 'lost', type: 'database', label: 'Lost', stage: 5, row: 0 },
      ],
    }
    render(<DataflowFigure spec={spec} />)

    expect(said()).toContain('DIAGRAM_STAGE_OUT_OF_RANGE')
  })
})

describe('LifecycleFigure', () => {
  it('applies yOffset, the way every other figure with the field does', () => {
    const base: LifecycleSpec = {
      meta: { title: 'Offsets' },
      states: [{ id: 's', type: 'active', label: 'S', col: 0 }],
    }
    const flat = render(<LifecycleFigure spec={base} />)
    const y = plateOf(flat.container, 's')?.getAttribute('y')
    flat.unmount()

    const nudged = render(
      <LifecycleFigure
        spec={{ ...base, states: [{ ...base.states[0]!, yOffset: 40 }] }}
      />,
    )
    const nudgedY = nudged.container.querySelector('[data-node="s"] rect')?.getAttribute('y')

    expect(Number(nudgedY)).toBe(Number(y) + 40)
  })

  it('does not enrol a state with an unknown lane in the implicit rail', () => {
    const spec: LifecycleSpec = {
      meta: { title: 'Rail' },
      lanes: [{ id: 'main', label: 'Phases' }],
      states: [
        { id: 'a', type: 'start', label: 'A', lane: 'main', col: 0 },
        { id: 'b', type: 'active', label: 'B', lane: 'typo', col: 1 },
      ],
    }
    const { container } = render(<LifecycleFigure spec={spec} />)

    expect(said()).toContain('DIAGRAM_LANE_UNKNOWN')
    // No transition is declared, so the only line that could be here is a rail
    // edge invented out of a lane id nothing declares.
    expect(container.querySelectorAll('[data-diagram-wires] path')).toHaveLength(0)
  })

  it('shows a pointer over a plate the caller can select', () => {
    const { container } = render(<LifecycleFigure spec={LIFECYCLE} onSelectNode={() => {}} />)

    expect(container.querySelector('[data-node="queued"]')?.getAttribute('class')).toContain(
      'cursor-pointer',
    )
  })
})

describe('SequenceFigure', () => {
  it('drops a message naming a participant nothing declares, from the text too', () => {
    const spec: SequenceSpec = {
      meta: { title: 'Dangling' },
      participants: [{ id: 'api', label: 'API' }],
      messages: [{ id: 'ghosted', from: 'ghost', to: 'api', y: 150, label: 'calls' }],
    }
    const { container } = render(<SequenceFigure spec={spec} />)

    expect(said()).toContain('DIAGRAM_EDGE_DANGLING')
    // The picture cannot draw it. The summary claiming it exists is the two
    // halves of the same figure disagreeing.
    expect(container.textContent).not.toContain('ghost')
  })
})

describe('DiagramInspector', () => {
  it('keeps two facts that share a label', () => {
    const errors: string[] = []
    vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      errors.push(args.map(String).join(' '))
    })

    render(
      <DiagramInspector
        title="API"
        facts={[
          { label: 'Source', value: 'app/api.py' },
          { label: 'Source', value: 'app/routes.py' },
        ]}
      />,
    )

    expect(errors.join('\n')).not.toMatch(/same key/i)
    expect(screen.getByText('app/api.py')).toBeInTheDocument()
    expect(screen.getByText('app/routes.py')).toBeInTheDocument()
  })
})

describe('DiagramMinimap', () => {
  it('draws no map at all until the content has been measured', () => {
    const { container } = render(
      <DiagramMinimap
        content={{ width: 0, height: 0 }}
        frame={{ width: 400, height: 200 }}
        view={{ scale: 1, x: 0, y: 0 }}
      >
        <p>miniature</p>
      </DiagramMinimap>,
    )

    // Scale 1 on an unmeasured artwork is the top-left corner at full size,
    // under a viewport rectangle that means nothing.
    expect(container.querySelector('[data-viewport]')).toBeNull()
    expect(screen.queryByText('miniature')).toBeNull()
  })

  it('clamps the viewport rectangle to the map', () => {
    const { container } = render(
      <DiagramMinimap
        content={{ width: 800, height: 300 }}
        frame={{ width: 400, height: 200 }}
        view={{ scale: 1, x: 100, y: 0 }}
      />,
    )

    const rect = container.querySelector<HTMLElement>('[data-viewport]')
    // x would be −25: a quarter of the frame is off the west edge of a map that
    // has no west edge.
    expect(rect?.style.left).toBe('0px')
    expect(rect?.style.width).toBe('75px')
  })

  it('seeks only for a drag that started on the map', async () => {
    const seen: number[][] = []
    const { container } = render(
      <DiagramMinimap
        content={{ width: 800, height: 300 }}
        frame={{ width: 400, height: 200 }}
        view={{ scale: 1, x: 0, y: 0 }}
        onSeek={(x, y) => seen.push([x, y])}
      />,
    )

    const layer = container.querySelector<HTMLElement>('[data-seek]')
    expect(layer).not.toBeNull()

    // A button pressed somewhere else and dragged across the map is not this
    // component's gesture to answer.
    fireEvent.pointerMove(layer!, { buttons: 1, clientX: 10, clientY: 10, pointerId: 1 })
    expect(seen).toEqual([])

    fireEvent.pointerDown(layer!, { buttons: 1, clientX: 10, clientY: 10, pointerId: 1 })
    expect(seen).toHaveLength(1)
  })

  it('takes the frame size from the view when the caller has none of its own', () => {
    const { container } = render(
      <DiagramMinimap
        content={{ width: 800, height: 300 }}
        view={{ scale: 1, x: 0, y: 0, frame: { width: 400, height: 200 } }}
      />,
    )

    expect(container.querySelector<HTMLElement>('[data-viewport]')?.style.width).toBe('100px')
  })
})

describe('DiagramCanvas', () => {
  it('reports the frame it is looking through, so a minimap can be right', async () => {
    const views: unknown[] = []
    const { container } = render(
      <DiagramCanvas label="Request path" onViewChange={(view) => views.push(view)}>
        <ArchitectureFigure spec={ARCHITECTURE} heading={false} legend="hidden" cards={false} />
      </DiagramCanvas>,
    )

    const frame = container.querySelector<HTMLElement>('[role="group"]')!
    vi.spyOn(frame, 'getBoundingClientRect').mockReturnValue({
      width: 400,
      height: 200,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 400,
      bottom: 200,
      toJSON: () => ({}),
    } as DOMRect)

    await userEvent.click(screen.getByLabelText('Zoom in'))

    expect(views.at(-1)).toMatchObject({ frame: { width: 400, height: 200 } })
  })

  it('names the reset button after the percentage it shows', async () => {
    render(
      <DiagramCanvas label="Request path">
        <ArchitectureFigure spec={ARCHITECTURE} heading={false} legend="hidden" cards={false} />
      </DiagramCanvas>,
    )

    // WCAG 2.5.3: a voice user says the "100%" they can see.
    const reset = screen.getByRole('button', { name: '100%, reset the view' })
    expect(reset).toHaveTextContent('100%')

    await userEvent.click(screen.getByLabelText('Zoom in'))
    const zoomed = screen.getByRole('button', { name: /, reset the view$/ })
    expect(zoomed.getAttribute('aria-label')).toBe(`${zoomed.textContent}, reset the view`)
    expect(zoomed).not.toHaveTextContent('100%')

    await userEvent.click(zoomed)
    expect(screen.getByRole('button', { name: '100%, reset the view' })).toBeInTheDocument()
  })
})

describe('the diagrams entry', () => {
  it('exports the serialiser a caller would need to build a file of its own', async () => {
    const entry = await import('../index')

    // Without these, a caller who wants a transparent export, a different
    // frame or a server-side render has nothing to build on: the pipeline is
    // private and the menu is the only door.
    expect(typeof entry.serializeSvg).toBe('function')
    expect(typeof entry.rasterize).toBe('function')
    expect(typeof entry.downloadBlob).toBe('function')
    expect(typeof entry.exportFilename).toBe('function')
  })
})
