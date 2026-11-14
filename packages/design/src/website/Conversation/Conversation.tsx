'use client'

import { useRef, useState } from 'react'
import type { CSSProperties, HTMLAttributes, ReactElement, ReactNode, Ref } from 'react'
import { ArrowRight as ArrowRightIcon, ArrowUp, ArrowUpRight, ChevronDown, ChevronRight, RefreshCw, X } from '../../icons'
import { cn } from '../../lib/cn'
import { replaceSlotContent, resolveSlotElement } from '../../lib/slot-content'
import { Article } from '../../components/Article/Article'
import { Button } from '../../components/Button/Button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/Collapsible/Collapsible'
import { DescriptionList } from '../../components/DescriptionList/DescriptionList'
import type { DescriptionListItem } from '../../components/DescriptionList/DescriptionList'
import { Heading } from '../../components/Heading/Heading'
import { Text } from '../../components/Text/Text'

export interface ConversationLayoutProps extends HTMLAttributes<HTMLDivElement> {
  evidence: ReactNode
}

/** A reading-width conversation with a separate, sticky evidence rail. */
export function ConversationLayout({ evidence, children, className, ...rest }: ConversationLayoutProps) {
  return <div className={cn('folio-conversation-layout', className)} {...rest}>
    {children}<div className="folio-conversation-layout__evidence">{evidence}</div>
  </div>
}

export interface ConversationFactsProps extends HTMLAttributes<HTMLDListElement> { items: DescriptionListItem[] }

export function ConversationFacts({ items, className, ...rest }: ConversationFactsProps) {
  return <DescriptionList items={items} layout="stacked" divided={false} className={cn('folio-conversation-facts', className)} {...rest} />
}

export interface ConversationSuggestion {
  id: string
  label: string
  onSelect: () => void
  disabled?: boolean
  /** Compact docks may omit longer suggestions on small viewports. */
  wideOnly?: boolean
}

export interface ConversationSuggestionsProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  items: ConversationSuggestion[]
}

export function ConversationSuggestions({ label, items, className, ...rest }: ConversationSuggestionsProps) {
  return <div className={cn('folio-conversation-suggestions', className)} {...rest}>
    <Text size="xs" tone="muted">{label}</Text>
    <ul>{items.map((item, index) => <li key={item.id} data-wide-only={item.wideOnly || undefined} style={{ '--n': index } as CSSProperties}>
      <Button variant="ghost" className="folio-conversation-suggestions__action" disabled={item.disabled} onClick={item.onSelect}>
        <span>{item.label}</span><ArrowUpRight size={16} aria-hidden />
      </Button>
    </li>)}</ul>
  </div>
}

export interface ConversationControl {
  id: string
  label: string
  kind?: 'expand' | 'collapse' | 'reset'
  disabled?: boolean
  onSelect: () => void
}

export interface ConversationThreadProps extends HTMLAttributes<HTMLElement> {
  label: string
  intro?: { title: ReactNode; description: ReactNode; suggestionsLabel: string; suggestions: ConversationSuggestion[] }
  summary?: ReactNode
  controls?: ConversationControl[]
  composer: ReactNode
  proposal?: ReactNode
  hasTurns: boolean
}

/** Host owns turns and folding; this composition owns their hierarchy and controls. */
export function ConversationThread({ label, intro, summary, controls = [], composer, proposal, hasTurns, children, className, ...rest }: ConversationThreadProps) {
  return <section aria-label={label} className={cn('folio-conversation-thread', className)} {...rest}>
    {intro && <div className="folio-conversation-thread__intro">
      <Heading level={2}>{intro.title}</Heading><Text className="mt-5">{intro.description}</Text>
      <ConversationSuggestions label={intro.suggestionsLabel} items={intro.suggestions} />
    </div>}
    {hasTurns && <>
      <div className="folio-conversation-thread__controls">
        <Text size="xs" tone="muted">{summary}</Text>
        <div>{controls.map((control) => {
          const Icon = control.kind === 'reset' ? RefreshCw : control.kind === 'expand' ? ChevronDown : ChevronRight
          return <Button key={control.id} variant="ghost" disabled={control.disabled} onClick={control.onSelect}><Icon size={14} aria-hidden />{control.label}</Button>
        })}</div>
      </div>
      <ConversationLog>{children}</ConversationLog>
    </>}
    <div className="folio-conversation-thread__composer" data-sticky={hasTurns || undefined}>
      {proposal && <div className="folio-conversation-thread__proposal">{proposal}</div>}{composer}
    </div>
  </section>
}

export interface ConversationLogProps extends HTMLAttributes<HTMLDivElement> { compact?: boolean }

export function ConversationLog({ compact, className, ...rest }: ConversationLogProps) {
  return <div role="log" aria-live="polite" className={cn('folio-conversation-log', className)} data-compact={compact || undefined} {...rest} />
}

export interface ConversationTurnProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode
  metadata?: ReactNode
  expanded: boolean
  onToggle: () => void
  bodyId: string
  preview?: ReactNode
}

export function ConversationTurn({ title, metadata, expanded, onToggle, bodyId, preview, children, className, ...rest }: ConversationTurnProps) {
  return <article className={cn('folio-conversation-turn', className)} {...rest}>
    {metadata}
    <Collapsible open={expanded} onOpenChange={onToggle}>
      <Heading level={3} size="sub">
        <CollapsibleTrigger asChild><Button variant="ghost" className="folio-conversation-turn__toggle" aria-controls={bodyId}><span>{title}</span><ChevronRight size={16} aria-hidden /></Button></CollapsibleTrigger>
      </Heading>
      {!expanded && <Text size="sm" tone="muted" className="folio-conversation-turn__preview">{preview}</Text>}
      <CollapsibleContent id={bodyId}><div className="folio-conversation-turn__body">{children}</div></CollapsibleContent>
    </Collapsible>
  </article>
}

export interface ConversationQuoteProps extends HTMLAttributes<HTMLElement> { label: string; compact?: boolean }

export function ConversationQuote({ label, compact, children, className, ...rest }: ConversationQuoteProps) {
  return <figure className={cn('folio-conversation-quote', className)} data-compact={compact || undefined} {...rest}>
    <Text as="figcaption" size="xs" tone="muted">{label}</Text><blockquote>{children}</blockquote>
  </figure>
}

export interface ConversationAnswerProps extends HTMLAttributes<HTMLDivElement> {
  question: ReactNode
  /** Read before the question by assistive tech, such as "You asked". Not drawn: the question's size already says what it is. */
  questionLabel: string
  quote?: ReactNode
}

/** One question and its answer, set as a short passage under the question. */
export function ConversationAnswer({ question, questionLabel, quote, children, className, ...rest }: ConversationAnswerProps) {
  return <div className={cn('folio-conversation-answer', className)} {...rest}>
    {quote}<p className="folio-conversation-answer__question"><span className="sr-only">{questionLabel} </span>{question}</p>{children}
  </div>
}

/** Trusted React nodes from the host's sanitized answer parser, never raw model HTML. */
export function ConversationProse({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <Article as="div" className={cn('folio-conversation-prose', className)} {...rest} />
}

/**
 * Answer text that has just arrived, faded in once as it mounts.
 *
 * Wrap each newly streamed run of a few words, keyed by where it starts, so
 * earlier text is never re-faded: the answer reads as typesetting rather than
 * typing, with nothing blinking at its end. Reduced motion shows it at once.
 */
export function StreamingWords({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('folio-conversation-words', className)} {...rest} />
}

/** Model-generated headings are prose labels, so they do not alter the page outline. */
export function ConversationAnswerHeading({ lead, className, ...rest }: HTMLAttributes<HTMLParagraphElement> & { lead?: boolean }) {
  return <p className={cn('folio-conversation-prose__heading', className)} data-lead={lead || undefined} {...rest} />
}

export interface ConversationSource {
  id: string
  index: string
  title: ReactNode
  detail?: ReactNode
  kind: ReactNode
  highlighted?: boolean
  /** Whether the answer cited this passage. Once `phase` is `cited`, rows marked `false` fold away. */
  cited?: boolean
  link: ReactElement<{ children?: ReactNode }>
}

export interface ConversationSourcesProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  count: ReactNode
  items: ConversationSource[]
  /**
   * `retrieved` while the answer is written: every passage retrieval returned,
   * shown the moment it lands. `cited` once it is done: only the ones the answer
   * cites stay. Defaults to `cited`, which with no row marked uncited shows all.
   */
  phase?: 'retrieved' | 'cited'
}

/**
 * The answer's footnotes.
 *
 * They land when retrieval lands, before the first word, one stagger step
 * apart — the proof the answer is working from the site arrives first, and the
 * answer is then written above it. At the end the passages it did not cite
 * fold away and the count beside the label is the host's to swap.
 */
export function ConversationSources({ label, count, items, phase = 'cited', className, ...rest }: ConversationSourcesProps) {
  if (items.length === 0) return null
  return <div className={cn('folio-conversation-sources', className)} data-phase={phase} {...rest}><div className="folio-conversation-sources__body">
    <div className="folio-conversation-sources__header"><Text size="xs" tone="muted">{label}</Text><Text size="xs" tone="muted">{count}</Text></div>
    <ul>{items.map((item, index) => {
      const folded = phase === 'cited' && item.cited === false
      return <li key={item.id} data-cited={folded ? 'false' : undefined} inert={folded} aria-hidden={folded || undefined} style={{ '--n': index } as CSSProperties}><Button asChild variant="ghost" className="folio-conversation-sources__link" data-highlighted={item.highlighted || undefined}>
      {replaceSlotContent(item.link, <><Text as="span" size="xs" tone="muted" aria-hidden>{item.index}</Text><span><Text as="span" size="sm" tone="strong">{item.title}</Text>{item.detail && <Text as="span" size="xs" tone="muted">{item.detail}</Text>}</span><Text as="span" size="xs" tone="muted">{item.kind}</Text></>)}
      </Button></li>
    })}</ul>
  </div></div>
}

export interface ConversationNoteProps extends HTMLAttributes<HTMLDivElement> {
  /** `danger` for a failure, `warn` for a refusal that will pass, such as a rate limit. */
  tone: 'danger' | 'warn'
  /** Names the retry action. With `onRetry`, the note carries a button that asks again. */
  retryLabel?: string
  onRetry?: () => void
}

/**
 * Why there is no answer, as a sentence on the page rather than an alert box.
 *
 * A hairline in the tone's colour marks it; the page around it is ruled paper,
 * and a filled box would be the only one on it. A rate limit says how long to
 * wait in the composer's own countdown, not here.
 */
export function ConversationNote({ tone, retryLabel, onRetry, children, className, ...rest }: ConversationNoteProps) {
  return <div role="alert" className={cn('folio-conversation-note', className)} data-tone={tone} {...rest}>
    <Text size="sm">{children}</Text>
    {onRetry && retryLabel && <Button variant="secondary" size="sm" onClick={onRetry}><ArrowUp size={14} aria-hidden />{retryLabel}</Button>}
  </div>
}

export interface ActionProposalProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  destination: ReactNode
  detail?: ReactNode
  approveLabel: string
  dismissLabel: string
  onApprove: () => void
  onDismiss: () => void
  approvalAttributes?: Record<`data-${string}`, string>
}

export function ActionProposal({ label, destination, detail, approveLabel, dismissLabel, onApprove, onDismiss, approvalAttributes, className, ...rest }: ActionProposalProps) {
  return <div role="group" aria-label={label} className={cn('folio-action-proposal', className)} {...rest}>
    <Text size="xs" tone="muted">{label}</Text>
    <div className="folio-action-proposal__actions">
      <Button variant="ghost" className="folio-action-proposal__action" aria-label={approveLabel} onClick={onApprove} {...approvalAttributes}><span>{destination}</span><span>{detail && <Text as="span" size="xs" tone="muted" className="folio-action-proposal__detail">{detail}</Text>}<ArrowRightIcon size={16} aria-hidden /></span></Button>
      <Button variant="ghost" className="folio-action-proposal__action" onClick={onDismiss}>{dismissLabel}<X size={16} aria-hidden /></Button>
    </div>
  </div>
}

export interface SelectionToolbarAction { id: string; label: string; disabled?: boolean; onSelect: () => void }

export interface SelectionToolbarProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  actions: SelectionToolbarAction[]
  floating: boolean
  toolbarRef?: Ref<HTMLDivElement>
  style?: CSSProperties
}

/** Selection actions with a real toolbar's single tab stop and arrow navigation. */
export function SelectionToolbar({ label, actions, floating, toolbarRef, className, ...rest }: SelectionToolbarProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const controls = useRef<Array<HTMLButtonElement | null>>([])
  const enabled = actions.map((action, index) => action.disabled ? -1 : index).filter((index) => index !== -1)
  const selected = actions.findIndex((action) => action.id === activeId && !action.disabled)
  const activeIndex = selected >= 0 ? selected : (enabled[0] ?? -1)
  return <div ref={toolbarRef} role="toolbar" aria-label={label} data-folio-animated data-floating={floating} className={cn('folio-selection-toolbar', className)} {...rest} onKeyDown={(event) => {
    rest.onKeyDown?.(event)
    if (event.defaultPrevented || enabled.length === 0) return
    const current = controls.current.findIndex((control) => control === document.activeElement)
    const position = enabled.indexOf(current)
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl'
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight'
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft'
    let next: number | undefined
    if (event.key === 'Home') next = enabled[0]
    else if (event.key === 'End') next = enabled[enabled.length - 1]
    else if (event.key === forward) next = enabled[(position + 1) % enabled.length]
    else if (event.key === backward) next = enabled[(position - 1 + enabled.length) % enabled.length]
    else return
    if (next === undefined) return
    const nextAction = actions[next]
    if (!nextAction) return
    event.preventDefault()
    setActiveId(nextAction.id)
    controls.current[next]?.focus()
  }}>
    {actions.map((action, index) => <Button asChild key={action.id} variant="secondary"><button ref={(node) => { controls.current[index] = node }} type="button" tabIndex={index === activeIndex ? 0 : -1} disabled={action.disabled} onFocus={() => setActiveId(action.id)} onClick={action.onSelect}>{action.label}</button></Button>)}
  </div>
}

/** A router link keeps its own destination and behavior inside a standard action. */
export function ConversationRoomLink({ children }: { children: ReactElement }) {
  const link = resolveSlotElement(children as ReactElement<{ children?: ReactNode }>)
  return <Button asChild variant="ghost" className="mt-5">{replaceSlotContent(link, <>{link.props.children}<ArrowUpRight size={14} aria-hidden /></>)}</Button>
}
