import { LinkArrow } from '@misoto22/folio'

/**
 * The one thing on this component meant to be overridden. It is set in
 * --ink-3-aa, which is the AA floor against paper and close to invisible on
 * ink, so a call site on a reversed plate passes its own colour through
 * className. Everything else stays put: still the last child of the anchor,
 * still 0.68em, still aria-hidden.
 */
export function Example() {
  return (
    <div className="rounded-(--radius-lg) bg-(--ink) p-5">
      <a
        href="https://github.com/misoto22"
        className="text-sm text-(--paper) underline decoration-(--ink-3-aa) underline-offset-4"
      >
        The repository on GitHub
        <LinkArrow className="text-(--paper)" />
      </a>
    </div>
  )
}
