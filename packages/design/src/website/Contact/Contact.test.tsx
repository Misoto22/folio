import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactFacts, ContactFormView, ContactStatus, CorrespondenceSection, LocationClock, LocationFigure, QuestionList, type ContactFormLabels, type ContactFormViewProps } from './Contact'

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

  it('draws topics as tiles with hidden glyphs and moves the choice with the arrow keys', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<Form onTopicChange={changed} topics={[{ value: 'project', label: 'Project', icon: <svg data-testid="glyph" /> }, { value: 'photo', label: 'Photography' }]} />)
    const project = screen.getByRole('radio', { name: 'Project' })
    expect(within(project).getByTestId('glyph').parentElement).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('radiogroup', { name: 'Topic' })).toHaveAttribute('data-count', '2')
    project.focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Photography' })).toHaveFocus()
  })

  it('puts the send button before the note, with no keycap a phone has no key for', () => {
    render(<Form />)
    const send = screen.getByRole('button', { name: 'Send' })
    expect(send.closest('.folio-contact-form__actions')?.firstElementChild).toBe(send)
    expect(send.nextElementSibling).toHaveTextContent('We reply by email')
    expect(send.querySelector('kbd')).toBeNull()
  })

  it('folds the optional subject behind a disclosure and opens it on demand', async () => {
    const user = userEvent.setup()
    render(<Form labels={{ ...labels, addSubject: 'Add a subject' }} />)
    const more = screen.getByRole('button', { name: 'Add a subject' })
    expect(more).toHaveAttribute('aria-expanded', 'false')
    const panel = document.getElementById(more.getAttribute('aria-controls')!)!
    expect(panel).toHaveAttribute('inert')
    await user.click(more)
    expect(more).toHaveAttribute('aria-expanded', 'true')
    expect(panel).not.toHaveAttribute('inert')
    expect(screen.getByRole('textbox', { name: /Subject/ })).toBeInTheDocument()
  })

  it('never hides a subject the reader typed or one with an error', () => {
    render(<Form labels={{ ...labels, addSubject: 'Add a subject' }} values={{ name: '', email: '', subject: 'Hello', message: '' }} />)
    expect(screen.queryByRole('button', { name: 'Add a subject' })).toBeNull()
    expect(screen.getByRole('textbox', { name: /Subject/ }).closest('[inert]')).toBeNull()
  })

  it('disables submission while pending and displays success only when supplied by the host', () => {
    const view = render(<Form pending />)
    expect(screen.getByRole('button', { name: /Sending/ })).toBeDisabled()
    view.rerender(<Form success={{ title: 'Message delivered', description: 'Thank you for writing.' }} />)
    expect(screen.getByRole('status')).toHaveTextContent('Message delivered')
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Write to us' })).toBeNull()
  })
})

describe('contact facts and place', () => {
  it('lays facts out as icon rows with the term, or an action, at the end, and links as named marks', () => {
    render(<ContactFacts label="Contact" linksLabel="Social" linksVariant="marks"
      rows={[{ id: 'email', icon: <svg />, value: <a href="mailto:a@b.c">a@b.c</a>, action: <button type="button">Copy email address</button> }, { id: 'reply', value: 'Within 1–2 days', term: 'Response time' }]}
      links={<a href="https://github.com/x" aria-label="GitHub"><svg /></a>} />)
    const rows = within(screen.getByRole('complementary', { name: 'Contact' })).getAllByRole('listitem')
    expect(rows).toHaveLength(2)
    expect(within(rows[0]!).getByRole('button', { name: 'Copy email address' })).toBeInTheDocument()
    expect(rows[1]).toHaveTextContent('Within 1–2 daysResponse time')
    expect(screen.getByRole('navigation', { name: 'Social' })).toHaveAttribute('data-variant', 'marks')
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
  })

  it('sets a clock into the map and keeps the caption as the figure’s name', () => {
    const { container } = render(<LocationFigure label="Sydney, New South Wales" coordinates="33.8688°S · 151.2093°E" ratio={2} overlay={<LocationClock time="01:45" place="Sydney · AEDT" icon={<svg />} />} />)
    expect(screen.getByRole('figure', { name: 'Sydney, New South Wales' })).toHaveStyle({ '--folio-location-ratio': '2' })
    const clock = container.querySelector('.folio-location-figure__map .folio-location-figure__overlay time')
    expect(clock).toHaveTextContent('01:45')
    expect(container.querySelector('.folio-location-figure__overlay')).toHaveTextContent('Sydney · AEDT')
  })

  it('orders the place first in the contact layout and says availability in a pill', () => {
    const { container } = render(<CorrespondenceSection media={<p>Map</p>} aside={<p>Facts</p>}><ContactStatus>Open to collaboration</ContactStatus></CorrespondenceSection>)
    const section = container.firstElementChild!
    expect(section).toHaveAttribute('data-media')
    expect(section.querySelector('.folio-correspondence__side')?.firstElementChild).toHaveTextContent('Map')
    expect(screen.getByText('Open to collaboration')).toHaveClass('folio-contact-status')
  })
})

describe('QuestionList', () => {
  const items = [{ id: 'a', question: 'Do you take freelance work?', answer: 'Selectively.' }]
  it('shows every answer by default', () => {
    render(<QuestionList title="Before you write" items={items} />)
    expect(screen.getByRole('heading', { level: 3, name: 'Do you take freelance work?' })).toBeInTheDocument()
    expect(screen.queryByRole('button')).toBeNull()
  })
  it('closes answers behind their questions, keeping them in the document', async () => {
    const user = userEvent.setup()
    render(<QuestionList title="Before you write" items={items} disclosure />)
    const question = screen.getByRole('button', { name: 'Do you take freelance work?' })
    const answer = document.getElementById(question.getAttribute('aria-controls')!)!
    expect(question).toHaveAttribute('aria-expanded', 'false')
    expect(answer).toHaveTextContent('Selectively.')
    expect(answer).toHaveAttribute('inert')
    await user.click(question)
    expect(question).toHaveAttribute('aria-expanded', 'true')
    expect(answer).not.toHaveAttribute('inert')
  })
})
