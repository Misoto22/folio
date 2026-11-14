'use client'

import { Pause as PauseIcon, Play as PlayIcon, Square } from '../../icons'
import { useCallback, useEffect, useMemo, useRef, useState, type FC } from 'react'
import { cn } from '../../lib/cn'
import { Button } from '../../components/Button/Button'
import type { ChartConfig } from './chart'
import { defaultTick } from './format'
import {
  createSonification,
  hasAudioSupport,
  type SonifyOptions,
  type SonifyPoint,
  type SonifySeries,
  type SonifyState,
} from './sonify'

/**
 * The React surface over `sonify.ts` — a hook, a control, and the slot a chart
 * composes.
 *
 * Everything here obeys the one rule the engine is built around: **sound only
 * ever starts from an explicit user action.** There is no effect that plays, no
 * `autoPlay` prop, and no dependency change that can begin a run. That is not
 * the same conversation as `prefers-reduced-motion` — sound is not motion, and
 * reading a motion preference as "no audio either" would silence the readers
 * this feature exists for.
 */

/** A cell as speakable text. Speech has no use for an object. */
function categoryText(value: unknown): string {
  if (typeof value === 'number') return value.toLocaleString()
  if (typeof value === 'string' || typeof value === 'boolean') return String(value)
  return ''
}

/**
 * A chart's rows, flattened into what the engine plays.
 *
 * Anything that is not a finite number becomes a gap rather than a zero. A
 * missing month is not a month with no visitors, and sounding it as the bottom
 * of the range would invent a crash that never happened.
 *
 * A series whose `label` is not text falls back to its key: the label is spoken,
 * and an icon cannot be.
 */
export function chartSonifySeries(
  rows: Record<string, unknown>[],
  config: ChartConfig,
  xDataKey?: string,
  keys?: string[],
): SonifySeries[] {
  const wanted = keys ?? Object.keys(config)
  const categories = xDataKey ? rows.map((row) => categoryText(row[xDataKey])) : undefined

  return wanted
    .filter((key) => key in config)
    .map((key) => {
      const label = config[key]?.label
      return {
        key,
        label: typeof label === 'string' || typeof label === 'number' ? String(label) : key,
        values: rows.map((row) => {
          const value = row[key]
          return typeof value === 'number' && Number.isFinite(value) ? value : null
        }),
        categories,
      }
    })
}

export interface UseSonifyOptions extends SonifyOptions {
  /**
   * What the run is called. Spoken once, when the last note has finished, so a
   * listener knows the silence is the end rather than a stall.
   */
  name?: string
  /**
   * Fires as each point sounds, and with `null` between series.
   *
   * The hook already tracks this for you (`activePoint`); this is for a call
   * site that wants to drive something else — a reference line on the plot, a
   * row highlight in a table beside it.
   */
  onPointChange?: (point: SonifyPoint | null) => void
}

export interface UseSonifyResult {
  state: SonifyState
  isPlaying: boolean
  /** False where the browser has no Web Audio. Resolved after mount, never during render. */
  isSupported: boolean
  /** The point sounding right now, or `null` between series and at rest. */
  activePoint: SonifyPoint | null
  /** The latest text for a live region — a series' range, or the end of the run. */
  announcement: string
  /** Starts, or resumes. Call it from an event handler and nowhere else. */
  play: () => void
  pause: () => void
  stop: () => void
  /** Play when idle or paused, pause when playing — what one button needs. */
  toggle: () => void
  /** How long the whole run takes, in milliseconds. */
  durationMs: number
}

/**
 * Plays a set of series as pitch over time, and reports what is sounding.
 *
 * The controller is rebuilt whenever the data or the tuning changes and the
 * previous one is destroyed with it, so a brush drag or an unmount cancels
 * every pending timer and releases the audio hardware. No `AudioContext` is
 * constructed until the first `play()`.
 *
 * @example
 * const series = useMemo(() => chartSonifySeries(rows, config, 'month'), [rows, config])
 * const { toggle, isPlaying, announcement } = useSonify(series, { name: 'Visitors per month' })
 *
 * return (
 *   <>
 *     <button type="button" onClick={toggle}>{isPlaying ? 'Pause' : 'Play'}</button>
 *     <span role="status" aria-live="polite" className="sr-only">{announcement}</span>
 *   </>
 * )
 */
export function useSonify(series: SonifySeries[], options: UseSonifyOptions = {}): UseSonifyResult {
  const {
    name,
    onPointChange,
    noteMs,
    gapMs,
    leadInMs,
    rootFrequency,
    semitones,
    wave,
    volume,
    formatValue = defaultTick,
  } = options

  const [state, setState] = useState<SonifyState>('idle')
  const [activePoint, setActivePoint] = useState<SonifyPoint | null>(null)
  const [announcement, setAnnouncement] = useState('')
  // Starts optimistic so the server and the first client render agree; the
  // effect below is the only place the browser is asked.
  const [isSupported, setIsSupported] = useState(true)

  // Held in a ref rather than in the memo's dependencies: a call site that
  // passes an inline arrow would otherwise rebuild the controller — and cancel
  // the run — on every render.
  const pointChange = useRef(onPointChange)
  useEffect(() => {
    pointChange.current = onPointChange
  }, [onPointChange])

  useEffect(() => {
    setIsSupported(hasAudioSupport())
  }, [])

  const controller = useMemo(
    () =>
      createSonification({
        series,
        options: { noteMs, gapMs, leadInMs, rootFrequency, semitones, wave, volume, formatValue },
        onPoint: (point) => {
          setActivePoint(point)
          pointChange.current?.(point)
        },
        onAnnounce: setAnnouncement,
        onStateChange: setState,
        onEnd: () => setAnnouncement(name ? `End of ${name}.` : 'End of chart.'),
      }),
    [series, noteMs, gapMs, leadInMs, rootFrequency, semitones, wave, volume, formatValue, name],
  )

  useEffect(() => {
    setState('idle')
    setActivePoint(null)
    // Runs when the data changes as well as on unmount, which is what stops a
    // brushed-away run from playing on against rows that are no longer drawn.
    return () => controller.destroy()
  }, [controller])

  const play = useCallback(() => controller.play(), [controller])
  const pause = useCallback(() => controller.pause(), [controller])
  const stop = useCallback(() => {
    controller.stop()
    setAnnouncement('')
  }, [controller])

  const toggle = useCallback(() => {
    if (controller.state === 'playing') controller.pause()
    else controller.play()
  }, [controller])

  return {
    state,
    isPlaying: state === 'playing',
    isSupported,
    activePoint,
    announcement,
    play,
    pause,
    stop,
    toggle,
    durationMs: controller.durationMs,
  }
}

/** Where the control sits above the plot. */
export type SonifyAlign = 'start' | 'end'

const ALIGN: Record<SonifyAlign, string> = {
  start: 'justify-start',
  end: 'justify-end',
}

export interface SonifyProps extends SonifyOptions {
  /**
   * Which series play, in order. Defaults to every series in the chart's
   * config.
   *
   * Worth narrowing on a chart with four series: sequential playback means four
   * runs, and a listener rarely wants all of them.
   */
  keys?: string[]
  /** Where the control sits above the plot. */
  align?: SonifyAlign
  /** Overrides the control's visible label. */
  label?: string
  /**
   * Fires as each point sounds, and with `null` between series — for a call
   * site that wants to mark the point on the plot itself.
   */
  onPointChange?: (point: SonifyPoint | null) => void
  /** Merged onto the control row, last. */
  className?: string
}

/**
 * Plays this chart's values as sound.
 *
 * A slot: it renders nothing, and the chart root reads its props — the same
 * shape as `<Chart.Values>`. Composing it is what adds the control above the
 * plot, so a chart that does not ask for sonification ships none of it.
 *
 * Reach for it on the charts where a run of values over an axis IS the reading:
 * a line, an area, a bar series over time. It is not offered on a pie or a
 * treemap, where there is no order for the notes to be in.
 *
 * @example
 * <LineChart title="Visitors per month" config={config} data={data} xDataKey="month">
 *   <LineChart.Sonify />
 *   <LineChart.XAxis dataKey="month" />
 *   <LineChart.Line dataKey="desktop" />
 * </LineChart>
 */
export const Sonify: FC<SonifyProps> = () => null

/** Shared so an absent slot always yields the same array, not a new empty one. */
const NO_SERIES: SonifySeries[] = []

/** Separator for the memo key below. Never appears in a series key. */
const KEY_SEPARATOR = '\u0000'

/**
 * What a chart root calls to turn its composed `<Chart.Sonify />` slot and its
 * on-screen rows into playable series.
 *
 * The memo is keyed on the VALUE of the slot's `keys`, not on its identity: a
 * slot's props object is rebuilt on every parent render, so an identity
 * dependency would replace the controller — and cancel whatever was playing —
 * every time anything else on the page moved.
 *
 * Rows are the rows on screen, brush included. Sonifying the full data behind a
 * brushed range would say something the picture does not.
 *
 * `rows` and `config` are compared by identity, as everywhere else in the
 * package: a chart handed a freshly built `config` object on every render
 * rebuilds its run each time, which stops playback. Define both outside the
 * render, which is what every example here does.
 */
export function useChartSonifySeries(
  slot: SonifyProps | null,
  rows: Record<string, unknown>[],
  config: ChartConfig,
  xDataKey?: string,
): SonifySeries[] {
  const hasSlot = slot !== null
  const keys = slot?.keys?.join(KEY_SEPARATOR)

  return useMemo(
    () =>
      hasSlot
        ? chartSonifySeries(rows, config, xDataKey, keys?.split(KEY_SEPARATOR))
        : NO_SERIES,
    [hasSlot, keys, rows, config, xDataKey],
  )
}

export interface ChartSonifyButtonProps extends SonifyProps {
  /** The figure's name. Spoken as part of the control's accessible name. */
  title: string
  /** The series to play, already flattened — see `chartSonifySeries`. */
  series: SonifySeries[]
}

/**
 * The control that starts a chart's sonification.
 *
 * A real `<button>`, because this is the whole point of the feature: an audio
 * reading that a keyboard cannot reach is not an accessibility feature. The
 * visible label is the verb only — "Play", "Pause" — and the rest of the
 * accessible name is visually hidden, so the name still contains the visible
 * text verbatim (WCAG 2.5.3) while a screen reader hears which figure it
 * belongs to.
 *
 * No `aria-pressed`. A toggle button announces as "pressed"/"not pressed",
 * which for a transport control contradicts the label it is sitting on —
 * "Pause, toggle button, pressed" leaves the listener to work out whether the
 * chart is playing. A label that names the next action says it once.
 *
 * The live region carries the RANGE announcement before each series, not a line
 * per point: a fourteen-point run would interrupt itself fourteen times and the
 * listener would hear none of the tones. The per-point readout beside the
 * button is `aria-hidden` for the same reason — it is there for a sighted
 * reader following along.
 *
 * @example
 * <ChartSonifyButton title="Visitors per month" series={series} />
 */
export function ChartSonifyButton({
  title,
  series,
  align = 'end',
  label,
  className,
  keys: _keys,
  onPointChange,
  formatValue = defaultTick,
  ...options
}: ChartSonifyButtonProps) {
  const { state, isPlaying, isSupported, activePoint, announcement, stop, toggle } = useSonify(
    series,
    { ...options, formatValue, name: title, onPointChange },
  )

  const hasPoints = series.some((entry) => entry.values.some((value) => value !== null))
  const isDisabled = !isSupported || !hasPoints
  const Icon = isPlaying ? PauseIcon : PlayIcon

  const reason = !isSupported
    ? ' — audio is not available in this browser'
    : !hasPoints
      ? ' — nothing to play'
      : ''

  return (
    <div className={cn('mb-2 flex items-center gap-2', ALIGN[align], className)}>
      {activePoint && (
        // Visual only. The live region is deliberately not told about every
        // point; see the component note above.
        <span aria-hidden className="mono-meta truncate text-(--ink-3-aa)">
          {activePoint.category ?? `#${activePoint.index + 1}`}
          {activePoint.value !== null && ` · ${formatValue(activePoint.value)}`}
        </span>
      )}

      {state !== 'idle' && (
        <Button variant="ghost" size="md" onClick={stop}>
          <Square size={14} aria-hidden />
          Stop
          <span className="sr-only"> playing {title} as sound</span>
        </Button>
      )}

      <Button variant="secondary" size="md" onClick={toggle} disabled={isDisabled}>
        <Icon size={14} aria-hidden />
        {label ?? (isPlaying ? 'Pause' : 'Play')}
        <span className="sr-only">
          {' '}
          {isPlaying ? 'playing' : 'this chart'} as sound: {title}
          {reason}
        </span>
      </Button>

      <span role="status" aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </div>
  )
}

export default Sonify
