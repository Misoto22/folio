'use client'

import { useState } from 'react'
import { MediaListRow, MusicFeature } from '@misoto22/folio/website'

/**
 * Recording information and preview state arrive as props from the host player.
 * This example toggles the visible state without loading or playing audio.
 */
export function Example() {
  const [playing, setPlaying] = useState(false)
  return (
    <div className="w-full">
      <MusicFeature label="Selected recording" title="Morning light" description="The Field Ensemble"
        artworkFallback="Artwork unavailable" progress={{ label: 'Playback position', value: 42, max: 180, currentLabel: '0:42', endLabel: '3:00' }} />
      <MediaListRow index={1} title="Morning light" description="The Field Ensemble" trailing="3:00" active={playing}
        preview={{ label: playing ? 'Show paused state' : 'Show playing state', playing, onToggle: () => setPlaying((value) => !value) }} />
    </div>
  )
}
