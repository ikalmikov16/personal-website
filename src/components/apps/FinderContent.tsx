import { useEffect, useRef, useState } from 'react'
import { PROJECTS } from '../../data/projects'
import { DESKTOP_ICONS } from '../../constants/apps'

type FinderView = 'desktop' | `project-${string}`

export type FinderContentProps = {
  onTitleChange?: (title: string) => void
}

const SHARED_LINKS = [
  { label: 'GitHub', icon: '🔗', href: 'https://github.com/ikalmikov16' },
  { label: 'LinkedIn', icon: '🔗', href: 'https://linkedin.com/in/ikalmikov' },
  { label: 'Email', icon: '✉️', href: 'mailto:irakli.kalmikov@gmail.com' },
]

function getTitleForView(view: FinderView): string {
  if (view === 'desktop') return 'Desktop'
  const projectId = view.replace('project-', '')
  const project = PROJECTS.find((p) => p.id === projectId)
  return project?.title ?? 'Finder'
}

export function FinderContent({ onTitleChange }: FinderContentProps) {
  const [view, setView] = useState<FinderView>('desktop')
  const [selectedDesktopItem, setSelectedDesktopItem] = useState<string | null>(null)
  const titleChangeRef = useRef(onTitleChange)
  titleChangeRef.current = onTitleChange

  useEffect(() => {
    titleChangeRef.current?.(getTitleForView(view))
  }, [view])

  const activeProjectId = view.startsWith('project-') ? view.replace('project-', '') : null
  const activeProject = activeProjectId ? PROJECTS.find((p) => p.id === activeProjectId) : null

  const itemCount = view === 'desktop'
    ? `${DESKTOP_ICONS.length} items`
    : activeProject
      ? `${activeProject.tech.length} technologies`
      : ''

  return (
    <div className="finder">
      {/* Toolbar */}
      <div className="finder-toolbar">
        <div className="finder-toolbar-group">
          <button type="button" className="finder-toolbar-btn finder-toolbar-nav" disabled aria-label="Back">◀</button>
          <button type="button" className="finder-toolbar-btn finder-toolbar-nav" disabled aria-label="Forward">▶</button>
        </div>
        <div className="finder-toolbar-group finder-toolbar-views">
          <button type="button" className="finder-toolbar-btn finder-view-btn finder-view-btn--active" aria-label="Icon view">
            <svg width="13" height="11" viewBox="0 0 13 11" fill="currentColor"><rect x="0" y="0" width="5" height="5" rx="0.5"/><rect x="7" y="0" width="5" height="5" rx="0.5"/><rect x="0" y="6.5" width="5" height="5" rx="0.5"/><rect x="7" y="6.5" width="5" height="5" rx="0.5"/></svg>
          </button>
          <button type="button" className="finder-toolbar-btn finder-view-btn" aria-label="List view">
            <svg width="13" height="11" viewBox="0 0 13 11" fill="currentColor"><rect x="0" y="0" width="13" height="2" rx="0.5"/><rect x="0" y="3.5" width="13" height="2" rx="0.5"/><rect x="0" y="7" width="13" height="2" rx="0.5"/></svg>
          </button>
          <button type="button" className="finder-toolbar-btn finder-view-btn" aria-label="Column view">
            <svg width="13" height="11" viewBox="0 0 13 11" fill="currentColor"><rect x="0" y="0" width="3.5" height="11" rx="0.5"/><rect x="4.75" y="0" width="3.5" height="11" rx="0.5"/><rect x="9.5" y="0" width="3.5" height="11" rx="0.5"/></svg>
          </button>
          <button type="button" className="finder-toolbar-btn finder-view-btn" aria-label="Cover Flow">
            <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor"><rect x="0" y="0" width="15" height="6" rx="0.5"/><rect x="0" y="7.5" width="15" height="1" rx="0.5"/><rect x="0" y="9.5" width="15" height="1" rx="0.5"/></svg>
          </button>
        </div>
        <button type="button" className="finder-toolbar-btn finder-toolbar-action" aria-label="Action">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="M7 3.5v4M5.5 6l1.5 1.5L8.5 6" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="finder-toolbar-spacer" />
        <input
          type="search"
          className="finder-search"
          placeholder="Search"
          aria-label="Search"
        />
      </div>

      {/* Path bar */}
      <div className="finder-pathbar">
        <span className="finder-pathbar-icon">{view === 'desktop' ? '🖥' : '📁'}</span>
        <span>{getTitleForView(view)}</span>
      </div>

      {/* Sidebar + Content area */}
      <div className="finder-body">
        <aside className="finder-sidebar">
          {/* Places */}
          <div className="finder-sidebar-header">▼ PLACES</div>
          <button
            type="button"
            className={`finder-sidebar-item ${view === 'desktop' ? 'finder-sidebar-item--selected' : ''}`}
            onClick={() => setView('desktop')}
          >
            <span className="finder-sidebar-icon">🖥</span>
            Desktop
          </button>

          {/* Projects */}
          <div className="finder-sidebar-header">▼ PROJECTS</div>
          {PROJECTS.map((project) => {
            const projectView: FinderView = `project-${project.id}`
            return (
              <button
                key={project.id}
                type="button"
                className={`finder-sidebar-item ${view === projectView ? 'finder-sidebar-item--selected' : ''}`}
                onClick={() => setView(projectView)}
              >
                <span className="finder-sidebar-icon">📁</span>
                {project.title}
              </button>
            )
          })}

          {/* Shared */}
          <div className="finder-sidebar-header">▼ SHARED</div>
          {SHARED_LINKS.map((link) => (
            <a
              key={link.label}
              className="finder-sidebar-item finder-sidebar-link"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="finder-sidebar-icon">{link.icon}</span>
              {link.label}
            </a>
          ))}
        </aside>

        <main className="finder-main">
          {/* Desktop view — icon grid of desktop items */}
          {view === 'desktop' && (
            <div className="finder-icon-grid">
              {DESKTOP_ICONS.map((icon) => (
                <button
                  key={icon.label}
                  type="button"
                  className={`finder-icon-item ${selectedDesktopItem === icon.label ? 'finder-icon-item--selected' : ''}`}
                  onClick={() => setSelectedDesktopItem(icon.label)}
                >
                  <img
                    src={icon.icon || '/icons/folder.png'}
                    alt=""
                    className="finder-icon-item-img"
                    draggable={false}
                  />
                  <span className="finder-icon-item-label">{icon.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Project detail view */}
          {activeProject && (
            <div className="finder-project-detail">
              <div className="finder-project-detail-header">
                <img
                  src="/icons/app-placeholder.svg"
                  alt=""
                  className="finder-project-detail-icon"
                  draggable={false}
                />
                <div>
                  <h2 className="finder-project-detail-title">{activeProject.title}</h2>
                  <p className="finder-project-detail-desc">{activeProject.oneLiner}</p>
                </div>
              </div>

              <div className="finder-project-detail-section">
                <h4 className="finder-project-detail-label">Technologies</h4>
                <div className="finder-project-detail-tags">
                  {activeProject.tech.map((t) => (
                    <span key={t} className="finder-project-detail-tag">{t}</span>
                  ))}
                </div>
              </div>

              <div className="finder-project-detail-section">
                <h4 className="finder-project-detail-label">Links</h4>
                <div className="finder-project-detail-links">
                  {activeProject.links.live && (
                    <a href={activeProject.links.live} target="_blank" rel="noopener noreferrer">Live Site</a>
                  )}
                  {activeProject.links.repo && (
                    <a href={activeProject.links.repo} target="_blank" rel="noopener noreferrer">Repository</a>
                  )}
                  {activeProject.links.appStore && (
                    <a href={activeProject.links.appStore} target="_blank" rel="noopener noreferrer">App Store</a>
                  )}
                  {activeProject.links.playStore && (
                    <a href={activeProject.links.playStore} target="_blank" rel="noopener noreferrer">Google Play</a>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Status bar */}
      <div className="finder-statusbar">{itemCount}</div>
    </div>
  )
}
