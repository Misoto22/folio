import { SiteFooter, SiteLink } from '@misoto22/folio/website'

/**
 * A publication footer groups supplied links into named navigation regions.
 * The host owns each destination; the component owns spacing and hierarchy.
 */
export function Example() {
  return (
    <SiteFooter
      brand="Field Notes"
      description="An independent journal of design and observation."
      groups={[
        { id: 'read', label: 'Read', items: [
          { id: 'essays', content: <SiteLink><a href="#essays">Essays</a></SiteLink> },
          { id: 'index', content: <SiteLink><a href="#index">Archive</a></SiteLink> },
        ] },
        { id: 'about', label: 'About', items: [
          { id: 'studio', content: <SiteLink><a href="#studio">The studio</a></SiteLink> },
        ] },
      ]}
      copyright="© 2026 Field Notes"
      colophon="Set with care."
    />
  )
}
