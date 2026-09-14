/**
 * Every `localStorage` key the documentation site writes, in one place.
 *
 * The keys are a contract with every returning reader's browser rather than an
 * implementation detail: a key renamed in one call site and not another is a
 * preference that is saved and never read back, which nobody reports — the site
 * just forgets the theme. So the pre-paint script, the providers and the shell
 * all read their name from here.
 */
export const STORAGE_KEYS = {
  /** `light` or `dark`, stamped as `data-mode`. */
  mode: 'folio-mode',
  /** An accent id, stamped as `data-accent`. */
  accent: 'folio-accent',
  /** Every other theme axis, as one JSON object. */
  theme: 'folio-theme',
  /** `open` or `closed`, the docked state `SidebarProvider` remembers. */
  sidebar: 'folio-sidebar',
} as const

export type StorageKeyName = keyof typeof STORAGE_KEYS

/**
 * The names the site wrote before the Folio rename, kept only so a returning
 * reader's saved preferences survive it.
 *
 * The pre-paint script reads the current key and, when that is absent, falls
 * back to the legacy one and copies it forward. The legacy keys are never
 * deleted: a revert of the rename then still finds the reader's values where the
 * old code looks for them.
 *
 * These literals are deliberately NOT derived from `STORAGE_KEYS`, and the
 * prefix codemod skips this file. A mechanical `m22-` → `folio-` rewrite that
 * reached them would turn the fallback into a read of the new key twice, and
 * every returning reader would lose their theme without a single test failing
 * — `storage-keys.test.ts` pins them to these exact strings for that reason.
 *
 * Exception record (HAR-GOV-003)
 *   Owner:   Henry Chen
 *   Reason:  the rename from misoto22 design to Folio moved the persisted keys
 *            from `m22-` to `folio-`; without a read fallback every returning
 *            reader's mode, accent, theme axes and sidebar state would reset.
 *   Scope:   `apps/docs` only — this list, `LEGACY_KEY_PAIRS`, and the
 *            fallback read in `lib/theme-script.ts`. Nothing in
 *            `packages/design` reads these keys.
 *   Approval: the owner-approved Folio rename plan, 2026-09-14 (PR2).
 *   Review:  2026-12-14. By then a returning reader has had three months to
 *            load the site once, which is what copies their values forward.
 *            Remove `LEGACY_KEYS`, `LEGACY_KEY_PAIRS` and the fallback branch in
 *            `theme-script.ts` together, with their tests, in one follow-up.
 */
export const LEGACY_KEYS = ['m22-mode', 'm22-accent', 'm22-theme', 'm22-sidebar'] as const

/**
 * Each current key with the legacy key it replaces, as `[legacy, current]`.
 *
 * Indexed by position into `LEGACY_KEYS` rather than restating the strings, so
 * the four literals above stay the only copy.
 */
export const LEGACY_KEY_PAIRS: Record<StorageKeyName, readonly [legacy: string, current: string]> = {
  mode: [LEGACY_KEYS[0], STORAGE_KEYS.mode],
  accent: [LEGACY_KEYS[1], STORAGE_KEYS.accent],
  theme: [LEGACY_KEYS[2], STORAGE_KEYS.theme],
  sidebar: [LEGACY_KEYS[3], STORAGE_KEYS.sidebar],
}
