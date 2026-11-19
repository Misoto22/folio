import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const STYLES = join(dirname(fileURLToPath(import.meta.url)), '..')
const PACKAGE = join(STYLES, '..', '..')
const DOCS_CSS = join(PACKAGE, '..', '..', 'apps', 'docs', 'src', 'app', 'globals.css')

const read = (path: string) => readFileSync(path, 'utf8')
const declared = (css: string) => [...css.matchAll(/^@utility ([\w-]+)/gm)].map(([, name]) => name!)

describe('utilities.css', () => {
  const own = declared(read(join(STYLES, 'utilities.css')))

  it('declares the utilities components name by class', () => {
    expect(own).toEqual(expect.arrayContaining(['eyebrow', 'mono-meta', 'scroll-slim', 'scroll-hairline', 'panel-blur', 'scroll-fade']))
  })

  it('is the only stylesheet in the package that declares a utility', () => {
    const others = readdirSync(STYLES)
      .filter((file) => file.endsWith('.css') && file !== 'utilities.css')
      .filter((file) => declared(read(join(STYLES, file))).length > 0)
    expect(others).toEqual([])
  })

  it('reaches every consumer: the bundle, the exports map and the portable copy', () => {
    expect(read(join(STYLES, 'index.css'))).toContain("@import './utilities.css';")
    expect(JSON.parse(read(join(PACKAGE, 'package.json'))).exports['./utilities.css']).toBe('./dist/utilities.css')
    expect(read(join(PACKAGE, 'scripts', 'copy-portable-css.mjs'))).toContain("'utilities.css'")
  })

  it('is imported by the documentation site rather than copied into it', () => {
    const docs = read(DOCS_CSS)
    expect(docs).toContain("packages/design/src/styles/utilities.css'")
    expect(declared(docs).filter((name) => own.includes(name))).toEqual([])
  })
})
