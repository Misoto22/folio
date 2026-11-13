import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Heading } from './Heading'

describe('Heading', () => {
  it('renders the element the level names', () => {
    render(
      <>
        <Heading level={1}>Title</Heading>
        <Heading level={4}>Deep</Heading>
      </>,
    )
    // Queried by role and level, which is exactly how a screen reader's heading
    // list is built — the outline, not the class list.
    expect(screen.getByRole('heading', { level: 1, name: 'Title' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 4, name: 'Deep' })).toBeInTheDocument()
  })

  it('takes the size from the level when nobody says otherwise', () => {
    render(
      <>
        <Heading level={1}>One</Heading>
        <Heading level={3}>Three</Heading>
      </>,
    )
    expect(screen.getByText('One').className).toContain('var(--fs-title)')
    expect(screen.getByText('Three').className).toContain('var(--fs-sub)')
  })

  it('skips a step between level 1 and level 2', () => {
    // The ladder's steps sit close together, so two nesting headings must skip
    // one: --fs-lead over --fs-heading is a ratio of 1.14 and reads as an
    // accident. If this ever becomes `lead`, the default pairing is broken.
    render(<Heading level={2}>Two</Heading>)
    const className = screen.getByText('Two').className
    expect(className).toContain('var(--fs-heading)')
    expect(className).not.toContain('var(--fs-lead)')
  })

  it('sizes independently of the level in both directions', () => {
    render(
      <>
        <Heading level={3} size="title">
          Big and deep
        </Heading>
        <Heading level={1} size="item">
          Small and shallow
        </Heading>
      </>,
    )

    const big = screen.getByRole('heading', { level: 3, name: 'Big and deep' })
    expect(big.className).toContain('var(--fs-title)')

    const small = screen.getByRole('heading', { level: 1, name: 'Small and shallow' })
    expect(small.className).toContain('var(--fs-item)')
    expect(small.className).not.toContain('var(--fs-title)')
  })

  it('keeps the label step off the serif ladder', () => {
    // Levels five and six are the kicker, not a small serif heading — three
    // steps down, a serif heading is indistinguishable from bold prose. The
    // kicker's face is the voice axis's `--label-font` (mono unless quieted).
    render(<Heading level={5}>Metadata</Heading>)
    const className = screen.getByText('Metadata').className
    expect(className).toContain('font-(family-name:--label-font)')
    expect(className).not.toContain('font-heading')
  })

  it('carries an id through to the element a table of contents links to', () => {
    render(
      <Heading level={2} id="colour">
        Colour
      </Heading>,
    )
    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('id', 'colour')
  })
})
