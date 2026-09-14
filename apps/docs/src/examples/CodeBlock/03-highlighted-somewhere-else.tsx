import { CodeBlock } from '@misoto22/folio'

const SOURCE = `export function tone(state: string) {
  return state === 'ok' ? 'success' : 'danger'
}`

/**
 * What a build-time highlighter emits for SOURCE, shortened by hand. Every
 * colour is a token, so the block follows the page into dark mode rather than
 * carrying a theme of its own.
 */
const HIGHLIGHTED = `<pre><code><span class="line"><span style="color:var(--ink);font-weight:bold">export function</span> <span style="color:var(--ink);font-weight:bold">tone</span><span style="color:var(--ink-2)">(</span><span style="color:var(--ink)">state</span><span style="color:var(--ink-2)">: </span><span style="color:var(--ink)">string</span><span style="color:var(--ink-2)">) {</span></span>
<span class="line">  <span style="color:var(--ink);font-weight:bold">return</span> <span style="color:var(--ink)">state</span> <span style="color:var(--ink-2)">===</span> <span style="color:var(--ok)">'ok'</span> <span style="color:var(--ink-2)">?</span> <span style="color:var(--ok)">'success'</span> <span style="color:var(--ink-2)">:</span> <span style="color:var(--ok)">'danger'</span></span>
<span class="line"><span style="color:var(--ink-2)">}</span></span></code></pre>`

/**
 * Markup a highlighter produced, rendered as it arrived. The package does not
 * highlight and will not: a grammar is a few hundred kilobytes and a build-time
 * job, so this site runs Shiki inside its generator and hands the result here.
 * Passing html takes lineNumbers and highlightLines away in the TYPE rather
 * than leaving them as props that quietly render nothing, because html is one
 * opaque string this component does not parse. code stays required — it is what
 * the copy button puts on the clipboard, and it is the half a reader takes away.
 */
export function Example() {
  return (
    <CodeBlock title="tone.ts" lang="ts" code={SOURCE} html={HIGHLIGHTED} />
  )
}
