import { Badge, TBody, TD, TH, THead, TR, Table } from '@misoto22/folio'
import { apiCopy } from '@/i18n/api'
import type { Locale } from '@/i18n/locales'
import { fill, getMessages } from '@/i18n/messages'

export interface PropRow {
  name: string
  type: string
  required: boolean
  description: string
  defaultValue?: string
}

export interface PropsTableProps {
  /** The component these props belong to — used for the table's caption. */
  name: string
  /** The directory key, so a row can find its translation. */
  dir: string
  rows: PropRow[]
  /** Type expressions the extractor chose not to enumerate. */
  passthrough: string[]
  locale?: Locale
}

/**
 * A component's props, parsed out of its source.
 *
 * Required props sort first, then alphabetically. That is not cosmetic: the
 * required set is the smallest thing a reader has to understand to use the
 * component at all, and burying `caption` between `className` and `showCaption`
 * hides the one prop that will otherwise be forgotten.
 */
export function PropsTable({ name, dir, rows, passthrough, locale = 'en' }: PropsTableProps) {
  const t = getMessages(locale)
  const sorted = [...rows].sort((a, b) => {
    if (a.required !== b.required) return a.required ? -1 : 1
    return a.name.localeCompare(b.name)
  })

  if (sorted.length === 0 && passthrough.length === 0) {
    return (
      <p className="m-0 text-sm text-(--ink-3-aa)">{t.table.noProps}</p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {sorted.length > 0 && (
        <Table caption={`${name} props`}>
          <THead>
            <TR>
              <TH>{t.table.prop}</TH>
              <TH>{t.table.type}</TH>
              <TH>{t.table.default}</TH>
              <TH>{t.table.description}</TH>
            </TR>
          </THead>
          <TBody>
            {sorted.map((row) => (
              <TR key={row.name}>
                <TD className="whitespace-nowrap align-top">
                  <span className="font-mono text-xs text-(--ink)">{row.name}</span>
                  {row.required && (
                    <Badge tone="outline" className="ms-2 align-middle">
                      {t.table.required}
                    </Badge>
                  )}
                </TD>
                <TD className="align-top">
                  <code className="font-mono text-xs text-(--ink-2)">{row.type}</code>
                </TD>
                <TD className="align-top">
                  {row.defaultValue ? (
                    <code className="font-mono text-xs text-(--ink-2)">{row.defaultValue}</code>
                  ) : (
                    <span aria-hidden className="text-(--rule-2)">
                      —
                    </span>
                  )}
                </TD>
                <TD className="max-w-(--measure-record) align-top text-[13px] leading-relaxed">
                  {apiCopy(locale, `${dir}.${name}#${row.name}`, row.description) || (
                    <span className="text-(--ink-3-aa)">—</span>
                  )}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      {passthrough.length > 0 && (
        <p className="m-0 text-[13px] leading-relaxed text-(--ink-3-aa)">
          {fill(t.table.passthrough, { types: passthrough.join(', ') })}
        </p>
      )}
    </div>
  )
}
