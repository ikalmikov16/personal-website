import { useState, useRef, useCallback, useEffect, useMemo } from 'react'

export type SpotlightResult = {
  id: string
  label: string
  category: string
  icon?: string
  action: () => void
}

type SpotlightProps = {
  onClose: () => void
  onAction: (action: () => void) => void
  searchItems: SpotlightResult[]
  reduceMotion: boolean
}

type GroupedResults = { category: string; items: SpotlightResult[] }[]

function groupByCategory(items: SpotlightResult[]): GroupedResults {
  const map = new Map<string, SpotlightResult[]>()
  for (const item of items) {
    const arr = map.get(item.category)
    if (arr) arr.push(item)
    else map.set(item.category, [item])
  }
  return Array.from(map, ([category, items]) => ({ category, items }))
}

export function Spotlight({ onClose, onAction, searchItems, reduceMotion }: SpotlightProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return searchItems.slice(0, 20)
    const q = query.toLowerCase()
    return searchItems.filter((item) => item.label.toLowerCase().includes(q))
  }, [query, searchItems])

  const grouped = useMemo(() => groupByCategory(filtered), [filtered])

  const flatItems = useMemo(() => filtered, [filtered])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    const el = resultsRef.current?.querySelector('.spotlight-result--selected')
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  const triggerAction = useCallback(
    (index: number) => {
      const item = flatItems[index]
      if (item) onAction(item.action)
    },
    [flatItems, onAction]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'Tab':
          e.preventDefault()
          setSelectedIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1))
          break
        case 'Enter':
          e.preventDefault()
          triggerAction(selectedIndex)
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    },
    [flatItems.length, selectedIndex, triggerAction, onClose]
  )

  let flatIndex = 0

  return (
    <div className="spotlight-backdrop" onMouseDown={onClose}>
      <div
        className={`spotlight-panel${reduceMotion ? '' : ' spotlight-panel--entering'}`}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label="Spotlight Search"
      >
        <div className="spotlight-input-wrap">
          <svg
            className="spotlight-input-icon"
            width="18"
            height="18"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <circle cx="5.8" cy="5.8" r="4.5" />
            <line x1="9.2" y1="9.2" x2="13" y2="13" />
          </svg>
          <input
            ref={inputRef}
            className="spotlight-input"
            type="text"
            placeholder="Spotlight Search"
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        {flatItems.length > 0 && (
          <div className="spotlight-results" ref={resultsRef}>
            {grouped.map((group) => (
              <div key={group.category}>
                <div className="spotlight-category">{group.category}</div>
                {group.items.map((item) => {
                  const idx = flatIndex++
                  const isSelected = idx === selectedIndex
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`spotlight-result${isSelected ? ' spotlight-result--selected' : ''}`}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => triggerAction(idx)}
                    >
                      {item.icon ? (
                        <img
                          src={item.icon}
                          alt=""
                          className="spotlight-result-icon"
                          draggable={false}
                        />
                      ) : (
                        <span className="spotlight-result-icon spotlight-result-icon--empty" />
                      )}
                      <span className="spotlight-result-label">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        )}

        {flatItems.length === 0 && query.trim() && (
          <div className="spotlight-empty">No results for &ldquo;{query}&rdquo;</div>
        )}
      </div>
    </div>
  )
}
