import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders a <button> with type=button by default', () => {
    render(<Button>Save</Button>)
    const button = screen.getByRole('button', { name: 'Save' })
    expect(button.tagName).toBe('BUTTON')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('renders a native <a> when given href', () => {
    render(<Button href="/next">Go</Button>)
    const link = screen.getByRole('link', { name: /Go/ })
    expect(link).toHaveAttribute('href', '/next')
  })

  it('renders the keycap glyph after the label', () => {
    render(<Button keycap="S">Save</Button>)
    expect(screen.getByText('S')).toBeInTheDocument()
  })

  describe('loading', () => {
    it('disables the button and marks it busy', () => {
      render(<Button loading>Saving…</Button>)
      const button = screen.getByRole('button', { name: 'Saving…' })
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-busy', 'true')
    })

    it('keeps the label, so the control does not collapse mid-click', () => {
      render(<Button loading>Saving…</Button>)
      expect(screen.getByRole('button')).toHaveTextContent('Saving…')
    })

    it('marks a link aria-disabled, which is the only disable a link has', () => {
      render(
        <Button href="/x" loading>
          Go
        </Button>,
      )
      expect(screen.getByRole('link', { name: /Go/ })).toHaveAttribute('aria-disabled', 'true')
    })

    it('does not announce the spinner separately from the button', () => {
      render(<Button loading>Saving…</Button>)
      // The button's own label already says what is happening; a second live
      // region saying "Loading" would double it.
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  it('renders the child element when asChild, keeping the button styles', () => {
    render(
      <Button asChild variant="secondary">
        <a href="/work">Work</a>
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Work' })
    expect(link.tagName).toBe('A')
    expect(link.className).toContain('rounded-(--radius-control)')
  })

  it('lets a caller override a base utility rather than emitting both', () => {
    render(<Button className="px-2">Tight</Button>)
    const className = screen.getByRole('button').className
    expect(className).toContain('px-2')
    expect(className).not.toContain('px-6')
  })

  it('forwards arbitrary attributes to the element', () => {
    render(<Button data-testid="cta">Save</Button>)
    expect(screen.getByTestId('cta')).toBeInTheDocument()
  })
})
