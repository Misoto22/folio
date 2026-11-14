import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Calendar } from './Calendar'

const JANUARY_2026 = new Date(2026, 0, 1)

const openPicker = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: /January 2026/ }))
  return screen.getByRole('dialog', { name: 'Month and year' })
}

describe('Calendar month picker', () => {
  it('keeps Tab inside the panel, which is opaque and covers the grid', async () => {
    const user = userEvent.setup()
    render(<Calendar mode="single" defaultMonth={JANUARY_2026} />)
    const panel = await openPicker(user)

    // The day grid is still mounted underneath an opaque --paper panel. Tab
    // used to walk straight into it, leaving the reader on a control they can
    // neither see nor — once focus is out of the caption — dismiss.
    within(panel).getByRole('button', { name: 'Dec' }).focus()
    await user.tab()

    expect(panel).toContainElement(document.activeElement as HTMLElement)
  })

  it('wraps backwards too', async () => {
    const user = userEvent.setup()
    render(<Calendar mode="single" defaultMonth={JANUARY_2026} />)
    const panel = await openPicker(user)

    within(panel).getByRole('button', { name: 'Previous year' }).focus()
    await user.tab({ shift: true })

    expect(panel).toContainElement(document.activeElement as HTMLElement)
  })

  it('still answers Escape after the reader has tabbed to the end of it', async () => {
    const user = userEvent.setup()
    render(<Calendar mode="single" defaultMonth={JANUARY_2026} />)
    const panel = await openPicker(user)

    within(panel).getByRole('button', { name: 'Dec' }).focus()
    await user.tab()
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog', { name: 'Month and year' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /January 2026/ })).toHaveFocus()
  })

  it('announces the panel as a dialog, now that focus really does stay in it', async () => {
    const user = userEvent.setup()
    render(<Calendar mode="single" defaultMonth={JANUARY_2026} />)

    await user.click(screen.getByRole('button', { name: /January 2026/ }))
    expect(screen.getByRole('dialog', { name: 'Month and year' })).toBeInTheDocument()
  })
})

describe('Calendar picker in a language other than English', () => {
  it('names the month panel and the controls that step its year', async () => {
    const user = userEvent.setup()
    render(
      <Calendar
        mode="single"
        defaultMonth={JANUARY_2026}
        monthPanelLabel="月份和年份"
        previousYearLabel="上一年"
        nextYearLabel="下一年"
      />,
    )

    await user.click(screen.getByRole('button', { name: /January 2026/ }))
    const panel = screen.getByRole('dialog', { name: '月份和年份' })

    // The month names already follow `locale`, which is what made the chrome
    // around them look like an oversight rather than a policy.
    expect(within(panel).getByRole('button', { name: '上一年' })).toBeInTheDocument()
    expect(within(panel).getByRole('button', { name: '下一年' })).toBeInTheDocument()
  })

  it('names the year panel and the controls that page it', async () => {
    const user = userEvent.setup()
    render(
      <Calendar
        mode="single"
        defaultMonth={JANUARY_2026}
        startMonth={new Date(1960, 0)}
        endMonth={new Date(2036, 11)}
        yearPanelLabel="年份"
        earlierYearsLabel="更早的年份"
        laterYearsLabel="更晚的年份"
      />,
    )

    await user.click(screen.getByRole('button', { name: /January 2026/ }))
    await user.click(screen.getByRole('button', { name: '2026' }))
    const panel = screen.getByRole('dialog', { name: '年份' })

    expect(within(panel).getByRole('button', { name: '更早的年份' })).toBeInTheDocument()
    expect(within(panel).getByRole('button', { name: '更晚的年份' })).toBeInTheDocument()
  })

  it('still says the English words when nothing else is offered', async () => {
    const user = userEvent.setup()
    render(<Calendar mode="single" defaultMonth={JANUARY_2026} />)

    await user.click(screen.getByRole('button', { name: /January 2026/ }))
    const panel = screen.getByRole('dialog', { name: 'Month and year' })
    expect(within(panel).getByRole('button', { name: 'Previous year' })).toBeInTheDocument()
    expect(within(panel).getByRole('button', { name: 'Next year' })).toBeInTheDocument()
  })
})

describe('Calendar day buttons', () => {
  it('lead their name with the number they show, so a voice user can say it', () => {
    render(<Calendar mode="single" defaultMonth={JANUARY_2026} />)
    const day = screen.getByRole('button', { name: /^2, .*January 2nd, 2026$/ })

    // WCAG 2.5.3: the visible text has to be part of the name, as a word —
    // "2nd" alone is not "2", which is what the library's own name left.
    expect(day).toHaveTextContent(/^2$/)
  })

  it('keeps the library notes for today and the selected day after the date', () => {
    const today = new Date()
    render(<Calendar mode="single" selected={today} defaultMonth={today} />)

    const name = screen.getByRole('button', { name: /^\d+, Today, .*, selected$/ }).getAttribute('aria-label')
    expect(name?.startsWith(`${today.getDate()}, `)).toBe(true)
  })

  it('names the cells of a calendar with no mode the same way', () => {
    render(<Calendar defaultMonth={JANUARY_2026} />)

    // No `mode` means no buttons: the library draws plain grid cells instead,
    // and names them through a different label function.
    expect(screen.queryByRole('button', { name: /January 2nd/ })).toBeNull()
    expect(screen.getByRole('gridcell', { name: /^2, .*January 2nd, 2026$/ })).toHaveTextContent(/^2$/)
  })

  it('lets a consumer replace the name, and merges the rest of their labels', () => {
    render(
      <Calendar
        mode="single"
        defaultMonth={JANUARY_2026}
        labels={{ labelDayButton: (date) => `Day ${date.getDate()}`, labelNext: () => 'Forward' }}
      />,
    )

    expect(screen.getByRole('button', { name: 'Day 2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Forward' })).toBeInTheDocument()
  })
})
