import { useEffect, useRef, useCallback } from 'react'

export type ContextMenuItem =
  | { type: 'item'; label: string; action?: () => void; disabled?: boolean }
  | { type: 'separator' }

export type ContextMenuState = {
  x: number
  y: number
  items: ContextMenuItem[]
} | null

type ContextMenuProps = {
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const focusedIndexRef = useRef(-1)

  const getActionableIndices = useCallback(() => {
    return items
      .map((item, i) => (item.type === 'item' && !item.disabled ? i : -1))
      .filter((i) => i !== -1)
  }, [items])

  const focusItem = useCallback((index: number) => {
    focusedIndexRef.current = index
    const el = menuRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`)
    el?.focus()
  }, [])

  useEffect(() => {
    const actionable = getActionableIndices()
    if (actionable.length > 0) focusItem(actionable[0])
  }, [getActionableIndices, focusItem])

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current?.contains(e.target as Node)) return
      onClose()
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      const actionable = getActionableIndices()
      if (actionable.length === 0) return
      const currentPos = actionable.indexOf(focusedIndexRef.current)

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = currentPos < actionable.length - 1 ? actionable[currentPos + 1] : actionable[0]
        focusItem(next)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = currentPos > 0 ? actionable[currentPos - 1] : actionable[actionable.length - 1]
        focusItem(prev)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const item = items[focusedIndexRef.current]
        if (item?.type === 'item' && item.action) {
          item.action()
          onClose()
        }
      }
    }
    const handleScroll = () => onClose()

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [items, onClose, getActionableIndices, focusItem])

  const vw = window.innerWidth
  const vh = window.innerHeight
  const menuWidth = 200
  const menuHeight = items.length * 26
  const posX = x + menuWidth > vw ? x - menuWidth : x
  const posY = y + menuHeight > vh ? Math.max(0, y - menuHeight) : y

  return (
    <div
      ref={menuRef}
      className="context-menu"
      role="menu"
      aria-label="Context menu"
      style={{ left: posX, top: posY }}
    >
      {items.map((item, i) => {
        if (item.type === 'separator') {
          return <div key={i} className="context-menu-separator" />
        }
        return (
          <button
            key={i}
            type="button"
            data-index={i}
            className={`context-menu-item${item.disabled ? ' context-menu-item--disabled' : ''}`}
            role="menuitem"
            tabIndex={-1}
            disabled={item.disabled}
            onClick={() => {
              if (item.action) {
                item.action()
                onClose()
              }
            }}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
