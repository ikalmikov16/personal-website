import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { WindowPosition, WindowSize } from '../types/window'
import {
  DEFAULT_WINDOW_SIZE,
  MIN_WINDOW_WIDTH,
  MIN_WINDOW_HEIGHT,
  MAX_WINDOW_WIDTH,
  MAX_WINDOW_HEIGHT,
} from '../types/window'

type ResizeHandle =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

type WindowProps = {
  id: string
  title: string
  position: WindowPosition
  size?: WindowSize
  zIndex?: number
  isFocused?: boolean
  playOpenAnimation?: boolean
  children: ReactNode
  onClose?: () => void
  onFocus?: () => void
  onMinimize?: () => void
  onZoom?: () => void
  onPositionChange?: (x: number, y: number) => void
  onSizeChange?: (width: number, height: number) => void
}

const MENU_BAR_HEIGHT = 22
const DOCK_HEIGHT = 64

function clamp(min: number, value: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function clampPosition(x: number, y: number, w: number, h: number) {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 800
  const vh = typeof window !== 'undefined' ? window.innerHeight : 600
  const minX = 0
  const minY = MENU_BAR_HEIGHT
  const maxX = Math.max(minX, vw - w)
  const maxY = Math.max(minY, vh - DOCK_HEIGHT - h)
  return {
    x: clamp(minX, x, maxX),
    y: clamp(minY, y, maxY),
  }
}

const HANDLE_LIST: ResizeHandle[] = [
  'top',
  'right',
  'bottom',
  'left',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
]

export function Window({
  id,
  title,
  position,
  size = DEFAULT_WINDOW_SIZE,
  zIndex = 0,
  isFocused,
  playOpenAnimation = true,
  children,
  onClose,
  onFocus,
  onMinimize,
  onZoom,
  onPositionChange,
  onSizeChange,
}: WindowProps) {
  const [isOpening, setIsOpening] = useState(playOpenAnimation)
  const dragOffsetRef = useRef<{ x: number; y: number } | null>(null)
  const resizeRef = useRef<{
    handle: ResizeHandle
    startX: number
    startY: number
    startW: number
    startH: number
    startPosX: number
    startPosY: number
  } | null>(null)

  useEffect(() => {
    if (!isOpening) return
    const timeout = window.setTimeout(() => setIsOpening(false), 250)
    return () => window.clearTimeout(timeout)
  }, [isOpening])

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest?.('.traffic-light')) return
    if (target.closest?.('.window-resize-handle')) return
    if (!onPositionChange) return
    dragOffsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    }
    const onMouseMove = (e: MouseEvent) => {
      if (dragOffsetRef.current == null) return
      const rawX = e.clientX - dragOffsetRef.current.x
      const rawY = e.clientY - dragOffsetRef.current.y
      const { x, y } = clampPosition(rawX, rawY, size.width, size.height)
      onPositionChange(x, y)
    }
    const onMouseUp = () => {
      dragOffsetRef.current = null
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const handleResizeMouseDown = (handle: ResizeHandle, e: React.MouseEvent) => {
    if (e.button !== 0) return
    e.stopPropagation()
    if (!onSizeChange) return
    resizeRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startW: size.width,
      startH: size.height,
      startPosX: position.x,
      startPosY: position.y,
    }
    const onMouseMove = (e: MouseEvent) => {
      const r = resizeRef.current
      if (!r || !onSizeChange) return
      const dx = e.clientX - r.startX
      const dy = e.clientY - r.startY
      let w = r.startW
      let h = r.startH
      let newX = r.startPosX
      let newY = r.startPosY
      switch (r.handle) {
        case 'bottom-right':
          w = r.startW + dx
          h = r.startH + dy
          break
        case 'bottom':
          h = r.startH + dy
          break
        case 'right':
          w = r.startW + dx
          break
        case 'top':
          h = r.startH - dy
          newY = r.startPosY + dy
          break
        case 'left':
          w = r.startW - dx
          newX = r.startPosX + dx
          break
        case 'top-left':
          w = r.startW - dx
          h = r.startH - dy
          newX = r.startPosX + dx
          newY = r.startPosY + dy
          break
        case 'top-right':
          w = r.startW + dx
          h = r.startH - dy
          newY = r.startPosY + dy
          break
        case 'bottom-left':
          w = r.startW - dx
          h = r.startH + dy
          newX = r.startPosX + dx
          break
      }
      w = clamp(MIN_WINDOW_WIDTH, w, MAX_WINDOW_WIDTH)

      const vh = typeof window !== 'undefined' ? window.innerHeight : 600
      const maxH = vh - DOCK_HEIGHT - newY
      h = clamp(MIN_WINDOW_HEIGHT, h, Math.min(MAX_WINDOW_HEIGHT, maxH))

      if (r.handle.includes('left')) newX = r.startPosX + r.startW - w
      if (r.handle.includes('top')) newY = r.startPosY + r.startH - h
      const { x: clampedX, y: clampedY } = clampPosition(newX, newY, w, h)
      onSizeChange(w, h)
      if (onPositionChange) onPositionChange(clampedX, clampedY)
    }
    const onMouseUp = () => {
      resizeRef.current = null
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const getResizeCursor = (handle: ResizeHandle) => {
    switch (handle) {
      case 'top':
      case 'bottom':
        return 'ns-resize'
      case 'left':
      case 'right':
        return 'ew-resize'
      case 'top-left':
      case 'bottom-right':
        return 'nwse-resize'
      case 'top-right':
      case 'bottom-left':
        return 'nesw-resize'
    }
  }

  const windowClass = `window${isFocused === false ? ' window--inactive' : ''}`

  return (
    <div
      className={`window-wrapper${isOpening ? ' window-wrapper--opening' : ''}`}
      style={{ left: position.x, top: position.y, zIndex }}
      data-window-id={id}
      onClick={onFocus}
      role="presentation"
    >
      <div className={windowClass} style={{ width: size.width, height: size.height }}>
        <div
          className="window-title-bar"
          onMouseDown={handleTitleBarMouseDown}
          role="button"
          tabIndex={0}
          aria-label="Drag to move window"
        >
          <div className="traffic-lights">
            <span
              className="traffic-light traffic-light--red"
              onClick={(e) => {
                e.stopPropagation()
                onClose?.()
              }}
              onMouseDown={(e) => e.stopPropagation()}
              role="button"
              aria-label="Close"
            >
              <span className="traffic-light-symbol">×</span>
            </span>
            <span
              className="traffic-light traffic-light--yellow"
              onClick={(e) => {
                e.stopPropagation()
                onMinimize?.()
              }}
              onMouseDown={(e) => e.stopPropagation()}
              role="button"
              aria-label="Minimize"
            >
              <span className="traffic-light-symbol">−</span>
            </span>
            <span
              className="traffic-light traffic-light--green"
              onClick={(e) => {
                e.stopPropagation()
                onZoom?.()
              }}
              onMouseDown={(e) => e.stopPropagation()}
              role="button"
              aria-label="Zoom"
            >
              <span className="traffic-light-symbol">+</span>
            </span>
          </div>
          <span className="window-title">{title}</span>
        </div>
        <div className="window-content">{children}</div>
        {onSizeChange &&
          HANDLE_LIST.map((handle) => (
            <div
              key={handle}
              className={`window-resize-handle window-resize-handle--${handle}`}
              onMouseDown={(e) => handleResizeMouseDown(handle, e)}
              style={{ cursor: getResizeCursor(handle) }}
              aria-label={`Resize ${handle}`}
            />
          ))}
      </div>
    </div>
  )
}
