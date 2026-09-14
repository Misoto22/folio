/**
 * Cloudflare Pages' `_redirects`, read the way Pages reads it.
 *
 * Two readers need the same answer. `serve-out.mjs` follows a retired address
 * the way production does, so the end-to-end suite tests the redirect that
 * ships; `redirects.test.ts` holds every retired address to a page the site
 * still publishes. One reader, so the test cannot pass on a rule the server
 * would read differently.
 *
 * Only the subset this site writes: literal paths, `:placeholder` segments and
 * a trailing `*` splat, first match wins, trailing slashes significant, `#`
 * comments. The reference is Pages' own documentation:
 * https://developers.cloudflare.com/pages/configuration/redirects/
 */

/** The status codes Pages accepts on a redirect rule. */
const STATUSES = new Set([301, 302, 303, 307, 308])

/** @typedef {{ source: RegExp, destination: string, status: number }} RedirectRule */

/**
 * Every rule in a `_redirects` file, in file order.
 *
 * @param {string} text
 * @returns {RedirectRule[]}
 */
export function parseRedirects(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '' && !line.startsWith('#'))
    .map((line) => {
      const [source, destination, code = '302', ...rest] = line.split(/\s+/)
      if (!source || !destination || rest.length > 0) {
        throw new Error(`_redirects: malformed rule "${line}"`)
      }
      const status = Number(code)
      if (!STATUSES.has(status)) {
        throw new Error(`_redirects: ${code} is not a redirect status Pages accepts, in "${line}"`)
      }
      return { source: sourcePattern(source), destination, status }
    })
}

/** A source path as an anchored pattern: `:name` is one segment, a final `*` the rest. */
function sourcePattern(source) {
  const literal = source.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
  const body = literal.replace(/:(\w+)/g, '(?<$1>[^/]+)').replace(/\*$/, '(?<splat>.*)')
  return new RegExp(`^${body}$`)
}

/**
 * Where a request for `pathname` is sent, or `undefined` when no rule claims it.
 *
 * @param {RedirectRule[]} rules
 * @param {string} pathname
 * @returns {{ location: string, status: number } | undefined}
 */
export function redirectFor(rules, pathname) {
  for (const rule of rules) {
    const match = rule.source.exec(pathname)
    if (!match) continue
    const values = match.groups ?? {}
    const location = rule.destination.replace(/:(\w+)/g, (token, name) => values[name] ?? token)
    return { location, status: rule.status }
  }
  return undefined
}
