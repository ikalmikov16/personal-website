import { useEffect, useCallback } from 'react'

type AboutThisMacProps = {
  onClose: () => void
}

const INFO_ROWS = [
  { label: 'Processor', value: 'Irakli Kalmikov' },
  { label: 'Memory', value: 'TypeScript, React, Vite' },
  { label: 'Startup Disk', value: 'github.com/ikalmikov16' },
]

export function AboutThisMac({ onClose }: AboutThisMacProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="about-mac-backdrop" onMouseDown={onClose}>
      <div
        className="about-mac-outer"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="About This Mac"
      >
        <div className="window">
          <div className="window-title-bar">
            <div className="traffic-lights">
              <span
                className="traffic-light traffic-light--red"
                onClick={onClose}
                role="button"
                aria-label="Close"
              >
                <span className="traffic-light-symbol">×</span>
              </span>
              <span className="traffic-light about-mac-tl--disabled" role="presentation" />
              <span className="traffic-light about-mac-tl--disabled" role="presentation" />
            </div>
            <span className="window-title">About This Mac</span>
          </div>

          <div className="about-mac-content">
            <img
              src="/icons/glossy-apple-logo.png"
              alt=""
              className="about-mac-logo"
              draggable={false}
              aria-hidden
            />

            <h1 className="about-mac-heading">Mac OS X</h1>
            <p className="about-mac-version">Version 10.6.8</p>

            <button type="button" className="about-mac-btn" disabled>
              Software Update...
            </button>

            <div className="about-mac-info">
              {INFO_ROWS.map((row) => (
                <div key={row.label} className="about-mac-info-row">
                  <span className="about-mac-info-label">{row.label}</span>
                  <span className="about-mac-info-value">{row.value}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="about-mac-btn"
              onClick={() =>
                window.open('https://github.com/ikalmikov16', '_blank', 'noopener,noreferrer')
              }
            >
              More Info...
            </button>

            <p className="about-mac-copyright">
              TM and © 1983–2011 Apple Inc.
              <br />
              All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
