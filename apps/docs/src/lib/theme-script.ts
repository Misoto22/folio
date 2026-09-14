import { LEGACY_KEY_PAIRS } from './storage-keys'

/**
 * Resolves the theme before the first paint.
 *
 * Inline and synchronous on purpose: any deferred script — including React's own
 * hydration — runs after the browser has already painted, so a dark reader sees
 * a white flash on every navigation. Reading `localStorage` here and stamping
 * the attribute on `<html>` costs a millisecond and removes the flash entirely.
 *
 * It is a string because it is injected into `<head>` verbatim, and it lives in
 * its own module so a test can run exactly the bytes that ship. Key names come
 * from `storage-keys.ts` through `JSON.stringify`, never typed here.
 *
 * Wrapped in a function so nothing it declares lands on `window`.
 */
export const THEME_SCRIPT = `
(function () {
  var keys = ${JSON.stringify(LEGACY_KEY_PAIRS)}
  // A preference under its current name, or else under the name it had before
  // the Folio rename — copied forward so the next visit finds the new key.
  // The copy has its own try: storage that reads but refuses a write (a full
  // quota) must still paint this visit with the reader's theme. The legacy key
  // is left in place, so a revert of the rename still finds it.
  function read(pair) {
    var value = localStorage.getItem(pair[1])
    if (value !== null) return value
    value = localStorage.getItem(pair[0])
    if (value !== null) {
      try {
        localStorage.setItem(pair[1], value)
      } catch (_) {}
    }
    return value
  }
  var root = document.documentElement
  try {
    var stored = read(keys.mode)
    var system = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    root.dataset.mode = stored === 'light' || stored === 'dark' ? stored : system
    var accent = read(keys.accent)
    if (accent) root.dataset.accent = accent
    // Every other axis, restored the same way and for the same reason: a theme
    // applied on hydration is a theme the reader watches being applied.
    var theme = JSON.parse(read(keys.theme) || '{}')
    var defaults = { surface: 'paper', radius: 'soft', rules: 'hairline', type: 'editorial', motion: 'calm', density: 'comfortable', chartPalette: 'mono' }
    for (var axis in defaults) {
      if (theme[axis] && theme[axis] !== defaults[axis]) root.dataset[axis] = theme[axis]
    }
    // Nothing to apply here: SidebarProvider reads its key after mount, so the
    // copy this makes is the whole of its migration.
    read(keys.sidebar)
  } catch (_) {
    root.dataset.mode = 'light'
  }
  // The root layout sits above the locale routes and has no params, so the
  // document's language is set from the path here — before first paint, so the
  // element is correct for anything reading it afterwards rather than being
  // corrected on hydration.
  var zh = location.pathname === '/zh' || location.pathname.indexOf('/zh/') === 0
  root.lang = zh ? 'zh-Hans' : 'en'
})()
`.trim()
