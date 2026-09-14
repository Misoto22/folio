import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { COPIED_RESET_MS } from '../../lib/useClipboardCopy'
import { resetWarnings } from '../../lib/warn'
import { CodeBlock } from './CodeBlock'

const SOURCE = 'const a = 1\n\nexport default a\n'

/**
 * A clipboard the test can read back.
 *
 * jsdom ships none, and `userEvent.setup()` installs a stub of its own — so
 * this has to be applied AFTER the setup call or user-event's stub is the one
 * the component writes to, and the assertion reads an untouched spy.
 */
function withClipboard(writeText: () => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
    writable: true,
  })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('CodeBlock', () => {
  it('copies the source, not the rendered markup', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn(async () => {})
    withClipboard(writeText)
    render(<CodeBlock code={SOURCE} lang="ts" />)

    await user.click(screen.getByRole('button', { name: 'Copy the snippet' }))

    expect(writeText).toHaveBeenCalledWith(SOURCE)
  })

  it('copies the source even when highlighted markup was supplied', async () => {
    // The failure this exists for: a block that copies what it rendered hands
    // the reader a wall of spans.
    const user = userEvent.setup()
    const writeText = vi.fn(async () => {})
    withClipboard(writeText)
    render(<CodeBlock code={SOURCE} html="<pre><code><span>const</span> a = 1</code></pre>" />)

    await user.click(screen.getByRole('button', { name: 'Copy the snippet' }))

    expect(writeText).toHaveBeenCalledWith(SOURCE)
  })

  it('says so when the copy succeeded', async () => {
    const user = userEvent.setup()
    withClipboard(vi.fn(async () => {}))
    render(<CodeBlock code={SOURCE} />)

    await user.click(screen.getByRole('button', { name: 'Copy the snippet' }))

    // The accessible name carries the state; a drawn tick alone announces
    // nothing.
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument()
  })

  it('survives a clipboard that refuses', async () => {
    const user = userEvent.setup()
    withClipboard(
      vi.fn(async () => {
        throw new Error('denied')
      }),
    )
    render(<CodeBlock code={SOURCE} />)

    // Clipboard access is denied in an insecure context and inside some embeds.
    // The snippet is still selectable, so the page must not go down with it.
    await user.click(screen.getByRole('button', { name: 'Copy the snippet' }))

    expect(screen.getByRole('button', { name: 'Copy the snippet' })).toBeInTheDocument()
  })

  it('scrolls past maxHeight rather than clipping it', () => {
    render(<CodeBlock code={SOURCE} maxHeight="12rem" label="Example" />)

    const body = screen.getByRole('group', { name: 'Example' })
    expect(body).toHaveStyle({ maxHeight: '12rem' })
    expect(body.className).toContain('overflow-auto')
    expect(body.className).not.toContain('overflow-hidden')
    // A capped box whose contents cannot be reached by keyboard is a box with
    // half its content missing for anyone not using a mouse.
    expect(body).toHaveAttribute('tabindex', '0')
  })

  it('announces the scrolling body without making it a landmark', () => {
    // Both halves matter. The body is named, so the tab stop announces what the
    // reader has arrived in rather than dropping them into an anonymous box —
    // and it is a group rather than a region, so three fenced blocks in one
    // article are three snippets rather than three landmarks all called "Code".
    render(<CodeBlock code={SOURCE} />)

    const body = screen.getByRole('group', { name: 'Code' })
    expect(body).toHaveAttribute('tabindex', '0')
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('leaves the body uncapped when no maxHeight is given', () => {
    render(<CodeBlock code={SOURCE} />)
    expect(screen.getByRole('group', { name: 'Code' }).style.maxHeight).toBe('')
  })

  it('numbers every line, including the blank ones', () => {
    const { container } = render(<CodeBlock code={SOURCE} lineNumbers />)

    const rows = [...container.querySelectorAll('[data-line]')]
    expect(rows).toHaveLength(SOURCE.split('\n').length)

    // The number is a CHILD of the line it numbers, so alignment is structural
    // rather than two columns agreeing about a line-height. Row three is the
    // blank one; its number still has to be there and still has to be three.
    expect(rows.map((row) => row.getAttribute('data-line'))).toEqual(['1', '2', '3', '4'])
    expect(rows[1].textContent).toBe('2')
    expect(rows[2].textContent).toBe('3export default a')
  })

  it('bands only the lines it was asked to', () => {
    const { container } = render(<CodeBlock code={SOURCE} highlightLines={[2, 99]} />)

    const banded = [...container.querySelectorAll('[data-highlighted]')]
    // 99 is past the end and is ignored rather than throwing — the usual cause
    // is a snippet that got shorter while the annotation did not.
    expect(banded.map((row) => row.getAttribute('data-line'))).toEqual(['2'])
  })

  it('names the body after the title when no label is given', () => {
    render(<CodeBlock code={SOURCE} title="cn.ts" />)
    expect(screen.getByRole('group', { name: 'cn.ts' })).toBeInTheDocument()
  })

  it('prints a language label, and none at all when the language is unknown', () => {
    const { rerender } = render(<CodeBlock code={SOURCE} lang="bash" />)
    expect(screen.getByText('Shell')).toBeInTheDocument()

    rerender(<CodeBlock code={SOURCE} />)
    expect(screen.queryByText('Shell')).not.toBeInTheDocument()
  })

  it('drops the copy button when asked', () => {
    render(<CodeBlock code={SOURCE} copyable={false} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders an empty snippet as one empty line rather than nothing', () => {
    const { container } = render(<CodeBlock code="" lineNumbers />)
    expect(container.querySelectorAll('[data-line]')).toHaveLength(1)
  })
})

describe('CodeBlock copy state', () => {
  beforeEach(() => resetWarnings())
  afterEach(() => vi.useRealTimers())

  // Plain fake timers and a direct click: `shouldAdvanceTime` lets the test's
  // own real duration leak into the clock and close the window early.
  it('returns to the copy label once the confirmation window closes', async () => {
    vi.useFakeTimers()
    withClipboard(vi.fn(async () => {}))
    render(<CodeBlock code={SOURCE} />)

    await act(async () => { screen.getByRole('button', { name: 'Copy the snippet' }).click() })
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()

    act(() => { vi.advanceTimersByTime(COPIED_RESET_MS - 1) })
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(1) })
    expect(screen.getByRole('button', { name: 'Copy the snippet' })).toBeInTheDocument()
  })

  it('gives a second copy its own full confirmation window', async () => {
    vi.useFakeTimers()
    withClipboard(vi.fn(async () => {}))
    render(<CodeBlock code={SOURCE} />)

    await act(async () => { screen.getByRole('button', { name: 'Copy the snippet' }).click() })
    act(() => { vi.advanceTimersByTime(COPIED_RESET_MS - 200) })
    await act(async () => { screen.getByRole('button', { name: 'Copied' }).click() })
    act(() => { vi.advanceTimersByTime(COPIED_RESET_MS - 1) })
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(1) })
    expect(screen.getByRole('button', { name: 'Copy the snippet' })).toBeInTheDocument()
  })

  it('stops claiming success when a later write is refused, and says why in development', async () => {
    const user = userEvent.setup()
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const writeText = vi.fn<() => Promise<void>>().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('denied'))
    withClipboard(writeText)
    render(<CodeBlock code={SOURCE} />)

    await user.click(screen.getByRole('button', { name: 'Copy the snippet' }))
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Copied' }))

    expect(screen.getByRole('button', { name: 'Copy the snippet' })).toBeInTheDocument()
    expect(consoleWarn).toHaveBeenCalledTimes(1)
    expect(consoleWarn.mock.calls[0]![0]).toContain('CLIPBOARD_WRITE_REJECTED')
    expect(consoleWarn.mock.calls[0]![0]).toContain('CodeBlock.copy')
  })
})
