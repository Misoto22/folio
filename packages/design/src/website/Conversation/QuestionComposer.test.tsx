import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuestionComposer, type QuestionComposerProps } from './QuestionComposer'

function Composer(props: Partial<QuestionComposerProps>) {
  const [value, setValue] = useState('')
  return <QuestionComposer id="question" label="Your question" hideLabel value={value} onValueChange={setValue} onSubmit={() => {}} submitLabel="Ask" submitDisabled={!value.trim()} {...props} />
}

describe('QuestionComposer', () => {
  it('sends with the arrow, named by the submit label, once there is a question', async () => {
    const user = userEvent.setup()
    const submit = vi.fn()
    render(<Composer onSubmit={submit} />)
    const send = screen.getByRole('button', { name: 'Ask' })
    expect(send).toBeDisabled()
    await user.type(screen.getByRole('textbox', { name: 'Your question' }), 'Why?')
    expect(send).toBeEnabled()
    await user.click(send)
    expect(submit).toHaveBeenCalledOnce()
  })

  it('turns the send control into Stop while an answer streams, and stops instead of sending', async () => {
    const user = userEvent.setup()
    const submit = vi.fn()
    const stop = vi.fn()
    render(<Composer pending onSubmit={submit} onStop={stop} stopLabel="Stop" submitDisabled />)
    const control = screen.getByRole('button', { name: 'Stop' })
    expect(control).toBeEnabled()
    expect(control).toHaveAttribute('type', 'button')
    expect(screen.queryByRole('button', { name: 'Ask' })).toBeNull()
    await user.click(control)
    expect(stop).toHaveBeenCalledOnce()
    await user.type(screen.getByRole('textbox'), 'more{Enter}')
    expect(submit).not.toHaveBeenCalled()
  })

  it('stays a plain send control while pending when the host offers no Stop', () => {
    render(<Composer pending submitDisabled />)
    expect(screen.getByRole('button', { name: 'Ask' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Stop' })).toBeNull()
  })

  it('holds the field and counts down inside the button while a rate limit lasts', () => {
    const { rerender, container } = render(<Composer retryIn={24} />)
    const field = screen.getByRole('textbox', { name: 'Your question' })
    const send = screen.getByRole('button', { name: 'Ask' })
    expect(field).toBeDisabled()
    expect(send).toBeDisabled()
    expect(send).toHaveAttribute('data-waiting')
    expect(container.querySelector('.folio-question-composer__count')).toHaveTextContent('24')
    expect(send.style.getPropertyValue('--folio-composer-left')).toBe('1')
    rerender(<Composer retryIn={12} />)
    expect(send.style.getPropertyValue('--folio-composer-left')).toBe('0.5')
    rerender(<Composer retryIn={0} />)
    expect(screen.getByRole('textbox')).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Ask' })).not.toHaveAttribute('data-waiting')
    expect(container.querySelector('.folio-question-composer__count')).toBeNull()
  })

  it('lets the countdown outrank Stop, so a refused question cannot be stopped', () => {
    render(<Composer pending onStop={() => {}} stopLabel="Stop" retryIn={5} />)
    expect(screen.queryByRole('button', { name: 'Stop' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Ask' })).toBeDisabled()
  })
})
