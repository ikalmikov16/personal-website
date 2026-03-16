import { useEffect, useState } from 'react'
import { PROJECTS } from '../../data/projects'
import { SAFARI_LINKS } from '../../data/safari-links'
import { WALLPAPER_OPTIONS } from '../../data/wallpapers'

type MobileAppViewProps = {
  appId: string
  onBack: () => void
  wallpaperId: string
  onWallpaperChange: (id: string) => void
}

const APP_TITLES: Record<string, string> = {
  finder: 'Projects',
  safari: 'Links',
  terminal: 'About',
  preview: 'Resume',
  stickies: 'Notes',
  systempreferences: 'Settings',
}

export function MobileAppView({ appId, onBack, wallpaperId, onWallpaperChange }: MobileAppViewProps) {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)))
  }, [])

  const handleBack = () => {
    setEntered(false)
    setTimeout(onBack, 300)
  }

  return (
    <div className={`mobile-app-view${entered ? '' : ' mobile-app-view--entering'}`}>
      <div className="mobile-app-nav">
        <button type="button" className="mobile-app-nav-back" onClick={handleBack}>
          ◀ Home
        </button>
        <span className="mobile-app-nav-title">{APP_TITLES[appId] ?? appId}</span>
        <span className="mobile-app-nav-spacer" />
      </div>
      <div className="mobile-app-content">
        {appId === 'finder' && <ProjectsView />}
        {appId === 'safari' && <LinksView />}
        {appId === 'terminal' && <AboutView />}
        {appId === 'preview' && <ResumeView />}
        {appId === 'stickies' && <NotesView />}
        {appId === 'systempreferences' && (
          <SettingsView wallpaperId={wallpaperId} onWallpaperChange={onWallpaperChange} />
        )}
      </div>
    </div>
  )
}

function ProjectsView() {
  return (
    <div className="mobile-view-list">
      {PROJECTS.map((p) => (
        <div key={p.id} className="mobile-card">
          <h3 className="mobile-card-title">{p.title}</h3>
          <p className="mobile-card-desc">{p.oneLiner}</p>
          <div className="mobile-card-tags">
            {p.tech.map((t) => (
              <span key={t} className="mobile-card-tag">{t}</span>
            ))}
          </div>
          <div className="mobile-card-links">
            {p.links.repo && (
              <a href={p.links.repo} target="_blank" rel="noopener noreferrer" className="mobile-card-link">
                View Repo
              </a>
            )}
            {p.links.appStore && (
              <a href={p.links.appStore} target="_blank" rel="noopener noreferrer" className="mobile-card-link">
                App Store
              </a>
            )}
            {p.links.playStore && (
              <a href={p.links.playStore} target="_blank" rel="noopener noreferrer" className="mobile-card-link">
                Play Store
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function LinksView() {
  return (
    <div className="mobile-view-list">
      {SAFARI_LINKS.map((link) => (
        <a
          key={link.shortName + link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-link-row"
        >
          <span className="mobile-link-bar" style={{ background: link.color }} />
          <span className="mobile-link-label">{link.label}</span>
          <span className="mobile-link-chevron">›</span>
        </a>
      ))}
    </div>
  )
}

function AboutView() {
  return (
    <div className="mobile-view-about">
      <h2 className="mobile-about-name">Irakli Kalmikov</h2>
      <p className="mobile-about-role">Full Stack Developer</p>
      <p className="mobile-about-bio">
        Building web apps, APIs, and mobile apps. React, Python, TypeScript, React Native.
        Based in New York.
      </p>
      <div className="mobile-about-stack">
        {['React', 'TypeScript', 'Python', 'React Native', 'Django', 'FastAPI', 'PostgreSQL', 'Firebase', 'AWS'].map(
          (t) => (
            <span key={t} className="mobile-card-tag">{t}</span>
          )
        )}
      </div>
      <div className="mobile-about-links">
        <a href="mailto:irakli.kalmikov@gmail.com" className="mobile-about-link">
          Email
        </a>
        <a href="https://linkedin.com/in/ikalmikov" target="_blank" rel="noopener noreferrer" className="mobile-about-link">
          LinkedIn
        </a>
        <a href="https://github.com/ikalmikov16" target="_blank" rel="noopener noreferrer" className="mobile-about-link">
          GitHub
        </a>
      </div>
    </div>
  )
}

function ResumeView() {
  return (
    <div className="mobile-view-resume">
      <p className="mobile-resume-text">View or download the full resume.</p>
      <a
        href="/Resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-resume-btn"
      >
        Download Resume (PDF)
      </a>
    </div>
  )
}

function NotesView() {
  return (
    <div className="mobile-view-notes">
      <div className="mobile-notes-paper">
        <p className="mobile-notes-hint">Open IkaOS on a desktop to use Stickies.</p>
        <p className="mobile-notes-sub">
          The Stickies app lets you create colorful draggable notes that persist across sessions.
        </p>
      </div>
    </div>
  )
}

function SettingsView({
  wallpaperId,
  onWallpaperChange,
}: {
  wallpaperId: string
  onWallpaperChange: (id: string) => void
}) {
  return (
    <div className="mobile-view-settings">
      <h3 className="mobile-settings-heading">Wallpaper</h3>
      <div className="mobile-settings-grid">
        {WALLPAPER_OPTIONS.map((wp) => (
          <button
            key={wp.id}
            type="button"
            className={`mobile-settings-wp${wp.id === wallpaperId ? ' mobile-settings-wp--active' : ''}`}
            onClick={() => onWallpaperChange(wp.id)}
            aria-label={wp.label}
          >
            <img src={wp.url} alt={wp.label} className="mobile-settings-wp-img" draggable={false} />
          </button>
        ))}
      </div>
    </div>
  )
}
