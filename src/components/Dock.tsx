/* eslint-disable react-hooks/refs -- Dock intentionally reads iconRefs during render to compute real-time parabolic magnification from live DOM positions */
import { forwardRef, useRef, useState, useCallback, useEffect } from 'react'
import type { AppItem } from '../types/ui'
import type { ContextMenuState } from './ContextMenu'

export type MinimizedThumbnail = {
  windowId: string
  appId: string
  title: string
  snapshot?: HTMLCanvasElement
}

type DockProps = {
  openWindows?: { appId: string; minimized?: boolean }[]
  onOpenOrFocus: (appId: string, title: string) => void
  onCloseApp?: (appId: string) => void
  onContextMenu?: (state: ContextMenuState) => void
  apps: AppItem[]
  rightApps?: AppItem[]
  minimizedThumbnails?: MinimizedThumbnail[]
  onRestoreWindow?: (windowId: string) => void
}

const BASE_SIZE = 48
const MAX_EXTRA_SCALE = 0.55
const SIGMA = 50

function getScale(iconCenterX: number, mouseX: number | null): number {
  if (mouseX === null) return 1
  const dist = Math.abs(iconCenterX - mouseX)
  return 1 + MAX_EXTRA_SCALE * Math.exp(-(dist * dist) / (2 * SIGMA * SIGMA))
}

function useSnapshotUrl(snapshot?: HTMLCanvasElement): string {
  const [url, setUrl] = useState('')
  useEffect(() => {
    if (!snapshot) { setUrl(''); return }
    try { setUrl(snapshot.toDataURL('image/jpeg', 0.5)) }
    catch { setUrl('') }
  }, [snapshot])
  return url
}

function MinimizedThumb({
  thumb,
  mouseX,
  elRef,
  hoveredId,
  onHover,
  onLeave,
  onRestore,
}: {
  thumb: MinimizedThumbnail
  mouseX: number | null
  elRef: (el: HTMLButtonElement | null) => void
  hoveredId: string | null
  onHover: (id: string) => void
  onLeave: () => void
  onRestore: () => void
}) {
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const thumbUrl = useSnapshotUrl(thumb.snapshot)

  const getCenter = () => {
    if (!btnRef.current) return 0
    const r = btnRef.current.getBoundingClientRect()
    return r.left + r.width / 2
  }
  const scale = getScale(getCenter(), mouseX)
  const size = BASE_SIZE * scale

  const hoverKey = `min-${thumb.windowId}`
  const isHovered = hoveredId === hoverKey

  return (
    <button
      type="button"
      className="dock-icon dock-minimized-thumb"
      data-window-id={thumb.windowId}
      ref={(el) => { btnRef.current = el; elRef(el) }}
      onClick={onRestore}
      onMouseEnter={() => onHover(hoverKey)}
      onMouseLeave={onLeave}
      aria-label={`Restore ${thumb.title}`}
      style={{ width: size, height: size }}
    >
      {isHovered && <span className="dock-tooltip">{thumb.title}</span>}
      {thumbUrl ? (
        <img
          src={thumbUrl}
          alt={thumb.title}
          className="dock-icon-img dock-minimized-img"
          draggable={false}
          style={{ width: size, height: size }}
        />
      ) : (
        <span
          className="dock-icon-img dock-minimized-placeholder"
          style={{ width: size, height: size }}
        />
      )}
    </button>
  )
}

export const Dock = forwardRef<HTMLDivElement, DockProps>(function Dock(
  {
    openWindows = [],
    onOpenOrFocus,
    onCloseApp,
    onContextMenu,
    apps,
    rightApps = [],
    minimizedThumbnails = [],
    onRestoreWindow,
  },
  ref
) {
  const [mouseX, setMouseX] = useState<number | null>(null)
  const [hoveredAppId, setHoveredAppId] = useState<string | null>(null)
  const [bouncingApps, setBouncingApps] = useState<Set<string>>(new Set())
  const iconRefs = useRef<(HTMLButtonElement | null)[]>([])
  const rightIconRefs = useRef<(HTMLButtonElement | null)[]>([])
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouseX(e.clientX)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setMouseX(null)
    setHoveredAppId(null)
  }, [])

  const handleIconContextMenu = useCallback(
    (e: React.MouseEvent, app: AppItem) => {
      e.preventDefault()
      e.stopPropagation()
      const hasWindow = openWindows.some((w) => w.appId === app.appId)

      if (app.href) {
        onContextMenu?.({
          x: e.clientX,
          y: e.clientY,
          items: [
            { type: 'item', label: 'Open', action: () => window.open(app.href, '_blank', 'noopener,noreferrer') },
          ],
        })
        return
      }

      if (hasWindow) {
        onContextMenu?.({
          x: e.clientX,
          y: e.clientY,
          items: [
            { type: 'item', label: 'Show', action: () => onOpenOrFocus(app.appId, app.title) },
            { type: 'separator' },
            { type: 'item', label: 'Options', disabled: true },
            { type: 'separator' },
            { type: 'item', label: 'Quit', action: () => onCloseApp?.(app.appId) },
          ],
        })
      } else {
        onContextMenu?.({
          x: e.clientX,
          y: e.clientY,
          items: [
            { type: 'item', label: 'Open', action: () => onOpenOrFocus(app.appId, app.title) },
            { type: 'separator' },
            { type: 'item', label: 'Options', disabled: true },
            { type: 'item', label: 'Show in Finder', disabled: true },
          ],
        })
      }
    },
    [openWindows, onOpenOrFocus, onCloseApp, onContextMenu]
  )

  const getIconCenterX = (el: HTMLButtonElement | null): number => {
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    return rect.left + rect.width / 2
  }

  const allApps = apps
  const allRight = rightApps

  return (
    <div className="dock-wrapper" ref={ref}>
      <div className="dock" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <div className="dock-icons">
          {allApps.map((app, i) => {
            const hasWindow = openWindows.some((w) => w.appId === app.appId)
            const scale = getScale(getIconCenterX(iconRefs.current[i]), mouseX)
            const size = BASE_SIZE * scale
            const isBouncing = bouncingApps.has(app.appId)
            return (
              <button
                key={app.appId}
                type="button"
                className={`dock-icon${isBouncing ? ' dock-icon--bouncing' : ''}`}
                data-app-id={app.appId}
                ref={(el) => {
                  iconRefs.current[i] = el
                }}
                onClick={() => {
                  if (app.href) {
                    window.open(app.href, '_blank', 'noopener,noreferrer')
                  } else {
                    const isOpen = openWindows.some((w) => w.appId === app.appId && !w.minimized)
                    const isMinimized = openWindows.some((w) => w.appId === app.appId && w.minimized)
                    if (!isOpen && !isMinimized) {
                      if (isBouncing) return
                      setBouncingApps((prev) => new Set(prev).add(app.appId))
                      return
                    }
                    onOpenOrFocus(app.appId, app.title)
                  }
                }}
                onAnimationEnd={() => {
                  if (isBouncing) {
                    onOpenOrFocus(app.appId, app.title)
                  }
                  setBouncingApps((prev) => {
                    if (!prev.has(app.appId)) return prev
                    const next = new Set(prev)
                    next.delete(app.appId)
                    return next
                  })
                }}
                onMouseEnter={() => setHoveredAppId(app.appId)}
                onMouseLeave={() => setHoveredAppId(null)}
                onContextMenu={(e) => handleIconContextMenu(e, app)}
                aria-label={`Open ${app.title}`}
                style={{
                  width: size,
                  height: size,
                }}
              >
                {hoveredAppId === app.appId && <span className="dock-tooltip">{app.title}</span>}
                {app.icon ? (
                  <img
                    src={app.icon}
                    alt={app.title}
                    className="dock-icon-img"
                    draggable={false}
                    style={{ width: size, height: size }}
                  />
                ) : (
                  <span className="dock-icon-inner">{app.title.charAt(0)}</span>
                )}
                {hasWindow && <span className="dock-indicator" aria-hidden />}
              </button>
            )
          })}
        </div>

        {(allRight.length > 0 || minimizedThumbnails.length > 0) && (
          <>
            <div className="dock-separator">
              {[
                { w: 7, h: 1, gap: 0.5 },
                { w: 8, h: 1.2, gap: 1 },
                { w: 9, h: 1.4, gap: 1.2 },
                { w: 10, h: 1.6, gap: 1.5 },
                { w: 11.5, h: 2, gap: 2 },
                { w: 13, h: 2.5, gap: 2.5 },
                { w: 15, h: 3, gap: 3 },
                { w: 18, h: 4, gap: 4 },
              ].map((d, i) => (
                <span
                  key={i}
                  className="dock-separator-dash"
                  style={{
                    width: d.w,
                    height: d.h,
                    clipPath: 'polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)',
                    marginTop: d.gap,
                  }}
                />
              ))}
            </div>

            {/* Minimized window thumbnails */}
            <div className="dock-icons">
              {minimizedThumbnails.map((thumb, i) => (
                <MinimizedThumb
                  key={thumb.windowId}
                  thumb={thumb}
                  mouseX={mouseX}
                  elRef={(el) => { thumbRefs.current[i] = el }}
                  hoveredId={hoveredAppId}
                  onHover={setHoveredAppId}
                  onLeave={() => setHoveredAppId(null)}
                  onRestore={() => onRestoreWindow?.(thumb.windowId)}
                />
              ))}

              {allRight.map((app, i) => {
                const hasWindow = openWindows.some((w) => w.appId === app.appId)
                const scale = getScale(getIconCenterX(rightIconRefs.current[i]), mouseX)
                const size = BASE_SIZE * scale
                const isBouncing = bouncingApps.has(app.appId)
                return (
                  <button
                    key={app.appId}
                    type="button"
                    className={`dock-icon${isBouncing ? ' dock-icon--bouncing' : ''}`}
                    data-app-id={app.appId}
                    ref={(el) => {
                      rightIconRefs.current[i] = el
                    }}
                    onClick={() => {
                      if (app.href) {
                        window.open(app.href, '_blank', 'noopener,noreferrer')
                      } else {
                        const isOpen = openWindows.some((w) => w.appId === app.appId && !w.minimized)
                        const isMinimized = openWindows.some((w) => w.appId === app.appId && w.minimized)
                        if (!isOpen && !isMinimized) {
                          if (isBouncing) return
                          setBouncingApps((prev) => new Set(prev).add(app.appId))
                          return
                        }
                        onOpenOrFocus(app.appId, app.title)
                      }
                    }}
                    onAnimationEnd={() => {
                      if (isBouncing) {
                        onOpenOrFocus(app.appId, app.title)
                      }
                      setBouncingApps((prev) => {
                        if (!prev.has(app.appId)) return prev
                        const next = new Set(prev)
                        next.delete(app.appId)
                        return next
                      })
                    }}
                    onMouseEnter={() => setHoveredAppId(app.appId)}
                    onMouseLeave={() => setHoveredAppId(null)}
                    onContextMenu={(e) => handleIconContextMenu(e, app)}
                    aria-label={app.title}
                    style={{
                      width: size,
                      height: size,
                    }}
                  >
                    {hoveredAppId === app.appId && (
                      <span className="dock-tooltip">{app.title}</span>
                    )}
                    {app.icon ? (
                      <img
                        src={app.icon}
                        alt={app.title}
                        className="dock-icon-img"
                        draggable={false}
                        style={{ width: size, height: size }}
                      />
                    ) : (
                      <span className="dock-icon-inner">{app.title.charAt(0)}</span>
                    )}
                    {hasWindow && <span className="dock-indicator" aria-hidden />}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
})
