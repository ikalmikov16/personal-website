import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { toCanvas } from 'html-to-image'
import { BootScreen } from './components/BootScreen'
import { ContextMenu } from './components/ContextMenu'
import type { ContextMenuState } from './components/ContextMenu'
import { CrashDialog } from './components/CrashDialog'
import { Desktop } from './components/Desktop'
import { Dock } from './components/Dock'
import type { MinimizedThumbnail } from './components/Dock'
import { MenuBar } from './components/MenuBar'
import { Window } from './components/Window'
import { WindowTransitionOverlay } from './components/WindowTransitionOverlay'
import { FinderContent } from './components/apps/FinderContent'
import { PreviewContent } from './components/apps/PreviewContent'
import { SafariContent } from './components/apps/SafariContent'
import { TerminalContent } from './components/apps/TerminalContent'
import { SystemPreferencesContent } from './components/apps/SystemPreferencesContent'
import { LiveTesseraeContent } from './components/apps/LiveTesseraeContent'
import { FordhamSchedulerContent } from './components/apps/FordhamSchedulerContent'
import { SketchOffContent } from './components/apps/SketchOffContent'
import { Spotlight } from './components/Spotlight'
import type { SpotlightResult } from './components/Spotlight'
import { AboutThisMac } from './components/AboutThisMac'
import { AppSwitcher } from './components/AppSwitcher'
import type { AppSwitcherApp } from './components/AppSwitcher'
import { VolumeHUD } from './components/VolumeHUD'
import { StickiesApp } from './components/apps/StickiesApp'
import { createStickyNote, createDefaultStickyNotes } from './components/apps/sticky-data'
import type { StickyNoteData } from './components/apps/sticky-data'
import { DOCK_APPS, DOCK_RIGHT_APPS, TRANSIENT_DOCK_APPS, DESKTOP_ICONS } from './constants/apps'
import { SAFARI_LINKS } from './data/safari-links'
import { DEFAULT_WALLPAPER_ID, WALLPAPER_OPTIONS } from './data/wallpapers'
import { useKonamiCode } from './hooks/useKonamiCode'
import { MobileNotSupported } from './components/MobileNotSupported'

const STORAGE_KEY_WALLPAPER = 'ikaos-wallpaperId'
const STORAGE_KEY_STICKIES = 'ika-os-stickies'
const STORAGE_KEY_STICKIES_OPEN = 'ika-os-stickies-open'
let _nextStickyZ = 0

function loadStickies(): { notes: StickyNoteData[]; isFirstVisit: boolean } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_STICKIES)
    if (stored !== null) return { notes: JSON.parse(stored), isFirstVisit: false }
  } catch {
    /* ignore */
  }
  return { notes: createDefaultStickyNotes(), isFirstVisit: true }
}

function loadStickiesOpen(isFirstVisit: boolean): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_STICKIES_OPEN)
    if (stored !== null) return stored === '1'
  } catch {
    /* ignore */
  }
  return isFirstVisit
}

function getInitialWallpaperId(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_WALLPAPER)
    if (stored && WALLPAPER_OPTIONS.some((o) => o.id === stored)) return stored
  } catch {
    /* ignore */
  }
  return DEFAULT_WALLPAPER_ID
}
import type { WindowEntry } from './types/window'
import { DEFAULT_WINDOW_SIZE } from './types/window'

type WindowTransitionState = {
  direction: 'minimize' | 'restore'
  windowId: string
  appId: string
  title: string
  windowRect: DOMRect
  dockIconRect: DOMRect
  snapshotCanvas: HTMLCanvasElement
}

const APP_NAMES: Record<string, string> = {
  finder: 'Finder',
  terminal: 'Terminal',
  safari: 'Safari',
  systempreferences: 'System Preferences',
  preview: 'Preview',
  stickies: 'Stickies',
  'project-mosaic': 'Live Tesserae',
  'project-sketchoff': 'SketchOff',
  'project-fordham': 'Fordham Scheduler',
}

const MENU_BAR_HEIGHT = 22

function getDefaultPosition(openCount: number): { x: number; y: number } {
  const w = typeof window !== 'undefined' ? window.innerWidth : 800
  const h = typeof window !== 'undefined' ? window.innerHeight : 600
  let x = w / 2 - DEFAULT_WINDOW_SIZE.width / 2 + 40 * openCount
  let y = h / 2 - DEFAULT_WINDOW_SIZE.height / 2 + 40 * openCount
  x = Math.max(0, Math.min(x, w - DEFAULT_WINDOW_SIZE.width))
  y = Math.max(MENU_BAR_HEIGHT, Math.min(y, h - DEFAULT_WINDOW_SIZE.height))
  return { x, y }
}

function getAppContent(
  appId: string,
  props: {
    openWindow: (appId: string, title: string) => void
    openUrl: (url: string) => void
    wallpaperId: string
    onWallpaperChange: (id: string) => void
    onTitleChange?: (title: string) => void
  }
) {
  switch (appId) {
    case 'finder':
      return <FinderContent onTitleChange={props.onTitleChange} />
    case 'preview':
      return <PreviewContent />
    case 'terminal':
      return <TerminalContent onOpenWindow={props.openWindow} onOpenUrl={props.openUrl} />
    case 'safari':
      return <SafariContent onTitleChange={props.onTitleChange} />
    case 'systempreferences':
      return (
        <SystemPreferencesContent
          wallpaperId={props.wallpaperId}
          onWallpaperChange={props.onWallpaperChange}
          onTitleChange={props.onTitleChange}
        />
      )
    case 'project-mosaic':
      return <LiveTesseraeContent />
    case 'project-sketchoff':
      return <SketchOffContent />
    case 'project-fordham':
      return <FordhamSchedulerContent />
    default:
      return <p>Content for {appId}</p>
  }
}

function App() {
  const dockRef = useRef<HTMLDivElement>(null)
  const [windowSnapshots, setWindowSnapshots] = useState(() => new Map<string, HTMLCanvasElement>())
  const [openWindows, setOpenWindows] = useState<WindowEntry[]>([])
  const [wallpaperId, setWallpaperId] = useState(getInitialWallpaperId)
  const [windowTransition, setWindowTransition] = useState<WindowTransitionState | null>(null)
  const [booted, setBooted] = useState(() => {
    try {
      return sessionStorage.getItem('ika-os-booted') === '1'
    } catch {
      return true
    }
  })
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null)
  const [initialStickies] = useState(() => {
    const result = loadStickies()
    _nextStickyZ = result.notes.length
    return result
  })
  const [stickiesOpen, setStickiesOpen] = useState(() =>
    loadStickiesOpen(initialStickies.isFirstVisit)
  )
  const [stickyNotes, setStickyNotes] = useState<StickyNoteData[]>(initialStickies.notes)
  const [focusedStickyId, setFocusedStickyId] = useState<string | null>(null)
  const [spotlightOpen, setSpotlightOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [appSwitcher, setAppSwitcher] = useState<{
    apps: AppSwitcherApp[]
    selectedIndex: number
  } | null>(null)
  const [volumeLevel, setVolumeLevel] = useState(10)
  const [volumeVisible, setVolumeVisible] = useState(false)
  const [easterEgg, setEasterEgg] = useState<'none' | 'crash'>('none')
  const [animatingMinimizeIds, setAnimatingMinimizeIds] = useState<Set<string>>(() => new Set())
  const [reduceMotion, setReduceMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [isNarrowViewport, setIsNarrowViewport] = useState(
    () => window.matchMedia('(max-width: 768px)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const handler = () => setIsNarrowViewport(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault()
        setSpotlightOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const getDockIconRect = useCallback((appId: string): DOMRect | null => {
    const el = document.querySelector<HTMLElement>(`.dock-wrapper [data-app-id="${appId}"]`)
    return el ? el.getBoundingClientRect() : null
  }, [])

  const getThumbRect = useCallback((windowId: string): DOMRect | null => {
    const el = document.querySelector<HTMLElement>(`.dock-wrapper [data-window-id="${windowId}"]`)
    return el ? el.getBoundingClientRect() : null
  }, [])

  const returnFocusRef = useRef<HTMLElement | null>(null)
  useKonamiCode(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null
    setEasterEgg('crash')
  })

  useEffect(() => {
    if (easterEgg === 'none' && returnFocusRef.current) {
      returnFocusRef.current.focus()
      returnFocusRef.current = null
    }
  }, [easterEgg])

  const applyWallpaperId = useCallback((id: string) => {
    setWallpaperId(id)
    try {
      localStorage.setItem(STORAGE_KEY_WALLPAPER, id)
    } catch {
      /* ignore */
    }
  }, [])

  // ── Stickies persistence ──
  const stickiesSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (stickiesSaveTimer.current) clearTimeout(stickiesSaveTimer.current)
    stickiesSaveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_STICKIES, JSON.stringify(stickyNotes))
      } catch {
        /* ignore */
      }
    }, 500)
    return () => {
      if (stickiesSaveTimer.current) clearTimeout(stickiesSaveTimer.current)
    }
  }, [stickyNotes])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STICKIES_OPEN, stickiesOpen ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [stickiesOpen])

  const addStickyNote = useCallback(() => {
    const note = createStickyNote(_nextStickyZ++)
    setStickyNotes((prev) => [...prev, note])
    setFocusedStickyId(note.id)
  }, [])

  const closeStickyNote = useCallback((id: string) => {
    setStickyNotes((prev) => prev.filter((n) => n.id !== id))
    setFocusedStickyId((prev) => (prev === id ? null : prev))
  }, [])

  const updateStickyNote = useCallback((id: string, updates: Partial<StickyNoteData>) => {
    setStickyNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)))
  }, [])

  const focusStickyNote = useCallback((id: string) => {
    setFocusedStickyId(id)
    const z = _nextStickyZ++
    setStickyNotes((prev) => prev.map((n) => (n.id === id ? { ...n, zIndex: z } : n)))
  }, [])

  const openUrl = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [])

  const focusWindow = useCallback((id: string) => {
    setOpenWindows((prev) => {
      const entry = prev.find((w) => w.id === id)
      if (!entry || prev[prev.length - 1]?.id === id) return prev
      const rest = prev.filter((w) => w.id !== id)
      return [...rest, entry]
    })
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)))
  }, [])

  const restoreWindowInstantly = useCallback((id: string) => {
    setOpenWindows((prev) => {
      const existing = prev.find((w) => w.id === id)
      if (!existing) return prev
      const rest = prev.filter((w) => w.id !== id)
      return [...rest, { ...existing, minimized: false, wasRestored: true }]
    })
    requestAnimationFrame(() => {
      setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, wasRestored: false } : w)))
    })
  }, [])

  const captureWindowSnapshot = useCallback(async (windowNode: HTMLElement) => {
    const captureNode = windowNode.querySelector<HTMLElement>('.window') ?? windowNode
    const rect = captureNode.getBoundingClientRect()
    const area = Math.max(1, rect.width * rect.height)
    const maxSnapshotPixels = 4_800_000
    const maxAreaRatio = Math.sqrt(maxSnapshotPixels / area)
    const pixelRatio = Math.max(1.75, Math.min(4, window.devicePixelRatio * 2.5, maxAreaRatio))
    return toCanvas(captureNode, {
      cacheBust: true,
      backgroundColor: '#ffffff',
      pixelRatio,
    })
  }, [])

  const startMinimizeAnimation = useCallback(
    async (id: string, appId: string, title: string) => {
      if (windowTransition) return
      const el = document.querySelector<HTMLElement>(`[data-window-id="${id}"]`)
      if (!el) {
        minimizeWindow(id)
        return
      }
      const windowRect = el.getBoundingClientRect()
      try {
        const snapshotCanvas = await captureWindowSnapshot(el)
        setWindowSnapshots((prev) => new Map(prev).set(id, snapshotCanvas))

        flushSync(() => {
          setAnimatingMinimizeIds((prev) => new Set(prev).add(id))
          minimizeWindow(id)
        })

        const thumbRect = getThumbRect(id)
        const dockRect = thumbRect ?? getDockIconRect(appId)
        if (!dockRect) {
          setAnimatingMinimizeIds((prev) => {
            const next = new Set(prev)
            next.delete(id)
            return next
          })
          return
        }

        setWindowTransition({
          direction: 'minimize',
          windowId: id,
          appId,
          title,
          windowRect,
          dockIconRect: dockRect,
          snapshotCanvas,
        })
      } catch {
        minimizeWindow(id)
      }
    },
    [captureWindowSnapshot, getDockIconRect, getThumbRect, minimizeWindow, windowTransition]
  )

  const startRestoreAnimationById = useCallback(
    (windowId: string) => {
      if (windowTransition) return false
      const existing = openWindows.find((w) => w.id === windowId && w.minimized)
      if (!existing) return false

      const thumbRect = getThumbRect(windowId)
      const fallbackRect = getDockIconRect(existing.appId)
      const dockRect = thumbRect ?? fallbackRect
      const snapshotCanvas = windowSnapshots.get(existing.id)
      if (!dockRect || !snapshotCanvas) {
        restoreWindowInstantly(existing.id)
        return true
      }

      const windowRect = new DOMRect(
        existing.position.x,
        existing.position.y,
        existing.size.width,
        existing.size.height
      )

      setOpenWindows((prev) => {
        const entry = prev.find((w) => w.id === existing.id)
        if (!entry) return prev
        const rest = prev.filter((w) => w.id !== existing.id)
        return [...rest, entry]
      })

      setWindowTransition({
        direction: 'restore',
        windowId: existing.id,
        appId: existing.appId,
        title: existing.title,
        windowRect,
        dockIconRect: dockRect,
        snapshotCanvas,
      })

      return true
    },
    [
      getDockIconRect,
      getThumbRect,
      openWindows,
      restoreWindowInstantly,
      windowSnapshots,
      windowTransition,
    ]
  )

  const startRestoreAnimation = useCallback(
    (appId: string) => {
      if (windowTransition) return false
      const existing = openWindows.find((w) => w.appId === appId && w.minimized)
      if (!existing) return false
      return startRestoreAnimationById(existing.id)
    },
    [openWindows, startRestoreAnimationById, windowTransition]
  )

  const finishWindowTransition = useCallback(() => {
    if (!windowTransition) return

    if (windowTransition.direction === 'minimize') {
      setAnimatingMinimizeIds((prev) => {
        const next = new Set(prev)
        next.delete(windowTransition.windowId)
        return next
      })
      setWindowTransition(null)
      return
    }

    const restoredWindowId = windowTransition.windowId
    setWindowTransition(null)
    setOpenWindows((prev) =>
      prev.map((w) =>
        w.id === restoredWindowId ? { ...w, minimized: false, wasRestored: true } : w
      )
    )
    requestAnimationFrame(() => {
      setOpenWindows((prev) =>
        prev.map((w) => (w.id === restoredWindowId ? { ...w, wasRestored: false } : w))
      )
    })
  }, [windowTransition])

  const openWindow = useCallback(
    (appId: string, title: string) => {
      if (appId === 'stickies') {
        setStickiesOpen(true)
        if (stickyNotes.length === 0) {
          addStickyNote()
        }
        return
      }
      if (startRestoreAnimation(appId)) return

      setOpenWindows((prev) => {
        const existing = prev.find((w) => w.appId === appId)
        if (existing) {
          const rest = prev.filter((w) => w.id !== existing.id)
          return [...rest, existing]
        }
        const position = getDefaultPosition(prev.length)
        const id = `window-${appId}-${Date.now()}`
        const isProject = appId.startsWith('project-')
        const size = isProject ? { width: 720, height: 520 } : DEFAULT_WINDOW_SIZE
        return [
          ...prev,
          {
            id,
            appId,
            title,
            position,
            size,
            wasRestored: false,
          },
        ]
      })
    },
    [startRestoreAnimation, stickyNotes.length, addStickyNote]
  )

  // ── App Switcher + Volume HUD keyboard handling ──
  const getOpenApps = useCallback((): AppSwitcherApp[] => {
    const seen = new Set<string>()
    const apps: AppSwitcherApp[] = []
    for (let i = openWindows.length - 1; i >= 0; i--) {
      const w = openWindows[i]
      if (w.minimized || seen.has(w.appId)) continue
      seen.add(w.appId)
      const dockApp = [...DOCK_APPS, ...TRANSIENT_DOCK_APPS].find((a) => a.appId === w.appId)
      apps.push({
        appId: w.appId,
        title: APP_NAMES[w.appId] ?? w.title,
        icon: dockApp?.icon ?? '/icons/app-placeholder.svg',
      })
    }
    if (stickiesOpen && !seen.has('stickies')) {
      apps.push({ appId: 'stickies', title: 'Stickies', icon: '/icons/stickies.png' })
    }
    return apps
  }, [openWindows, stickiesOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault()
        setAppSwitcher((prev) => {
          if (prev) {
            const next = e.shiftKey
              ? (prev.selectedIndex - 1 + prev.apps.length) % prev.apps.length
              : (prev.selectedIndex + 1) % prev.apps.length
            return { ...prev, selectedIndex: next }
          }
          const apps = getOpenApps()
          if (apps.length < 2) return null
          return { apps, selectedIndex: 1 }
        })
        return
      }

      if (e.key === 'Escape' && appSwitcher) {
        e.preventDefault()
        setAppSwitcher(null)
        return
      }

      if (e.key === 'AudioVolumeUp' || e.key === 'AudioVolumeDown' || e.key === 'AudioVolumeMute') {
        e.preventDefault()
        setVolumeLevel((prev) => {
          if (e.key === 'AudioVolumeUp') return Math.min(16, prev + 2)
          if (e.key === 'AudioVolumeDown') return Math.max(0, prev - 2)
          return 0
        })
        setVolumeVisible(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt' && appSwitcher) {
        const selected = appSwitcher.apps[appSwitcher.selectedIndex]
        setAppSwitcher(null)
        if (selected) {
          if (selected.appId === 'stickies') {
            setStickiesOpen(true)
          } else {
            openWindow(selected.appId, selected.title)
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [appSwitcher, getOpenApps, openWindow])

  const closeWindow = useCallback((id: string) => {
    setWindowSnapshots((prev) => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })
    setOpenWindows((prev) => prev.filter((w) => w.id !== id))
  }, [])

  const closeApp = useCallback(
    (appId: string) => {
      if (appId === 'stickies') {
        setStickiesOpen(false)
        return
      }
      const idsToRemove = openWindows.filter((w) => w.appId === appId).map((w) => w.id)
      setOpenWindows((prev) => prev.filter((w) => w.appId !== appId))
      if (idsToRemove.length > 0) {
        setWindowSnapshots((prev) => {
          const next = new Map(prev)
          idsToRemove.forEach((id) => next.delete(id))
          return next
        })
      }
    },
    [openWindows]
  )

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position: { x, y }, preZoomRect: null } : w))
    )
  }, [])

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, size: { width, height }, preZoomRect: null } : w))
    )
  }, [])

  const updateWindowTitle = useCallback((id: string, title: string) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, title } : w)))
  }, [])

  const visibleWindows = openWindows.filter((w) => !w.minimized)
  const frontmostWindow =
    visibleWindows.length > 0 ? visibleWindows[visibleWindows.length - 1] : null
  const frontmostAppName = frontmostWindow
    ? (APP_NAMES[frontmostWindow.appId] ?? frontmostWindow.title)
    : stickiesOpen
      ? 'Stickies'
      : 'Finder'

  const runningTransientApps = TRANSIENT_DOCK_APPS.filter((app) =>
    openWindows.some((w) => w.appId === app.appId)
  )
  const dynamicRightApps = [...runningTransientApps, ...DOCK_RIGHT_APPS]

  const dockOpenWindows = [
    ...openWindows,
    ...(stickiesOpen ? [{ appId: 'stickies', minimized: false }] : []),
  ]

  const minimizedThumbnails: MinimizedThumbnail[] = openWindows
    .filter((w) => w.minimized)
    .map((w) => ({
      windowId: w.id,
      appId: w.appId,
      title: w.title,
      snapshot: windowSnapshots.get(w.id),
    }))

  const spotlightItems: SpotlightResult[] = useMemo(
    () => [
      ...DOCK_APPS.filter((a) => !a.href).map((a) => ({
        id: `app-${a.appId}`,
        label: a.title,
        category: 'Applications',
        icon: a.icon,
        action: () => openWindow(a.appId, a.title),
      })),
      ...DESKTOP_ICONS.map((d) => ({
        id: `desktop-${d.appId}`,
        label: d.label,
        category: 'Projects',
        icon: d.icon,
        action: () => openWindow(d.appId, d.title),
      })),
      ...SAFARI_LINKS.map((l) => ({
        id: `link-${l.shortName}`,
        label: l.label,
        category: 'Links',
        icon: undefined,
        action: () => openUrl(l.url),
      })),
      {
        id: 'action-wallpaper',
        label: 'Change Desktop Background',
        category: 'Actions',
        icon: '/icons/system-preferences.png',
        action: () => openWindow('systempreferences', 'System Preferences'),
      },
      {
        id: 'action-about',
        label: 'About This Mac',
        category: 'Actions',
        icon: undefined,
        action: () => setAboutOpen(true),
      },
    ],
    [openWindow, openUrl]
  )

  const closeFrontmostWindow = useCallback(() => {
    if (!frontmostWindow) return
    closeWindow(frontmostWindow.id)
  }, [frontmostWindow, closeWindow])

  const minimizeFrontmostWindow = useCallback(() => {
    if (!frontmostWindow) return
    startMinimizeAnimation(frontmostWindow.id, frontmostWindow.appId, frontmostWindow.title)
  }, [frontmostWindow, startMinimizeAnimation])

  const zoomWindow = useCallback((id: string) => {
    setOpenWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w
        if (w.preZoomRect) {
          return {
            ...w,
            position: { x: w.preZoomRect.x, y: w.preZoomRect.y },
            size: { width: w.preZoomRect.width, height: w.preZoomRect.height },
            preZoomRect: null,
          }
        }
        const vw = window.innerWidth
        const vh = window.innerHeight
        const DOCK_H = 64
        return {
          ...w,
          preZoomRect: {
            x: w.position.x,
            y: w.position.y,
            width: w.size.width,
            height: w.size.height,
          },
          position: { x: 0, y: MENU_BAR_HEIGHT },
          size: { width: vw, height: vh - MENU_BAR_HEIGHT - DOCK_H },
        }
      })
    )
  }, [])

  if (isNarrowViewport) {
    return <MobileNotSupported />
  }

  return (
    <div className="app-shell" data-theme="dark" onContextMenu={(e) => e.preventDefault()}>
      {!booted && <BootScreen onComplete={() => setBooted(true)} reduceMotion={reduceMotion} />}
      <MenuBar
        currentAppName={frontmostAppName}
        onOpenWindow={openWindow}
        onCloseWindow={frontmostWindow ? closeFrontmostWindow : undefined}
        onMinimizeWindow={frontmostWindow ? minimizeFrontmostWindow : undefined}
        stickiesOpen={stickiesOpen}
        onNewStickyNote={addStickyNote}
        onSpotlightToggle={() => setSpotlightOpen((prev) => !prev)}
        onAboutThisMac={() => setAboutOpen(true)}
      />
      <Desktop wallpaperId={wallpaperId} onOpenWindow={openWindow} onContextMenu={setContextMenu} />
      <div className="windows-layer">
        {openWindows.map((win, index) =>
          win.minimized || win.id === windowTransition?.windowId ? null : (
            <Window
              key={win.id}
              id={win.id}
              title={win.title}
              position={win.position}
              size={win.size}
              zIndex={index}
              isFocused={win.id === frontmostWindow?.id}
              onClose={() => closeWindow(win.id)}
              onFocus={() => focusWindow(win.id)}
              onMinimize={() => startMinimizeAnimation(win.id, win.appId, win.title)}
              onZoom={() => zoomWindow(win.id)}
              onPositionChange={(x, y) => updateWindowPosition(win.id, x, y)}
              onSizeChange={(w, h) => updateWindowSize(win.id, w, h)}
              playOpenAnimation={!win.wasRestored}
            >
              {getAppContent(win.appId, {
                openWindow,
                openUrl,
                wallpaperId,
                onWallpaperChange: applyWallpaperId,
                onTitleChange: (title) => updateWindowTitle(win.id, title),
              })}
            </Window>
          )
        )}
      </div>
      <StickiesApp
        isOpen={stickiesOpen}
        notes={stickyNotes}
        focusedNoteId={focusedStickyId}
        onFocusNote={focusStickyNote}
        onCloseNote={closeStickyNote}
        onUpdateNote={updateStickyNote}
        onContextMenu={setContextMenu}
      />
      {windowTransition && (
        <WindowTransitionOverlay
          snapshotCanvas={windowTransition.snapshotCanvas}
          windowRect={windowTransition.windowRect}
          dockIconRect={windowTransition.dockIconRect}
          direction={windowTransition.direction}
          onComplete={finishWindowTransition}
          reduceMotion={reduceMotion}
        />
      )}
      <Dock
        ref={dockRef}
        openWindows={dockOpenWindows}
        onOpenOrFocus={openWindow}
        onCloseApp={closeApp}
        onContextMenu={setContextMenu}
        apps={DOCK_APPS}
        rightApps={dynamicRightApps}
        minimizedThumbnails={minimizedThumbnails}
        onRestoreWindow={startRestoreAnimationById}
        animatingMinimizeIds={animatingMinimizeIds}
      />
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}
      {spotlightOpen && (
        <Spotlight
          onClose={() => setSpotlightOpen(false)}
          onAction={(action) => {
            action()
            setSpotlightOpen(false)
          }}
          searchItems={spotlightItems}
          reduceMotion={reduceMotion}
        />
      )}
      {aboutOpen && <AboutThisMac onClose={() => setAboutOpen(false)} />}
      {appSwitcher && (
        <AppSwitcher
          apps={appSwitcher.apps}
          selectedIndex={appSwitcher.selectedIndex}
          reduceMotion={reduceMotion}
        />
      )}
      <VolumeHUD
        level={volumeLevel}
        isOpen={volumeVisible}
        onHide={() => setVolumeVisible(false)}
      />
      {easterEgg === 'crash' && (
        <CrashDialog
          appName="Finder"
          onRelaunch={() => {
            setEasterEgg('none')
            openWindow('finder', 'Finder')
          }}
          onDismiss={() => setEasterEgg('none')}
        />
      )}
    </div>
  )
}

export default App
