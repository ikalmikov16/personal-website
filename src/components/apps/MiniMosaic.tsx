import { useCallback, useEffect, useRef, useState } from 'react'

const GRID = 20
const CELL_PX = 12
const CANVAS_SIZE = GRID * CELL_PX

const PALETTE = [
  '#222222',
  '#ffffff',
  '#4a9eff',
  '#f43f5e',
  '#22c55e',
  '#fbbf24',
  '#a855f7',
  '#f97316',
  '#14b8a6',
  '#6366f1',
]

function createGrid(): string[][] {
  return Array.from({ length: GRID }, () => Array.from({ length: GRID }, () => '#ffffff'))
}

export function MiniMosaic() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gridRef = useRef(createGrid())
  const [activeColor, setActiveColor] = useState(PALETTE[2])
  const painting = useRef(false)

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const grid = gridRef.current
    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        ctx.fillStyle = grid[y][x]
        ctx.fillRect(x * CELL_PX, y * CELL_PX, CELL_PX, CELL_PX)
      }
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL_PX, 0)
      ctx.lineTo(i * CELL_PX, CANVAS_SIZE)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * CELL_PX)
      ctx.lineTo(CANVAS_SIZE, i * CELL_PX)
      ctx.stroke()
    }
  }, [])

  useEffect(() => {
    draw()
  }, [draw])

  const paintAt = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current!.getBoundingClientRect()
      const scaleX = CANVAS_SIZE / rect.width
      const scaleY = CANVAS_SIZE / rect.height
      const x = Math.floor(((e.clientX - rect.left) * scaleX) / CELL_PX)
      const y = Math.floor(((e.clientY - rect.top) * scaleY) / CELL_PX)
      if (x < 0 || x >= GRID || y < 0 || y >= GRID) return
      if (gridRef.current[y][x] === activeColor) return
      gridRef.current[y][x] = activeColor
      draw()
    },
    [activeColor, draw]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      painting.current = true
      paintAt(e)
    },
    [paintAt]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!painting.current) return
      paintAt(e)
    },
    [paintAt]
  )

  useEffect(() => {
    const up = () => {
      painting.current = false
    }
    window.addEventListener('mouseup', up)
    return () => window.removeEventListener('mouseup', up)
  }, [])

  return (
    <div className="lt-demo">
      <div className="lt-demo-frame">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="lt-demo-canvas"
          style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        />
      </div>
      <div className="lt-demo-palette">
        {PALETTE.map((c) => (
          <button
            key={c}
            className={`lt-demo-color${c === activeColor ? ' lt-demo-color--active' : ''}`}
            style={{ background: c }}
            onClick={() => setActiveColor(c)}
            aria-label={`Color ${c}`}
          />
        ))}
      </div>
      <p className="lt-demo-caption">Click &amp; drag to draw on the mosaic</p>
    </div>
  )
}
