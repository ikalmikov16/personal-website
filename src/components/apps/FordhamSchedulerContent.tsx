import { MockScheduler } from './MockScheduler'

const TECH_TAGS = [
  'React',
  'Django',
  'Django REST Framework',
  'PostgreSQL',
  'pandas',
  'fuzzywuzzy',
  'Vite',
  'Bootstrap',
  'Render',
]

const FEATURES = [
  'Fuzzy course search across title, professor, CRN, and major',
  'Weekly calendar with month, week, and day views',
  'ICS export for Apple Calendar and Google Calendar',
  'Admin Excel import with automatic Fordham schedule parsing',
  'Built by students, for ~17,000 Fordham undergrads',
]

export function FordhamSchedulerContent() {
  return (
    <div className="fs">
      {/* Toolbar */}
      <div className="fs-toolbar">
        <div className="fs-toolbar-left">
          <img src="/icons/fordham.png" alt="" className="fs-toolbar-icon" draggable={false} />
          <span className="fs-toolbar-title">Fordham Final Exam Scheduler</span>
        </div>
        <a
          className="fs-toolbar-btn"
          href="https://fordham-exams.onrender.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="6.5" />
            <path d="M1.5 8h13M8 1.5c-2.5 2-3.5 4-3.5 6.5s1 4.5 3.5 6.5c2.5-2 3.5-4 3.5-6.5S10.5 3.5 8 1.5z" />
          </svg>
          Visit Site
        </a>
        <a
          className="fs-toolbar-btn"
          href="https://github.com/ikalmikov16/Fordham-Final-Exam-Scheduler"
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
      <div className="fs-content">
        {/* Hero: mock scheduler + description */}
        <div className="fs-hero">
          <MockScheduler />
          <div className="fs-desc">
            <h2 className="fs-desc-title">Fordham Final Exam Scheduler</h2>
            <p className="fs-desc-text">
              A web app that lets Fordham University students search for their courses, see final
              exams on an interactive calendar, and export the schedule to Apple or Google Calendar
              with one click. Built to replace manually searching through Excel spreadsheets.
            </p>
            <div className="fs-stats">
              <span className="fs-stat">~17,000 students</span>
              <span className="fs-stat">Fuzzy search</span>
              <span className="fs-stat">ICS export</span>
            </div>
          </div>
        </div>

        {/* The Story — Before vs After */}
        <div className="fs-section">
          <h4 className="fs-section-label">The Story</h4>
          <div className="fs-story">
            {/* Before */}
            <div className="fs-story-card">
              <span className="fs-story-badge">Before</span>
              <p className="fs-story-text">
                Fordham published final exam schedules as a massive Excel spreadsheet. Students had
                to manually scroll through hundreds of rows to find their exams — no search, no
                filtering, no way to export.
              </p>
              <div className="fs-story-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={`h${i}`} className="fs-story-grid-cell fs-story-grid-cell--header" />
                ))}
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={`c${i}`} className="fs-story-grid-cell" />
                ))}
              </div>
            </div>

            {/* After */}
            <div className="fs-story-card fs-story-card--after">
              <span className="fs-story-badge">After</span>
              <p className="fs-story-text">
                Students search by course, professor, or CRN. Exams appear on an interactive weekly
                calendar. One click exports the full schedule to Apple or Google Calendar.
              </p>
              <div className="fs-story-icons">
                <span className="fs-story-icon-item">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Search
                </span>
                <span className="fs-story-icon-item">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Calendar
                </span>
                <span className="fs-story-icon-item">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Impact */}
        <div className="fs-section">
          <h4 className="fs-section-label">Impact</h4>
          <div className="fs-impact">
            <p className="fs-impact-text">
              Today, Fordham University has integrated this open-source project into their system —
              serving the entire undergraduate student body.
            </p>
            <div className="fs-impact-timeline">
              <span className="fs-impact-step">Open Source</span>
              <span className="fs-impact-arrow">→</span>
              <span className="fs-impact-step fs-impact-step--accent">Adopted by Fordham</span>
              <span className="fs-impact-arrow">→</span>
              <span className="fs-impact-step">~17,000 students</span>
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="fs-section">
          <h4 className="fs-section-label">Technologies</h4>
          <div className="fs-tags">
            {TECH_TAGS.map((t) => (
              <span key={t} className="fs-tag">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="fs-section">
          <h4 className="fs-section-label">Key Features</h4>
          <ul className="fs-features">
            {FEATURES.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
