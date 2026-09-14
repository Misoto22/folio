import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LEGACY_KEY_PAIRS, STORAGE_KEYS } from '@/lib/storage-keys'
import { THEME_SCRIPT } from '@/lib/theme-script'

/**
 * The pre-paint script, run the way the browser runs it: as a string, against
 * the real `document`, with nothing from React present.
 *
 * Storage is supplied rather than read off the global. This environment's
 * `localStorage` is Node's experimental one, disabled without
 * `--localstorage-file`, which shadows jsdom's — the same reason
 * `Sidebar.test.tsx` brings its own store.
 */
let store: Map<string, string>
let prefersDark: boolean

function memoryStorage() {
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
    clear: () => store.clear(),
  }
}

function run() {
  // Indirect eval: global scope, the same scope an inline `<script>` gets.
  ;(0, eval)(THEME_SCRIPT)
}

const html = () => document.documentElement

beforeEach(() => {
  store = new Map()
  prefersDark = false
  vi.stubGlobal('localStorage', memoryStorage())
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query === '(prefers-color-scheme: dark)' && prefersDark,
    media: query,
  }))
  for (const name of Object.keys(html().dataset)) delete html().dataset[name]
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const [LEGACY_MODE] = LEGACY_KEY_PAIRS.mode
const [LEGACY_ACCENT] = LEGACY_KEY_PAIRS.accent
const [LEGACY_THEME] = LEGACY_KEY_PAIRS.theme
const [LEGACY_SIDEBAR] = LEGACY_KEY_PAIRS.sidebar

describe('the pre-paint theme script', () => {
  it('applies a returning reader\'s legacy preferences and copies them to the new keys', () => {
    store.set(LEGACY_MODE, 'dark')
    store.set(LEGACY_ACCENT, 'cobalt')
    store.set(LEGACY_THEME, JSON.stringify({ radius: 'sharp', surface: 'paper', chartPalette: 'chroma' }))
    store.set(LEGACY_SIDEBAR, 'closed')

    run()

    expect(html().dataset.mode).toBe('dark')
    expect(html().dataset.accent).toBe('cobalt')
    expect(html().dataset.radius).toBe('sharp')
    expect(html().dataset.chartPalette).toBe('chroma')
    // A default stays unwritten, exactly as before the rename.
    expect(html().dataset.surface).toBeUndefined()

    expect(store.get(STORAGE_KEYS.mode)).toBe('dark')
    expect(store.get(STORAGE_KEYS.accent)).toBe('cobalt')
    expect(store.get(STORAGE_KEYS.theme)).toBe(store.get(LEGACY_THEME))
    // Read after mount by `SidebarProvider`, so this copy is its only migration.
    expect(store.get(STORAGE_KEYS.sidebar)).toBe('closed')

    // Kept, so a revert still finds them.
    expect(store.get(LEGACY_MODE)).toBe('dark')
    expect(store.get(LEGACY_SIDEBAR)).toBe('closed')
  })

  it('prefers the new key when both are set, and leaves it untouched', () => {
    store.set(LEGACY_MODE, 'dark')
    store.set(STORAGE_KEYS.mode, 'light')
    store.set(LEGACY_ACCENT, 'plum')
    store.set(STORAGE_KEYS.accent, 'forest')
    store.set(LEGACY_THEME, JSON.stringify({ radius: 'round' }))
    store.set(STORAGE_KEYS.theme, JSON.stringify({ radius: 'sharp' }))
    store.set(LEGACY_SIDEBAR, 'closed')
    store.set(STORAGE_KEYS.sidebar, 'open')
    prefersDark = true

    run()

    expect(html().dataset.mode).toBe('light')
    expect(html().dataset.accent).toBe('forest')
    expect(html().dataset.radius).toBe('sharp')
    expect(store.get(STORAGE_KEYS.mode)).toBe('light')
    expect(store.get(STORAGE_KEYS.accent)).toBe('forest')
    expect(store.get(STORAGE_KEYS.theme)).toBe(JSON.stringify({ radius: 'sharp' }))
    expect(store.get(STORAGE_KEYS.sidebar)).toBe('open')
  })

  it('follows the system preference when nothing is stored', () => {
    prefersDark = true

    run()

    expect(html().dataset.mode).toBe('dark')
    expect(html().dataset.accent).toBeUndefined()
    expect(store.size).toBe(0)
  })

  it('still applies a legacy preference when storage refuses the copy', () => {
    store.set(LEGACY_MODE, 'dark')
    store.set(LEGACY_ACCENT, 'clay')
    vi.stubGlobal('localStorage', {
      ...memoryStorage(),
      setItem: () => {
        throw new DOMException('quota', 'QuotaExceededError')
      },
    })

    expect(run).not.toThrow()
    expect(html().dataset.mode).toBe('dark')
    expect(html().dataset.accent).toBe('clay')
  })

  it('renders light, without throwing, when storage itself throws', () => {
    prefersDark = true
    const refuse = () => {
      throw new DOMException('denied', 'SecurityError')
    }
    vi.stubGlobal('localStorage', { getItem: refuse, setItem: refuse, removeItem: refuse, clear: refuse })

    expect(run).not.toThrow()
    expect(html().dataset.mode).toBe('light')
    expect(html().lang).toBe('en')
  })
})
