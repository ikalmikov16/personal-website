import { useState, useRef, useCallback, useEffect } from 'react'
import { getWallpaperStyle } from '../data/wallpapers'
import { DESKTOP_ICONS } from '../constants/apps'
import type { DesktopIconItem } from '../types/ui'
import type { ContextMenuState } from './ContextMenu'

const MENU_BAR_HEIGHT = 22
const ICON_W = 80
const ICON_H = 100
const DRAG_THRESHOLD = 5
const STORAGE_KEY = 'ika-os-icon-positions'

function getDefaultPosition(index: number): { x: number; y: number } {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
  return {
    x: vw - 24 - ICON_W,
    y: MENU_BAR_HEIGHT + 16 + index * ICON_H,
  }
}

function clampToViewport(px: number, py: number): { x: number; y: number } {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
  const vh = typeof window !== 'undefined' ? window.innerHeight : 768
  const dockH = 64
  return {
    x: Math.max(0, Math.min(px, vw - ICON_W)),
    y: Math.max(MENU_BAR_HEIGHT, Math.min(py, vh - dockH - ICON_H)),
  }
}

function loadPositions(): Record<string, { x: number; y: number }> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function savePositions(positions: Record<string, { x: number; y: number }>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
  } catch {
    /* ignore */
  }
}

type DesktopProps = {
  wallpaperId?: string
  onOpenWindow?: (appId: string, title: string) => void
  onContextMenu?: (state: ContextMenuState) => void
}

export function Desktop({ wallpaperId = 'default', onOpenWindow, onContextMenu }: DesktopProps) {
  const [iconPositions, setIconPositions] =
    useState<Record<string, { x: number; y: number }>>(loadPositions)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const dragRef = useRef<{
    appId: string
    startMouseX: number
    startMouseY: number
    startIconX: number
    startIconY: number
    moved: boolean
  } | null>(null)

  useEffect(() => {
    savePositions(iconPositions)
  }, [iconPositions])

  const getIconPosition = useCallback(
    (icon: DesktopIconItem, index: number) => {
      return iconPositions[icon.appId] ?? getDefaultPosition(index)
    },
    [iconPositions]
  )

  const cleanUpIcons = useCallback(() => {
    setIconPositions({})
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const handleDesktopContextMenu = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('.desktop-icon')) return
      e.preventDefault()
      onContextMenu?.({
        x: e.clientX,
        y: e.clientY,
        items: [
          { type: 'item', label: 'New Folder', disabled: true },
          { type: 'separator' },
          {
            type: 'item',
            label: 'Change Desktop Background...',
            action: () => onOpenWindow?.('systempreferences', 'System Preferences'),
          },
          { type: 'item', label: 'Clean Up', action: cleanUpIcons },
        ],
      })
    },
    [onContextMenu, onOpenWindow, cleanUpIcons]
  )

  const handleIconContextMenu = useCallback(
    (e: React.MouseEvent, icon: DesktopIconItem) => {
      e.preventDefault()
      e.stopPropagation()
      onContextMenu?.({
        x: e.clientX,
        y: e.clientY,
        items: [
          { type: 'item', label: 'Open', action: () => onOpenWindow?.(icon.appId, icon.title) },
          { type: 'item', label: 'Get Info', disabled: true },
          { type: 'separator' },
          { type: 'item', label: 'Move to Trash', disabled: true },
        ],
      })
    },
    [onContextMenu, onOpenWindow]
  )

  const handleIconMouseDown = useCallback(
    (e: React.MouseEvent, icon: DesktopIconItem, index: number) => {
      if (e.button !== 0) return
      const pos = getIconPosition(icon, index)
      dragRef.current = {
        appId: icon.appId,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startIconX: pos.x,
        startIconY: pos.y,
        moved: false,
      }

      const onMouseMove = (ev: MouseEvent) => {
        const dr = dragRef.current
        if (!dr) return
        const dx = ev.clientX - dr.startMouseX
        const dy = ev.clientY - dr.startMouseY
        if (!dr.moved && Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return
        dr.moved = true
        setDraggingId(dr.appId)
        setIconPositions((prev) => ({
          ...prev,
          [dr.appId]: { x: dr.startIconX + dx, y: dr.startIconY + dy },
        }))
      }

      const onMouseUp = () => {
        const dr = dragRef.current
        if (dr?.moved) {
          setIconPositions((prev) => {
            const raw = prev[dr.appId]
            if (!raw) return prev
            return { ...prev, [dr.appId]: clampToViewport(raw.x, raw.y) }
          })
        }
        dragRef.current = null
        setDraggingId(null)
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    [getIconPosition]
  )

  const handleDoubleClick = useCallback(
    (icon: DesktopIconItem) => {
      if (dragRef.current?.moved) return
      onOpenWindow?.(icon.appId, icon.title)
    },
    [onOpenWindow]
  )

  return (
    <div
      className="desktop"
      style={getWallpaperStyle(wallpaperId)}
      onContextMenu={handleDesktopContextMenu}
    >
      <div className="desktop-icons">
        {DESKTOP_ICONS.map((icon, index) => {
          const pos = getIconPosition(icon, index)
          const isDragging = draggingId === icon.appId
          return (
            <button
              key={icon.label}
              type="button"
              className={`desktop-icon${isDragging ? ' desktop-icon--dragging' : ''}`}
              style={{ left: pos.x, top: pos.y }}
              onDoubleClick={() => handleDoubleClick(icon)}
              onMouseDown={(e) => handleIconMouseDown(e, icon, index)}
              onContextMenu={(e) => handleIconContextMenu(e, icon)}
              title={`Open ${icon.label}`}
              aria-label={`${icon.label}`}
            >
              <span className="desktop-icon-image" aria-hidden>
                {icon.icon ? (
                  <img src={icon.icon} alt="" className="desktop-icon-img" draggable={false} />
                ) : (
                  icon.label.charAt(0)
                )}
              </span>
              <span className="desktop-icon-label">{icon.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
