import { ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import { RiAlignCenter, RiAlignJustify, RiAlignLeft, RiAlignRight } from '@remixicon/react'

const ALIGNMENTS = [
  { value: 'start', label: 'Align left', icon: RiAlignLeft },
  { value: 'center', label: 'Align centre', icon: RiAlignCenter },
  { value: 'end', label: 'Align right', icon: RiAlignRight },
  { value: 'justify', label: 'Justify', icon: RiAlignJustify },
]

/**
 * Four segments carrying a glyph and no word, for a toolbar where the word
 * would only repeat what the row already says. There is no iconOnly path here
 * the way Button has one — nothing strips the text or supplies a name for you —
 * so each segment needs its own aria-label, and a strip without them announces
 * four unnamed buttons. Mind the height as well: segments are --control-h-sm,
 * 36px comfortable and 30px under compact, which is under the 44px pointer
 * floor, so a strip meant for a thumb needs a height of its own.
 */
export function Example() {
  return (
    <ToggleGroup type="single" defaultValue="start" aria-label="Text alignment">
      {ALIGNMENTS.map(({ value, label, icon: Icon }) => (
        <ToggleGroupItem key={value} value={value} aria-label={label} className="px-2.5">
          <Icon size={16} aria-hidden />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
