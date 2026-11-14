import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReasoningTrace } from './ReasoningTrace'

const steps = [{ id: '1', state: 'done' as const, label: 'Searched the archive', summary: '120ms' }]

describe('ReasoningTrace', () => {
  it('is a plain status line, not a control, before any step arrives', () => {
    render(<ReasoningTrace label="Steps" running title="Thinking" items={[]} />)
    expect(screen.getByRole('status')).toHaveTextContent('Thinking')
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('opens its steps while running and shimmers the title', () => {
    const { container } = render(<ReasoningTrace label="Steps" running title="Thinking" items={steps} />)
    expect(screen.getByRole('button', { name: /Thinking/ })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('list', { name: 'Steps' })).toBeInTheDocument()
    expect(container.querySelector('.folio-reasoning__title')).toHaveAttribute('data-running')
  })

  it('folds its steps away once done, with a settled title and no shimmer', () => {
    const { container, rerender } = render(<ReasoningTrace label="Steps" running title="Thinking" items={steps} />)
    rerender(<ReasoningTrace label="Steps" running={false} title="Thought for 1.5s" items={steps} />)
    const trigger = screen.getByRole('button', { name: /Thought for 1\.5s/ })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(container.querySelector('.folio-reasoning__title')).not.toHaveAttribute('data-running')
  })

  it('keeps the reader’s own choice over the automatic open and close', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<ReasoningTrace label="Steps" running title="Thinking" items={steps} />)
    await user.click(screen.getByRole('button', { name: /Thinking/ }))
    expect(screen.getByRole('button', { name: /Thinking/ })).toHaveAttribute('aria-expanded', 'false')
    rerender(<ReasoningTrace label="Steps" running={false} title="Thought for 1.5s" items={steps} />)
    await user.click(screen.getByRole('button', { name: /Thought/ }))
    expect(screen.getByRole('button', { name: /Thought/ })).toHaveAttribute('aria-expanded', 'true')
  })
})
