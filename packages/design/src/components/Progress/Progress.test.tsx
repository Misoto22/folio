import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Progress } from './Progress'

const fill = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('[role="progressbar"] > div')

const sweep = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('[role="progressbar"] [data-folio-animated]')

describe('Progress max', () => {
  it('paints the fraction of max it announces', () => {
    const { container } = render(<Progress value={100} max={500} label="Restoring" />)

    // The bar used to paint 100% while Radix announced "100 of 500". The
    // picture and the announcement have to be the same number.
    expect(fill(container)).toHaveStyle({ width: '20%' })
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '500')
  })

  it('prints the same fraction it paints', () => {
    render(<Progress value={100} max={500} label="Restoring" showValue />)

    expect(screen.getByText('20%')).toBeInTheDocument()
  })

  it('still reads value as a percentage when max is left alone', () => {
    const { container } = render(<Progress value={62} label="Uploading photos" />)

    expect(fill(container)).toHaveStyle({ width: '62%' })
  })

  it('clamps a value past the ceiling instead of overflowing the track', () => {
    const { container } = render(<Progress value={900} max={500} label="Restoring" />)

    expect(fill(container)).toHaveStyle({ width: '100%' })
  })

  it('falls back to 100 on an unusable max, which is what Radix does with it', () => {
    const { container } = render(<Progress value={40} max={0} label="Restoring" />)

    expect(fill(container)).toHaveStyle({ width: '40%' })
  })
})

describe('Progress under reduced motion', () => {
  it('does not rest an indeterminate bar in the shape of a finished one', () => {
    const { container } = render(<Progress label="Indexing" />)

    // jsdom loads no stylesheet and answers no media query, so this asserts the
    // class contract rather than a computed width. What it guards is specific:
    // `motion-reduce:w-full` turned an in-progress sweep into a full-width bar
    // at rest — which is exactly what a completed bar looks like. Without any
    // motion-reduce override the sweep simply stops where it is drawn, a
    // quarter of the track at the inline start, which is the same answer
    // Spinner gives a reader who asked for less motion: a partial shape that
    // still reads as unfinished.
    const bar = sweep(container)
    expect(bar).not.toBeNull()
    expect(bar?.className).toContain('w-1/4')
    expect(bar?.className).not.toContain('motion-reduce:w-full')
    expect(bar?.className).not.toContain('motion-reduce:opacity-40')
  })
})
