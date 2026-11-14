'use client'

import { ArrowLeftRight } from '../../icons'
import { useId, useRef, useState, type InputHTMLAttributes, type PointerEvent, type Ref } from 'react'
import { cn } from '../../lib/cn'
import { CONTROL_BASE, CONTROL_BORDER, isInvalid } from '../../lib/control'
import { clampToRange, parseNumber, snapToStep } from '../../lib/numeric'

/**
 * Pixels of travel per step while scrubbing.
 *
 * Four is the number a pointer reads as "one notch". At one or two the value
 * runs away from the hand; past about eight the gesture stops feeling like it
 * is driving anything and a reader goes back to typing.
 */
const PX_PER_STEP = 4

/** How much Shift multiplies a scrub by. Ten, as in every drawing tool. */
const COARSE = 10

export interface NumberFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'min' | 'max' | 'step' | 'type'> {
  value?: number
  defaultValue?: number
  /** Fires with the parsed number. Raw `onChange` still fires with the event. */
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  /** The increment for the arrows and for one notch of a scrub. */
  step?: number
  /**
   * A unit drawn inside the end of the field — `%`, `px`, `ms`.
   *
   * The field reserves a fixed slot for it, so keep it to about four
   * characters; a longer one runs under a long number. It is announced through
   * `aria-describedby` as well as drawn, because a unit nobody hears turns
   * "300" into a number with no dimension.
   */
  unit?: string
  /**
   * A grip at the start of the field that changes the value as it is dragged.
   *
   * On by default, and the reason to reach for this over `<Input type="number">`:
   * a value that is being TUNED — a duration, a weight, an offset — is found by
   * sweeping through neighbouring values, not by typing candidates one at a
   * time. Shift multiplies the travel by ten.
   *
   * Pointer only, and `aria-hidden` for that reason: the same journey on a
   * keyboard is the arrow keys on the field itself, which the platform already
   * provides. Turn it off where the number is a quantity rather than a setting
   * — a line item's quantity is chosen, not swept to.
   */
  scrub?: boolean
  /** Paints the resting border with `--danger` and reflects `aria-invalid`. */
  invalid?: boolean
  ref?: Ref<HTMLInputElement>
}

/**
 * A number, typed or swept to.
 *
 * `Input` with `type="number"` is a box that happens to reject letters. This is
 * the control for a number that has a RANGE and a sensible increment: the
 * arrows step it, the grip sweeps it, and `min`, `max` and `step` are honoured
 * on the way out rather than merely announced.
 *
 * Reach for `Slider` instead when the position along the range is the
 * information — a volume, a confidence, anything a reader judges by where the
 * thumb sits. Reach for this when the digits are. A slider that also has to be
 * exact is a `Slider` with `editable`, not one of these beside it.
 *
 * **Clamping happens when the field is left, not while it is being typed.** A
 * minimum of 10 would otherwise make 50 unreachable: the `5` is clamped up to
 * 10 before the `0` arrives. So `onValueChange` can report a number outside the
 * range mid-keystroke, and the value that settles is always inside it.
 *
 * The native spinner buttons are hidden — they are three different controls in
 * three browsers, and none of them is this system's. The grip replaces them for
 * a pointer; the arrow keys were always the keyboard's answer.
 *
 * @example
 * <Field label="Line height"><NumberField defaultValue={1.5} min={1} max={3} step={0.1} /></Field>
 * @example
 * <Field label="Timeout"><NumberField defaultValue={30} min={0} max={600} unit="s" /></Field>
 */
export function NumberField({
  value,
  defaultValue,
  onValueChange,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  unit,
  scrub = true,
  invalid,
  disabled,
  className,
  ref,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  ...rest
}: NumberFieldProps) {
  const bad = isInvalid(invalid, ariaInvalid)
  const unitId = useId()

  const [uncontrolled, setUncontrolled] = useState<number>(
    defaultValue ?? (Number.isFinite(min) ? min : 0),
  )
  const current = value ?? uncontrolled

  // Non-null only while the box is being typed into. The field shows the draft
  // verbatim then, so a half-typed "1." or "-" survives to the next keystroke
  // instead of being rewritten into a number the moment it parses.
  //
  // Mirrored into a ref because Escape has to clear it and then blur the field
  // in the SAME event: `setDraft(null)` has not been applied by the time the
  // blur handler runs, so a handler reading the state variable would still see
  // the abandoned text and commit it.
  const [draft, setDraft] = useState<string | null>(null)
  const draftRef = useRef<string | null>(null)
  const setDraftText = (text: string | null) => {
    draftRef.current = text
    setDraft(text)
  }

  const emit = (next: number) => {
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  /** Reconciles a number with the range and the step, then commits it. */
  const settle = (next: number) => emit(clampToRange(snapToStep(next, step, Number.isFinite(min) ? min : 0), min, max))

  // What the value was when the box gained focus, so Escape has something to
  // go back to: the raw emits above have already moved it by then.
  const entry = useRef(current)

  const drag = useRef<{ pointerId: number; startX: number; startValue: number; sign: 1 | -1 } | null>(null)

  const startScrub = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.button !== 0 || disabled) return
    // Otherwise the gesture selects the text of the field it is dragging over.
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startValue: current,
      // A scrub is spatial, so it follows the reading direction the way the
      // slider's own track does: in an RTL page, more is to the left.
      sign: getComputedStyle(event.currentTarget).direction === 'rtl' ? -1 : 1,
    }
  }

  const moveScrub = (event: PointerEvent<HTMLSpanElement>) => {
    const state = drag.current
    if (!state || state.pointerId !== event.pointerId) return
    const notches = Math.round((event.clientX - state.startX) / PX_PER_STEP) * state.sign
    settle(state.startValue + notches * step * (event.shiftKey ? COARSE : 1))
  }

  const endScrub = (event: PointerEvent<HTMLSpanElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    drag.current = null
  }

  return (
    <div className={cn('relative w-full', disabled && 'opacity-(--disabled-opacity)', className)}>
      <input
        ref={ref}
        type="number"
        inputMode="decimal"
        disabled={disabled}
        value={draft ?? String(current)}
        min={Number.isFinite(min) ? min : undefined}
        max={Number.isFinite(max) ? max : undefined}
        step={step}
        aria-describedby={[describedBy, unit ? unitId : null].filter(Boolean).join(' ') || undefined}
        aria-invalid={ariaInvalid ?? (invalid ? true : undefined)}
        onFocus={(event) => {
          entry.current = current
          onFocus?.(event)
        }}
        onChange={(event) => {
          setDraftText(event.target.value)
          // The raw number, unclamped — see the note on the component.
          const parsed = parseNumber(event.target.value)
          if (parsed !== null) emit(parsed)
          onChange?.(event)
        }}
        onBlur={(event) => {
          const text = draftRef.current
          const parsed = text === null ? null : parseNumber(text)
          if (parsed !== null) settle(parsed)
          setDraftText(null)
          onBlur?.(event)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            const text = draftRef.current
            const parsed = text === null ? null : parseNumber(text)
            if (parsed !== null) settle(parsed)
            setDraftText(null)
          }
          if (event.key === 'Escape') {
            emit(entry.current)
            setDraftText(null)
            event.currentTarget.blur()
          }
          onKeyDown?.(event)
        }}
        className={cn(
          CONTROL_BASE,
          bad ? CONTROL_BORDER.invalid : CONTROL_BORDER.resting,
          'tabular-nums',
          // Full literal strings: Tailwind only emits what it can read here.
          scrub && 'ps-9',
          unit && 'pe-12',
          // Three browsers, three spinners, none of them this system's.
          '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
        )}
        {...rest}
      />
      {scrub && (
        <span
          // Not a button: it commits nothing, has no keyboard journey of its
          // own, and announcing it would give a reader a control that does
          // nothing when they press it. The arrow keys on the field are the
          // keyboard's path to the same values.
          aria-hidden="true"
          onPointerDown={startScrub}
          onPointerMove={moveScrub}
          onPointerUp={endScrub}
          onPointerCancel={endScrub}
          className={cn(
            'absolute inset-y-0 start-0 flex touch-none select-none items-center ps-2.5 text-(--ink-3-aa) transition-colors duration-(--duration-fast)',
            disabled ? 'pointer-events-none' : 'cursor-ew-resize hover:text-(--ink)',
          )}
        >
          <ArrowLeftRight className="size-4" aria-hidden />
        </span>
      )}
      {unit && (
        <span
          id={unitId}
          className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 text-sm text-(--ink-3-aa)"
        >
          {unit}
        </span>
      )}
    </div>
  )
}

export default NumberField
