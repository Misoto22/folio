import { cn } from '@misoto22/folio'
import type { RemixiconComponentType } from '@remixicon/react'

export interface IconTileProps {
  icon: RemixiconComponentType
  /** `sm` 22px in a rail row, `md` 32px beside a heading, `lg` 56px beside a page title. */
  size?: 'sm' | 'md' | 'lg'
  /**
   * The current thing — the open page, the group it sits in. Drawn in ink, the
   * system's primary. Everything else is the secondary stone tile, so exactly
   * one tile in view reads as "here".
   */
  current?: boolean
  className?: string
}

const BOX = {
  sm: 'size-5.5 rounded-(--radius-sm)',
  md: 'size-8 rounded-(--radius)',
  lg: 'size-14 rounded-(--radius-lg)',
} as const

const GLYPH = { sm: 13, md: 16, lg: 26 } as const

/**
 * A glyph on a tile, in role colour only.
 *
 * The tiles were tinted per group once — the chart palette's eight hues —
 * and the page read as confetti: eleven colours that meant nothing but
 * "different", competing with the state colours that do mean something.
 * Ink for current, stone for the rest, and hue stays with charts and status.
 */
export function IconTile({ icon: Icon, size = 'md', current = false, className }: IconTileProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        BOX[size],
        current ? 'bg-(--ink) text-(--paper)' : 'bg-(--stone) text-(--ink-2)',
        className,
      )}
    >
      <Icon size={GLYPH[size]} />
    </span>
  )
}
