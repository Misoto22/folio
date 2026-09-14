import { Kbd, Text } from '@misoto22/folio'

/**
 * A three-key chord, as three caps. One box holding ⌘⇧P is a single key that
 * does not exist, and the min-w-[1.6em] that makes one character square just
 * stretches to hold all three. The glyph keys carry an aria-label because ⌘ and
 * ⇧ are read out as their Unicode names or skipped entirely — a Mac shortcut
 * written in symbols alone is a silent instruction.
 */
export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <Text size="sm">
        Reformat the file with <Kbd aria-label="Command">⌘</Kbd>{' '}
        <Kbd aria-label="Shift">⇧</Kbd> <Kbd>P</Kbd>.
      </Text>
      <Text size="sm">
        On Windows and Linux the same chord is <Kbd>Ctrl</Kbd> <Kbd>Shift</Kbd> <Kbd>P</Kbd>.
      </Text>
    </div>
  )
}
