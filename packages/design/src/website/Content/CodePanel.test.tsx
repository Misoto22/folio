import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { COPIED_RESET_MS } from '../../lib/useClipboardCopy'
import { resetWarnings } from '../../lib/warn'
import { ClipboardButton, CodePanel } from './CodePanel'

describe('CodePanel clipboard boundary', () => {
  beforeEach(() => resetWarnings())
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('copies the rendered highlighted text, including line breaks', async () => {
    const user = userEvent.setup()
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    render(<CodePanel languageLabel="Shell" copyLabel="Copy code" copiedLabel="Copied"><code><span>printf hello</span>{'\n'}<span>printf world</span>{'\n'}</code></CodePanel>)
    await user.click(screen.getByRole('button', { name: 'Copy code' }))
    expect(write).toHaveBeenCalledWith('printf hello\nprintf world')
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
    expect(screen.getByText('printf hello').closest('pre')).toHaveAttribute('tabindex', '0')
  })

  it('does not report success after the browser rejects a clipboard write', async () => {
    const user = userEvent.setup()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Permission denied'))
    render(<ClipboardButton text="example" copyLabel="Copy code" copiedLabel="Copied" />)
    await user.click(screen.getByRole('button', { name: 'Copy code' }))
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Copied' })).not.toBeInTheDocument()
  })

  it('accepts highlighted children inside a pre-existing renderer figure', () => {
    const { container } = render(<figure data-renderer="mdx"><CodePanel framed={false} languageLabel="TypeScript" copyLabel="Copy" copiedLabel="Copied" preProps={{ 'aria-label': 'Example' }}><code>const a = 1</code></CodePanel></figure>)
    expect(container.querySelectorAll('figure')).toHaveLength(1)
    expect(screen.getByText('const a = 1').closest('pre')).toHaveAttribute('aria-label', 'Example')
  })

  it('confirms for the shared window, then returns to its copy label', async () => {
    // Plain fake timers and a direct click: `shouldAdvanceTime` lets the test's
    // own real duration leak into the clock and close the window early.
    vi.useFakeTimers()
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: vi.fn(async () => {}) }, configurable: true, writable: true })
    render(<ClipboardButton text="example" copyLabel="Copy code" copiedLabel="Copied" />)

    await act(async () => { screen.getByRole('button', { name: 'Copy code' }).click() })
    expect(screen.getByRole('button', { name: 'Copied' })).toHaveTextContent('Copied')

    act(() => { vi.advanceTimersByTime(COPIED_RESET_MS - 1) })
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(1) })
    expect(screen.getByRole('button', { name: 'Copy code' })).toHaveTextContent('Copy code')
  })

  it('names the refusal in development and clears a confirmation still showing', async () => {
    const user = userEvent.setup()
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValueOnce()
    render(<ClipboardButton text="example" copyLabel="Copy code" copiedLabel="Copied" />)

    await user.click(screen.getByRole('button', { name: 'Copy code' }))
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()

    write.mockRejectedValueOnce(new Error('Permission denied'))
    await user.click(screen.getByRole('button', { name: 'Copied' }))
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument()
    expect(consoleWarn).toHaveBeenCalledTimes(1)
    expect(consoleWarn.mock.calls[0]![0]).toContain('CLIPBOARD_WRITE_REJECTED')
    expect(consoleWarn.mock.calls[0]![0]).toContain('Permission denied')
  })

  it('treats a host text reader that throws as a failed copy', async () => {
    const user = userEvent.setup()
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    render(<ClipboardButton getText={() => { throw new Error('highlighter unmounted') }} copyLabel="Copy code" copiedLabel="Copied" />)

    await user.click(screen.getByRole('button', { name: 'Copy code' }))
    expect(write).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument()
    expect(consoleWarn.mock.calls[0]![0]).toContain('highlighter unmounted')
  })
})
