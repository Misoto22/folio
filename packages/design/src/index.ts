/**
 * @misoto22/folio — public entry.
 *
 * Components export from here; the look ships separately as CSS:
 *
 *   import '@misoto22/folio/styles.css'    // compiled Tailwind + tokens + fonts
 *
 * or, for an app that already compiles Tailwind itself, the portable layers on
 * their own:
 *
 *   import '@misoto22/folio/tokens.css'    // primitives, plus data-mode and data-density
 *   import '@misoto22/folio/semantic.css'  // roles
 *   import '@misoto22/folio/themes.css'    // the other six theming axes
 *   import '@misoto22/folio/keyframes.css' // motion
 *
 * All four, or the theming attributes are attributes that do nothing: every
 * axis but `data-mode` and `data-density` is declared only in `themes.css`, and
 * an app that skips it writes `data-radius="sharp"` and gets no error, no
 * warning and no corner.
 *
 * Everything below is a consumer contract. Adding an export is cheap; changing
 * or removing one is a breaking change (DESIGN-API-001).
 */

// ─── Utilities ───
export * from './lib/overlay-container'

// ─── Tokens ───
export { BRAND } from './tokens/brand'
export type { BrandColor } from './tokens/brand'

// ─── Utilities ───
export { cn } from './lib/cn'
export { CONTROL_BASE, CONTROL_BORDER, isInvalid } from './lib/control'
export { useSelectionIndicator } from './lib/useSelectionIndicator'
export type { IndicatorStyle } from './lib/useSelectionIndicator'

// ─── Actions ───
export * from './components/Button/Button'
export * from './components/FloatingIconButton/FloatingIconButton'

// ─── Display ───
export * from './components/Text/Text'
export * from './components/Heading/Heading'
export * from './components/Code/Code'
export * from './components/CodeBlock/CodeBlock'
export * from './components/Markdown/Markdown'
export * from './components/Badge/Badge'
export * from './components/Tag/Tag'
export * from './components/Kbd/Kbd'
export * from './components/Avatar/Avatar'
export * from './components/StatusDot/StatusDot'
export * from './components/Metric/Metric'
export * from './components/StatusPill/StatusPill'
export * from './components/LinkArrow/LinkArrow'
export * from './components/Separator/Separator'
export * from './components/Timestamp/Timestamp'
export * from './components/FigureBand/FigureBand'

// ─── Feedback ───
export * from './components/Spinner/Spinner'
export * from './components/Skeleton/Skeleton'
export * from './components/Progress/Progress'
export * from './components/Alert/Alert'
export * from './components/EmptyState/EmptyState'
export * from './components/ErrorState/ErrorState'
export * from './components/Toast/Toast'

// ─── Forms ───
export * from './components/Field/Field'
export * from './components/ColorPicker/ColorPicker'
export * from './components/Combobox/Combobox'
export * from './components/DatePicker/DatePicker'
export * from './components/NumberField/NumberField'
export * from './components/Slider/Slider'
export * from './components/ToggleGroup/ToggleGroup'
export * from './components/Input/Input'
export * from './components/Textarea/Textarea'
export * from './components/Select/Select'
export * from './components/NativeSelect/NativeSelect'
export * from './components/Checkbox/Checkbox'
export * from './components/RadioGroup/RadioGroup'
export * from './components/Switch/Switch'

// ─── Overlays ───
export * from './components/Dialog/Dialog'
export * from './components/DropdownMenu/DropdownMenu'
export * from './components/Tooltip/Tooltip'
export * from './components/Popover/Popover'
export * from './components/Sheet/Sheet'
export * from './components/ContextMenu/ContextMenu'
export * from './components/Command/Command'
export * from './components/SearchableMenu/SearchableMenu'

// ─── Navigation ───
export * from './components/Tabs/Tabs'
export * from './components/Accordion/Accordion'
export * from './components/Collapsible/Collapsible'
export * from './components/Breadcrumb/Breadcrumb'
export * from './components/Pagination/Pagination'
export * from './components/NavItem/NavItem'
export * from './components/Sidebar/Sidebar'

// ─── Surfaces / layout ───
export * from './components/Card/Card'
export * from './components/Table/Table'
export * from './components/DescriptionList/DescriptionList'
export * from './components/Toolbar/Toolbar'
export * from './components/AspectRatio/AspectRatio'
export * from './components/Calendar/Calendar'
export * from './components/ScrollArea/ScrollArea'
export * from './components/AppShell/AppShell'
export * from './components/PageHeader/PageHeader'
export * from './components/Article/Article'
export * from './components/Diagram/Diagram'
export * from './components/Steps/Steps'
