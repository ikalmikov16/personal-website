import { useEffect, useState, useRef } from 'react'

type BootScreenProps = {
  onComplete: () => void
  reduceMotion: boolean
}

const AppleLogo = () => (
  <svg
    className="boot-screen-logo"
    width="44"
    height="54"
    viewBox="0 0 814 1000"
    fill="#6e6e6e"
    aria-hidden
  >
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.3-155.5-127c-56.9-82-101.8-210.6-101.8-332.8 0-195.6 127.2-299.5 252.2-299.5 66.5 0 121.9 43.6 163.5 43.6 39.5 0 101.1-46.2 176.6-46.2 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8.6 15.7 1.3 18.2 2.6.6 6.4 1.3 10.2 1.3 45.4 0 103.5-30.4 139.5-71.4z" />
  </svg>
)

export function BootScreen({ onComplete, reduceMotion }: BootScreenProps) {
  const [phase, setPhase] = useState<'loading' | 'fading' | 'done'>('loading')
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    if (reduceMotion) {
      const t = setTimeout(() => {
        try {
          sessionStorage.setItem('ika-os-booted', '1')
        } catch {
          /* ignore */
        }
        onComplete()
      }, 500)
      timersRef.current.push(t)
      return
    }

    const t1 = setTimeout(() => setPhase('fading'), 2500)
    const t2 = setTimeout(() => {
      setPhase('done')
      try {
        sessionStorage.setItem('ika-os-booted', '1')
      } catch {
        /* ignore */
      }
      onComplete()
    }, 3000)

    timersRef.current.push(t1, t2)

    return () => {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
    }
  }, [onComplete, reduceMotion])

  if (phase === 'done') return null

  const className = [
    'boot-screen',
    phase === 'fading' ? 'boot-screen--fading' : '',
    reduceMotion ? 'boot-screen--no-motion' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className} aria-hidden>
      <AppleLogo />
      <div className="boot-screen-progress">
        <div className="boot-screen-progress-fill" />
      </div>
    </div>
  )
}
