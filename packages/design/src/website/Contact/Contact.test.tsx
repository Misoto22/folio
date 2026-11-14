import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactFormView, type ContactFormLabels, type ContactFormViewProps } from './Contact'

const labels: ContactFormLabels = {
  heading: 'Write to us', topic: 'Topic', name: 'Name', email: 'Email', subject: 'Subject', message: 'Message',
  namePlaceholder: 'Your name', emailPlaceholder: 'you@example.com', subjectPlaceholder: 'Subject', messagePlaceholder: 'Your message',
  optional: 'optional', note: 'We reply by email', submit: 'Send', submitting: 'Sending',
}

function Form({ onTopicChange, ...props }: Partial<ContactFormViewProps>) {
  const [topic, setTopic] = useState('project')
  return <ContactFormView labels={labels} values={{ name: '', email: '', subject: '', message: '' }} topics={[{ value: 'project', label: 'Project' }, { value: 'photo', label: 'Photography' }]} topic={topic} onTopicChange={(value) => { setTopic(value); onTopicChange?.(value) }} onFieldChange={() => {}} onSubmit={(event) => event.preventDefault()} limits={{ name: 20, email: 80, subject: 40, message: 500 }} {...props} />
}

describe('ContactFormView', () => {
  it('keeps exactly one topic selected and calls only the controlled change boundary', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<Form onTopicChange={changed} />)
    const group = screen.getByRole('radiogroup', { name: 'Topic' })
    await user.click(within(group).getByRole('radio', { name: 'Photography' }))
    expect(changed).toHaveBeenLastCalledWith('photo')
    expect(within(group).getByRole('radio', { name: 'Photography' })).toHaveAttribute('aria-checked', 'true')
    await user.click(within(group).getByRole('radio', { name: 'Photography' }))
    expect(within(group).getByRole('radio', { name: 'Photography' })).toHaveAttribute('aria-checked', 'true')
  })

  it('says each field’s error under that field and wires it to the control, leaving the others valid', () => {
    render(<Form fieldErrors={{ name: 'Add your name.', message: 'Write a message.' }} />)
    const name = screen.getByRole('textbox', { name: 'Name' })
    expect(name).toHaveAttribute('aria-invalid', 'true')
    expect(name).toHaveAccessibleDescription('Add your name.')
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveAccessibleDescription('Write a message.')
    expect(screen.getByRole('textbox', { name: 'Email' })).not.toHaveAttribute('aria-invalid')
    expect(screen.getByRole('textbox', { name: /Subject/ })).not.toHaveAttribute('aria-invalid')
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('reports a failed send as a hairline note beside the button, not a banner that invalidates the fields', () => {
    render(<Form error="The message could not be sent." />)
    const note = screen.getByRole('alert')
    expect(note).toHaveTextContent('The message could not be sent.')
    expect(note).toHaveClass('folio-contact-form__note')
    expect(note.nextElementSibling).toHaveClass('folio-contact-form__actions')
    expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveAttribute('aria-invalid')
  })

  it('disables submission while pending and displays success only when supplied by the host', () => {
    const view = render(<Form pending />)
    expect(screen.getByRole('button', { name: /Sending/ })).toBeDisabled()
    view.rerender(<Form success={{ title: 'Message delivered', description: 'Thank you for writing.' }} />)
    expect(screen.getByRole('status')).toHaveTextContent('Message delivered')
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
  })
})
