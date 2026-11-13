import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tag } from './Tag'

describe('Tag', () => {
  it('is presentational until it is given something to remove', () => {
    render(<Tag>TypeScript</Tag>)
    expect(screen.getByText('TypeScript').tagName).toBe('SPAN')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('names the remove control after its subject, not after the action', () => {
    // "Remove" eight times down a row of filters is eight controls a screen
    // reader cannot tell apart.
    render(
      <>
        <Tag onRemove={() => {}} removeLabel="Remove Rust filter">
          Rust
        </Tag>
        <Tag onRemove={() => {}} removeLabel="Remove TypeScript filter">
          TypeScript
        </Tag>
      </>,
    )
    expect(screen.getByRole('button', { name: 'Remove Rust filter' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove TypeScript filter' })).toBeInTheDocument()
  })

  it('calls onRemove from the pointer and from the keyboard', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(
      <Tag onRemove={onRemove} removeLabel="Remove Rust filter">
        Rust
      </Tag>,
    )
    const remove = screen.getByRole('button', { name: 'Remove Rust filter' })

    await user.click(remove)
    expect(onRemove).toHaveBeenCalledTimes(1)

    // A real <button>, so Enter and Space both fire it and Tab reaches it.
    remove.focus()
    await user.keyboard('{Enter}')
    expect(onRemove).toHaveBeenCalledTimes(2)
  })

  it('does not submit the form it happens to sit in', () => {
    render(
      <form>
        <Tag onRemove={() => {}} removeLabel="Remove Rust filter">
          Rust
        </Tag>
      </form>,
    )
    expect(screen.getByRole('button', { name: 'Remove Rust filter' })).toHaveAttribute(
      'type',
      'button',
    )
  })

  it('hides the glyph from the accessible name', () => {
    render(
      <Tag onRemove={() => {}} removeLabel="Remove Rust filter">
        Rust
      </Tag>,
    )
    const button = screen.getByRole('button', { name: 'Remove Rust filter' })
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('takes the pointer target past the drawn box', () => {
    // The X is 16px, under the 24px WCAG 2.5.8 floor. The inset pseudo-element
    // is what closes that without changing the drawing or pushing chips apart.
    render(
      <Tag onRemove={() => {}} removeLabel="Remove Rust filter">
        Rust
      </Tag>,
    )
    expect(screen.getByRole('button', { name: 'Remove Rust filter' }).className).toContain(
      'before:inset-[-4px]',
    )
  })

  it('keeps the active look, removable or not', () => {
    const { rerender } = render(<Tag active>Rust</Tag>)
    const look = screen.getByText('Rust').className
    expect(look).toContain('bg-(--action)')

    rerender(
      <Tag active onRemove={() => {}} removeLabel="Remove Rust filter">
        Rust
      </Tag>,
    )
    expect(screen.getByText('Rust').className).toContain('bg-(--action)')
  })

  it('makes the chip itself the filter control rather than asking for a wrapper', () => {
    // The wrapper a call site used to write is what put a button around a
    // chip that already holds one.
    render(
      <Tag active onClick={() => {}}>
        Rust
      </Tag>,
    )
    const chip = screen.getByRole('button', { name: 'Rust' })
    expect(chip).toHaveAttribute('aria-pressed', 'true')
    expect(chip.tagName).toBe('BUTTON')
  })

  it('leaves aria-pressed off a chip that is not a toggle', () => {
    // A tag that navigates or opens something is not pressed or unpressed, and
    // announcing "not pressed" is worse than announcing nothing.
    render(<Tag onClick={() => {}}>Rust</Tag>)
    expect(screen.getByRole('button', { name: 'Rust' })).not.toHaveAttribute('aria-pressed')
  })

  it('sets a removable filter chip\u2019s two controls beside each other, never one inside the other', () => {
    // A button inside a button is invalid: the parser splits it, and the
    // result is a DOM neither the author nor the accessibility tree expects.
    render(
      <Tag active onClick={() => {}} onRemove={() => {}} removeLabel="Remove Rust filter">
        Rust
      </Tag>,
    )
    const controls = screen.getAllByRole('button')
    expect(controls).toHaveLength(2)
    expect(controls.some((one) => controls.some((other) => other !== one && other.contains(one)))).toBe(
      false,
    )
  })

  it('fires the right handler for each half of a removable filter chip', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onRemove = vi.fn()
    render(
      <Tag onClick={onClick} onRemove={onRemove} removeLabel="Remove Rust filter">
        Rust
      </Tag>,
    )

    await user.click(screen.getByRole('button', { name: 'Rust' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onRemove).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Remove Rust filter' }))
    expect(onRemove).toHaveBeenCalledTimes(1)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
