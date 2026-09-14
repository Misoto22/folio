import { Breadcrumb, Heading, Text } from '@misoto22/folio'

/**
 * The trail above the title it ends on. Start it above the current page: a
 * one-item Breadcrumb renders that item as the current crumb with no path at
 * all, which is a landmark announcing a journey of length one. Every crumb but
 * the last needs an href — one without renders as plain text in the same colour
 * as the links beside it, with no destination and no aria-current, so it reads
 * as the page the reader is on when it is not. The last crumb repeating the
 * heading is not a duplication to fix: one is the path, the other is the page.
 */
export function Example() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Breadcrumb
        label="Invoice trail"
        items={[
          { label: 'Clients', href: '/clients' },
          { label: 'Northwind', href: '/clients/northwind' },
          { label: 'Invoice 2024-118' },
        ]}
      />
      <Heading level={2}>Invoice 2024-118</Heading>
      <Text size="sm" tone="muted">
        Issued 4 March, due 3 April. Unpaid.
      </Text>
    </div>
  )
}
