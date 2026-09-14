import { Kbd } from '@misoto22/folio'

/**
 * A shortcut inside the sentence that explains it. The space between two caps
 * is a real space in the markup, not something the component draws, and each
 * cap is its own kbd element — which is what tells a screen reader the run is a
 * key rather than a word. Nothing here binds anything, so print a key only
 * where a handler is actually listening for it.
 */
export function Example() {
  return (
    <p className="m-0 text-sm text-(--ink-2)">
      Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the palette, or <Kbd>Esc</Kbd> to close it.
    </p>
  )
}
