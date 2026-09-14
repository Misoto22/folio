'use client'

import { Button } from '@misoto22/folio'
import { RiMoonLine, RiSunLine } from '@remixicon/react'
import { useEffect, useState } from 'react'
import { useMessages } from '@/i18n/useLocale'
import { STORAGE_KEYS } from '@/lib/storage-keys'

type Mode = 'light' | 'dark'

/**
 * Flips `data-mode` on `<html>` and remembers the choice.
 *
 * Starts as `null` rather than guessing a mode: the real value lives in
 * `localStorage`, which the server cannot see, and rendering a sun icon that
 * becomes a moon on hydration is a visible flicker on every page load. The
 * button reserves its space and fills in the icon after mount.
 */
export function ThemeToggle() {
  const [mode, setMode] = useState<Mode | null>(null)
  const t = useMessages()

  useEffect(() => {
    const current = document.documentElement.dataset.mode
    setMode(current === 'dark' ? 'dark' : 'light')
  }, [])

  const toggle = () => {
    const next: Mode = mode === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.mode = next
    try {
      localStorage.setItem(STORAGE_KEYS.mode, next)
    } catch {
      // A private window with storage blocked still gets the toggle; it just
      // does not remember. Swallowing here is the whole handling.
    }
    setMode(next)
  }

  return (
    <Button
      iconOnly
      size="sm"
      variant="ghost"
      onClick={toggle}
      aria-label={mode === 'dark' ? t.appearance.toLight : t.appearance.toDark}
    >
      {mode === null ? (
        <span className="size-4" aria-hidden />
      ) : mode === 'dark' ? (
        <RiSunLine size={16} aria-hidden />
      ) : (
        <RiMoonLine size={16} aria-hidden />
      )}
    </Button>
  )
}
