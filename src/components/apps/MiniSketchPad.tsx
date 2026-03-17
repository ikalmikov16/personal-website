import { useCallback, useEffect, useRef, useState } from 'react'

const PROMPTS = [
  'A Cat',
  'A Slice of Pizza',
  'A Banana With Wheels',
  'A Dog Wearing a Hat',
  'Your Dream House',
  'A Rocket Ship Bedroom',
  'A Fish With Legs',
  'A Chair',
  'A Pair of Glasses',
  'A Ghost Playing Guitar',
  'A Bird',
  'A Cheeseburger',
  'A Castle in the Clouds',
  'A Sunflower',
  'A Robot',
  'A Tree With Eyes',
  'A Cup of Coffee',
  'A Penguin on a Surfboard',
  'A Mountain at Sunset',
  'A Spaceship',
]

const COLORS = [
  '#222222',
  '#ef4444',
  '#3b82f6',
  '#f97316',
  '#14b8a6',
  '#8b5cf6',
  '#22c55e',
  '#ffffff',
]

const CANVAS_W = 220
const CANVAS_H = 200

export function MiniSketchPad() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeColor, setActiveColor] = useState(COLORS[0])
  const [prompt, setPrompt] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
  const painting = useRef(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  const getPos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (CANVAS_W / rect.width),
      y: (e.clientY - rect.top) * (CANVAS_H / rect.height),
    }
  }, [])

  const drawLine = useCallback(
    (from: { x: number; y: number }, to: { x: number; y: number }) => {
      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx) return
      ctx.strokeStyle = activeColor
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.stroke()
    },
    [activeColor]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      painting.current = true
      const pos = getPos(e)
      lastPos.current = pos
      const ctx = canvasRef.current?.getContext('2d')
      if (ctx) {
        ctx.fillStyle = activeColor
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
    },
    [activeColor, getPos]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!painting.current || !lastPos.current) return
      const pos = getPos(e)
      drawLine(lastPos.current, pos)
      lastPos.current = pos
    },
    [drawLine, getPos]
  )

  useEffect(() => {
    const up = () => {
      painting.current = false
      lastPos.current = null
    }
    window.addEventListener('mouseup', up)
    return () => window.removeEventListener('mouseup', up)
  }, [])

  const clearCanvas = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
  }, [])

  useEffect(() => {
    clearCanvas()
  }, [clearCanvas])

  const newPrompt = useCallback(() => {
    setPrompt((prev) => {
      let next: string
      do {
        next = PROMPTS[Math.floor(Math.random() * PROMPTS.length)]
      } while (next === prev && PROMPTS.length > 1)
      return next
    })
    clearCanvas()
  }, [clearCanvas])

  return (
    <div className="so-sketchpad">
      <div className="so-sketchpad-prompt">
        <span className="so-sketchpad-prompt-text">Draw: {prompt}</span>
        <button className="so-sketchpad-new-btn" onClick={newPrompt}>
          New
        </button>
      </div>
      <div className="so-sketchpad-frame">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="so-sketchpad-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        />
      </div>
      <div className="so-sketchpad-controls">
        {COLORS.map((c) => (
          <button
            key={c}
            className={`so-sketchpad-color${c === activeColor ? ' so-sketchpad-color--active' : ''}`}
            style={{ background: c }}
            onClick={() => setActiveColor(c)}
            aria-label={`Color ${c}`}
          />
        ))}
        <button className="so-sketchpad-clear" onClick={clearCanvas}>
          Clear
        </button>
      </div>
      <p className="so-sketchpad-caption">Try it -- draw the prompt!</p>
    </div>
  )
}
