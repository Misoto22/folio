import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConversationDock, type ConversationDockProps } from './ConversationDock'

function dock(props: Partial<ConversationDockProps> = {}) {
  return <ConversationDock label="Ask" subtitle="grounded in the archive" open={false} card corner="bottom-left"
    roomLink={<a href="/ask">Demo room</a>} closeLabel="Collapse the assistant" onClose={() => {}}
    composer={<input aria-label="Question" />}
    launcher={{ label: 'Ask', accessibleLabel: 'Ask about the archive', placeholder: 'What would you like to know?', visible: true, onOpen: () => {} }}
    {...props}>Log</ConversationDock>
}

describe('ConversationDock', () => {
  it('is the pill while closed: the panel is inert and the pill controls it', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    const { container } = render(dock({ launcher: { label: 'Ask', accessibleLabel: 'Ask about the archive', placeholder: 'What would you like to know?', visible: true, onOpen } }))
    const pill = screen.getByRole('button', { name: 'Ask about the archive' })
    const panel = container.querySelector('aside')!
    expect(pill).toHaveAttribute('aria-expanded', 'false')
    expect(pill).toHaveAttribute('aria-controls', panel.id)
    expect(panel).toHaveAttribute('inert')
    expect(panel).toHaveAccessibleName('Ask')
    // The placeholder is what hover reveals; it is never read twice.
    expect(screen.getByText('What would you like to know?')).toHaveAttribute('aria-hidden', 'true')
    await user.click(pill)
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it('opens in the same shell: the panel is live, the pill steps aside', () => {
    const { container } = render(dock({ open: true }))
    const shell = container.querySelector('.folio-conversation-dock')!
    expect(shell).toHaveAttribute('data-open', 'true')
    expect(container.querySelector('aside')).not.toHaveAttribute('inert')
    expect(container.querySelector('.folio-conversation-dock__pill')).toHaveAttribute('inert')
    expect(screen.getByRole('button', { name: 'Collapse the assistant' })).toBeInTheDocument()
    expect(screen.getByText('grounded in the archive')).toBeInTheDocument()
  })

  it('carries an unread dot once the conversation has a turn', () => {
    const { container, rerender } = render(dock())
    expect(container.querySelector('.folio-conversation-dock__dot')).toBeNull()
    rerender(dock({ hasTurns: true }))
    expect(container.querySelector('.folio-conversation-dock__dot')).toHaveAttribute('aria-hidden', 'true')
  })

  it('hides the closed pill when the host withholds it, but never the open panel', () => {
    const { container, rerender } = render(dock({ launcher: { label: 'Ask', accessibleLabel: 'Ask', visible: false, onOpen: () => {} } }))
    const shell = container.querySelector('.folio-conversation-dock')!
    expect(shell).toHaveAttribute('data-revealed', 'false')
    expect(container.querySelector('.folio-conversation-dock__pill')).toHaveAttribute('inert')
    rerender(dock({ open: true, launcher: { label: 'Ask', accessibleLabel: 'Ask', visible: false, onOpen: () => {} } }))
    expect(shell).toHaveAttribute('data-revealed', 'true')
  })

  it('takes the open size and keyboard inset as custom properties, leaving the pill its own width', () => {
    const { container } = render(dock({ open: true, size: { width: 420, height: 560 }, keyboardInset: 300, style: { transform: 'translate(4px, 0px)' } }))
    const shell = container.querySelector<HTMLElement>('.folio-conversation-dock')!
    expect(shell.style.getPropertyValue('--folio-dock-w')).toBe('420px')
    expect(shell.style.getPropertyValue('--folio-dock-h')).toBe('560px')
    expect(shell.style.getPropertyValue('--folio-dock-keyboard')).toBe('300px')
    expect(shell.style.width).toBe('')
    expect(shell.style.transform).toBe('translate(4px, 0px)')
    expect(shell).toHaveAttribute('data-measured')
  })

  it('opens as a sheet with a scrim and grabber when it is not a card, closing from the scrim', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { container } = render(dock({ open: true, card: false, onClose }))
    expect(container.querySelector('.folio-conversation-dock__grab')).toBeInTheDocument()
    const scrim = container.querySelector<HTMLElement>('.folio-conversation-dock__scrim')!
    expect(scrim).toHaveAttribute('data-open', 'true')
    await user.click(scrim)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('forwards the shell and pill refs to the host', () => {
    const shellRef = { current: null as HTMLElement | null }
    const pillRef = { current: null as HTMLButtonElement | null }
    render(dock({ panelRef: shellRef, launcher: { label: 'Ask', accessibleLabel: 'Ask', visible: true, onOpen: () => {}, buttonRef: pillRef } }))
    expect(shellRef.current).toHaveClass('folio-conversation-dock')
    expect(pillRef.current).toHaveClass('folio-conversation-dock__pill')
  })
})
