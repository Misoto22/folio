import { TBody, TD, TH, THead, TR, Table } from '@misoto22/folio'
import type { Locale } from '@/i18n/locales'
import { getMessages } from '@/i18n/messages'

export interface TokenRow {
  name: string
  value: string
  comment?: string
  category: string
}

/** Values that can be drawn as a chip rather than only printed. */
function swatchFor(value: string): string | undefined {
  if (/^(#|rgba?\(|color-mix|oklch)/.test(value)) return value
  // A token whose value is another token still resolves to a colour at runtime,
  // so the chip is drawn from the reference rather than being skipped.
  const reference = value.match(/^var\((--[\w-]+)\)$/)
  return reference ? `var(${reference[1]})` : undefined
}

export interface TokenTableProps {
  /**
   * The heading's `id`, so the contents rail has something to link to.
   *
   * Derived from the category key by the caller rather than slugged from the
   * title here: the title is translated, and an anchor that changes with the
   * page's language is an anchor that breaks every link written against it.
   */
  id?: string
  title: string
  note?: string
  rows: TokenRow[]
  /** The same tokens under `[data-mode='dark']`, keyed by name. */
  dark?: Map<string, string>
  locale?: Locale
}

/**
 * One category of tokens, read out of the package's CSS at build time.
 *
 * The swatch is painted with the token itself — `background: var(--paper)`, not
 * a hex copied into this file — so a chip cannot show a colour the system no
 * longer has. It also means the whole table re-paints when the theme flips,
 * which is the fastest way to see what a token actually does.
 */
export function TokenTable({ id, title, note, rows, dark, locale = 'en' }: TokenTableProps) {
  const t = getMessages(locale)
  if (rows.length === 0) return null

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        {/* h2: this sits directly under the page title, and a heading order
            that jumps a level is a jump a screen reader has to explain to
            itself. */}
        <h2
          id={id}
          className="m-0 scroll-mt-(--scroll-offset) font-heading text-[length:var(--fs-item)] font-normal text-(--ink)"
        >
          {title}
        </h2>
        {note && (
          <p className="m-0 max-w-(--measure-record) text-[13px] leading-relaxed text-(--ink-3-aa)">
            {note}
          </p>
        )}
      </div>

      <Table caption={`${title} tokens`}>
        <THead>
          <TR>
            {/* Named, not empty: a column header with no text is announced as
                nothing at all, once per row. */}
              <TH className="w-10">
                <span className="sr-only">{t.table.swatch}</span>
              </TH>
            <TH>{t.table.token}</TH>
            <TH>{t.table.value}</TH>
            {dark && <TH>{t.table.dark}</TH>}
            <TH>{t.table.notes}</TH>
          </TR>
        </THead>
        <TBody>
          {rows.map((row) => {
            const swatch = swatchFor(row.value)
            const darkValue = dark?.get(row.name)
            return (
              <TR key={row.name}>
                <TD className="align-top">
                  {swatch ? (
                    <span
                      aria-hidden
                      className="mt-0.5 block size-5 rounded-(--radius-sm) border border-(--rule-2)"
                      style={{ background: swatch }}
                    />
                  ) : null}
                </TD>
                <TD className="whitespace-nowrap align-top">
                  <code className="font-mono text-xs text-(--ink)">--{row.name}</code>
                </TD>
                <TD className="align-top">
                  <code className="font-mono text-xs text-(--ink-2)">{row.value}</code>
                </TD>
                {dark && (
                  <TD className="align-top">
                    {darkValue ? (
                      <code className="font-mono text-xs text-(--ink-2)">{darkValue}</code>
                    ) : (
                      <span className="mono-meta text-(--ink-3-aa)">{t.table.same}</span>
                    )}
                  </TD>
                )}
                <TD className="max-w-(--measure-record) align-top text-[13px] leading-relaxed">
                  {row.comment ?? <span className="text-(--rule-2)">—</span>}
                </TD>
              </TR>
            )
          })}
        </TBody>
      </Table>
    </section>
  )
}
