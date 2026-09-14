/**
 * Taking an `<svg>` off the page as a file.
 *
 * Shared by two entries that both draw in SVG and both need to hand a reader a
 * picture of it: `@misoto22/folio/charts` and `@misoto22/folio/diagrams`.
 * Everything here is engine-agnostic — nothing knows what a series or a node
 * is — so the parts that DO know (which `<svg>` inside a wrapper is the plot,
 * what the file should be called, what sits behind it) stay with the caller.
 *
 * Nothing touches the DOM at module scope. Every browser API — `document`,
 * `canvas`, `URL.createObjectURL` — is reached for inside a function body, so
 * this module imports cleanly into a server component and only fails when a
 * consumer actually asks for a file on a server, which is a call that cannot
 * succeed anywhere.
 */

const SVG_NS = 'http://www.w3.org/2000/svg'

/**
 * The properties copied from the live DOM onto the serialised clone.
 *
 * Paint, geometry-adjacent paint, and type. Layout is deliberately absent: an
 * SVG's geometry is in its attributes, which the clone already carries, and
 * copying computed `width`/`height`/`transform` onto every node would fight
 * them.
 */
const PAINTED_PROPERTIES = [
  'display',
  'visibility',
  'opacity',
  'color',
  'fill',
  'fill-opacity',
  'fill-rule',
  'stroke',
  'stroke-opacity',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stop-color',
  'stop-opacity',
  'flood-color',
  'flood-opacity',
  'marker-start',
  'marker-mid',
  'marker-end',
  'mask',
  'filter',
  'clip-path',
  'clip-rule',
  'paint-order',
  'mix-blend-mode',
  'shape-rendering',
  'text-anchor',
  'dominant-baseline',
  'font-family',
  'font-size',
  'font-style',
  'font-weight',
  'letter-spacing',
  'text-transform',
] as const

/**
 * Copies the resolved paint of every node in `live` onto the matching node in
 * `clone`.
 *
 * ## The problem this function exists to solve
 *
 * Serialising an `<svg>` and handing it to an `<img>` puts it in a document of
 * its own. That document has none of the page's stylesheets, so every
 * `var(--ink)`, `var(--rule-2)` and `var(--diagram-node)` in the markup
 * resolves to nothing — and a paint that resolves to nothing is not a fallback
 * colour, it is an invisible mark. Serialise naively and you get an empty
 * rectangle.
 *
 * ## The solution
 *
 * Walk the live tree and the clone in step, and on every node write
 * `getComputedStyle`'s answer into an inline `style`. Computed values have
 * already had `var()` substituted by the engine, so `fill: var(--ink)` arrives
 * as `fill: rgb(16, 16, 16)` — and, because the walk reads the LIVE element, it
 * reads it under whichever theme is currently applied. Light and dark come out
 * right for free, with no theme argument anywhere in this file.
 *
 * `<stop>` and `<marker>` children are walked too, which is the half that is
 * easy to miss: a gradient's stops and an arrowhead's fill carry custom
 * properties of their own, and a `<defs>` that lost its paint takes every line
 * ending with it.
 */
export function inlinePaint(live: Element, clone: Element): void {
  const computed = getComputedStyle(live)
  let css = ''
  for (const property of PAINTED_PROPERTIES) {
    const value = computed.getPropertyValue(property)
    if (value) css += `${property}:${value};`
  }
  if (css) clone.setAttribute('style', css)

  // The clone is a faithful deep copy, so child lists line up by index.
  const children = live.children
  const clones = clone.children
  for (let index = 0; index < children.length; index += 1) {
    const liveChild = children[index]
    const cloneChild = clones[index]
    if (liveChild && cloneChild) inlinePaint(liveChild, cloneChild)
  }
}

/**
 * A custom property, resolved against the live element.
 *
 * `var()` inside a custom property is substituted at computed-value time, so
 * `--diagram-surface: var(--paper)` reads back as a colour. The guard is for
 * the case where it did not — an unregistered name, or a value the engine left
 * as a token stream — because writing `var(--paper)` into a serialised SVG
 * paints nothing at all.
 */
export function readToken(element: Element, name: string, fallback: string): string {
  const value = getComputedStyle(element).getPropertyValue(name).trim()
  return value && !value.includes('var(') ? value : fallback
}

export interface SerializeOptions {
  /** Space around the artwork, in user units. Defaults to 16. */
  padding?: number
  /** Painted behind the artwork. Omit for a transparent ground. */
  background?: string
  /** A band above the artwork carrying this text. */
  title?: string
  /** Paint for the title. Defaults to `#101010`. */
  titleColor?: string
  /** Family for the title. Defaults to `sans-serif`. */
  titleFont?: string
  /**
   * Forces the output box, letterboxing the artwork inside it.
   *
   * This is what a share card is: a fixed 1200×630 frame that the diagram is
   * fitted into, rather than a frame the diagram sizes. Omit it and the output
   * is the artwork plus its padding.
   */
  frame?: { width: number; height: number }
}

/**
 * One standalone `<svg>` document: the element's own artwork, repainted with
 * resolved colours, on an optional plate, under an optional title.
 *
 * Returns markup rather than a blob because the SVG export wants the string
 * and every raster export wants it as a data source — one serialisation, four
 * file formats.
 *
 * ## What this cannot capture, honestly
 *
 * - **Anything drawn in HTML.** A toolbar, a tooltip, an inspector panel are
 *   DOM, not SVG. The file is the artwork.
 * - **Web fonts.** The isolated document cannot fetch the page's `@font-face`
 *   sources, so text is rasterised in whatever the resolved family stack finds
 *   locally. Type metrics will differ from the screen.
 * - **Cross-origin images.** An `<image>` from another origin taints the canvas
 *   and `toBlob` throws; there is no way around it from script.
 */
export function serializeSvg(svg: SVGSVGElement, options: SerializeOptions = {}): string {
  const { padding = 16, background, title, titleColor = '#101010', titleFont = 'sans-serif' } = options

  const box = svg.getBoundingClientRect()
  const width = Math.ceil(box.width) || Number(svg.getAttribute('width')) || 0
  const height = Math.ceil(box.height) || Number(svg.getAttribute('height')) || 0
  if (width === 0 || height === 0) {
    // Artwork that has not been measured yet has no size to export. Silently
    // producing a 0×0 file would look to a reader like a broken download
    // rather than a call made one frame too early.
    throw new Error('serializeSvg: the artwork has no measured size yet — export it after it renders')
  }

  const clone = svg.cloneNode(true) as SVGSVGElement
  inlinePaint(svg, clone)
  clone.setAttribute('width', String(width))
  clone.setAttribute('height', String(height))

  const titleBand = title ? 34 : 0
  const contentWidth = width + padding * 2
  const contentHeight = height + padding * 2 + titleBand

  // A frame letterboxes rather than stretches: a share card that squashed a
  // wide diagram to 1200×630 would be a picture of a different diagram.
  const totalWidth = options.frame?.width ?? contentWidth
  const totalHeight = options.frame?.height ?? contentHeight
  const scale = options.frame
    ? Math.min(totalWidth / contentWidth, totalHeight / contentHeight, 1)
    : 1
  const offsetX = (totalWidth - contentWidth * scale) / 2
  const offsetY = (totalHeight - contentHeight * scale) / 2

  const page = document.createElementNS(SVG_NS, 'svg')
  page.setAttribute('xmlns', SVG_NS)
  page.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
  page.setAttribute('width', String(totalWidth))
  page.setAttribute('height', String(totalHeight))
  page.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`)

  if (background) {
    const plate = document.createElementNS(SVG_NS, 'rect')
    plate.setAttribute('width', String(totalWidth))
    plate.setAttribute('height', String(totalHeight))
    plate.setAttribute('fill', background)
    page.append(plate)
  }

  const stage = document.createElementNS(SVG_NS, 'g')
  stage.setAttribute('transform', `translate(${offsetX}, ${offsetY}) scale(${scale})`)
  page.append(stage)

  if (title) {
    const caption = document.createElementNS(SVG_NS, 'text')
    caption.setAttribute('x', String(padding))
    caption.setAttribute('y', String(padding + 15))
    caption.setAttribute('fill', titleColor)
    caption.setAttribute('font-size', '15')
    caption.setAttribute('font-weight', '500')
    caption.setAttribute('font-family', titleFont)
    caption.textContent = title
    stage.append(caption)
  }

  const group = document.createElementNS(SVG_NS, 'g')
  group.setAttribute('transform', `translate(${padding}, ${padding + titleBand})`)
  group.append(clone)
  stage.append(group)

  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(page)}`
}

/** The raster formats a browser canvas can encode. */
export type RasterFormat = 'png' | 'jpeg' | 'webp'

const MIME: Record<RasterFormat, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
}

export interface RasterOptions {
  /** Multiplier on the on-screen size. 2 is a retina-sharp export. */
  scale?: number
  /** Encoder quality for `jpeg` and `webp`, 0–1. Ignored by `png`. */
  quality?: number
  /**
   * Painted behind the image, for a format with no alpha channel.
   *
   * JPEG has no transparency, so a diagram serialised without a plate lands on
   * black. Passing the page's own surface here is what makes the file look
   * like the screen rather than like a negative.
   */
  background?: string
}

/**
 * SVG markup, rasterised through a canvas.
 *
 * This is the browser's own SVG rasteriser re-drawing the markup, not a
 * screenshot: antialiasing, `backdrop-filter` and any effect a page stylesheet
 * applied from outside the `<svg>` are not in it.
 */
export async function rasterize(
  markup: string,
  format: RasterFormat,
  options: RasterOptions = {},
): Promise<Blob> {
  const { scale = 2, quality = 0.92, background } = options

  const url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml;charset=utf-8' }))
  try {
    const image = await loadImage(url)
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.ceil(image.width * scale))
    canvas.height = Math.max(1, Math.ceil(image.height * scale))

    const context = canvas.getContext('2d')
    if (!context) throw new Error('rasterize: this browser gave back no 2D canvas context')

    if (background) {
      context.fillStyle = background
      context.fillRect(0, 0, canvas.width, canvas.height)
    }
    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    return await canvasToBlob(canvas, MIME[format], quality)
  } finally {
    URL.revokeObjectURL(url)
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', () =>
      reject(new Error('rasterize: the browser refused to decode the serialised artwork')),
    )
    image.src = url
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error(`rasterize: the canvas produced no ${mime} data`))
        },
        mime,
        quality,
      )
    } catch (cause) {
      // A cross-origin image anywhere in the artwork taints the canvas and this
      // throws SecurityError. Nothing in script can untaint it, so the honest
      // move is to say which failure it was.
      reject(
        new Error(
          'rasterize: the canvas is tainted, which means the artwork contains a cross-origin image',
          { cause },
        ),
      )
    }
  })
}

/**
 * Hands a blob to the browser as a download.
 *
 * Throws rather than no-oping without a `document`: a download is something a
 * person just asked for, and a silent return would look to them like a click
 * that did nothing.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  if (typeof document === 'undefined') {
    throw new Error('downloadBlob: needs a browser document — call it from an event handler')
  }

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.rel = 'noopener'
  anchor.style.display = 'none'
  document.body.append(anchor)
  anchor.click()
  anchor.remove()

  // Revoking in the same tick cancels the download in Safari; one turn of the
  // event loop is enough for the navigation to have started.
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

/**
 * A title as a filename.
 *
 * Lowercase, ASCII-safe and hyphenated, because a downloaded file crosses into
 * shells, zip archives and Windows paths where a title's spaces and slashes are
 * someone else's problem. A title with no ASCII in it at all — a Chinese one,
 * say — slugs to nothing, so the caller's fallback is what names the file.
 */
export function exportFilename(title: string, extension: string, fallback = 'figure'): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${slug || fallback}.${extension}`
}
