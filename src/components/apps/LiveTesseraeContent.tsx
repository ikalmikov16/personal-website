import { ArchDiagram } from './ArchDiagram'
import { MiniMosaic } from './MiniMosaic'

const TECH_TAGS = [
  'React',
  'TypeScript',
  'FastAPI',
  'WebSocket',
  'PostgreSQL',
  'AWS S3',
  'Docker',
  'Pillow',
]

const FEATURES = [
  'Multi-level zoom rendering — overview, chunk, and tile layers',
  'Real-time WebSocket with chunk-based subscriptions',
  'LRU caching and request deduplication on the client',
  'Incremental chunk and overview rendering (no full re-renders)',
  'Sparse tile storage — only edited tiles hit the database',
]

export function LiveTesseraeContent() {
  return (
    <div className="lt">
      {/* Toolbar */}
      <div className="lt-toolbar">
        <div className="lt-toolbar-left">
          <img
            src="/icons/live-tesserae.svg"
            alt=""
            className="lt-toolbar-icon"
            draggable={false}
          />
          <span className="lt-toolbar-title">Live Tesserae</span>
        </div>
        <a
          className="lt-toolbar-btn"
          href="https://tesserae.live"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="6.5" />
            <path d="M1.5 8h13M8 1.5c-2.5 2-3.5 4-3.5 6.5s1 4.5 3.5 6.5c2.5-2 3.5-4 3.5-6.5S10.5 3.5 8 1.5z" />
          </svg>
          Visit Site
        </a>
        <a
          className="lt-toolbar-btn"
          href="https://github.com/ikalmikov16"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          GitHub
        </a>
      </div>

      {/* Scrollable content */}
      <div className="lt-content">
        {/* Hero: demo + description */}
        <div className="lt-hero">
          <MiniMosaic />
          <div className="lt-desc">
            <h2 className="lt-desc-title">Live Tesserae</h2>
            <p className="lt-desc-text">
              A collaborative, real-time mosaic canvas where anyone can draw on a shared
              1,000&times;1,000 grid of tiles. Each tile is a 32&times;32 pixel canvas — enough
              space for real pixel art. Edits appear live for all viewers via WebSocket. No
              accounts, no signup.
            </p>
            <div className="lt-stats">
              <span className="lt-stat">1,000,000 tiles</span>
              <span className="lt-stat">32&times;32 per tile</span>
              <span className="lt-stat">Real-time sync</span>
            </div>
          </div>
        </div>

        {/* Architecture */}
        <div className="lt-section">
          <h4 className="lt-section-label">Architecture</h4>
          <ArchDiagram />
        </div>

        {/* Technologies */}
        <div className="lt-section">
          <h4 className="lt-section-label">Technologies</h4>
          <div className="lt-tags">
            {TECH_TAGS.map((t) => (
              <span key={t} className="lt-tag">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="lt-section">
          <h4 className="lt-section-label">Key Features</h4>
          <ul className="lt-features">
            {FEATURES.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
