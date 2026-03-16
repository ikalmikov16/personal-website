import { useState, useEffect } from 'react'
import type { WallpaperStyle } from '../../data/wallpapers'

type SlideToUnlockProps = {
  onUnlock: () => void
  wallpaperStyle: WallpaperStyle
}

function formatTime() {
  const now = new Date()
  return now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function formatDate() {
  return new Date().toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function SlideToUnlock({ onUnlock, wallpaperStyle }: SlideToUnlockProps) {
  const [time, setTime] = useState(formatTime)
  const [date] = useState(formatDate)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 30_000)
    return () => clearInterval(id)
  }, [])

  const handleTap = () => {
    setFading(true)
    setTimeout(onUnlock, 300)
  }

  return (
    <div
      className={`slide-to-unlock${fading ? ' slide-to-unlock--fading' : ''}`}
      onClick={handleTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleTap()}
    >
      <div className="slide-to-unlock-bg" style={wallpaperStyle} />
      <div className="slide-to-unlock-content">
        <p className="slide-to-unlock-time">{time}</p>
        <p className="slide-to-unlock-date">{date}</p>
        <p className="slide-to-unlock-text">slide to unlock</p>
      </div>
    </div>
  )
}
