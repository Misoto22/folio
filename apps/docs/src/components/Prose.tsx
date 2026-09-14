import { cn } from '@misoto22/folio'

export interface ProseProps {
  /** Plain text with blank-line paragraphs, `backticks` and **bold**. */
  text: string
  small?: boolean
  className?: string
}

/**
 * The two pieces of Markdown this site's prose actually uses.
 *
 * A full Markdown pipeline would be a dependency, a sanitiser and a build step
 * for backticks and blank lines. Anything richer than that belongs in a
 * component, not in a doc comment or a changelog bullet — and keeping the
 * renderer this small is what stops someone reaching for a table in one.
 *
 * Shared by the component pages (JSDoc) and the changelog (CHANGELOG.md), so
 * both read the same way.
 */
export function Prose({ text, small = false, className }: ProseProps) {
  return (
    <div
      className={cn(
        'flex max-w-(--w-reading) flex-col gap-3',
        small ? 'text-[13px]' : 'text-sm',
        className,
      )}
    >
      {text.split(/\n\s*\n/).map((paragraph, index) => (
        <p key={index} className="m-0 leading-relaxed text-(--ink-2)">
          {paragraph.split(/(`[^`]+`|\*\*[^*]+\*\*)/).map((part, partIndex) => {
            if (part.startsWith('`') && part.endsWith('`')) {
              return (
                <code
                  key={partIndex}
                  className="rounded-(--radius-sm) bg-(--stone) px-1.5 py-0.5 font-mono text-xs text-(--ink)"
                >
                  {part.slice(1, -1)}
                </code>
              )
            }
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIndex} className="font-medium text-(--ink)">
                  {part.slice(2, -2)}
                </strong>
              )
            }
            return <span key={partIndex}>{part.replace(/\n/g, ' ')}</span>
          })}
        </p>
      ))}
    </div>
  )
}

export default Prose
