import { Spinner } from '@misoto22/folio'

/**
 * The three rings — 14px, 18px and 26px — matched to the type they sit beside
 * rather than picked for emphasis. size is the only thing that resizes one:
 * className lands on the outer wrapper, so a size utility passed that way grows
 * an empty box around an unchanged ring. label defaults to the bare word
 * Loading, which is the announcement the prop exists to prevent — name the
 * specific wait, because three spinners all saying Loading tell a screen reader
 * nothing, and each is read once on mount and never again.
 */
export function Example() {
  return (
    <div className="flex items-center gap-6">
      <Spinner size="sm" label="Loading, small" />
      <Spinner size="md" label="Loading, medium" />
      <Spinner size="lg" label="Loading, large" />
    </div>
  )
}
