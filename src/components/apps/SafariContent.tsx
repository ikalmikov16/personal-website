import { useEffect } from 'react'
import { SAFARI_LINKS } from '../../data/safari-links'

type SafariContentProps = {
  onTitleChange?: (title: string) => void
}

export function SafariContent({ onTitleChange }: SafariContentProps) {
  useEffect(() => {
    onTitleChange?.('Top Sites')
  }, [onTitleChange])

  return (
    <div className="safari">
      {/* Toolbar Row 1: Navigation + Address + Search */}
      <div className="safari-toolbar-main">
        <div className="safari-nav-group">
          <button className="safari-nav-btn" disabled aria-label="Back">
            <span className="safari-nav-arrow">◀</span>
          </button>
          <button className="safari-nav-btn" disabled aria-label="Forward">
            <span className="safari-nav-arrow">▶</span>
          </button>
          <button className="safari-nav-btn safari-nav-btn--plus" disabled aria-label="Add tab">
            +
          </button>
        </div>
        <div className="safari-address-bar">
          <span className="safari-address-icon" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="#999" strokeWidth="1.2" />
              <line x1="6" y1="1" x2="6" y2="11" stroke="#999" strokeWidth="0.8" />
              <line x1="1" y1="6" x2="11" y2="6" stroke="#999" strokeWidth="0.8" />
              <ellipse cx="6" cy="6" rx="3" ry="5" stroke="#999" strokeWidth="0.8" />
            </svg>
          </span>
          <span className="safari-address-text" />
          <button className="safari-address-x" aria-label="Stop" disabled>
            ×
          </button>
        </div>
        <div className="safari-search-field">
          <svg
            className="safari-search-icon"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="5" cy="5" r="3.5" stroke="#999" strokeWidth="1.2" />
            <line
              x1="7.5"
              y1="7.5"
              x2="10.5"
              y2="10.5"
              stroke="#999"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <span className="safari-search-text">Google</span>
        </div>
      </div>

      {/* Toolbar Row 2: Bookmarks Bar */}
      <div className="safari-bookmarks-bar">
        <button className="safari-bm-icon-btn" aria-label="Show All Bookmarks">
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true">
            <path d="M1 1h4l2 2h6v8H1V1z" stroke="#666" strokeWidth="1" fill="none" />
            <path d="M3 0v4M5 0v3" stroke="#666" strokeWidth="0.8" />
          </svg>
        </button>
        <button className="safari-bm-icon-btn" aria-label="Top Sites">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <rect x="0.5" y="0.5" width="5" height="5" rx="0.5" stroke="#666" strokeWidth="1" />
            <rect x="6.5" y="0.5" width="5" height="5" rx="0.5" stroke="#666" strokeWidth="1" />
            <rect x="0.5" y="6.5" width="5" height="5" rx="0.5" stroke="#666" strokeWidth="1" />
            <rect x="6.5" y="6.5" width="5" height="5" rx="0.5" stroke="#666" strokeWidth="1" />
          </svg>
        </button>
        <span className="safari-bm-divider" />
        {SAFARI_LINKS.map((link) => (
          <a
            key={link.url}
            className="safari-bookmark-link"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Content: Top Sites */}
      <div className="safari-top-sites">
        <div className="safari-ts-header">
          <div className="safari-ts-toggle">
            <span className="safari-ts-toggle-opt safari-ts-toggle-opt--active">Top Sites</span>
            <span className="safari-ts-toggle-opt">History</span>
          </div>
        </div>

        <div className="safari-ts-grid">
          {SAFARI_LINKS.map((link) => (
            <a
              key={link.url}
              className="safari-site-card"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="safari-card-preview" style={{ background: link.color }}>
                <div
                  className="safari-card-header"
                  style={{ background: `color-mix(in srgb, ${link.color}, #000 25%)` }}
                />
                <span className="safari-card-name">{link.shortName}</span>
              </div>
              <span className="safari-card-label">{link.label}</span>
            </a>
          ))}
        </div>

        <p className="safari-ts-caption">
          As you browse the web, Safari will learn which websites are your favorites and display
          them above as your Top Sites.
        </p>

        <button className="safari-ts-edit" type="button">
          Edit
        </button>

        <img
          src="/icons/safari.png"
          alt=""
          className="safari-ts-compass"
          aria-hidden="true"
          draggable={false}
        />
      </div>
    </div>
  )
}
