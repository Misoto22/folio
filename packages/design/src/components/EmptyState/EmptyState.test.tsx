import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Inbox } from '../../icons'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('opens the second level by default', () => {
    // An empty state stands in for a view inside a page that already has its
    // h1, so the level below it is the one that does not put a hole in heading
    // navigation.
    render(<EmptyState title="No projects yet" />)
    expect(screen.getByRole('heading', { level: 2, name: 'No projects yet' })).toBeInTheDocument()
  })

  it('renders the element the level names', () => {
    render(
      <>
        <EmptyState level={3} title="In a section" />
        <EmptyState level={4} title="Deeper still" />
      </>,
    )
    // Queried the way a screen reader builds its heading list — the outline,
    // not the class list.
    expect(screen.getByRole('heading', { level: 3, name: 'In a section' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 4, name: 'Deeper still' })).toBeInTheDocument()
  })

  it('keeps the title at --fs-sub whatever the level is', () => {
    // The whole point of splitting the element from the size: moving an empty
    // state down the outline must not resize it. --fs-sub is what it rendered
    // at as a fixed h3, and it is what it renders at at every level.
    render(
      <>
        <EmptyState icon={Inbox} title="Default" />
        <EmptyState level={5} title="Buried" />
      </>,
    )
    for (const name of ['Default', 'Buried']) {
      const className = screen.getByText(name).className
      expect(className, name).toContain('var(--fs-sub)')
      expect(className, name).not.toContain('var(--fs-heading)')
      expect(className, name).not.toContain('var(--fs-item)')
      expect(className, name).not.toContain('font-mono')
    }
  })
})
