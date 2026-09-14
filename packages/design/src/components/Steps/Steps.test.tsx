import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Steps } from './Steps'

const STEPS = [
  { title: 'Corpus', note: 'Blog MDX' },
  { title: 'Chunking', note: 'By heading', current: true },
  { title: 'Answer' },
]

describe('Steps', () => {
  it('is an ordered list that counts from one and marks only the current step', () => {
    render(<Steps label="How an answer is built" steps={STEPS} />)

    const list = screen.getByRole('list', { name: 'How an answer is built' })
    expect(list.tagName).toBe('OL')
    const items = screen.getAllByRole('listitem')
    expect(items.map((item) => item.querySelector(':scope > span.rounded-full')!.textContent)).toEqual(['1', '2', '3'])
    expect(items.map((item) => item.getAttribute('aria-current'))).toEqual([null, 'step', null])
    expect(items[1]!.querySelector(':scope > span.rounded-full')!.className).toContain('bg-(--accent)')
  })

  it('prints a note only when there is one, and no connector after the last step', () => {
    render(<Steps steps={STEPS} />)

    const items = screen.getAllByRole('listitem')
    expect(screen.getByText('By heading')).toBeInTheDocument()
    expect(items[2]!.querySelectorAll('.mono-meta')).toHaveLength(0)
    expect(items.map((item) => item.querySelectorAll(':scope > span.w-px').length)).toEqual([1, 1, 0])
  })

  it('drops the digit for a rule marker', () => {
    render(<Steps marker="rule" steps={STEPS} />)

    const marker = screen.getAllByRole('listitem')[0]!.querySelector(':scope > span.rounded-full')!
    expect(marker.textContent).toBe('')
    expect(marker.className).toContain('text-[0px]')
  })

  it('renders nothing for an empty sequence', () => {
    const { container } = render(<Steps steps={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
