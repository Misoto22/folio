'use client'

import { useId, useState, type FormEventHandler, type HTMLAttributes, type ReactNode } from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { ArrowRight, CircleCheck, Lock, Plus } from '../../icons'
import { Button } from '../../components/Button/Button'
import { DescriptionList, type DescriptionListItem } from '../../components/DescriptionList/DescriptionList'
import { Field } from '../../components/Field/Field'
import { Heading } from '../../components/Heading/Heading'
import { Input } from '../../components/Input/Input'
import { StatusDot } from '../../components/StatusDot/StatusDot'
import { Text } from '../../components/Text/Text'
import { Textarea } from '../../components/Textarea/Textarea'
import { cn } from '../../lib/cn'

export interface CorrespondenceSectionProps extends HTMLAttributes<HTMLDivElement> {
  aside: ReactNode
  children: ReactNode
  /** The secondary column can precede or follow the main content. */
  asidePosition?: 'start' | 'end'
  /**
   * A picture of the place — usually a `LocationFigure` — set above the aside.
   *
   * With it the section becomes the contact layout: the main content takes
   * seven parts and the place and aside five, the side column stays in view
   * while the main column scrolls, and on a phone the picture comes first,
   * the main content second and the aside last.
   */
  media?: ReactNode
}

/** A correspondence page's primary content and supporting facts. */
export function CorrespondenceSection({ aside, children, asidePosition = 'start', media, className, ...rest }: CorrespondenceSectionProps) {
  if (media != null) {
    return (
      <div className={cn('folio-correspondence', className)} data-aside-position="end" data-media="" {...rest}>
        <div className="folio-correspondence__main">{children}</div>
        <div className="folio-correspondence__side">
          <div className="folio-correspondence__media">{media}</div>
          {aside}
        </div>
      </div>
    )
  }
  return (
    <div className={cn('folio-correspondence', className)} data-aside-position={asidePosition} {...rest}>
      {asidePosition === 'start' && aside}
      {children}
      {asidePosition === 'end' && aside}
    </div>
  )
}

export interface ContactStatusProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
}

/** Availability in one outlined pill beside a contact page's title, with a live dot. */
export function ContactStatus({ children, className, ...rest }: ContactStatusProps) {
  return <span className={cn('folio-contact-status', className)} {...rest}><StatusDot size="sm" />{children}</span>
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
  /**
   * The disclosure that reveals the optional subject. With it the subject is
   * folded away until asked for; without it the subject field is always shown.
   */
  addSubject?: string
}

/** One answer to "what's this about?", drawn as a tile. */
export interface ContactTopic {
  value: string
  label: string
  /** A glyph above the label, hidden from assistive tech. */
  icon?: ReactNode
}

export interface ContactFormViewProps {
  labels: ContactFormLabels
  values: ContactFormValues
  topics: ContactTopic[]
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
 * The topic as tiles on a grid, never a segmented strip.
 *
 * A strip is one object and cannot break across lines; tiles are five objects,
 * five across on a desk and three and two on a phone, so there is no width at
 * which the choice wraps by accident. It keeps the radio-group semantics and
 * the roving arrow keys of the strip it replaced.
 */
function TopicTiles({ labelId, topics, topic, onTopicChange }: { labelId: string; topics: ContactTopic[]; topic: string; onTopicChange: (value: string) => void }) {
  return (
    <ToggleGroupPrimitive.Root type="single" value={topic} onValueChange={(value) => { if (value) onTopicChange(value) }} aria-labelledby={labelId} className="folio-contact-topic" data-count={topics.length}>
      {topics.map((item) => (
        <ToggleGroupPrimitive.Item key={item.value} value={item.value} className="folio-contact-topic__tile">
          {item.icon && <span className="folio-contact-topic__icon" aria-hidden>{item.icon}</span>}
          <span>{item.label}</span>
        </ToggleGroupPrimitive.Item>
      ))}
    </ToggleGroupPrimitive.Root>
  )
}

/**
 * Controlled contact form. Validation, submission and delivery remain host responsibilities.
 *
 * A validation error is said under the field it is about, so the reader is told
 * which one and nothing above the form moves. A failed send is a hairline note
 * beside the send button, not a filled banner over the form. The send button
 * comes before the note, full width on a phone, so nothing shares its row and
 * the button is never after prose in the focus order.
 */
export function ContactFormView({ labels, values, topics, topic, onTopicChange, onFieldChange, onSubmit, limits, pending = false, error, fieldErrors = {}, success, idPrefix }: ContactFormViewProps) {
  const generatedId = useId()
  const prefix = idPrefix ?? generatedId
  const headingId = `${prefix}-intro`
  const topicId = `${prefix}-topic`
  const subjectPanelId = `${prefix}-subject-panel`
  const foldSubject = labels.addSubject != null
  const [subjectOpen, setSubjectOpen] = useState(false)
  // A subject the reader already typed, or one the host has an error for, is
  // never hidden behind the disclosure.
  const subjectShown = !foldSubject || subjectOpen || values.subject !== '' || fieldErrors.subject != null

  const subjectField = (
    <Field label={<>{labels.subject} <Text as="span" size="xs" tone="muted">({labels.optional})</Text></>} htmlFor={`${prefix}-subject`} error={fieldNote(fieldErrors.subject)}>
      <Input name="subject" value={values.subject} onChange={(event) => onFieldChange('subject', event.target.value)} placeholder={labels.subjectPlaceholder} maxLength={limits.subject} className="folio-contact-form__input" />
    </Field>
  )

  return (
    <section className="folio-contact-form" data-state={success ? 'sent' : undefined}>
      {!success && <Heading level={2} id={headingId} className="folio-contact-form__heading">{labels.heading}</Heading>}
      <div role="status" aria-live="polite" aria-atomic="true">
        {success && (
          <div className="folio-contact-form__sent">
            <CircleCheck size={34} aria-hidden />
            <p className="folio-contact-form__sent-title">{success.title}</p>
            <p className="folio-contact-form__sent-body">{success.description}</p>
          </div>
        )}
      </div>
      {!success && (
        <form onSubmit={onSubmit} noValidate aria-labelledby={headingId} className="folio-contact-form__fields">
          <div className="folio-contact-form__topic">
            <span id={topicId} className="folio-contact-form__label">{labels.topic}</span>
            <TopicTiles labelId={topicId} topics={topics} topic={topic} onTopicChange={onTopicChange} />
          </div>
          <div className="folio-contact-form__identity">
            <Field label={labels.name} required htmlFor={`${prefix}-name`} error={fieldNote(fieldErrors.name)}>
              <Input name="name" autoComplete="name" value={values.name} onChange={(event) => onFieldChange('name', event.target.value)} placeholder={labels.namePlaceholder} required maxLength={limits.name} className="folio-contact-form__input" />
            </Field>
            <Field label={labels.email} required htmlFor={`${prefix}-email`} error={fieldNote(fieldErrors.email)}>
              <Input name="email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={(event) => onFieldChange('email', event.target.value)} placeholder={labels.emailPlaceholder} required maxLength={limits.email} className="folio-contact-form__input" />
            </Field>
          </div>
          {!foldSubject && subjectField}
          <Field label={labels.message} required htmlFor={`${prefix}-message`} error={fieldNote(fieldErrors.message)}>
            <Textarea name="message" value={values.message} onChange={(event) => onFieldChange('message', event.target.value)} placeholder={labels.messagePlaceholder} required maxLength={limits.message} rows={6} />
          </Field>
          {foldSubject && (
            <div className="folio-contact-form__subject">
              {!(values.subject !== '' || fieldErrors.subject != null) && (
                <button type="button" className="folio-contact-form__more" aria-expanded={subjectShown} aria-controls={subjectPanelId} onClick={() => setSubjectOpen((open) => !open)}>
                  <Plus size={15} aria-hidden />{labels.addSubject}
                </button>
              )}
              <div id={subjectPanelId} className="folio-contact-form__fold" data-open={subjectShown || undefined} inert={!subjectShown}>
                <div>{subjectField}</div>
              </div>
            </div>
          )}
          {error && <p id={`${prefix}-status`} role="alert" className="folio-contact-form__note">{error}</p>}
          <div className="folio-contact-form__actions">
            <Button type="submit" loading={pending} className="folio-contact-form__submit">
              {pending ? labels.submitting : labels.submit}
              {!pending && <ArrowRight size={16} aria-hidden className="folio-contact-form__submit-arrow" />}
            </Button>
            <p className="folio-contact-form__privacy"><Lock size={14} aria-hidden /><span>{labels.note}</span></p>
          </div>
        </form>
      )}
    </section>
  )
}

/** One fact on a contact page: a glyph, the value, and either its name or one action at the end of the row. */
export interface ContactFactRow {
  id: string
  /** A glyph at the start of the row, hidden from assistive tech. */
  icon?: ReactNode
  value: ReactNode
  /** What the value is, quiet at the end of the row. */
  term?: ReactNode
  /** One control at the end of the row, such as a copy button. Takes the place of `term`. */
  action?: ReactNode
}

export interface ContactFactsProps {
  label: string
  /** Facts as a stacked definition list. */
  items?: DescriptionListItem[]
  /** Facts as icon rows: value first, the term quiet at the end. Drawn after `items`. */
  rows?: ContactFactRow[]
  links?: ReactNode
  linksLabel?: string
  /** `marks` lays the links out as round 44px icon buttons. */
  linksVariant?: 'text' | 'marks'
}

/** Contact facts, as a definition list or as icon rows, with optional navigation. */
export function ContactFacts({ label, items, rows, links, linksLabel, linksVariant = 'text' }: ContactFactsProps) {
  return (
    <aside aria-label={label} className="folio-contact-facts">
      {items && items.length > 0 && <DescriptionList items={items} layout="stacked" />}
      {rows && rows.length > 0 && (
        <ul className="folio-contact-facts__rows">
          {rows.map((row) => (
            <li key={row.id}>
              {row.icon && <span className="folio-contact-facts__icon" aria-hidden>{row.icon}</span>}
              <span className="folio-contact-facts__value">{row.value}</span>
              {row.action ? <span className="folio-contact-facts__action">{row.action}</span> : row.term != null && <span className="folio-contact-facts__term">{row.term}</span>}
            </li>
          ))}
        </ul>
      )}
      {links && <nav aria-label={linksLabel} className="folio-contact-facts__links" data-variant={linksVariant}>{links}</nav>}
    </aside>
  )
}

export interface QuestionListProps extends HTMLAttributes<HTMLElement> {
  title: string
  description?: string
  items: { id: string; question: string; answer: string }[]
  /**
   * Close the answers behind their questions. Each question becomes a button
   * with `aria-expanded`; every answer stays in the document, so structured
   * data describing them still describes content on the page.
   */
  disclosure?: boolean
}

function QuestionDisclosure({ id, question, answer }: { id: string; question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="folio-question-list__row" data-open={open || undefined}>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((value) => !value)}>
          <span>{question}</span>
          <Plus size={18} aria-hidden />
        </button>
      </h3>
      <div id={id} className="folio-question-list__answer" inert={!open}>
        <div><Text className="m-0">{answer}</Text></div>
      </div>
    </div>
  )
}

/** Questions and answers: all visible when the set is short, or closed behind their questions. */
export function QuestionList({ title, description, items, disclosure = false, className, ...rest }: QuestionListProps) {
  const id = useId()
  return (
    <section aria-labelledby={id} className={cn('folio-question-list', className)} data-disclosure={disclosure || undefined} {...rest}>
      <div className="folio-question-list__head">
        <Heading level={2} id={id}>{title}</Heading>
        {description && <Text className="folio-question-list__description">{description}</Text>}
      </div>
      <div className="folio-question-list__items">
        {disclosure
          ? items.map((item, index) => <QuestionDisclosure key={item.id} id={`${id}-answer-${index}`} question={item.question} answer={item.answer} />)
          : items.map((item) => <article key={item.id} className="folio-question-list__item"><Heading level={3}>{item.question}</Heading><Text className="m-0">{item.answer}</Text></article>)}
      </div>
    </section>
  )
}

export interface LocationFigureProps extends HTMLAttributes<HTMLElement> {
  label: string
  coordinates: string
  image?: ReactNode
  credit?: ReactNode
  /** Set into the map's lower corner — usually a `LocationClock`. */
  overlay?: ReactNode
  /** The map's aspect ratio as width over height. 16 / 10 by default. */
  ratio?: number
}

/** Static map presentation; provider URLs, credentials and theme selection stay in the host. */
export function LocationFigure({ label, coordinates, image, credit, overlay, ratio, className, style, ...rest }: LocationFigureProps) {
  return (
    <figure aria-label={label} className={cn('folio-location-figure', className)} style={ratio ? { ...style, ['--folio-location-ratio' as string]: String(ratio) } : style} {...rest}>
      <div className="folio-location-figure__map">
        {image ?? <span className="folio-location-figure__crosshair" aria-hidden />}
        <span className="folio-location-figure__marker" aria-hidden />
        {overlay && <div className="folio-location-figure__overlay">{overlay}</div>}
        {credit && <span className="folio-location-figure__credit">{credit}</span>}
      </div>
      <figcaption className="folio-location-figure__caption"><Text as="span" size="xs" tone="strong">{label}</Text><Text as="span" size="xs" tone="muted">{coordinates}</Text></figcaption>
    </figure>
  )
}

export interface LocationClockProps {
  /** The local time, already formatted by the host, e.g. "01:45". */
  time: string
  /** The machine-readable instant or time for `<time dateTime>`. */
  dateTime?: string
  /** Where and which zone, e.g. "Sydney · AEDT". */
  place: ReactNode
  /** A glyph before the time — the sun by day, the moon by night. */
  icon?: ReactNode
}

/** A live local time set into a map: a glyph, the time in tabular figures, and the place and zone. */
export function LocationClock({ time, dateTime, place, icon }: LocationClockProps) {
  return (
    <span className="folio-location-clock">
      {icon && <span className="folio-location-clock__icon" aria-hidden>{icon}</span>}
      <time dateTime={dateTime} suppressHydrationWarning>{time}</time>
      <span className="folio-location-clock__place">{place}</span>
    </span>
  )
}
