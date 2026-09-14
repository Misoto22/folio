import { PageHeader } from '@misoto22/folio'

/**
 * Every slot but the title is optional, and an omitted one renders nothing at
 * all rather than an empty box — four empty elements take the same vertical
 * space as four full ones and read as a layout bug. This is the shape most
 * routes inside an application frame actually want: the shell already pins a
 * trail, so a second one here would be two answers to where am I. level={2}
 * again, because the opening on a real page is the document's own h1 and this
 * one is a preview inside a page that already has one.
 */
export function Example() {
  return <PageHeader level={2} title="Jobs" />
}
