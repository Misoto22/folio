import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecoveryLinks, RecoveryState, WebsiteLoading } from './Recovery'

describe('website recovery', () => {
  it('preserves one page heading and host-owned destinations', () => {
    render(<RecoveryState code="404" heading="Page unavailable" message="Choose another page." action={<button>Try again</button>} elsewhere={<RecoveryLinks label="Elsewhere" items={[{ id: 'work', link: <a href="/zh/work">工作</a> }]} />} />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page unavailable')
    expect(screen.getByRole('link', { name: '工作' })).toHaveAttribute('href', '/zh/work')
  })

  it.each(['records', 'gallery', 'media', 'metrics', 'identity', 'article', 'photograph', 'cards'] as const)('names the %s loading state once and reserves its content', (layout) => {
    const { container } = render(<WebsiteLoading layout={layout} label="正在载入内容" />)
    expect(screen.getAllByRole('status')).toHaveLength(1)
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('正在载入内容')
    expect(container.querySelector('header')).not.toBeNull()
    expect(container.querySelector('[data-loading-content]')).not.toBeNull()
  })

  it('waits a beat and fades in, outside the pulse, for every layout', () => {
    const { container } = render(<WebsiteLoading layout="records" label="Loading" />)
    const page = container.firstElementChild
    expect(page).toHaveClass('folio-loading-page')
    const data = page?.querySelector('.folio-loading-data')
    expect(data?.firstElementChild).toHaveAttribute('role', 'status')
  })

  it('renders a real intro at once, outside the delayed skeleton, and drops the masthead bars', () => {
    const { container } = render(<WebsiteLoading layout="records" label="Loading projects" intro={<h1>Projects.</h1>} />)
    const heading = screen.getByRole('heading', { level: 1, name: 'Projects.' })
    expect(heading.closest('.folio-loading-data')).toBeNull()
    expect(container.querySelector('.folio-loading-intro')).toBeNull()
    expect(container.querySelector('.folio-loading-records')).not.toBeNull()
  })

  it('draws a card grid with one card per row asked for', () => {
    const { container } = render(<WebsiteLoading layout="cards" rows={6} label="Loading skills" />)
    expect(container.querySelectorAll('.folio-loading-cards > div')).toHaveLength(6)
    expect(container.querySelector('.folio-loading-records')).toBeNull()
  })

  it('draws a photograph detail on the detail page grid, not the gallery grid', () => {
    const { container } = render(<WebsiteLoading layout="photograph" label="Loading photograph" />)
    expect(container.querySelector('.folio-media-spread .folio-media-well')).not.toBeNull()
    expect(container.querySelector('.folio-media-ledger')).not.toBeNull()
    expect(container.querySelector('.folio-loading-gallery')).toBeNull()
  })

  it('draws an article masthead and body, with the cover only when asked', () => {
    const { container, rerender } = render(<WebsiteLoading layout="article" label="Loading post" />)
    expect(container.querySelector('.folio-detail-masthead')).not.toBeNull()
    expect(container.querySelector('.folio-reading-body')).not.toBeNull()
    expect(container.querySelector('.folio-reading-figure')).not.toBeNull()
    rerender(<WebsiteLoading layout="article" media={false} label="Loading post" />)
    expect(container.querySelector('.folio-reading-figure')).toBeNull()
    expect(container.querySelector('.folio-loading-records')).toBeNull()
  })
})
