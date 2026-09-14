import { Breadcrumb } from '@misoto22/folio'

/**
 * A path deep enough to wrap, with a separator that is not the default slash.
 * The list wraps rather than truncating, and that is the right trade: the level
 * a truncating trail drops is usually the one the reader was heading for. The
 * separator is decorative whatever is put in it — it lives in an aria-hidden
 * list item and is never read out. Do not hide this on a phone to save a line.
 * That is the layout where the sidebar is behind a drawer, which makes the
 * trail the only way up a level that is on the screen at all.
 */
export function Example() {
  return (
    <Breadcrumb
      label="Deep trail"
      separator="›"
      className="max-w-xs"
      items={[
        { label: 'Workspace', href: '/' },
        { label: 'Clients', href: '/clients' },
        { label: 'Northwind', href: '/clients/northwind' },
        { label: 'Invoices', href: '/clients/northwind/invoices' },
        { label: '2024-118' },
      ]}
    />
  )
}
