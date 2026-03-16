import { useEffect, useState, useRef, useCallback } from 'react'

type WelcomeNotificationProps = {
  reduceMotion: boolean
}

const STORAGE_KEY = 'ika-os-welcomed'

export function WelcomeNotification({ reduceMotion }: WelcomeNotificationProps) {
  const [phase, setPhase] = useState<'hidden' | 'entering' | 'visible' | 'exiting' | 'done'>(
    'hidden'
  )
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') {
        setPhase('done')
        return
      }
    } catch {
      setPhase('done')
      return
    }

    const t1 = setTimeout(() => setPhase('entering'), 500)
    timersRef.current.push(t1)

    const t2 = setTimeout(() => setPhase('visible'), reduceMotion ? 500 : 800)
    timersRef.current.push(t2)

    const t3 = setTimeout(() => setPhase('exiting'), reduceMotion ? 5500 : 5800)
    timersRef.current.push(t3)

    const t4 = setTimeout(() => {
      setPhase('done')
      try { sessionStorage.setItem(STORAGE_KEY, '1') } catch { /* ignore */ }
    }, reduceMotion ? 5500 : 6100)
    timersRef.current.push(t4)

    return clearTimers
  }, [reduceMotion, clearTimers])

  const dismiss = useCallback(() => {
    clearTimers()
    setPhase('exiting')
    const t = setTimeout(() => {
      setPhase('done')
      try { sessionStorage.setItem(STORAGE_KEY, '1') } catch { /* ignore */ }
    }, reduceMotion ? 0 : 300)
    timersRef.current.push(t)
  }, [clearTimers, reduceMotion])

  if (phase === 'done' || phase === 'hidden') return null

  const className = [
    'welcome-notification',
    phase === 'visible' || phase === 'entering' ? 'welcome-notification--visible' : '',
    phase === 'exiting' ? 'welcome-notification--hiding' : '',
    reduceMotion ? 'welcome-notification--no-motion' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className} onClick={dismiss} role="status">
      <img
        src="/icons/finder.png"
        alt=""
        className="welcome-notification-icon"
        draggable={false}
      />
      <div>
        <p className="welcome-notification-title">Welcome to IkaOS</p>
        <p className="welcome-notification-body">
          Double-click an icon or explore the dock to get started.
        </p>
      </div>
    </div>
  )
}
