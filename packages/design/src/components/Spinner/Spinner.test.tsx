import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('announces what is loading', () => {
    render(<Spinner label="Loading projects" />)
    expect(screen.getByRole('status')).toHaveTextContent('Loading projects')
  })

  it('goes silent when label is null, for use inside a control that already speaks', () => {
    const { container } = render(<Spinner label={null} />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws the ring in the inherited colour when tone is current', () => {
    const { container } = render(<Spinner tone="current" label={null} />)
    expect(container.querySelector('[data-folio-animated]')?.className).toContain('border-t-current')
  })
})

describe('Spinner className', () => {
  it('sizes the ring rather than an invisible box around it', () => {
    const { container } = render(<Spinner className="size-8" label={null} />)
    const ring = container.querySelector('[data-folio-animated]')

    // className used to land on the outer inline-flex wrapper while SIZE and
    // TONE went on the inner span, so <Spinner className="size-8" /> grew the
    // box and left an unchanged 18px ring inside it.
    expect(ring?.className).toContain('size-8')
    expect(ring?.className).not.toContain('size-[18px]')
  })

  it('lets a caller recolour the ring the same way', () => {
    const { container } = render(<Spinner className="border-t-(--danger)" label={null} />)
    const ring = container.querySelector('[data-folio-animated]')

    expect(ring?.className).toContain('border-t-(--danger)')
    expect(ring?.className).not.toContain('border-t-(--ink)')
  })
})
