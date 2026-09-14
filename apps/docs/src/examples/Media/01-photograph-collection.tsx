import { MediaCollection, MediaGallery, MediaGalleryItem, MediaMasthead } from '@misoto22/folio/website'

/**
 * A gallery receives link and image slots while preserving each print's orientation.
 * The illustrations stand in for host-owned photographs and retain descriptive alternatives.
 */
export function Example() {
  return (
    <MediaCollection masthead={<MediaMasthead title="Field observations" description="A small collection of places and light." headingLevel={4} />}>
      <MediaGallery>
        <MediaGalleryItem title="The far shore" index="01" location="Coast" orientation="landscape">
          <a href="#far-shore"><svg viewBox="0 0 640 420" role="img" aria-label="Illustration of a shoreline beneath a pale sky">
            <rect width="640" height="420" fill="var(--bg-2)" /><path d="M0 270 L180 210 L420 260 L640 160 V420 H0Z" fill="var(--rule)" />
          </svg></a>
        </MediaGalleryItem>
        <MediaGalleryItem title="A quiet corner" index="02" location="City" orientation="portrait">
          <a href="#quiet-corner"><svg viewBox="0 0 420 560" role="img" aria-label="Illustration of a doorway with afternoon shadow">
            <rect width="420" height="560" fill="var(--bg-2)" /><path d="M110 90 H310 V560 H110Z" fill="var(--rule)" />
          </svg></a>
        </MediaGalleryItem>
      </MediaGallery>
    </MediaCollection>
  )
}
