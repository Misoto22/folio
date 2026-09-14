import { MediaDetailLayout } from '@misoto22/folio/website'

/**
 * A media detail preserves the host's return destination as a real link, while the layout holds it at a measured touch target across browser rounding.
 */
export function Example() {
  return (
    <MediaDetailLayout
      title="Low tide"
      titleId="low-tide"
      headingLevel={4}
      notesLabel="Field notes for low tide"
      orientation="landscape"
      index="02 / 12"
      backLink={<a href="#field-observations">Back to field observations</a>}
      media={
        <figure className="m-0 w-full">
          <svg viewBox="0 0 960 540" role="img" aria-label="Illustration of a low shoreline at dusk">
            <rect width="960" height="540" fill="var(--bg-2)" />
            <path d="M0 350 L240 290 L480 340 L720 245 L960 310 V540 H0Z" fill="var(--rule)" />
          </svg>
        </figure>
      }
    />
  )
}
