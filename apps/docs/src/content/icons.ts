import {
  RiAccessibilityLine,
  RiBarChartBoxLine,
  RiBookOpenLine,
  RiBracesLine,
  RiCompass3Line,
  RiCursorLine,
  RiFileTextLine,
  RiFlowChart,
  RiFocus3Line,
  RiGlobalLine,
  RiInputField,
  RiKeyboardLine,
  RiLayout2Line,
  RiLayoutMasonryLine,
  RiLightbulbLine,
  RiLinksLine,
  RiListCheck2,
  RiNotification3Line,
  RiPaletteLine,
  RiPlayCircleLine,
  RiPuzzleLine,
  RiShapesLine,
  RiStackLine,
  RiStickyNoteLine,
  RiTableLine,
  RiContrast2Line,
  type RemixiconComponentType,
} from '@remixicon/react'
import type { ComponentGroup } from './registry'
import type { SectionId } from './sections'

/**
 * The site's icon vocabulary: one glyph per thing a reader navigates by.
 *
 * Kept in one place so a group, a section or a heading draws the same mark in
 * the masthead, the rail, the index and the page — an icon that changes
 * between the sidebar and the page title is two icons, and a reader stops
 * trusting either.
 *
 * Icons carry no colour of their own. Every tile that holds one is painted by
 * `IconTile` from the role tokens: ink for the current thing, stone for the
 * rest. Hue is reserved for charts and for state.
 */
export const SECTION_ICON: Record<SectionId, RemixiconComponentType> = {
  docs: RiBookOpenLine,
  components: RiShapesLine,
  templates: RiLayout2Line,
  themes: RiContrast2Line,
}

/** The guide's foundations section, which is its own tab in the masthead. */
export const FOUNDATIONS_ICON: RemixiconComponentType = RiPaletteLine

export const GROUP_ICON: Record<ComponentGroup, RemixiconComponentType> = {
  Actions: RiCursorLine,
  Forms: RiInputField,
  Navigation: RiCompass3Line,
  Overlays: RiStackLine,
  Feedback: RiNotification3Line,
  Display: RiLayoutMasonryLine,
  Surfaces: RiFileTextLine,
  Data: RiTableLine,
  Charts: RiBarChartBoxLine,
  Diagrams: RiFlowChart,
  Website: RiGlobalLine,
}

/**
 * Each heading on a component page, by its anchor id.
 *
 * The contents rail and the heading itself draw the same glyph, so a reader
 * who spots "Keyboard" in the rail finds the same mark where it lands.
 */
export const HEADING_ICON: Record<string, RemixiconComponentType> = {
  examples: RiPlayCircleLine,
  usage: RiLightbulbLine,
  notes: RiStickyNoteLine,
  anatomy: RiFocus3Line,
  'best-practices': RiListCheck2,
  parts: RiPuzzleLine,
  reexports: RiLinksLine,
  types: RiBracesLine,
  keyboard: RiKeyboardLine,
  accessibility: RiAccessibilityLine,
  related: RiLinksLine,
  props: RiListCheck2,
}
