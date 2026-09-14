/**
 * Development warnings, written for the reader most likely to hit them.
 *
 * The skill in this package documents a handful of ways to misuse a component
 * that fail SILENTLY — a `Field` whose child is a wrapper wires no label, an
 * icon-only `Button` with no accessible name renders perfectly and is invisible
 * to a screen reader. Documentation is the wrong place for those on its own: it
 * only helps a reader who went looking, and the whole problem is that nothing
 * told them to look.
 *
 * So the component says it, at the moment it happens. The shape follows what an
 * agent needs to repair its own call without asking anyone: a stable `code` it
 * can branch on, the `field` that caused it, an imperative one-line `fix`, and
 * where to get the rest. A message that only says "invalid props" makes an
 * agent guess, and it guesses by trying things.
 *
 * Three constraints this has to keep:
 *
 * - **Dev only.** Every call site is behind `process.env.NODE_ENV`, which the
 *   consumer's bundler replaces and then drops. Nothing here reaches a
 *   production bundle.
 * - **Once per problem.** React renders twice in StrictMode and again on every
 *   state change; a warning printed each time is noise that trains people to
 *   ignore it.
 * - **Never throws.** A warning that breaks the render is worse than the bug it
 *   describes, and this runs during render.
 */

/**
 * `process.env.NODE_ENV`, without pulling Node's types into a browser library.
 *
 * Declared module-locally rather than in a `.d.ts`: an ambient `process` there
 * would travel into the emitted declarations and collide with a consumer's own
 * Node types. The `typeof` guard is what makes it safe in a bundle that never
 * defines it.
 */
declare const process: { env?: { NODE_ENV?: string } } | undefined

/**
 * True outside a production build, and false when nothing said either way.
 *
 * Every bundler replaces `process.env.NODE_ENV` with a literal, which folds
 * this to `false` and lets the guarded calls below be dropped entirely. Off is
 * the right default for the case where nothing replaced it: a warning that
 * reaches a user's console is worse than one an author never sees.
 */
export const DEV =
  typeof process !== 'undefined' && process?.env?.NODE_ENV !== 'production'

/** Warnings already printed, keyed by code + detail, so a re-render is quiet. */
const seen = new Set<string>()

interface Warning {
  /** Stable identifier. Never reused for a different cause. */
  code: string
  /** What went wrong, in one declarative sentence. */
  problem: string
  /** The prop or child that caused it. */
  field: string
  /** Imperative, and self-sufficient — assume nobody opens the docs. */
  fix: string
  /** The component to ask about. */
  component: string
}

/**
 * Print one warning, once.
 *
 * Guarded at the call site too, so a production bundle drops the whole
 * expression rather than the branch inside it.
 */
export function warn({ code, problem, field, fix, component }: Warning): void {
  if (!DEV) return

  const key = `${code}:${field}`
  if (seen.has(key)) return
  seen.add(key)

  console.warn(
    [
      `[@misoto22/folio] ${code}`,
      `  ${problem}`,
      `  field: ${field}`,
      `  fix:   ${fix}`,
      `  docs:  npx @misoto22/folio docs ${component}`,
    ].join('\n'),
  )
}

/** Test seam: the dedupe is global state, and a suite needs it reset. */
export function resetWarnings(): void {
  seen.clear()
}

/**
 * Warn when a prop that is required for accessibility holds nothing usable.
 *
 * `Table.caption`, `Progress.label` and their siblings are required in the type
 * precisely because forgetting them ships a control nobody can use without
 * sight — and an empty string satisfies the type while satisfying nothing else.
 * That is exactly the shape a model produces when it knows a prop is mandatory
 * and has nothing to put in it.
 *
 * Not applied to `Avatar.alt`. An empty `alt` is the correct, deliberate markup
 * for a decorative image, so warning on it would be a false positive on a
 * pattern the platform endorses.
 */
export function warnBlankName(
  component: string,
  field: string,
  value: unknown,
  announces: string,
): void {
  if (!DEV) return
  if (typeof value !== 'string' || value.trim() !== '') return

  warn({
    code: 'REQUIRED_NAME_BLANK',
    problem: `${component}.${field} is an empty string, so ${announces}. The type is satisfied; nothing else is.`,
    field: `${component}.${field}`,
    fix: `Give ${field} the words a person would need to understand this without seeing it.`,
    component,
  })
}
