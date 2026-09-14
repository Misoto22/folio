'use client'

import { useRef, useState } from 'react'
import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, PointerEvent, ReactElement, ReactNode, Ref } from 'react'
import { RiArrowRightLine, RiArrowRightUpLine, RiArrowDownSLine, RiArrowRightSLine, RiRestartLine, RiSparklingLine, RiCloseLine, RiChat3Line } from '@remixicon/react'
import { cn } from '../../lib/cn'
import { replaceSlotContent, resolveSlotElement } from '../../lib/slot-content'
import { Article } from '../../components/Article/Article'
import { Button } from '../../components/Button/Button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/Collapsible/Collapsible'
import { DescriptionList } from '../../components/DescriptionList/DescriptionList'
import type { DescriptionListItem } from '../../components/DescriptionList/DescriptionList'
import { Field } from '../../components/Field/Field'
import { Heading } from '../../components/Heading/Heading'
import { Input } from '../../components/Input/Input'
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
    <ul>{items.map((item) => <li key={item.id} data-wide-only={item.wideOnly || undefined}>
      <Button variant="ghost" className="folio-conversation-suggestions__action" disabled={item.disabled} onClick={item.onSelect}>
        <span>{item.label}</span><RiArrowRightLine size={16} aria-hidden />
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
          const Icon = control.kind === 'reset' ? RiRestartLine : control.kind === 'expand' ? RiArrowDownSLine : RiArrowRightSLine
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

export interface QuestionComposerProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  id: string
  label: string
  hideLabel?: boolean
  value: string
  onValueChange: (value: string) => void
  onSubmit: () => void
  inputRef?: Ref<HTMLInputElement>
  placeholder?: string
  maxLength?: number
  disabled?: boolean
  submitDisabled?: boolean
  pending?: boolean
  submitLabel: string
  hint?: ReactNode
  hideHint?: boolean
  counter?: ReactNode
  actions?: ReactNode
  compact?: boolean
}

/** A controlled, labelled composer. Request limits and sending remain host concerns. */
export function QuestionComposer({ id, label, hideLabel, value, onValueChange, onSubmit, inputRef, placeholder, maxLength, disabled, submitDisabled, pending, submitLabel, hint, hideHint, counter, actions, compact, className, ...rest }: QuestionComposerProps) {
  return <form autoComplete="off" className={cn('folio-question-composer', className)} data-compact={compact || undefined} onSubmit={(event) => { event.preventDefault(); onSubmit() }} {...rest}>
    <div className="folio-question-composer__row">
      <Field htmlFor={id} label={<span className={hideLabel ? 'sr-only' : undefined}>{label}</span>} className="folio-question-composer__field">
        <Input ref={inputRef} id={id} name="question" value={value} onChange={(event) => onValueChange(event.target.value)} placeholder={placeholder} maxLength={maxLength} disabled={disabled} />
      </Field>
      <Button type="submit" loading={pending} disabled={submitDisabled} keycap={compact ? undefined : '↵'}>{submitLabel}</Button>
    </div>
    {(hint || counter || actions) && <div className="folio-question-composer__footer">
      {hint && <Text size="xs" tone="muted" className={hideHint ? 'sr-only' : undefined}>{hint}</Text>}
      {counter != null && <Text as="span" size="xs" tone="muted" className="folio-question-composer__counter">{counter}</Text>}
      {actions}
    </div>}
  </form>
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
        <CollapsibleTrigger asChild><Button variant="ghost" className="folio-conversation-turn__toggle" aria-controls={bodyId}><span>{title}</span><RiArrowRightSLine size={16} aria-hidden /></Button></CollapsibleTrigger>
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

export interface ConversationAnswerProps extends HTMLAttributes<HTMLDivElement> { question: ReactNode; questionLabel: string; quote?: ReactNode }

export function ConversationAnswer({ question, questionLabel, quote, children, className, ...rest }: ConversationAnswerProps) {
  return <div className={cn('folio-conversation-answer', className)} {...rest}>
    {quote}<Text size="xs" tone="muted">{questionLabel}</Text><Text tone="strong" size="lead" className="folio-conversation-answer__question">{question}</Text>{children}
  </div>
}

/** Trusted React nodes from the host's sanitized answer parser, never raw model HTML. */
export function ConversationProse({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <Article as="div" className={cn('folio-conversation-prose', className)} {...rest} />
}

/** Model-generated headings are prose labels, so they do not alter the page outline. */
export function ConversationAnswerHeading({ lead, className, ...rest }: HTMLAttributes<HTMLParagraphElement> & { lead?: boolean }) {
  return <p className={cn('folio-conversation-prose__heading', className)} data-lead={lead || undefined} {...rest} />
}

export function StreamingCaret() { return <span aria-hidden="true" className="folio-conversation-caret" /> }

export interface ConversationSource {
  id: string
  index: string
  title: ReactNode
  detail?: ReactNode
  kind: ReactNode
  highlighted?: boolean
  link: ReactElement<{ children?: ReactNode }>
}

export interface ConversationSourcesProps extends HTMLAttributes<HTMLDivElement> { label: string; count: ReactNode; items: ConversationSource[] }

export function ConversationSources({ label, count, items, className, ...rest }: ConversationSourcesProps) {
  if (items.length === 0) return null
  return <div className={cn('folio-conversation-sources', className)} {...rest}>
    <div className="folio-conversation-sources__header"><Text size="xs" tone="muted">{label}</Text><Text size="xs" tone="muted">{count}</Text></div>
    <ul>{items.map((item) => <li key={item.id}><Button asChild variant="ghost" className="folio-conversation-sources__link" data-highlighted={item.highlighted || undefined}>
      {replaceSlotContent(item.link, <><Text as="span" size="xs" tone="muted" aria-hidden>{item.index}</Text><span><Text as="span" size="sm" tone="strong">{item.title}</Text>{item.detail && <Text as="span" size="xs" tone="muted">{item.detail}</Text>}</span><Text as="span" size="xs" tone="muted">{item.kind}</Text></>)}
    </Button></li>)}</ul>
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
      <Button variant="ghost" className="folio-action-proposal__action" aria-label={approveLabel} onClick={onApprove} {...approvalAttributes}><span>{destination}</span><span>{detail && <Text as="span" size="xs" tone="muted" className="folio-action-proposal__detail">{detail}</Text>}<RiArrowRightLine size={16} aria-hidden /></span></Button>
      <Button variant="ghost" className="folio-action-proposal__action" onClick={onDismiss}>{dismissLabel}<RiCloseLine size={16} aria-hidden /></Button>
    </div>
  </div>
}

export interface ConversationLauncherProps extends ButtonHTMLAttributes<HTMLButtonElement> { visible: boolean; buttonRef?: Ref<HTMLButtonElement> }

export function ConversationLauncher({ visible, buttonRef, className, children, ...rest }: ConversationLauncherProps) {
  return <Button asChild variant="secondary" className={cn('folio-conversation-launcher', className)}><button ref={buttonRef} inert={!visible} data-revealed={visible} {...rest}><RiChat3Line size={18} aria-hidden />{children}</button></Button>
}

export type ConversationDockCorner = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'

export interface ConversationDockProps extends HTMLAttributes<HTMLElement> {
  label: string
  open: boolean
  card: boolean
  corner: ConversationDockCorner
  dragging?: boolean
  moving?: boolean
  panelRef?: Ref<HTMLElement>
  logRef?: Ref<HTMLDivElement>
  roomLink: ReactElement
  closeLabel: string
  onClose: () => void
  onHeaderPointerDown?: (event: PointerEvent<HTMLElement>) => void
  handles?: ReactNode
  proposal?: ReactNode
  notice?: ReactNode
  composer: ReactNode
}

/** The host supplies placement, dismissal and stream state; the dock draws them. */
export function ConversationDock({ label, open, card, corner, dragging, moving, panelRef, logRef, roomLink, closeLabel, onClose, onHeaderPointerDown, handles, proposal, notice, composer, children, className, ...rest }: ConversationDockProps) {
  return <>
    {open && !card && <div className="folio-conversation-dock__scrim" aria-hidden onClick={onClose} />}
    <aside ref={panelRef} aria-label={label} inert={!open} data-open={open} data-card={card} data-corner={corner} data-dragging={dragging || undefined} data-moving={moving || undefined} className={cn('folio-conversation-dock', className)} {...rest}>
      {handles}
      <header onPointerDown={onHeaderPointerDown} className="folio-conversation-dock__header">
        <Text as="span" size="xs" tone="muted"><RiSparklingLine size={14} aria-hidden />{label}</Text>
        <div><Button asChild variant="ghost">{roomLink}</Button><Button variant="ghost" iconOnly aria-label={closeLabel} onClick={onClose}><RiArrowDownSLine size={16} aria-hidden /></Button></div>
      </header>
      <div ref={logRef} className="folio-conversation-dock__log">{children}</div>
      {proposal && <div className="folio-conversation-dock__proposal">{proposal}</div>}
      {notice && <Text role="status" size="xs" className="folio-conversation-dock__notice">{notice}</Text>}
      <div className="folio-conversation-dock__composer">{composer}</div>
    </aside>
  </>
}

export interface ConversationDockWelcomeProps extends HTMLAttributes<HTMLDivElement> { lead: ReactNode; suggestionsLabel: string; suggestions: ConversationSuggestion[] }

export function ConversationDockWelcome({ lead, suggestionsLabel, suggestions, className, ...rest }: ConversationDockWelcomeProps) {
  return <div className={cn('folio-conversation-dock-welcome', className)} {...rest}><Text size="lead" tone="strong">{lead}</Text><ConversationSuggestions label={suggestionsLabel} items={suggestions} /></div>
}

export interface ConversationResizeHandleProps {
  axis: 'size-vertical' | 'size-horizontal'
  side: 'top' | 'bottom' | 'left' | 'right'
  label: string
  dragging: boolean
  onStart: (axis: 'size-vertical' | 'size-horizontal', event: PointerEvent<HTMLElement>) => void
  onNudge: (axis: 'size-vertical' | 'size-horizontal', delta: number) => void
}

/** Keyboard equivalents for the host's pointer resize controller. */
export function ConversationResizeHandle({ axis, side, label, dragging, onStart, onNudge }: ConversationResizeHandleProps) {
  const growKey = { top: 'ArrowUp', bottom: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' }[side]
  const shrinkKey = { top: 'ArrowDown', bottom: 'ArrowUp', left: 'ArrowRight', right: 'ArrowLeft' }[side]
  return <div role="separator" aria-orientation={axis === 'size-vertical' ? 'horizontal' : 'vertical'} aria-label={label} tabIndex={0} data-side={side} data-dragging={dragging || undefined} className="folio-conversation-resize" onPointerDown={(event) => onStart(axis, event)} onKeyDown={(event) => {
    if (event.key === growKey) onNudge(axis, 32)
    else if (event.key === shrinkKey) onNudge(axis, -32)
    else return
    event.preventDefault()
  }} />
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
  return <Button asChild variant="ghost" className="mt-5">{replaceSlotContent(link, <>{link.props.children}<RiArrowRightUpLine size={14} aria-hidden /></>)}</Button>
}
