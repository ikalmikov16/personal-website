import { useEffect } from 'react'

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
]

export function useKonamiCode(onMatch: () => void) {
  useEffect(() => {
    let index = 0

    const handleKeyDown = (e: KeyboardEvent) => {
      const expected = KONAMI_SEQUENCE[index]
      if (e.code === expected) {
        index += 1
        if (index === KONAMI_SEQUENCE.length) {
          onMatch()
          index = 0
        }
      } else {
        index = 0
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onMatch])
}
