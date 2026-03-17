import { useEffect, useRef, useState } from 'react'

type VolumeHUDProps = {
  level: number
  isOpen: boolean
  onHide: () => void
}

const TOTAL_BLOCKS = 16
const DISMISS_MS = 1500
const FADE_MS = 300

function SpeakerIcon({ level }: { level: number }) {
  const waves = level === 0 ? 0 : level <= 5 ? 1 : level <= 10 ? 2 : 3
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#fff" stroke="none" />
      {waves >= 1 && <path d="M14 9.5a3.5 3.5 0 0 1 0 5" />}
      {waves >= 2 && <path d="M16.5 7a7 7 0 0 1 0 10" />}
      {waves >= 3 && <path d="M19 4.5a10.5 10.5 0 0 1 0 15" />}
    </svg>
  )
}

export function VolumeHUD({ level, isOpen, onHide }: VolumeHUDProps) {
  const [fading, setFading] = useState(false)
  const [tracked, setTracked] = useState({ isOpen, level })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (isOpen !== tracked.isOpen || level !== tracked.level) {
    setTracked({ isOpen, level })
    setFading(false)
  }

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)

    if (!isOpen) return

    timerRef.current = setTimeout(() => {
      setFading(true)
      fadeTimerRef.current = setTimeout(onHide, FADE_MS)
    }, DISMISS_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
    }
  }, [isOpen, level, onHide])

  if (!isOpen) return null

  return (
    <div
      className={`volume-hud${fading ? ' volume-hud--hidden' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={`Volume ${level} of ${TOTAL_BLOCKS}`}
    >
      <div className="volume-hud-icon">
        <SpeakerIcon level={level} />
      </div>
      <div className="volume-hud-blocks">
        {Array.from({ length: TOTAL_BLOCKS }, (_, i) => (
          <div
            key={i}
            className={`volume-hud-block${i < level ? ' volume-hud-block--filled' : ' volume-hud-block--empty'}`}
          />
        ))}
      </div>
    </div>
  )
}
