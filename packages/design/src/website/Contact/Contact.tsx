'use client'

import { useId, type FormEventHandler, type HTMLAttributes, type ReactNode } from 'react'
import { Alert } from '../../components/Alert/Alert'
import { Button } from '../../components/Button/Button'
import { DescriptionList, type DescriptionListItem } from '../../components/DescriptionList/DescriptionList'
import { Field } from '../../components/Field/Field'
import { Heading } from '../../components/Heading/Heading'
import { Input } from '../../components/Input/Input'
import { Text } from '../../components/Text/Text'
import { Textarea } from '../../components/Textarea/Textarea'
import { ToggleGroup, ToggleGroupItem } from '../../components/ToggleGroup/ToggleGroup'
import { cn } from '../../lib/cn'

export interface CorrespondenceSectionProps extends HTMLAttributes<HTMLDivElement> {
  aside: ReactNode
  children: ReactNode
  /** The secondary column can precede or follow the main content. */
  asidePosition?: 'start' | 'end'
}

/** A correspondence page's primary content and supporting facts. */
export function CorrespondenceSection({ aside, children, asidePosition = 'start', className, ...rest }: CorrespondenceSectionProps) {
  return (
    <div className={cn('folio-correspondence', className)} data-aside-position={asidePosition} {...rest}>
      {asidePosition === 'start' && aside}
      {children}
      {asidePosition === 'end' && aside}
    </div>
  )
}

export interface ContactFormValues {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactFormLabels {
  heading: string
  topic: string
  name: string
  email: string
  subject: string
  message: string
  namePlaceholder: string
  emailPlaceholder: string
  subjectPlaceholder: string
  messagePlaceholder: string
  optional: string
  note: string
  submit: string
  submitting: string
}

export interface ContactFormViewProps {
  labels: ContactFormLabels
  values: ContactFormValues
  topics: { value: string; label: string }[]
  topic: string
  onTopicChange: (value: string) => void
  onFieldChange: (field: keyof ContactFormValues, value: string) => void
  onSubmit: FormEventHandler<HTMLFormElement>
  limits: Record<keyof ContactFormValues, number>
  pending?: boolean
  /** Why the send failed — a sentence ruled in the danger colour beside the send button, not a banner over the form. */
  error?: string
  /** What is wrong with each field, said under that field and wired to it with `aria-invalid` and `aria-describedby`. */
  fieldErrors?: Partial<Record<keyof ContactFormValues, string>>
  /** A server-confirmed success. The host decides when the form can disappear. */
  success?: { title: string; description: string }
  /** Optional stable prefix for links to a specific form. */
  idPrefix?: string
}

/** A field's error, unfolding under it rather than pushing the form down at once. */
function fieldNote(message: string | undefined) {
  return message ? <span className="folio-contact-form__error"><span>{message}</span></span> : undefined
}

/**
 * Controlled contact form. Validation, submission and delivery remain host responsibilities.
 *
 * A validation error is said under the field it is about, so the reader is told
 * which one and nothing above the form moves. A failed send is a hairline note
 * beside the send button, not a filled banner over the form.
 */
export function ContactFormView({ labels, values, topics, topic, onTopicChange, onFieldChange, onSubmit, limits, pending = false, error, fieldErrors = {}, success, idPrefix }: ContactFormViewProps) {
  const generatedId = useId()
  const prefix = idPrefix ?? generatedId
  const headingId = `${prefix}-intro`

  return (
    <section className="folio-contact-form">
      <Heading level={2} id={headingId} className="mb-8 max-w-[24ch]">{labels.heading}</Heading>
      <div aria-live="polite" aria-atomic="true">
        {success && <Alert tone="success" title={success.title}>{success.description}</Alert>}
      </div>
      {!success && (
        <form onSubmit={onSubmit} noValidate aria-labelledby={headingId} className="folio-contact-form__fields">
          <Field label={labels.topic}>
            <ToggleGroup type="single" value={topic} onValueChange={(value) => { if (value) onTopicChange(value) }} className="max-w-full flex-wrap">
              {topics.map((item) => <ToggleGroupItem key={item.value} value={item.value} className="min-h-11 min-w-11">{item.label}</ToggleGroupItem>)}
            </ToggleGroup>
          </Field>
          <div className="folio-contact-form__identity">
            <Field label={labels.name} required htmlFor={`${prefix}-name`} error={fieldNote(fieldErrors.name)}>
              <Input name="name" autoComplete="name" value={values.name} onChange={(event) => onFieldChange('name', event.target.value)} placeholder={labels.namePlaceholder} required maxLength={limits.name} className="min-h-11" />
            </Field>
            <Field label={labels.email} required htmlFor={`${prefix}-email`} error={fieldNote(fieldErrors.email)}>
              <Input name="email" type="email" autoComplete="email" value={values.email} onChange={(event) => onFieldChange('email', event.target.value)} placeholder={labels.emailPlaceholder} required maxLength={limits.email} className="min-h-11" />
            </Field>
          </div>
          <Field label={<>{labels.subject} <Text as="span" size="xs" tone="muted">({labels.optional})</Text></>} htmlFor={`${prefix}-subject`} error={fieldNote(fieldErrors.subject)}>
            <Input name="subject" value={values.subject} onChange={(event) => onFieldChange('subject', event.target.value)} placeholder={labels.subjectPlaceholder} maxLength={limits.subject} className="min-h-11" />
          </Field>
          <Field label={labels.message} required htmlFor={`${prefix}-message`} error={fieldNote(fieldErrors.message)}>
            <Textarea name="message" value={values.message} onChange={(event) => onFieldChange('message', event.target.value)} placeholder={labels.messagePlaceholder} required maxLength={limits.message} rows={6} />
          </Field>
          {error && <p id={`${prefix}-status`} role="alert" className="folio-contact-form__note">{error}</p>}
          <div className="folio-contact-form__actions">
            <Text size="xs" tone="muted" className="m-0 max-w-[30ch]">{labels.note}</Text>
            <Button type="submit" keycap="↵" loading={pending} className="min-h-11">{pending ? labels.submitting : labels.submit}</Button>
          </div>
        </form>
      )}
    </section>
  )
}

export interface ContactFactsProps {
  label: string
  items: DescriptionListItem[]
  links?: ReactNode
  linksLabel?: string
}

/** Contact facts retain their definition-list semantics and optional navigation. */
export function ContactFacts({ label, items, links, linksLabel }: ContactFactsProps) {
  return (
    <aside aria-label={label} className="folio-contact-facts">
      <DescriptionList items={items} layout="stacked" />
      {links && <nav aria-label={linksLabel} className="folio-contact-facts__links">{links}</nav>}
    </aside>
  )
}

export interface QuestionListProps extends HTMLAttributes<HTMLElement> {
  title: string
  description?: string
  items: { id: string; question: string; answer: string }[]
}

/** Visible questions and answers, useful when the complete answer set is short. */
export function QuestionList({ title, description, items, className, ...rest }: QuestionListProps) {
  const id = useId()
  return (
    <section aria-labelledby={id} className={cn('folio-question-list', className)} {...rest}>
      <Heading level={2} id={id}>{title}</Heading>
      {description && <Text className="mb-8 mt-3 max-w-[42rem]">{description}</Text>}
      <div className="folio-question-list__items">
        {items.map((item) => <article key={item.id} className="folio-question-list__item"><Heading level={3}>{item.question}</Heading><Text className="m-0">{item.answer}</Text></article>)}
      </div>
    </section>
  )
}

export interface LocationFigureProps extends HTMLAttributes<HTMLElement> {
  label: string
  coordinates: string
  image?: ReactNode
  credit?: ReactNode
}

/** Static map presentation; provider URLs, credentials and theme selection stay in the host. */
export function LocationFigure({ label, coordinates, image, credit, className, ...rest }: LocationFigureProps) {
  return (
    <figure aria-label={label} className={cn('folio-location-figure', className)} {...rest}>
      <div className="folio-location-figure__map">
        {image ?? <span className="folio-location-figure__crosshair" aria-hidden />}
        <span className="folio-location-figure__marker" aria-hidden />
      </div>
      <figcaption className="folio-location-figure__caption"><Text as="span" size="xs" tone="strong">{label}</Text><Text as="span" size="xs" tone="muted">{coordinates}</Text>{credit && <Text as="span" size="xs" tone="muted" className="basis-full">{credit}</Text>}</figcaption>
    </figure>
  )
}
