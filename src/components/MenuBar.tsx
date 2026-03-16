import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react'

type MenuItem =
  | { type: 'item'; label: string; shortcut?: string; action?: () => void; disabled?: boolean }
  | { type: 'separator' }

type MenuDefinition = {
  id: string
  label: string
  bold?: boolean
  items: MenuItem[]
}

type MenuBarProps = {
  currentAppName?: string
  onOpenWindow?: (appId: string, title: string) => void
  onCloseWindow?: () => void
  onMinimizeWindow?: () => void
  stickiesOpen?: boolean
  onNewStickyNote?: () => void
  onSpotlightToggle?: () => void
  onAboutThisMac?: () => void
}

function formatTime(date: Date): string {
  const day = date.toLocaleDateString(undefined, { weekday: 'short' })
  const month = date.toLocaleDateString(undefined, { month: 'short' })
  const dayNum = date.getDate()
  const time = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  return `${day} ${month} ${dayNum} ${time}`
}

const BluetoothIcon = () => (
  <svg width="11" height="15" viewBox="0 0 11 15" fill="currentColor">
    <path d="M5 0L5 5.8 2.2 3 1 4.2 4.3 7.5 1 10.8 2.2 12 5 9.2V15l5.5-4.8L7.2 7.5l3.3-2.7L5 0zm1.2 2.7L8 5 6.2 6.5V2.7zm0 6L8 10l-1.8 2.3V8.7z" />
  </svg>
)

const WiFiIcon = () => (
  <svg width="14" height="11" viewBox="-1 -0.5 16 12" fill="currentColor">
    <circle cx="7" cy="9.5" r="1.3" />
    <path d="M4.8 7.4a3.3 3.3 0 0 1 4.4 0l1-1.1a5 5 0 0 0-6.4 0l1 1.1z" />
    <path d="M2.6 5.2a6.4 6.4 0 0 1 8.8 0l1-1.1a8 8 0 0 0-10.8 0l1 1.1z" />
    <path d="M.4 3a9.5 9.5 0 0 1 13.2 0l1-1.1A11.2 11.2 0 0 0-.6 1.9L.4 3z" />
  </svg>
)

const SoundIcon = () => (
  <svg width="14" height="11" viewBox="0 0 14 11" fill="currentColor">
    <path d="M0 3.5v4h2.5l3.5 3V.5l-3.5 3H0z" />
    <path d="M8.5 2.5a3.5 3.5 0 0 1 0 6l.7.9a4.6 4.6 0 0 0 0-7.8l-.7.9z" opacity="0.85" />
    <path d="M10.3.8a6.2 6.2 0 0 1 0 9.4l.7.8a7.3 7.3 0 0 0 0-11l-.7.8z" opacity="0.7" />
  </svg>
)

const SpotlightIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <circle cx="5.8" cy="5.8" r="4.5" />
    <line x1="9.2" y1="9.2" x2="13" y2="13" />
  </svg>
)

export function MenuBar({
  currentAppName = 'Finder',
  onOpenWindow,
  onCloseWindow,
  onMinimizeWindow,
  stickiesOpen,
  onNewStickyNote,
  onSpotlightToggle,
  onAboutThisMac,
}: MenuBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [time, setTime] = useState(() => formatTime(new Date()))
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 30000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (openMenu === null) return
    const handleClick = (e: MouseEvent) => {
      if (barRef.current?.contains(e.target as Node)) return
      setOpenMenu(null)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openMenu])

  const handleItemClick = useCallback((action?: () => void) => {
    if (action) {
      action()
      setOpenMenu(null)
    }
  }, [])

  const toggle = useCallback((id: string) => {
    setOpenMenu((prev) => (prev === id ? null : id))
  }, [])

  const slideOver = useCallback((id: string) => {
    setOpenMenu((prev) => (prev !== null ? id : prev))
  }, [])

  const hasOpenWindows = !!onCloseWindow
  const hasMinimizable = !!onMinimizeWindow

  // ── Left-side menu definitions ──

  const appleMenu: MenuDefinition = {
    id: 'apple',
    label: '',
    items: [
      { type: 'item', label: 'About This Mac', action: onAboutThisMac },
      { type: 'separator' },
      {
        type: 'item',
        label: 'System Preferences...',
        action: () => onOpenWindow?.('systempreferences', 'System Preferences'),
      },
      { type: 'separator' },
      { type: 'item', label: 'Force Quit...', shortcut: '⌥⌘⎋', disabled: true },
      { type: 'separator' },
      { type: 'item', label: 'Sleep', disabled: true },
      { type: 'item', label: 'Restart...', disabled: true },
      { type: 'item', label: 'Shut Down...', disabled: true },
    ],
  }

  const appMenu: MenuDefinition = {
    id: 'app',
    label: currentAppName,
    bold: true,
    items: [
      { type: 'item', label: `About ${currentAppName}`, disabled: true },
      { type: 'separator' },
      { type: 'item', label: 'Preferences...', shortcut: '⌘,', disabled: true },
      { type: 'separator' },
      { type: 'item', label: `Hide ${currentAppName}`, shortcut: '⌘H', disabled: true },
      { type: 'item', label: 'Hide Others', shortcut: '⌥⌘H', disabled: true },
      { type: 'item', label: 'Show All', disabled: true },
    ],
  }

  const fileMenu: MenuDefinition = {
    id: 'file',
    label: 'File',
    items: [
      ...(stickiesOpen
        ? [
            { type: 'item' as const, label: 'New Note', shortcut: '⌘N', action: onNewStickyNote },
            { type: 'separator' as const },
          ]
        : [
            {
              type: 'item' as const,
              label: 'New Window',
              shortcut: '⌘N',
              action: () => onOpenWindow?.('finder', 'Finder'),
            },
          ]),
      {
        type: 'item',
        label: 'Close Window',
        shortcut: '⌘W',
        action: onCloseWindow,
        disabled: !hasOpenWindows,
      },
      { type: 'separator' },
      { type: 'item', label: 'Get Info', shortcut: '⌘I', disabled: true },
    ],
  }

  const noteMenu: MenuDefinition = {
    id: 'note',
    label: 'Note',
    items: [
      { type: 'item', label: 'New Note', shortcut: '⌘N', action: onNewStickyNote },
      { type: 'separator' },
      { type: 'item', label: 'Use Floating Window', disabled: true },
      { type: 'item', label: 'Translucent Window', disabled: true },
    ],
  }

  const colorMenu: MenuDefinition = {
    id: 'color',
    label: 'Color',
    items: [
      { type: 'item', label: '● Yellow', disabled: true },
      { type: 'item', label: '● Blue', disabled: true },
      { type: 'item', label: '● Green', disabled: true },
      { type: 'item', label: '● Pink', disabled: true },
      { type: 'item', label: '● Purple', disabled: true },
      { type: 'item', label: '● Gray', disabled: true },
    ],
  }

  const editMenu: MenuDefinition = {
    id: 'edit',
    label: 'Edit',
    items: [
      { type: 'item', label: 'Undo', shortcut: '⌘Z', disabled: true },
      { type: 'item', label: 'Redo', shortcut: '⇧⌘Z', disabled: true },
      { type: 'separator' },
      { type: 'item', label: 'Cut', shortcut: '⌘X', disabled: true },
      { type: 'item', label: 'Copy', shortcut: '⌘C', disabled: true },
      { type: 'item', label: 'Paste', shortcut: '⌘V', disabled: true },
      { type: 'item', label: 'Select All', shortcut: '⌘A', disabled: true },
    ],
  }

  const viewMenu: MenuDefinition = {
    id: 'view',
    label: 'View',
    items: [
      { type: 'item', label: 'as Icons', disabled: true },
      { type: 'item', label: 'as List', disabled: true },
      { type: 'item', label: 'as Columns', disabled: true },
      { type: 'item', label: 'as Cover Flow', disabled: true },
      { type: 'separator' },
      { type: 'item', label: 'Show Path Bar', disabled: true },
      { type: 'item', label: 'Show Status Bar', disabled: true },
    ],
  }

  const goMenu: MenuDefinition = {
    id: 'go',
    label: 'Go',
    items: [
      { type: 'item', label: 'Back', shortcut: '⌘[', disabled: true },
      { type: 'item', label: 'Forward', shortcut: '⌘]', disabled: true },
      { type: 'separator' },
      { type: 'item', label: 'Computer', shortcut: '⇧⌘C', disabled: true },
      { type: 'item', label: 'Home', shortcut: '⇧⌘H', disabled: true },
      { type: 'item', label: 'Desktop', shortcut: '⇧⌘D', disabled: true },
      { type: 'item', label: 'Applications', shortcut: '⇧⌘A', disabled: true },
      { type: 'item', label: 'Utilities', shortcut: '⇧⌘U', disabled: true },
      { type: 'separator' },
      { type: 'item', label: 'Go to Folder...', shortcut: '⇧⌘G', disabled: true },
      { type: 'item', label: 'Connect to Server...', shortcut: '⌘K', disabled: true },
    ],
  }

  const windowMenu: MenuDefinition = {
    id: 'window',
    label: 'Window',
    items: [
      {
        type: 'item',
        label: 'Minimize',
        shortcut: '⌘M',
        action: onMinimizeWindow,
        disabled: !hasMinimizable,
      },
      { type: 'item', label: 'Zoom', disabled: true },
      { type: 'separator' },
      { type: 'item', label: 'Bring All to Front', disabled: true },
    ],
  }

  const helpMenu: MenuDefinition = {
    id: 'help',
    label: 'Help',
    items: [{ type: 'item', label: 'Mac Help', disabled: true }],
  }

  const menus = stickiesOpen
    ? [appMenu, fileMenu, editMenu, noteMenu, colorMenu, windowMenu, helpMenu]
    : [appMenu, fileMenu, editMenu, viewMenu, goMenu, windowMenu, helpMenu]

  // ── Right-side menu definitions ──

  const bluetoothMenu: MenuDefinition = {
    id: 'bluetooth',
    label: '',
    items: [
      { type: 'item', label: 'Bluetooth: On', disabled: true },
      { type: 'item', label: 'Discoverable', disabled: true },
      { type: 'separator' },
      { type: 'item', label: 'Set Up Bluetooth Device...', disabled: true },
      { type: 'separator' },
      { type: 'item', label: 'Open Bluetooth Preferences...', disabled: true },
    ],
  }

  const wifiMenu: MenuDefinition = {
    id: 'wifi',
    label: '',
    items: [
      { type: 'item', label: 'AirPort: On', disabled: true },
      { type: 'item', label: 'Turn AirPort Off', disabled: true },
      { type: 'separator' },
      { type: 'item', label: '✓  Home Network', disabled: true },
      { type: 'separator' },
      { type: 'item', label: 'Join Other Network...', disabled: true },
      { type: 'item', label: 'Create Network...', disabled: true },
      { type: 'separator' },
      { type: 'item', label: 'Open Network Preferences...', disabled: true },
    ],
  }

  const soundMenu: MenuDefinition = {
    id: 'sound',
    label: '',
    items: [
      { type: 'item', label: 'Output: Internal Speakers', disabled: true },
      { type: 'separator' },
      { type: 'item', label: 'Internal Speakers', disabled: true },
      { type: 'item', label: 'Headphones', disabled: true },
      { type: 'separator' },
      { type: 'item', label: 'Sound Preferences...', disabled: true },
    ],
  }

  const clockMenu: MenuDefinition = {
    id: 'clock',
    label: '',
    items: [
      { type: 'item', label: 'View as Analog', disabled: true },
      { type: 'item', label: 'View as Digital', disabled: true },
      { type: 'separator' },
      { type: 'item', label: 'Open Date & Time Preferences...', disabled: true },
    ],
  }

  const userMenu: MenuDefinition = {
    id: 'user',
    label: '',
    items: [
      { type: 'item', label: 'Ika', disabled: true },
      { type: 'separator' },
      { type: 'item', label: 'Login Window...', disabled: true },
      { type: 'separator' },
      { type: 'item', label: 'Account Preferences...', disabled: true },
    ],
  }

  // Spotlight is handled as a direct toggle, not a dropdown menu

  // ── Rendering helpers ──

  const renderDropdown = (menu: MenuDefinition) => (
    <div className="menu-bar-dropdown" role="menu">
      {menu.items.map((item, i) => {
        if (item.type === 'separator') {
          return <div key={i} className="menu-bar-dropdown-separator" />
        }
        return (
          <button
            key={i}
            type="button"
            className={`menu-bar-dropdown-item${item.disabled ? ' menu-bar-dropdown-item--disabled' : ''}`}
            role="menuitem"
            onClick={() => handleItemClick(item.action)}
            disabled={item.disabled}
          >
            <span>{item.label}</span>
            {item.shortcut && <span className="menu-bar-dropdown-shortcut">{item.shortcut}</span>}
          </button>
        )
      })}
    </div>
  )

  const renderRightItem = (
    id: string,
    menu: MenuDefinition,
    children: ReactNode,
    className?: string,
    label?: string
  ) => (
    <div key={id} className="menu-bar-menu-wrap">
      <button
        type="button"
        className={`menu-bar-right-btn${className ? ` ${className}` : ''}`}
        onClick={() => toggle(id)}
        onMouseEnter={() => slideOver(id)}
        aria-expanded={openMenu === id}
        aria-haspopup="menu"
        aria-label={label ?? id}
        title={label ?? id}
      >
        {children}
      </button>
      {openMenu === id && renderDropdown(menu)}
    </div>
  )

  return (
    <div className="menu-bar" ref={barRef}>
      <div className="menu-bar-left">
        {/* Apple menu */}
        <div className="menu-bar-menu-wrap">
          <button
            type="button"
            className="menu-bar-apple"
            onClick={() => toggle('apple')}
            onMouseEnter={() => slideOver('apple')}
            aria-expanded={openMenu === 'apple'}
            aria-haspopup="menu"
            aria-label="Apple menu"
          >
            &#63743;
          </button>
          {openMenu === 'apple' && renderDropdown(appleMenu)}
        </div>

        {/* App menus */}
        {menus.map((menu) => (
          <div key={menu.id} className="menu-bar-menu-wrap">
            <button
              type="button"
              className={`menu-bar-menu-trigger${menu.bold ? ' menu-bar-menu-trigger--bold' : ''}`}
              onClick={() => toggle(menu.id)}
              onMouseEnter={() => slideOver(menu.id)}
              aria-expanded={openMenu === menu.id}
              aria-haspopup="menu"
              aria-label={`${menu.label} menu`}
            >
              {menu.label}
            </button>
            {openMenu === menu.id && renderDropdown(menu)}
          </div>
        ))}
      </div>

      <div className="menu-bar-right">
        {renderRightItem('bluetooth', bluetoothMenu, <BluetoothIcon />, undefined, 'Bluetooth')}
        {renderRightItem('wifi', wifiMenu, <WiFiIcon />, undefined, 'Wi-Fi')}
        {renderRightItem('sound', soundMenu, <SoundIcon />, undefined, 'Sound')}
        {renderRightItem(
          'clock',
          clockMenu,
          <span className="menu-bar-clock">{time}</span>,
          undefined,
          'Date & Time'
        )}
        {renderRightItem(
          'user',
          userMenu,
          <span className="menu-bar-user">Ika</span>,
          undefined,
          'Ika'
        )}
        <button
          type="button"
          className="menu-bar-right-btn menu-bar-spotlight-icon"
          onClick={() => {
            setOpenMenu(null)
            onSpotlightToggle?.()
          }}
          aria-label="Spotlight"
          title="Spotlight"
        >
          <SpotlightIcon />
        </button>
      </div>
    </div>
  )
}
