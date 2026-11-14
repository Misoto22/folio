import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Check, Minus } from '../../icons'
import { Checkbox } from './Checkbox'

/**
 * The drawn path is what tells the dash from the tick, without leaning on the
 * icon set's class names. Render the icon the state is supposed to draw and compare
 * against it, rather than pinning path data a version bump is free to redraw.
 */
const glyph = (container: HTMLElement) =>
  container.querySelector('svg path')?.getAttribute('d') ?? ''

const drawn = (Icon: typeof Check) => {
  const { container } = render(<Icon />)
  return container.querySelector('svg path')?.getAttribute('d') ?? ''
}

describe('Checkbox', () => {
  it('draws the dash for an uncontrolled indeterminate box', () => {
    // The tick here is the "all of them" picture on a partly selected list —
    // the one thing the indeterminate state exists to avoid saying.
    const { container } = render(<Checkbox aria-label="Select all" defaultChecked="indeterminate" />)
    expect(glyph(container)).toBe(drawn(Minus))
  })

  it('draws the dash for a controlled indeterminate box', () => {
    const { container } = render(
      <Checkbox aria-label="Select all" checked="indeterminate" onCheckedChange={() => {}} />,
    )
    expect(glyph(container)).toBe(drawn(Minus))
  })

  it('draws the tick when it is simply checked', () => {
    const { container } = render(<Checkbox aria-label="Ship on merge" defaultChecked />)
    expect(glyph(container)).toBe(drawn(Check))
  })
})
