'use client'

import { useState } from 'react'
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '../../lib/cn'
import { Text } from '../../components/Text/Text'
import { ArrowUp, Square } from '../../icons'

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
  /** True while an answer streams. With `onStop`, the send button becomes Stop. */
  pending?: boolean
  /** The send button's accessible name; the button itself is an arrow. */
  submitLabel: string
  /** Cancels the answer in flight. Shown in the send button's place while `pending`. */
  onStop?: () => void
  /** The Stop button's accessible name. Required for Stop to appear. */
  stopLabel?: string
  /**
   * Whole seconds until another question is allowed, counted down by the host —
   * from a `Retry-After`, say. While above zero the field is disabled and the
   * send button carries the count inside a draining ring.
   */
  retryIn?: number
  hint?: ReactNode
  hideHint?: boolean
  counter?: ReactNode
  actions?: ReactNode
  /** The dock's size: a 48px field rather than the room's 52px. */
  compact?: boolean
}

/** The longest countdown seen since the wait began, so the ring drains from full. */
function useCountdownTotal(retryIn: number | undefined): number {
  const [total, setTotal] = useState(0)
  const seconds = retryIn ?? 0
  if (seconds <= 0 && total !== 0) setTotal(0)
  else if (seconds > total) setTotal(seconds)
  return Math.max(total, seconds)
}

/**
 * The question field: a capsule with the send control inside its end.
 *
 * It is the launcher pill opened — the same height and the same corner — so a
 * reader who pressed the pill finds the caret where the pill was. The control
 * is one button in three states: an arrow to send, a square to stop an answer
 * in flight, and a count inside a draining ring while a rate limit holds. Each
 * state swaps in place, so nothing beside it moves. Limits and sending stay
 * host concerns.
 */
export function QuestionComposer({ id, label, hideLabel, value, onValueChange, onSubmit, inputRef, placeholder, maxLength, disabled, submitDisabled, pending, submitLabel, onStop, stopLabel, retryIn, hint, hideHint, counter, actions, compact, className, ...rest }: QuestionComposerProps) {
  const waiting = (retryIn ?? 0) > 0
  const total = useCountdownTotal(retryIn)
  const stoppable = Boolean(pending && onStop && stopLabel) && !waiting
  const ring = { '--folio-composer-left': total > 0 ? (retryIn ?? 0) / total : 0 } as CSSProperties
  return <form autoComplete="off" className={cn('folio-question-composer', className)} data-compact={compact || undefined} onSubmit={(event) => { event.preventDefault(); if (!stoppable) onSubmit() }} {...rest}>
    <label htmlFor={id} className={cn('folio-question-composer__label', hideLabel && 'sr-only')}>{label}</label>
    <div className="folio-question-composer__field" data-disabled={disabled || waiting || undefined}>
      <input ref={inputRef} id={id} name="question" value={value} onChange={(event) => onValueChange(event.target.value)} placeholder={placeholder} maxLength={maxLength} disabled={disabled || waiting} />
      <button
        type={stoppable ? 'button' : 'submit'}
        className="folio-question-composer__send"
        aria-label={stoppable ? stopLabel : submitLabel}
        data-pending={stoppable || undefined}
        data-waiting={waiting || undefined}
        disabled={waiting || (!stoppable && Boolean(submitDisabled))}
        onClick={stoppable ? onStop : undefined}
        style={waiting ? ring : undefined}
      >
        <ArrowUp size={18} aria-hidden className="folio-question-composer__glyph" data-glyph="send" />
        <Square size={14} aria-hidden className="folio-question-composer__glyph" data-glyph="stop" />
        {waiting && <>
          <svg aria-hidden viewBox="0 0 36 36" className="folio-question-composer__ring"><circle cx="18" cy="18" r="15.915" /><circle cx="18" cy="18" r="15.915" pathLength={100} /></svg>
          <span aria-hidden className="folio-question-composer__count">{retryIn}</span>
        </>}
      </button>
    </div>
    {(hint || counter != null || actions) && <div className="folio-question-composer__footer">
      {hint && <Text size="xs" tone="muted" className={hideHint ? 'sr-only' : undefined}>{hint}</Text>}
      {counter != null && <Text as="span" size="xs" tone="muted" className="folio-question-composer__counter">{counter}</Text>}
      {actions}
    </div>}
  </form>
}
