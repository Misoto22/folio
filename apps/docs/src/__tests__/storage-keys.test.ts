import { describe, expect, it } from 'vitest'
import { LEGACY_KEYS, LEGACY_KEY_PAIRS, STORAGE_KEYS } from '@/lib/storage-keys'

describe('the persisted storage keys', () => {
  /**
   * The literals are the point of this test, so they are written out rather
   * than imported or built from a prefix.
   *
   * The `m22-` → `folio-` codemod must leave `LEGACY_KEYS` alone: rewritten, the
   * fallback reads the new key twice and every returning reader silently loses
   * their theme. If a mechanical rewrite reaches either this file or the list,
   * the two stop agreeing and this fails — which is the only place that mistake
   * would ever be visible.
   */
  it('keeps the legacy keys exactly as the site used to write them', () => {
    expect(LEGACY_KEYS).toEqual(['m22-mode', 'm22-accent', 'm22-theme', 'm22-sidebar'])
  })

  it('pairs every current key with the legacy key it replaces', () => {
    expect(Object.keys(LEGACY_KEY_PAIRS).sort()).toEqual(Object.keys(STORAGE_KEYS).sort())
    for (const [name, [legacy, current]] of Object.entries(LEGACY_KEY_PAIRS)) {
      expect(current).toBe(STORAGE_KEYS[name as keyof typeof STORAGE_KEYS])
      expect(LEGACY_KEYS).toContain(legacy)
      // Same preference on both sides: the legacy mode key feeds the new mode key, never the accent.
      expect(legacy.slice(legacy.indexOf('-'))).toBe(current.slice(current.indexOf('-')))
    }
    expect(new Set(Object.values(LEGACY_KEY_PAIRS).map(([legacy]) => legacy)).size).toBe(LEGACY_KEYS.length)
  })

  it('never reuses a legacy name as a current one', () => {
    for (const current of Object.values(STORAGE_KEYS)) {
      expect(LEGACY_KEYS).not.toContain(current)
    }
  })
})
