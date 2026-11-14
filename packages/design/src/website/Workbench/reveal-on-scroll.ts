/** Steps of the cascade: a batch of more than four arrives with the rest at the fourth. */
const MAX_STEP = 3

/**
 * Hides each element that starts below the fold and reveals it the first time
 * it scrolls into view.
 *
 * Elements that come into view together arrive one `--stagger` step apart in
 * document order, capped at four steps, so a row of cards reads as one arrival
 * rather than a queue. Anything already on screen, a page without
 * IntersectionObserver and a reader who asked for reduced motion are left
 * exactly as the server rendered them. Returns the cleanup.
 */
export function revealOnScroll(nodes: HTMLElement[]): () => void {
  if (typeof IntersectionObserver === 'undefined') return () => {}
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return () => {}
  const below = nodes.filter((node) => node.getBoundingClientRect().top >= window.innerHeight)
  if (below.length === 0) return () => {}
  for (const node of below) {
    node.classList.add('folio-wb-reveal')
    node.dataset.reveal = 'hidden'
  }
  let waiting = below.length
  const observer = new IntersectionObserver(
    (entries) => {
      const arriving = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target as HTMLElement)
      arriving.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
      arriving.forEach((node, index) => {
        node.style.setProperty('--folio-reveal-step', String(Math.min(index, MAX_STEP)))
        node.dataset.reveal = 'shown'
        // Once it has arrived the element is handed back to its own rules, so
        // its hover transitions do not inherit the reveal's duration and delay.
        node.addEventListener('transitionend', () => {
          delete node.dataset.reveal
          node.style.removeProperty('--folio-reveal-step')
        }, { once: true })
        observer.unobserve(node)
        waiting -= 1
      })
      if (waiting <= 0) observer.disconnect()
    },
    { rootMargin: '0px 0px -10% 0px' },
  )
  for (const node of below) observer.observe(node)
  return () => observer.disconnect()
}
