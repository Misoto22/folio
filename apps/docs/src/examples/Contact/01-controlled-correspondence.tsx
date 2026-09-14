'use client'

import { useState } from 'react'
import { ContactFormView, type ContactFormValues } from '@misoto22/folio/website'

/**
 * The host controls every field and confirms success after its own submission work.
 * This local example captures a draft in memory and sends no message.
 */
export function Example() {
  const [values, setValues] = useState<ContactFormValues>({ name: '', email: '', subject: '', message: '' })
  const [topic, setTopic] = useState('question')
  const [saved, setSaved] = useState(false)
  return (
    <ContactFormView
      labels={{ heading: 'Start a conversation', topic: 'Topic', name: 'Name', email: 'Email', subject: 'Subject', message: 'Message',
        namePlaceholder: 'Your name', emailPlaceholder: 'you@example.com', subjectPlaceholder: 'A short introduction', messagePlaceholder: 'What would you like to discuss?',
        optional: 'Optional', note: 'This demonstration saves a local draft only.', submit: 'Capture draft', submitting: 'Capturing' }}
      values={values} onFieldChange={(field, value) => setValues((current) => ({ ...current, [field]: value }))}
      topic={topic} onTopicChange={setTopic} topics={[{ value: 'question', label: 'A question' }, { value: 'project', label: 'A project' }]}
      limits={{ name: 100, email: 200, subject: 160, message: 2000 }}
      onSubmit={(event) => { event.preventDefault(); setSaved(true) }}
      success={saved ? { title: 'Draft captured', description: 'The example retained this draft locally. No message was sent.' } : undefined}
    />
  )
}
