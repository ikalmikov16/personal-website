import { useEffect, useRef } from 'react'

type CrashDialogProps = {
  appName: string
  onRelaunch: () => void
  onDismiss: () => void
}

export function CrashDialog({ appName, onRelaunch, onDismiss }: CrashDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const firstButton = dialogRef.current?.querySelector<HTMLButtonElement>('button')
    firstButton?.focus()
  }, [])

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusables = el.querySelectorAll<HTMLElement>('button')
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    el.addEventListener('keydown', handleKeyDown)
    return () => el.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div
      className="crash-dialog-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crash-dialog-title"
    >
      <div className="crash-dialog" ref={dialogRef}>
        <div className="crash-dialog-icon" aria-hidden>
          ⚠️
        </div>
        <h2 id="crash-dialog-title" className="crash-dialog-title">
          {appName} quit unexpectedly
        </h2>
        <p className="crash-dialog-message">
          Click Relaunch to open the application again. If you continue to have problems, try
          restarting your computer.
        </p>
        <div className="crash-dialog-buttons">
          <button
            type="button"
            className="crash-dialog-btn crash-dialog-btn--primary"
            onClick={onRelaunch}
          >
            Relaunch
          </button>
          <button type="button" className="crash-dialog-btn" onClick={onDismiss}>
            Report to Apple
          </button>
          <button type="button" className="crash-dialog-btn" onClick={onDismiss}>
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
