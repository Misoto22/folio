import './jsdom-layout'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PropsPlayground } from '@/components/PropsPlayground'
import { COMPONENTS as CATALOG } from '@/content/registry'
import { componentSource } from '@/lib/docs'
import type { PropRow } from '@/lib/docs'
import type { TypeAlias } from '@/lib/prop-controls'

/**
 * The real registry, plus one export that cannot render on its own.
 *
 * The fallback is the panel's most important promise and the hardest thing to
 * provoke honestly: which of the package's components throw outside their
 * parent depends on Radix's internals, so pinning the test to one of them would
 * be testing somebody else's context check. `Orphan` states the case directly
 * and leaves the other hundred-odd entries real, which is what the sweep at the
 * bottom of this file needs.
 */
vi.mock('@/generated/component-registry', async () => {
  const actual =
    await vi.importActual<typeof import('@/generated/component-registry')>(
      '@/generated/component-registry',
    )
  return {
    COMPONENTS: {
      ...actual.COMPONENTS,
      Orphan: function Orphan(): never {
        throw new Error('Orphan reads a context no page gave it')
      },
    },
  }
})

function row(partial: Partial<PropRow> & { name: string; type: string }): PropRow {
  return { required: false, description: '', ...partial }
}

const ROWS: PropRow[] = [
  row({
    name: 'loading',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Swaps the leading content for a spinner.',
  }),
  row({ name: 'variant', type: 'ButtonVariant', defaultValue: "'primary'" }),
  row({ name: 'onClick', type: '(event: MouseEvent) => void' }),
  row({ name: 'className', type: 'string' }),
  row({ name: 'children', type: 'ReactNode' }),
]

const ALIASES: TypeAlias[] = [
  { name: 'ButtonVariant', definition: "'primary' | 'secondary' | 'ghost' | 'danger'" },
]

function mount(name = 'Button') {
  return render(
    <PropsPlayground
      name={name}
      rows={ROWS}
      aliases={ALIASES}
      passthrough={[]}
      fallback={<p>The read-only table</p>}
    />,
  )
}

/** The preview's own copy of the subject, named by the children the panel gave it. */
function preview() {
  return screen.getByRole('button', { name: 'Item 1 Item 2 Item 3' })
}

/** The copy control, under either of the two names it answers to. */
function copyButton() {
  return screen.getByRole('button', { name: /Copy JSX|Copied/ })
}

let written: string[] = []

beforeEach(() => {
  written = []
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: (text: string) => { written.push(text); return Promise.resolve() } },
  })
})

describe('PropsPlayground', () => {
  it('gives a boolean prop a switch, and the flip reaches the preview', () => {
    mount()
    const toggle = screen.getByRole('switch', { name: 'loading' })

    expect(preview()).not.toHaveAttribute('aria-busy')

    fireEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-checked', 'true')
    // `loading` is the component's own doing, not the panel's: the preview is
    // the real Button, so the state it reports is the one a call site would get.
    expect(preview()).toHaveAttribute('aria-busy', 'true')
  })

  it('gives an enum a select carrying the options its alias declares', () => {
    mount()
    // `variant primary`, not `variant` — a Select trigger carries its name
    // and its current value, so the prefix is what identifies the row.
    const trigger = screen.getByRole('combobox', { name: /^variant\b/ })

    fireEvent.keyDown(trigger, { key: 'ArrowDown' })

    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'primary',
      'secondary',
      'ghost',
      'danger',
    ])
  })

  it('keeps a prop it cannot steer, and offers it no control', () => {
    mount()
    const cells = screen.getByText('onClick').closest('tr')!

    expect(within(cells).queryByRole('switch')).toBeNull()
    expect(within(cells).queryByRole('combobox')).toBeNull()
    expect(within(cells).queryByRole('textbox')).toBeNull()
  })

  it('does not offer className, whatever its type says', () => {
    mount()
    expect(screen.queryByText('className')).toBeNull()
  })

  it('copies a call site holding only what the reader changed', async () => {
    mount()

    fireEvent.click(copyButton())
    await vi.waitFor(() => expect(written).toHaveLength(1))
    expect(written[0]).toBe('<Button>\n  Item 1\n  Item 2\n  Item 3\n</Button>')

    fireEvent.click(screen.getByRole('switch', { name: 'loading' }))
    fireEvent.click(copyButton())
    await vi.waitFor(() => expect(written).toHaveLength(2))

    expect(written[1]).toContain('<Button loading>')
    // Everything still sitting on its default stays out: the point of the
    // button is the two attributes the reader chose, not a copy of the table.
    expect(written[1]).not.toContain('variant')
  })

  it('returns every control to its fallback on Reset', () => {
    mount()
    fireEvent.click(screen.getByRole('switch', { name: 'loading' }))
    expect(preview()).toHaveAttribute('aria-busy', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(screen.getByRole('switch', { name: 'loading' })).toHaveAttribute('aria-checked', 'false')
    expect(preview()).not.toHaveAttribute('aria-busy')
  })

  it('counts children up and down', () => {
    mount()
    fireEvent.click(screen.getByRole('button', { name: 'One fewer child' }))
    fireEvent.click(screen.getByRole('button', { name: 'One fewer child' }))

    expect(screen.getByRole('button', { name: 'Item 1' })).toBeInTheDocument()
  })

  it('fills a required slot the panel has no control for', () => {
    // `title` is a non-`children` ReactNode, so `prop-controls` refuses it a
    // control on purpose — and a required one left empty renders an EmptyState
    // whose heading has nothing in it, which is a component state no call site
    // can reach.
    render(
      <PropsPlayground
        name="EmptyState"
        rows={[row({ name: 'title', type: 'ReactNode', required: true })]}
        aliases={[]}
        passthrough={[]}
        fallback={<p>The read-only table</p>}
      />,
    )

    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
  })

  it('leaves an optional slot empty, because empty is what omitting it looks like', () => {
    render(
      <PropsPlayground
        name="EmptyState"
        rows={[
          row({ name: 'title', type: 'ReactNode', required: true }),
          row({ name: 'description', type: 'ReactNode' }),
        ]}
        aliases={[]}
        passthrough={[]}
        fallback={<p>The read-only table</p>}
      />,
    )

    // Both props name a row in the control table below, so counting is what
    // separates "the panel rendered it" from "the panel listed it": `title`
    // reaches the preview as well as the table, `description` only the table.
    expect(screen.getAllByText('title')).toHaveLength(2)
    expect(screen.getAllByText('description')).toHaveLength(1)
  })

  it('keeps a placeholder the reader never chose out of the snippet', async () => {
    render(
      <PropsPlayground
        name="EmptyState"
        rows={[row({ name: 'title', type: 'ReactNode', required: true })]}
        aliases={[]}
        passthrough={[]}
        fallback={<p>The read-only table</p>}
      />,
    )

    fireEvent.click(copyButton())
    await vi.waitFor(() => expect(written).toHaveLength(1))

    // The slot has no control, so there is nothing the reader could have
    // chosen. A snippet carrying invented content is worse than one missing a
    // prop: the first is wrong and looks right.
    expect(written[0]).toBe('<EmptyState />')
    expect(written[0]).not.toContain('title')
  })

  it('seats a required text field on its own name, and that one IS the reader\'s', async () => {
    render(
      <PropsPlayground
        name="Progress"
        rows={[row({ name: 'label', type: 'string', required: true })]}
        aliases={[]}
        passthrough={[]}
        fallback={<p>The read-only table</p>}
      />,
    )

    // Seeded into the control, not just into the preview: the reader can read
    // it and type over it, which is what makes it the panel's state rather than
    // scaffolding — and a required prop missing from the snippet is a snippet
    // that does not compile.
    expect(screen.getByRole('textbox', { name: 'label' })).toHaveValue('label')

    fireEvent.click(copyButton())
    await vi.waitFor(() => expect(written).toHaveLength(1))
    expect(written[0]).toBe('<Progress label="label" />')
  })

  it('names a control that documents no way to name itself', () => {
    // Checkbox is `ComponentProps<typeof CheckboxPrimitive.Root>` and nothing
    // more, so there is no row to seed. Its name comes from the call site, and
    // the panel is the call site.
    render(
      <PropsPlayground
        name="Checkbox"
        rows={[]}
        aliases={[]}
        passthrough={[]}
        fallback={<p>The read-only table</p>}
      />,
    )

    expect(screen.getByRole('checkbox', { name: 'Checkbox' })).toBeInTheDocument()
  })

  it('names a required control whose naming prop is a union no control can steer', async () => {
    // `Slider.label` is `string | [string, string]` — one name, or one per
    // thumb. `prop-controls` refuses a union it cannot enumerate, and
    // `placeholder` only reaches required ReactNode slots and empty text
    // fields, so nothing seeds it: the panel mounted `<Slider />`, and the
    // thumb it renders is the element carrying `role="slider"`.
    render(
      <PropsPlayground
        name="Slider"
        rows={[row({ name: 'label', type: 'string | [string, string]', required: true })]}
        aliases={[]}
        passthrough={[]}
        fallback={<p>The read-only table</p>}
      />,
    )

    expect(screen.getByRole('slider', { name: 'Slider' })).toBeInTheDocument()

    fireEvent.click(copyButton())
    await vi.waitFor(() => expect(written).toHaveLength(1))
    // The frame's, not the reader's: there is no control to have moved.
    expect(written[0]).toBe('<Slider />')
  })

  it('fills FloatingIconButton with a glyph, so its visible text never fights its label', async () => {
    render(
      <PropsPlayground
        name="FloatingIconButton"
        rows={[
          row({ name: 'position', type: "'start' | 'end'", required: true }),
          row({ name: 'label', type: 'string', required: true }),
          row({ name: 'children', type: 'ReactNode', required: true }),
        ]}
        aliases={[]}
        passthrough={[]}
        fallback={<p>The read-only table</p>}
      />,
    )

    // The count control used to render "Item 1 Item 2 Item 3" inside a button
    // named "label" — visible words its name does not contain (WCAG 2.5.3).
    const button = screen.getByRole('button', { name: 'label' })
    expect(button).toHaveTextContent(/^$/)
    expect(button.querySelector('svg')).not.toBeNull()
    expect(screen.queryByText('Item 1')).toBeNull()

    fireEvent.click(copyButton())
    await vi.waitFor(() => expect(written).toHaveLength(1))
    // The glyph is the frame's, not the reader's.
    expect(written[0]).not.toContain('Item')
    expect(written[0]).not.toContain('children')
  })

  it('pins AppShell out of the page\'s own landmarks, and keeps the pins off the snippet', async () => {
    render(
      <PropsPlayground
        name="AppShell"
        rows={[
          row({ name: 'sidebar', type: 'ReactNode', required: true }),
          row({ name: 'children', type: 'ReactNode', required: true }),
          row({ name: 'contentAs', type: "'main' | 'div'", defaultValue: "'main'" }),
          row({ name: 'sidebarLabel', type: 'string', defaultValue: "'Sidebar'" }),
        ]}
        aliases={[]}
        passthrough={[]}
        fallback={<p>The read-only table</p>}
      />,
    )

    // A document holds one `main`, and this preview sits inside the page's own.
    expect(screen.queryByRole('main')).toBeNull()
    expect(screen.getByRole('complementary', { name: 'Preview sidebar' })).toBeInTheDocument()

    fireEvent.click(copyButton())
    await vi.waitFor(() => expect(written).toHaveLength(1))
    // Both pins are the frame's doing, not the reader's, so neither travels.
    expect(written[0]).not.toContain('contentAs')
    expect(written[0]).not.toContain('Preview sidebar')
  })

  it('keeps a full document shell out of the nested preview', () => {
    render(<PropsPlayground name="SiteShell" rows={[]} aliases={[]} passthrough={[]} fallback={<p>Shell properties</p>} />)
    expect(screen.queryByRole('main')).toBeNull()
    expect(screen.getByText('Shell properties')).toBeInTheDocument()
  })

  it('supplies the recovery preview with its inherited required heading', () => {
    render(<PropsPlayground name="RecoveryState" rows={[]} aliases={[]} passthrough={[]} fallback={<p>Recovery properties</p>} />)
    expect(screen.getByRole('heading', { name: 'Page unavailable', level: 2 })).toBeInTheDocument()
  })

  it('hands the page back the read-only table when the preview throws', () => {
    // React reports a caught error on the console; the boundary is the point.
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      mount('Orphan')
      expect(screen.getByText('The read-only table')).toBeInTheDocument()
      expect(screen.queryByRole('switch', { name: 'loading' })).toBeNull()
    } finally {
      quiet.mockRestore()
    }
  })

  it('falls back the same way for an export the registry does not know', () => {
    mount('NotAComponent')
    expect(screen.getByText('The read-only table')).toBeInTheDocument()
  })
})

describe('the generated component registry', () => {
  it('holds the real components, so the panel has something to render', async () => {
    const actual = await vi.importActual<typeof import('@/generated/component-registry')>(
      '@/generated/component-registry',
    )
    expect(typeof actual.COMPONENTS.Button).toBe('function')
    expect(Object.keys(actual.COMPONENTS).length).toBeGreaterThan(50)
  })

  it('gives every component in the package a panel, previewing or falling back', () => {
    const aliases = CATALOG.flatMap((entry) => componentSource(entry.dir).exportedTypes)
    // The sweep provokes the boundary on whatever cannot stand alone, and React
    // reports each caught error on the console. The catching is the assertion.
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => {})
    let previewed = 0

    try {
      for (const entry of CATALOG) {
        const source = componentSource(entry.dir)
        const primary = source.components.find((component) => component.name === entry.dir)
        const view = render(
          <PropsPlayground
            name={primary?.name ?? entry.name}
            rows={primary?.props ?? []}
            aliases={aliases}
            passthrough={primary?.passthrough ?? []}
            fallback={<p>The read-only table</p>}
          />,
        )

        const text = view.container.textContent ?? ''
        // Either the panel is driving the component, or it has handed the page
        // back the table it was given. Neither is the failure this guards.
        const live = text.includes('Copy JSX') && !text.includes('The read-only table')
        if (live) previewed += 1
        else expect(text, entry.slug).toContain('The read-only table')
        view.unmount()
      }
    } finally {
      quiet.mockRestore()
    }

    // A floor rather than an exact count: which components need a parent is the
    // package's business and will move. Nothing sweeping is only evidence that
    // the sweep ran.
    expect(previewed).toBeGreaterThan(CATALOG.length / 2)
  })
})
