import { useCallback } from 'react'
import { StickyNote } from './StickyNote'
import type { StickyNoteData } from './sticky-data'
import { STICKY_COLOR_LABELS } from './sticky-data'
import type { ContextMenuState } from '../ContextMenu'

type StickiesAppProps = {
  isOpen: boolean
  notes: StickyNoteData[]
  focusedNoteId: string | null
  onFocusNote: (id: string) => void
  onCloseNote: (id: string) => void
  onUpdateNote: (id: string, updates: Partial<StickyNoteData>) => void
  onContextMenu?: (state: ContextMenuState) => void
}

export function StickiesApp({
  isOpen,
  notes,
  focusedNoteId,
  onFocusNote,
  onCloseNote,
  onUpdateNote,
  onContextMenu,
}: StickiesAppProps) {
  const handleNoteContextMenu = useCallback(
    (e: React.MouseEvent, noteId: string) => {
      e.preventDefault()
      e.stopPropagation()
      onContextMenu?.({
        x: e.clientX,
        y: e.clientY,
        items: STICKY_COLOR_LABELS.map(({ color, label }) => ({
          type: 'item' as const,
          label: `● ${label}`,
          action: () => onUpdateNote(noteId, { color }),
        })),
      })
    },
    [onContextMenu, onUpdateNote]
  )

  if (!isOpen || notes.length === 0) return null

  return (
    <div className="stickies-layer">
      {notes.map((note) => (
        <StickyNote
          key={note.id}
          note={note}
          isFocused={focusedNoteId === note.id}
          onFocus={() => onFocusNote(note.id)}
          onClose={() => onCloseNote(note.id)}
          onTextChange={(text) => onUpdateNote(note.id, { text })}
          onPositionChange={(x, y) => onUpdateNote(note.id, { x, y })}
          onSizeChange={(width, height) => onUpdateNote(note.id, { width, height })}
          onContextMenu={(e) => handleNoteContextMenu(e, note.id)}
        />
      ))}
    </div>
  )
}
