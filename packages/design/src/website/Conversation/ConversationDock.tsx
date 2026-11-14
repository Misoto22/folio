'use client'

import { useId, useLayoutEffect, useRef } from 'react'
import type { CSSProperties, HTMLAttributes, PointerEvent, ReactElement, ReactNode, Ref, RefObject } from 'react'
import { cn } from '../../lib/cn'
import { Button } from '../../components/Button/Button'
import { Text } from '../../components/Text/Text'
import { Asterisk, ChevronDown } from '../../icons'
import { ConversationSuggestions } from './Conversation'
import type { ConversationSuggestion } from './Conversation'

export type ConversationDockCorner = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'

/** The closed dock: the pill in the corner that the panel grows out of. */
export interface ConversationDockLauncher {
  /** The pill's visible word, such as "Ask". */
  label: ReactNode
  /** The pill's accessible name, which can say more than its one word. */
  accessibleLabel: string
  /** Revealed beside the label while a pointer rests on the pill — the question the field will ask. */
  placeholder?: ReactNode
  /** Whether the closed pill shows. The host decides — after some scroll on a phone, say. Ignored while open. */
  visible: boolean
  onOpen: () => void
  buttonRef?: Ref<HTMLButtonElement>
  /** Host attributes for the pill, such as analytics hooks. */
  attributes?: Record<`data-${string}`, string>
}

export interface ConversationDockProps extends HTMLAttributes<HTMLElement> {
  /** The panel's name, set as its title and its accessible label. */
  label: string
  /** A quiet note after the title, such as where the answers come from. */
  subtitle?: ReactNode
  open: boolean
  /** A card in a corner, or — false — a sheet along the bottom edge with a scrim. */
  card: boolean
  corner: ConversationDockCorner
  dragging?: boolean
  moving?: boolean
  /** The shell: the one element that is the pill closed and the panel open. */
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
  launcher: ConversationDockLauncher
  /** True once the conversation holds a turn; the closed pill carries a dot. */
  hasTurns?: boolean
  /** The open card's size in pixels. The sheet ignores it. */
  size?: { width: number; height: number }
  /** Pixels the on-screen keyboard covers; the open sheet rides above it. */
  keyboardInset?: number
}

/**
 * Measures the pill at rest and with its placeholder, onto the shell.
 *
 * The shell's width is what animates, and a width cannot ease to `auto`; the
 * two numbers are what it eases between. Measured, not written down, because
 * the label and the placeholder are the host's translated strings.
 */
function usePillWidths(shell: RefObject<HTMLElement | null>, pill: RefObject<HTMLButtonElement | null>, placeholder: RefObject<HTMLSpanElement | null>) {
  useLayoutEffect(() => {
    const shellNode = shell.current
    const pillNode = pill.current
    if (!shellNode || !pillNode) return
    const measure = () => {
      const frame = shellNode.offsetWidth - shellNode.clientWidth
      const full = pillNode.offsetWidth
      const hint = placeholder.current
      const extra = hint && hint.offsetWidth > 0 ? hint.offsetWidth + (Number.parseFloat(getComputedStyle(pillNode).columnGap) || 0) : 0
      shellNode.style.setProperty('--folio-dock-pill-w', `${full - extra + frame}px`)
      shellNode.style.setProperty('--folio-dock-pill-w-hover', `${full + frame}px`)
      shellNode.setAttribute('data-measured', '')
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(pillNode)
    return () => observer.disconnect()
  }, [shell, pill, placeholder])
}

function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === 'function') ref(node)
  else if (ref) (ref as { current: T | null }).current = node
}

/**
 * The assistant on every page: one shell that is the pill closed and the panel open.
 *
 * The launcher does not hand over to a panel that fades in above it — it
 * grows into it. Hover widens the pill to show the question it will ask; open
 * grows the shell's own box and corner while the panel inside it keeps its
 * final size, so nothing reflows as it grows, and the composer sits where the
 * pill was. On a phone the same shell opens into a sheet with a grabber and a
 * scrim. The host supplies placement, dismissal and stream state.
 */
export function ConversationDock({ label, subtitle, open, card, corner, dragging, moving, panelRef, logRef, roomLink, closeLabel, onClose, onHeaderPointerDown, handles, proposal, notice, composer, launcher, hasTurns, size, keyboardInset, children, className, style, ...rest }: ConversationDockProps) {
  const panelId = useId()
  const shell = useRef<HTMLElement | null>(null)
  const pill = useRef<HTMLButtonElement | null>(null)
  const placeholder = useRef<HTMLSpanElement | null>(null)
  usePillWidths(shell, pill, placeholder)
  const shellStyle = {
    ...(size ? { '--folio-dock-w': `${size.width}px`, '--folio-dock-h': `${size.height}px` } : null),
    ...(keyboardInset ? { '--folio-dock-keyboard': `${keyboardInset}px` } : null),
    ...style,
  } as CSSProperties
  return <>
    {!card && <div className="folio-conversation-dock__scrim" data-open={open} aria-hidden onClick={open ? onClose : undefined} />}
    <div
      ref={(node) => { shell.current = node; assignRef(panelRef, node) }}
      data-open={open} data-card={card} data-corner={corner} data-revealed={launcher.visible || open}
      data-has-turns={hasTurns || undefined} data-dragging={dragging || undefined} data-moving={moving || undefined}
      className={cn('folio-conversation-dock', className)} style={shellStyle} {...rest}
    >
      <button
        ref={(node) => { pill.current = node; assignRef(launcher.buttonRef, node) }}
        type="button" className="folio-conversation-dock__pill" aria-label={launcher.accessibleLabel}
        aria-expanded={open} aria-controls={panelId} inert={open || !launcher.visible} onClick={launcher.onOpen} {...launcher.attributes}
      >
        <Asterisk size={16} strokeWidth={2} aria-hidden className="folio-conversation-dock__mark" />
        <span>{launcher.label}</span>
        {hasTurns && <span aria-hidden className="folio-conversation-dock__dot" />}
        {launcher.placeholder && <span ref={placeholder} aria-hidden className="folio-conversation-dock__placeholder">{launcher.placeholder}</span>}
      </button>
      <aside id={panelId} aria-label={label} inert={!open} className="folio-conversation-dock__panel">
        {!card && <span aria-hidden className="folio-conversation-dock__grab" />}
        {handles}
        <header onPointerDown={onHeaderPointerDown} className="folio-conversation-dock__header">
          <Text as="span" size="xs" tone="muted"><b>{label}</b>{subtitle}</Text>
          <div><Button asChild variant="ghost">{roomLink}</Button><Button variant="ghost" iconOnly aria-label={closeLabel} onClick={onClose}><ChevronDown size={18} aria-hidden /></Button></div>
        </header>
        <div ref={logRef} className="folio-conversation-dock__log">{children}</div>
        {proposal && <div className="folio-conversation-dock__proposal">{proposal}</div>}
        {notice && <Text role="status" size="xs" className="folio-conversation-dock__notice">{notice}</Text>}
        <div className="folio-conversation-dock__composer">{composer}</div>
      </aside>
    </div>
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
