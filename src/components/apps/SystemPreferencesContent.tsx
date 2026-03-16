import { useState, useEffect } from 'react'
import { WALLPAPER_OPTIONS } from '../../data/wallpapers'

type SysPrefPane = 'grid' | 'desktop' | 'about'

type PrefItem = {
  id: string
  label: string
  icon?: string
  pane?: SysPrefPane
}

type PrefSection = {
  title: string
  items: PrefItem[]
}

const PREF_SECTIONS: PrefSection[] = [
  {
    title: 'Personal',
    items: [
      { id: 'appearance', label: 'Appearance' },
      { id: 'desktop', label: 'Desktop &\nScreen Saver', icon: '/icons/system-preferences.png', pane: 'desktop' },
      { id: 'dock', label: 'Dock' },
      { id: 'expose', label: 'Exposé &\nSpaces' },
      { id: 'lang', label: 'Language &\nText' },
      { id: 'security', label: 'Security' },
      { id: 'spotlight', label: 'Spotlight' },
    ],
  },
  {
    title: 'Hardware',
    items: [
      { id: 'cds', label: 'CDs & DVDs' },
      { id: 'displays', label: 'Displays' },
      { id: 'energy', label: 'Energy\nSaver' },
      { id: 'keyboard', label: 'Keyboard' },
      { id: 'mouse', label: 'Mouse' },
      { id: 'trackpad', label: 'Trackpad' },
      { id: 'print', label: 'Print & Fax' },
      { id: 'sound', label: 'Sound' },
    ],
  },
  {
    title: 'Internet & Wireless',
    items: [
      { id: 'mobileme', label: 'MobileMe' },
      { id: 'network', label: 'Network' },
      { id: 'bluetooth', label: 'Bluetooth' },
      { id: 'sharing', label: 'Sharing' },
    ],
  },
  {
    title: 'System',
    items: [
      { id: 'accounts', label: 'Accounts' },
      { id: 'datetime', label: 'Date & Time' },
      { id: 'parental', label: 'Parental\nControls' },
      { id: 'swupdate', label: 'Software\nUpdate' },
      { id: 'speech', label: 'Speech' },
      { id: 'startup', label: 'Startup Disk' },
      { id: 'timemachine', label: 'Time Machine' },
      { id: 'about', label: 'About', icon: '/icons/finder.png', pane: 'about' },
    ],
  },
]

const SOURCE_ITEMS = [
  'Desktop Pictures',
  'Nature',
  'Plants',
  'Art',
  'Black & White',
  'Abstract',
  'Patterns',
  'Solid Colors',
]

type SystemPreferencesContentProps = {
  wallpaperId: string
  onWallpaperChange: (id: string) => void
  onTitleChange?: (title: string) => void
}

export function SystemPreferencesContent({
  wallpaperId,
  onWallpaperChange,
  onTitleChange,
}: SystemPreferencesContentProps) {
  const [currentPane, setCurrentPane] = useState<SysPrefPane>('grid')
  const [history, setHistory] = useState<SysPrefPane[]>(['grid'])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [selectedSource, setSelectedSource] = useState('Nature')

  useEffect(() => {
    const titles: Record<SysPrefPane, string> = {
      grid: 'System Preferences',
      desktop: 'Desktop & Screen Saver',
      about: 'About',
    }
    onTitleChange?.(titles[currentPane])
  }, [currentPane, onTitleChange])

  const navigateTo = (pane: SysPrefPane) => {
    const newHistory = [...history.slice(0, historyIndex + 1), pane]
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setCurrentPane(pane)
  }

  const goBack = () => {
    if (historyIndex <= 0) return
    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)
    setCurrentPane(history[newIndex])
  }

  const goForward = () => {
    if (historyIndex >= history.length - 1) return
    const newIndex = historyIndex + 1
    setHistoryIndex(newIndex)
    setCurrentPane(history[newIndex])
  }

  const currentWallpaper =
    WALLPAPER_OPTIONS.find((o) => o.id === wallpaperId) ?? WALLPAPER_OPTIONS[0]

  return (
    <div className="sysprefs">
      {/* Toolbar */}
      <div className="sysprefs-toolbar">
        <div className="sysprefs-toolbar-left">
          <button
            className="sysprefs-nav-btn"
            onClick={goBack}
            disabled={historyIndex <= 0}
            aria-label="Back"
          >
            ◀
          </button>
          <button
            className="sysprefs-nav-btn"
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            aria-label="Forward"
          >
            ▶
          </button>
          <button
            className="sysprefs-show-all-btn"
            onClick={() => navigateTo('grid')}
            disabled={currentPane === 'grid'}
          >
            Show All
          </button>
        </div>
        <div className="sysprefs-search">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="5" cy="5" r="3.5" stroke="#999" strokeWidth="1.2" />
            <line x1="7.5" y1="7.5" x2="10.5" y2="10.5" stroke="#999" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Main icon grid */}
      {currentPane === 'grid' && (
        <div className="sysprefs-grid">
          {PREF_SECTIONS.map((section) => (
            <div key={section.title} className="sysprefs-section">
              <div className="sysprefs-section-header">{section.title}</div>
              <div className="sysprefs-section-sep" />
              <div className="sysprefs-icons-row">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    className={`sysprefs-icon-btn${item.pane ? '' : ' sysprefs-icon-btn--disabled'}`}
                    onClick={() => item.pane && navigateTo(item.pane)}
                  >
                    {item.icon ? (
                      <img src={item.icon} alt="" className="sysprefs-icon-img" draggable={false} />
                    ) : (
                      <div className="sysprefs-icon-placeholder" data-pref={item.id} />
                    )}
                    <span className="sysprefs-icon-label">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop & Screen Saver pane */}
      {currentPane === 'desktop' && (
        <div className="dss">
          <div className="dss-tabs">
            <span className="dss-tab dss-tab--active">Desktop</span>
            <span className="dss-tab">Screen Saver</span>
          </div>

          <div className="dss-body">
            {/* Left panel: preview + source tree */}
            <div className="dss-left">
              <div
                className="dss-preview"
                style={{ backgroundImage: `url(${currentWallpaper.url})` }}
              />
              <div className="dss-preview-label">{currentWallpaper.label}</div>

              <div className="dss-source-tree">
                <div className="dss-source-group-header">
                  <span className="dss-disclosure">▼</span> Apple
                </div>
                {SOURCE_ITEMS.map((name) => (
                  <button
                    key={name}
                    className={`dss-source-item${selectedSource === name ? ' dss-source-item--selected' : ''}`}
                    onClick={() => setSelectedSource(name)}
                  >
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" className="dss-folder-svg" aria-hidden="true">
                      <path d="M1 1.5h3.5l1 1H11v6.5H1z" stroke="#6d8ab5" strokeWidth="1" fill="#a0c4e8" />
                    </svg>
                    {name}
                  </button>
                ))}
                <div className="dss-source-group-header dss-source-group-header--collapsed">
                  <span className="dss-disclosure">▶</span> iPhoto
                </div>
                <div className="dss-source-group-header dss-source-group-header--collapsed">
                  <span className="dss-disclosure">▶</span> Folders
                </div>
              </div>

              <div className="dss-source-actions">
                <button className="dss-action-btn" aria-label="Add">+</button>
                <button className="dss-action-btn" aria-label="Remove">−</button>
              </div>
            </div>

            {/* Right panel: thumbnail grid */}
            <div className="dss-right">
              <div className="dss-thumb-grid">
                {WALLPAPER_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    className={`dss-thumb${wallpaperId === opt.id ? ' dss-thumb--selected' : ''}`}
                    onClick={() => onWallpaperChange(opt.id)}
                    title={opt.label}
                  >
                    <img src={opt.url} alt={opt.label} className="dss-thumb-img" draggable={false} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom options bar */}
          <div className="dss-options">
            <label className="dss-opt-row">
              <input type="checkbox" disabled />
              <span>Change picture:</span>
              <select disabled>
                <option>Every 30 minutes</option>
                <option>Every hour</option>
                <option>Every day</option>
              </select>
            </label>
            <label className="dss-opt-row">
              <input type="checkbox" disabled />
              <span>Random order</span>
            </label>
            <label className="dss-opt-row">
              <input type="checkbox" defaultChecked disabled />
              <span>Translucent menu bar</span>
            </label>
          </div>
        </div>
      )}

      {/* About pane */}
      {currentPane === 'about' && (
        <div className="sysprefs-about">
          <img src="/icons/finder.png" alt="" className="sysprefs-about-avatar" draggable={false} />
          <h2 className="sysprefs-about-name">Ika Kalmikov</h2>
          <p className="sysprefs-about-role">Software Engineer</p>
          <div className="sysprefs-about-divider" />
          <p className="sysprefs-about-version">IkaOS Version 1.0</p>
          <p className="sysprefs-about-tech">Built with React, TypeScript, Vite & Bun</p>
          <div className="sysprefs-about-links">
            <a href="https://linkedin.com/in/ikalmikov" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/ikalmikov16" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="mailto:irakli.kalmikov@gmail.com">Email</a>
          </div>
        </div>
      )}
    </div>
  )
}
