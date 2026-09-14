import { Breadcrumb } from '@misoto22/folio'

/**
 * Where you are, as a path. The last crumb is plain text carrying
 * aria-current="page" and never a link to itself — a self-link is the most
 * common breadcrumb bug, and it offers a screen reader a navigation that goes
 * nowhere. The separators sit in their own aria-hidden list items, so the trail
 * is read as its items rather than as home slash components slash. label names
 * the nav landmark; a page that can hold two trails has to name both, or a
 * reader gets two entries called Breadcrumb and no way to choose.
 */
export function Example() {
  return (
    // Named, because the page that documents this component has a breadcrumb
    // of its own and two landmarks with one name cannot be told apart.
    <Breadcrumb
      label="Example trail"
      items={[
        { label: 'Home', href: '/' },
        { label: 'Components', href: '/components' },
        { label: 'Breadcrumb' },
      ]}
    />
  )
}
