import { useState, type ReactElement } from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MediaDetailLayout, MediaGallery, MediaGalleryItem, MediaGallerySkeleton, MediaMapAreaList, MediaMapMarker, MediaMapNavigation, MediaMasthead, MediaMetadata, MediaPager, MediaPagerItem } from './Media'

describe('Media gallery and detail composition', () => {
  it('retains host links, intrinsic dimensions and image descriptions', () => {
    render(<MediaGallery><MediaGalleryItem title="A portrait" index="001" location="Sydney" orientation="portrait"><a href="/frames/portrait?from=archive"><img src="/portrait.jpg" alt="A person at the shore" width={800} height={1200} /></a></MediaGalleryItem></MediaGallery>)
    const link = screen.getByRole('link', { name: 'A person at the shore' })
    expect(link).toHaveAttribute('href', '/frames/portrait?from=archive')
    expect(link).toHaveAttribute('data-photo-orientation', 'portrait')
    expect(within(link).getByRole('img')).toHaveAttribute('width', '800')
    expect(within(link).getByRole('img')).toHaveAttribute('height', '1200')
    expect(screen.getByRole('listitem')).toHaveTextContent('001A portraitSydney')
  })

  it('sets level mounts unless a host asks for justified rows', () => {
    const { rerender } = render(<MediaGallery><MediaGalleryItem title="A frame"><a href="/a"><img alt="A" /></a></MediaGalleryItem></MediaGallery>)
    expect(screen.getByRole('list')).toHaveAttribute('data-layout', 'mounts')
    rerender(<MediaGallery layout="justified"><MediaGalleryItem title="A frame"><a href="/a"><img alt="A" /></a></MediaGalleryItem></MediaGallery>)
    expect(screen.getByRole('list')).toHaveAttribute('data-layout', 'justified')
  })

  it('hands each print its own ratio and keeps the host style beside it', () => {
    render(<MediaGallery layout="justified"><MediaGalleryItem title="Wide" ratio={1.5} style={{ marginTop: 0 }}><a href="/w"><img alt="Wide" /></a></MediaGalleryItem></MediaGallery>)
    const item = screen.getByRole('listitem')
    expect(item.style.getPropertyValue('--folio-media-ratio')).toBe('1.5')
    expect(item.style.marginTop).toBe('0px')
  })

  it.each([undefined, 0, -1, Number.NaN, Number.POSITIVE_INFINITY])('leaves a ratio of %s to the stylesheet\'s portrait default', (ratio) => {
    render(<MediaGallery layout="justified"><MediaGalleryItem title="Unknown" ratio={ratio}><a href="/u"><img alt="Unknown" /></a></MediaGalleryItem></MediaGallery>)
    expect(screen.getByRole('listitem').style.getPropertyValue('--folio-media-ratio')).toBe('')
  })

  it('gives a justified skeleton a mix of frame ratios', () => {
    render(<MediaGallerySkeleton label="Loading photographs" layout="justified" count={3} />)
    const items = within(screen.getByRole('status')).getAllByRole('listitem')
    expect(screen.getByRole('list')).toHaveAttribute('data-layout', 'justified')
    expect(items.map((item) => item.style.getPropertyValue('--folio-media-ratio'))).toEqual(['1.5', '0.8', '1'])
  })

  it('lets page compositions join an existing document outline', () => {
    render(
      <>
        <MediaMasthead title="Field observations" headingLevel={4} />
        <MediaDetailLayout
          title="Shore"
          titleId="shore"
          headingLevel={4}
          notesLabel="Frame notes"
          orientation="landscape"
          backLink={<a href="/archive">Back</a>}
          media={<img alt="Shore" src="/shore.jpg" />}
        />
      </>,
    )

    expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(2)
  })

  it('renders a localized empty state with its recovery action', () => {
    render(<MediaGallery emptyTitle="No frames match" emptyAction={<a href="/archive">Reset filters</a>} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('No frames match')
    expect(screen.getByRole('link', { name: 'Reset filters' })).toHaveAttribute('href', '/archive')
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('names its loading state and reserves the collection header and content', () => {
    render(<MediaGallerySkeleton label="Loading photographs" />)
    const status = screen.getByRole('status', { name: 'Loading photographs' })
    expect(status).toHaveAttribute('aria-busy', 'true')
    expect(status.querySelector('header')).not.toBeNull()
    expect(status.querySelector('[data-loading-content]')).not.toBeNull()
    expect(within(status).getAllByRole('listitem')).toHaveLength(6)
  })

  it.each(['portrait', 'landscape'] as const)('keeps %s metadata and actions in source reading order', (orientation) => {
    render(<MediaDetailLayout title="Shore" titleId="shore" notesLabel="Frame notes" orientation={orientation} backLink={<a href="/archive">Back</a>} media={<img alt="Shore" src="/shore.jpg" />} actions={<button>Share</button>} metadata={<MediaMetadata items={[{ term: 'Camera', description: 'A camera' }]} />} />)
    const article = screen.getByRole('article', { name: 'Shore' })
    const notes = screen.getByRole('complementary', { name: 'Frame notes' })
    const image = screen.getByRole('img', { name: 'Shore' })
    expect(article).toContainElement(notes)
    expect(image.compareDocumentPosition(notes) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Share' }).compareDocumentPosition(screen.getByText('Camera')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.queryByRole('main')).not.toBeInTheDocument()
  })

  it('keeps the host pager href and relation, and omits a pager with no neighbors', () => {
    const { rerender } = render(<MediaPager label="Frame navigation" previous={<MediaPagerItem link={<a href="/frame?from=filtered" rel="prev" />} direction="previous" label="Previous" title="The shore" />} />)
    expect(screen.getByRole('link', { name: 'Previous The shore' })).toHaveAttribute('href', '/frame?from=filtered')
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'prev')
    rerender(<MediaPager label="Frame navigation" />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('composes a deferred server link without losing its navigation props or content', () => {
    const navigate = vi.fn((event) => event.preventDefault())
    const link = <a href="/frame?from=filtered" rel="next" onClick={navigate}>Host placeholder</a>
    // React Server Components transport a deferred element rather than an
    // ordinary element with a .type. React child traversal resolves this shape.
    const payload = Object.assign(Promise.resolve(link), { status: 'fulfilled', value: link })
    const deferredLink = {
      $$typeof: Symbol.for('react.lazy'),
      _payload: payload,
      _init: () => link,
    } as unknown as ReactElement

    render(<MediaPagerItem link={deferredLink} direction="next" label="Next" title="The shore" image={<img src="/shore.jpg" alt="" />} />)

    const pager = screen.getByRole('link', { name: 'Next The shore' })
    expect(pager).toHaveAttribute('href', '/frame?from=filtered')
    expect(pager).toHaveAttribute('rel', 'next')
    expect(pager).toHaveAttribute('data-direction', 'next')
    expect(pager.querySelector('img')).toHaveAttribute('src', '/shore.jpg')
    expect(screen.queryByText('Host placeholder')).not.toBeInTheDocument()
    fireEvent.click(pager)
    expect(navigate).toHaveBeenCalledOnce()
  })
})

describe('Media map controls', () => {
  it('exposes localized marker names, selection state and native keyboard activation', async () => {
    const user = userEvent.setup()
    const activate = vi.fn()
    render(<MediaMapMarker label="Select the shore" active onClick={activate} />)
    const marker = screen.getByRole('button', { name: 'Select the shore' })
    expect(marker).toHaveAttribute('aria-pressed', 'true')
    expect(marker).toHaveStyle({ width: '44px', height: '44px' })
    await user.tab()
    await user.keyboard('[Enter]')
    expect(activate).toHaveBeenCalledOnce()
  })

  it('reports area choices without taking ownership of geographic state', async () => {
    const user = userEvent.setup()
    function Areas() {
      const [selected, setSelected] = useState('one')
      return <MediaMapAreaList items={[{ id: 'one', label: 'Coast', count: '03' }, { id: 'two', label: 'City', count: '02' }]} value={selected} onValueChange={setSelected} />
    }
    render(<Areas />)
    await user.click(screen.getByRole('button', { name: 'City 02' }))
    expect(screen.getByRole('button', { name: 'City 02' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Coast 03' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('delegates zoom operations through labeled controls', () => {
    const zoomIn = vi.fn()
    const zoomOut = vi.fn()
    render(<MediaMapNavigation zoomInLabel="Closer" zoomOutLabel="Further" onZoomIn={zoomIn} onZoomOut={zoomOut} />)
    fireEvent.click(screen.getByRole('button', { name: 'Closer' }))
    fireEvent.click(screen.getByRole('button', { name: 'Further' }))
    expect(zoomIn).toHaveBeenCalledOnce()
    expect(zoomOut).toHaveBeenCalledOnce()
  })
})
