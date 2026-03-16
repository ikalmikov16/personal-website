import { useState, useEffect } from 'react'

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function MobileStatusBar() {
  const [time, setTime] = useState(formatTime)

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="mobile-status-bar">
      <span className="mobile-status-carrier">
        IkaOS
        <svg className="mobile-status-signal" width="28" height="10" viewBox="0 0 28 10" fill="#fff">
          <rect x="0" y="7" width="4" height="3" rx="0.5" />
          <rect x="6" y="5" width="4" height="5" rx="0.5" />
          <rect x="12" y="3" width="4" height="7" rx="0.5" />
          <rect x="18" y="1" width="4" height="9" rx="0.5" />
          <rect x="24" y="0" width="4" height="10" rx="0.5" />
        </svg>
      </span>
      <span className="mobile-status-time">{time}</span>
      <span className="mobile-status-battery">
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none" stroke="#fff" strokeWidth="1">
          <rect x="0.5" y="0.5" width="20" height="10" rx="2" />
          <rect x="2" y="2" width="17" height="7" rx="1" fill="#32d74b" stroke="none" />
          <rect x="21" y="3" width="2.5" height="5" rx="1" fill="#fff" stroke="none" />
        </svg>
      </span>
    </div>
  )
}
