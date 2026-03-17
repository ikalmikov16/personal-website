import { useCallback, useMemo, useRef, useState } from 'react'

type Course = {
  id: number
  code: string
  title: string
  professor: string
  crn: string
  day: number
  start: number
  end: number
}

const COURSES: Course[] = [
  {
    id: 1,
    code: 'CISC 1600',
    title: 'Multimedia Computing',
    professor: 'Zhang, L.',
    crn: '40121',
    day: 1,
    start: 9,
    end: 11,
  },
  {
    id: 2,
    code: 'COMM 1100',
    title: 'Foundations of Communication',
    professor: 'Rivera, M.',
    crn: '40234',
    day: 2,
    start: 13,
    end: 15,
  },
  {
    id: 3,
    code: 'PHYS 1601',
    title: 'Physics I',
    professor: 'Chen, W.',
    crn: '40345',
    day: 3,
    start: 10,
    end: 12,
  },
  {
    id: 4,
    code: 'MATH 2001',
    title: 'Discrete Mathematics',
    professor: 'Smith, J.',
    crn: '40456',
    day: 0,
    start: 14,
    end: 16,
  },
  {
    id: 5,
    code: 'ENGL 1100',
    title: 'Composition I',
    professor: 'Adams, K.',
    crn: '40567',
    day: 4,
    start: 9,
    end: 11,
  },
  {
    id: 6,
    code: 'HIST 1300',
    title: 'The Modern World',
    professor: 'Park, S.',
    crn: '40678',
    day: 1,
    start: 14,
    end: 16,
  },
  {
    id: 7,
    code: 'PSYC 1000',
    title: 'Intro to Psychology',
    professor: 'Lee, R.',
    crn: '40789',
    day: 3,
    start: 13,
    end: 15,
  },
  {
    id: 8,
    code: 'ECON 1100',
    title: 'Intro to Microeconomics',
    professor: 'Taylor, B.',
    crn: '40890',
    day: 4,
    start: 11,
    end: 13,
  },
]

const BLOCK_COLORS = ['#9A0000', '#8B6914', '#1a3a5c', '#2d5a27', '#6b2fa0', '#0e5e6f']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const HOUR_START = 8
const HOUR_END = 17
const HOUR_COUNT = HOUR_END - HOUR_START
const ROW_H = 24

function formatHour(h: number) {
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${h12}${suffix}`
}

export function MockScheduler() {
  const [query, setQuery] = useState('')
  const [added, setAdded] = useState<Course[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addedIds = useMemo(() => new Set(added.map((c) => c.id)), [added])

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return COURSES.filter(
      (c) =>
        !addedIds.has(c.id) &&
        (c.code.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.professor.toLowerCase().includes(q) ||
          c.crn.includes(q))
    )
  }, [query, addedIds])

  const addCourse = useCallback((c: Course) => {
    setAdded((prev) => [...prev, c])
    setQuery('')
    setShowDropdown(false)
    inputRef.current?.focus()
  }, [])

  const removeCourse = useCallback((id: number) => {
    setAdded((prev) => prev.filter((c) => c.id !== id))
  }, [])

  return (
    <div className="fs-mock">
      {/* Search */}
      <div className="fs-search-wrap">
        <svg
          className="fs-search-icon"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
          <line
            x1="7.5"
            y1="7.5"
            x2="10.5"
            y2="10.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        <input
          ref={inputRef}
          className="fs-search-input"
          type="text"
          placeholder="Search courses, professors, CRN..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowDropdown(true)
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        />
        {showDropdown && results.length > 0 && (
          <div className="fs-search-dropdown">
            {results.map((c) => (
              <div key={c.id} className="fs-search-item" onMouseDown={() => addCourse(c)}>
                <span className="fs-search-item-code">
                  {c.code} — {c.professor}
                </span>
                <span className="fs-search-item-title">{c.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exams count */}
      <div className="fs-exams-header">
        <span className="fs-exams-count">My Exams ({added.length})</span>
      </div>

      {/* Calendar grid */}
      <div className="fs-cal">
        <div className="fs-cal-header">
          <span className="fs-cal-header-cell" />
          {DAYS.map((d) => (
            <span key={d} className="fs-cal-header-cell">
              {d}
            </span>
          ))}
        </div>
        <div className="fs-cal-body">
          {/* Time labels */}
          <div className="fs-cal-time-col">
            {Array.from({ length: HOUR_COUNT }, (_, i) => (
              <span key={i} className="fs-cal-time-label">
                {formatHour(HOUR_START + i)}
              </span>
            ))}
          </div>

          {/* Grid area */}
          <div className="fs-cal-grid" style={{ height: HOUR_COUNT * ROW_H }}>
            {/* Grid lines */}
            <div className="fs-cal-grid-lines">
              {Array.from({ length: HOUR_COUNT }, (_, i) => (
                <div key={`h${i}`} className="fs-cal-grid-line" style={{ top: i * ROW_H }} />
              ))}
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={`v${i}`}
                  className="fs-cal-grid-col-line"
                  style={{ left: `${((i + 1) / 5) * 100}%` }}
                />
              ))}
            </div>

            {/* Exam blocks */}
            {added.map((c, idx) => {
              const top = (c.start - HOUR_START) * ROW_H
              const height = (c.end - c.start) * ROW_H
              const left = `${(c.day / 5) * 100}%`
              const width = `${100 / 5}%`
              const color = BLOCK_COLORS[idx % BLOCK_COLORS.length]
              return (
                <div
                  key={c.id}
                  className="fs-cal-block"
                  style={{ top, height, left, width, background: color }}
                  onClick={() => removeCourse(c.id)}
                  title={`Click to remove ${c.code}`}
                >
                  <span className="fs-cal-block-code">{c.code}</span>
                  <span className="fs-cal-block-time">
                    {formatHour(c.start)}–{formatHour(c.end)}
                  </span>
                </div>
              )
            })}

            {added.length === 0 && <div className="fs-cal-empty">Search and add courses above</div>}
          </div>
        </div>
      </div>

      <p className="fs-mock-caption">Try it — search &amp; click to add exams</p>
    </div>
  )
}
