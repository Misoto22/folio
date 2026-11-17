import { MediaCollection, MediaGallery, MediaGalleryItem, MediaMasthead } from '@misoto22/folio/website'

/**
 * A justified gallery sets each print at its own ratio in rows of one height, without script.
 * The illustrations stand in for host-owned photographs and retain descriptive alternatives.
 */
export function Example() {
  return (
    <div className="w-full">
      <MediaCollection masthead={<MediaMasthead title="Field observations" description="A small collection of places and light." headingLevel={4} />}>
        <MediaGallery layout="justified">
          <MediaGalleryItem title="The far shore" index="01" location="Coast" orientation="landscape" ratio={640 / 420}>
            <a href="#far-shore"><svg viewBox="0 0 640 420" role="img" aria-label="Illustration of a shoreline beneath a pale sky">
              <rect width="640" height="420" fill="var(--bg-2)" /><path d="M0 270 L180 210 L420 260 L640 160 V420 H0Z" fill="var(--rule)" />
            </svg></a>
          </MediaGalleryItem>
          <MediaGalleryItem title="A quiet corner" index="02" location="City" orientation="portrait" ratio={420 / 560}>
            <a href="#quiet-corner"><svg viewBox="0 0 420 560" role="img" aria-label="Illustration of a doorway with afternoon shadow">
              <rect width="420" height="560" fill="var(--bg-2)" /><path d="M110 90 H310 V560 H110Z" fill="var(--rule)" />
            </svg></a>
          </MediaGalleryItem>
          <MediaGalleryItem title="Ridge at dusk" index="03" location="Alps" orientation="landscape" ratio={900 / 400}>
            <a href="#ridge"><svg viewBox="0 0 900 400" role="img" aria-label="Illustration of a long mountain ridge">
              <rect width="900" height="400" fill="var(--bg-2)" /><path d="M0 300 L220 140 L380 240 L600 90 L900 260 V400 H0Z" fill="var(--rule)" />
            </svg></a>
          </MediaGalleryItem>
          <MediaGalleryItem title="Window light" index="04" location="Home" orientation="square" ratio={1}>
            <a href="#window"><svg viewBox="0 0 500 500" role="img" aria-label="Illustration of a square window casting light">
              <rect width="500" height="500" fill="var(--bg-2)" /><path d="M150 120 H350 V380 H150Z" fill="var(--rule)" />
            </svg></a>
          </MediaGalleryItem>
          <MediaGalleryItem title="Harbour steps" index="05" location="Sydney" orientation="portrait" ratio={2 / 3}>
            <a href="#steps"><svg viewBox="0 0 400 600" role="img" aria-label="Illustration of stone steps down to water">
              <rect width="400" height="600" fill="var(--bg-2)" /><path d="M0 380 H120 V440 H240 V500 H400 V600 H0Z" fill="var(--rule)" />
            </svg></a>
          </MediaGalleryItem>
        </MediaGallery>
      </MediaCollection>
    </div>
  )
}
