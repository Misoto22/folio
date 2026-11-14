/**
 * The Workbench preset as the attributes a host writes on `<html>`.
 *
 * A preset is a combination of theme axes, never a block of its own, so this
 * is the whole of it: linen ground and warm ink, an ember accent for links and
 * the current state, primary buttons in ink and every control a capsule, headings in the grotesk at a quiet voice, and quiet rules. Radius, motion
 * and density stay on their defaults. Spread it onto the root element:
 *
 * ```tsx
 * <html {...WORKBENCH_THEME} data-mode="light">
 * ```
 */
export const WORKBENCH_THEME = {
  'data-surface': 'linen',
  'data-accent': 'ember',
  'data-action': 'ink',
  'data-type': 'grotesk',
  'data-rules': 'quiet',
  'data-voice': 'quiet',
  'data-controls': 'pill',
} as const
