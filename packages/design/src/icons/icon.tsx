import type { LucideIcon, LucideProps } from 'lucide-react'
import type { ComponentType, ReactElement } from 'react'

/**
 * What a component prop that takes an icon accepts — `icon={Settings}`.
 *
 * Deliberately narrower than any one icon set's props: a size, a class and the
 * hidden flag are all a component in this package passes, so a glyph from this
 * module, a bare Lucide icon or a Remix brand mark all fit.
 */
export type IconComponent = ComponentType<{ size?: number | string; className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>

/** The props of an icon from `@misoto22/folio/icons`: Lucide's own. */
export type FolioIconProps = LucideProps

/**
 * A Lucide glyph drawn at the system's weight.
 *
 * The stroke comes from `--ico-stroke` through an inline style, which outranks
 * the `stroke-width` attribute Lucide writes, so the weight is a token rather
 * than a number repeated at every call site. Passing `strokeWidth` opts out and
 * the attribute wins again. With no `size`, the box is `--ico-m` for the same
 * reason. Caps and joins are already round in Lucide's geometry.
 */
export function folioIcon(Glyph: LucideIcon): (props: FolioIconProps) => ReactElement {
  function Icon({ size, strokeWidth, style, ...rest }: FolioIconProps) {
    const tokenStyle = {
      ...(strokeWidth == null ? { strokeWidth: 'var(--ico-stroke)' } : null),
      ...(size == null ? { width: 'var(--ico-m)', height: 'var(--ico-m)' } : null),
      ...style,
    }
    return <Glyph size={size} strokeWidth={strokeWidth} style={tokenStyle} {...rest} />
  }
  Icon.displayName = Glyph.displayName
  return Icon
}
