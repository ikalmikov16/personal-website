import { useRef, useCallback } from 'react'
import { STICKY_COLORS } from './sticky-data'
import type { StickyNoteData } from './sticky-data'

const MIN_W = 140
const MIN_H = 100
const MAX_W = 600
const MAX_H = 700

type StickyNoteProps = {
  note: StickyNoteData
  isFocused: boolean
  onFocus: () => void
  onClose: () => void
  onTextChange: (text: string) => void
  onPositionChange: (x: number, y: number) => void
  onSizeChange: (width: number, height: number) => void
  onContextMenu?: (e: React.MouseEvent) => void
}

export function StickyNote({
  note,
  isFocused,
  onFocus,
  onClose,
  onTextChange,
  onPositionChange,
  onSizeChange,
  onContextMenu,
}: StickyNoteProps) {
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(
    null
  )
  const resizeRef = useRef<{ startX: number; startY: number; origW: number; origH: number } | null>(
    null
  )

  const colors = STICKY_COLORS[note.color]

  const handleHeaderMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('.sticky-note-close')) return
      e.preventDefault()
      onFocus()
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: note.x,
        origY: note.y,
      }

      const onMove = (ev: MouseEvent) => {
        const d = dragRef.current
        if (!d) return
        onPositionChange(d.origX + ev.clientX - d.startX, d.origY + ev.clientY - d.startY)
      }
      const onUp = () => {
        dragRef.current = null
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
      }
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    },
    [note.x, note.y, onFocus, onPositionChange]
  )

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      onFocus()
      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origW: note.width,
        origH: note.height,
      }

      const onMove = (ev: MouseEvent) => {
        const r = resizeRef.current
        if (!r) return
        const w = Math.max(MIN_W, Math.min(MAX_W, r.origW + ev.clientX - r.startX))
        const h = Math.max(MIN_H, Math.min(MAX_H, r.origH + ev.clientY - r.startY))
        onSizeChange(w, h)
      }
      const onUp = () => {
        resizeRef.current = null
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
      }
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    },
    [note.width, note.height, onFocus, onSizeChange]
  )

  return (
    <div
      className={`sticky-note${isFocused ? ' sticky-note--focused' : ''}`}
      style={{
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height,
        zIndex: note.zIndex,
      }}
      onMouseDown={onFocus}
    >
      <div
        className="sticky-note-header"
        style={{ background: colors.header, borderBottomColor: colors.border }}
        onMouseDown={handleHeaderMouseDown}
        onContextMenu={onContextMenu}
      >
        <button
          type="button"
          className="sticky-note-close"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          aria-label="Close note"
        >
          ×
        </button>
      </div>

      <textarea
        className="sticky-note-text"
        style={{ background: colors.bg }}
        value={note.text}
        onChange={(e) => onTextChange(e.target.value)}
        onFocus={onFocus}
        placeholder="New Note"
        spellCheck={false}
      />

      <div
        className="sticky-note-resize"
        onMouseDown={handleResizeMouseDown}
        aria-label="Resize note"
      />
    </div>
  )
}
