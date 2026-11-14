import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { AspectRatio } from './AspectRatio'

/**
 * jsdom has no layout engine, so nothing here can measure a rendered box. What
 * it CAN prove is the mechanism: that the ratio is declared on the box itself
 * and that no child is left able to push the height around. That is the whole
 * of the contract — the geometry is the browser's, and it is exercised for real
 * by the documentation site's browser suite.
 */
describe('AspectRatio', () => {
  it('declares the ratio on the box rather than faking it with padding', () => {
    // The padding-top percentage trick is a percentage of the WIDTH, which is
    // why it works and also why it breaks as a flex child and eats the
    // element's own padding.
    const { container } = render(<AspectRatio ratio="16 / 9" />)
    const box = container.firstElementChild as HTMLElement

    expect(box.style.aspectRatio).toBe('16 / 9')
    expect(box.style.paddingTop).toBe('')
  })

  it('accepts the ratio as a number', () => {
    // The CSS engine normalises the shorthand to `<width> / <height>`, so a
    // bare number arrives as `1 / 1`.
    const { container } = render(<AspectRatio ratio={1} />)
    expect((container.firstElementChild as HTMLElement).style.aspectRatio).toBe('1 / 1')
  })

  it('holds the box open for content with no intrinsic size', () => {
    // An empty div, a map that measures its container, a skeleton: none of them
    // have a height of their own, and the box must not collapse to zero.
    const { container } = render(
      <AspectRatio ratio="4 / 3">
        <div data-testid="child" />
      </AspectRatio>,
    )
    const box = container.firstElementChild as HTMLElement

    expect(box.style.aspectRatio).toBe('4 / 3')
    // Children are taken out of flow and stretched, so nothing inside can
    // contribute a height that would override the declared ratio.
    expect(box.className).toContain('[&>*]:absolute')
    expect(box.className).toContain('[&>*]:size-full')
    expect(box.querySelector('[data-testid="child"]')).not.toBeNull()
  })

  it('renders the box even with no children at all', () => {
    const { container } = render(<AspectRatio />)
    const box = container.firstElementChild as HTMLElement

    expect(box).not.toBeNull()
    // CSSOM serialises numbers to six significant digits (jsdom 31 follows
    // it), so compare the ratio as a number rather than as JS's long string.
    const [width, height] = box.style.aspectRatio.split('/').map(Number)
    expect(height).toBe(1)
    expect(width).toBeCloseTo(16 / 9, 5)
  })

  it('lets a caller override the ratio through style, last write winning', () => {
    const { container } = render(<AspectRatio ratio="16 / 9" style={{ aspectRatio: '3 / 2' }} />)
    expect((container.firstElementChild as HTMLElement).style.aspectRatio).toBe('3 / 2')
  })

  it('merges the caller’s className rather than emitting both sides', () => {
    const { container } = render(<AspectRatio className="w-64" />)
    const box = container.firstElementChild as HTMLElement

    expect(box.className).toContain('w-64')
    expect(box.className).not.toContain('w-full')
  })
})
