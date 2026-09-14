import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { resetWarnings } from './warn'
import { Field } from '../components/Field/Field'
import { Input } from '../components/Input/Input'
import { Button } from '../components/Button/Button'
import { Table, TBody, TD, TR } from '../components/Table/Table'
import { Progress } from '../components/Progress/Progress'

/**
 * The warnings exist for failures that are invisible, so a test that only
 * checked the happy path would be asserting the same nothing the user sees.
 *
 * Each case below is one the skill in this package documents in prose. Prose
 * only reaches a reader who went looking, and the whole problem is that nothing
 * told them to look — so these assert the component says it at the moment it
 * happens, and says enough to repair the call: a stable code, the offending
 * field, and an imperative fix.
 */
describe('development warnings', () => {
  let warned: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    resetWarnings()
    warned = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warned.mockRestore()
  })

  const message = () => warned.mock.calls.map((call) => String(call[0])).join('\n')

  it('says so when a Field wires a wrapper instead of a control', () => {
    // The failure that looks most correct. A div IS a valid element, so Field
    // clones it: the id, the describedby and the invalid state all land on the
    // box, the Input inside gets none of them, and the browser shows nothing
    // wrong.
    render(
      <Field label="Amount">
        <div>
          <Input />
        </div>
      </Field>,
    )

    expect(warned).toHaveBeenCalled()
    expect(message()).toContain('FIELD_CONTROL_NOT_LABELLABLE')
    expect(message()).toContain('<div>')
    expect(message()).toContain('field: children')
    // The fix has to be self-sufficient: assume nobody opens the docs.
    expect(message()).toContain('no wrapper')
  })

  it('says so when a Field has no single element to wire at all', () => {
    render(
      <Field label="Amount">
        <Input />
        <Input />
      </Field>,
    )
    expect(message()).toContain('FIELD_CONTROL_NOT_WIRED')
    expect(message()).toContain('field: children')
  })

  it('stays quiet for a bare host control', () => {
    // A raw <input> is labellable, so wiring it is correct and silent.
    render(
      <Field label="Amount">
        <input />
      </Field>,
    )
    expect(warned).not.toHaveBeenCalled()
  })

  it('stays quiet when the Field has a single control child', () => {
    render(
      <Field label="Email">
        <Input type="email" />
      </Field>,
    )
    expect(warned).not.toHaveBeenCalled()
  })

  it('says so when an iconOnly Button has no accessible name', () => {
    render(
      <Button iconOnly>
        <svg />
      </Button>,
    )
    expect(message()).toContain('BUTTON_ICON_ONLY_UNNAMED')
    expect(message()).toContain('aria-label')
  })

  it('accepts either spelling of an accessible name on an iconOnly Button', () => {
    render(
      <Button iconOnly aria-label="Close">
        <svg />
      </Button>,
    )
    render(
      <Button iconOnly aria-labelledby="heading">
        <svg />
      </Button>,
    )
    expect(warned).not.toHaveBeenCalled()
  })

  it('treats a blank required name as the empty thing it is', () => {
    // The type is satisfied and the table is still anonymous. This is exactly
    // what a model writes when it knows a prop is mandatory and has nothing to
    // put in it.
    render(
      <Table caption="">
        <TBody>
          <TR>
            <TD>Acme</TD>
          </TR>
        </TBody>
      </Table>,
    )
    expect(message()).toContain('REQUIRED_NAME_BLANK')
    expect(message()).toContain('Table.caption')
  })

  it('stays quiet when the required name says something', () => {
    render(
      <Table caption="Invoices awaiting payment">
        <TBody>
          <TR>
            <TD>Acme</TD>
          </TR>
        </TBody>
      </Table>,
    )
    expect(warned).not.toHaveBeenCalled()
  })

  it('warns once per problem, however many times it renders', () => {
    // React renders twice under StrictMode and again on every state change. A
    // warning printed each time is noise that trains people to ignore it.
    const { rerender } = render(<Progress value={40} label="" />)
    rerender(<Progress value={50} label="" />)
    rerender(<Progress value={60} label="" />)
    expect(warned).toHaveBeenCalledTimes(1)
  })

  it('names the component to ask about', () => {
    render(<Progress value={10} label="" />)
    expect(message()).toContain('npx @misoto22/folio docs Progress')
  })
})
