import { useEffect, useRef } from 'react'

type WindowTransitionOverlayProps = {
  snapshotCanvas: HTMLCanvasElement
  windowRect: DOMRect
  dockIconRect: DOMRect
  direction: 'minimize' | 'restore'
  onComplete: () => void
  reduceMotion?: boolean
}

type RectLike = {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}

const TARGET_OVERSAMPLE = Math.max(1.75, Math.min(3, window.devicePixelRatio * 1.75))
const DEFAULT_DURATION_MS = 520
const DEFAULT_RESTORE_DURATION_MS = 420
const REDUCED_MOTION_DURATION_MS = 100
const SLIDE_END_FRACTION = 0.5
const TRANSLATE_START_FRACTION = 0.4

function clamp(min: number, value: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function quadraticEaseInOut(t: number) {
  if (t < 0.5) return 2 * t * t
  return 1 - Math.pow(-2 * t + 2, 2) / 2
}

function getAnimationGeometry(initialRect: RectLike, finalRect: RectLike, fraction: number) {
  const slideProgress = clamp(0, fraction / SLIDE_END_FRACTION, 1)
  const translateProgress = clamp(
    0,
    (fraction - TRANSLATE_START_FRACTION) / (1 - TRANSLATE_START_FRACTION),
    1
  )

  const leftEdgeDistanceToMove = finalRect.left - initialRect.left
  const rightEdgeDistanceToMove = finalRect.right - initialRect.right
  const verticalDistanceToMove = finalRect.top - initialRect.top

  const topEdgeY = initialRect.top + translateProgress * verticalDistanceToMove
  const bottomEdgeY = Math.min(
    initialRect.bottom + translateProgress * verticalDistanceToMove,
    finalRect.bottom
  )

  const bezierTopY = initialRect.top
  const bezierBottomY = finalRect.top
  const bezierHeight = Math.max(1, bezierBottomY - bezierTopY)

  const leftBezierTopX = initialRect.left
  const rightBezierTopX = initialRect.right
  const leftBezierBottomX = initialRect.left + slideProgress * leftEdgeDistanceToMove
  const rightBezierBottomX = initialRect.right + slideProgress * rightEdgeDistanceToMove

  function leftBezierPosition(y: number) {
    if (y < bezierTopY) return leftBezierTopX
    if (y < bezierBottomY) {
      const progress = quadraticEaseInOut((y - bezierTopY) / bezierHeight)
      return leftBezierTopX + progress * (leftBezierBottomX - leftBezierTopX)
    }
    return leftBezierBottomX
  }

  function rightBezierPosition(y: number) {
    if (y < bezierTopY) return rightBezierTopX
    if (y < bezierBottomY) {
      const progress = quadraticEaseInOut((y - bezierTopY) / bezierHeight)
      return rightBezierTopX + progress * (rightBezierBottomX - rightBezierTopX)
    }
    return rightBezierBottomX
  }

  return { topEdgeY, bottomEdgeY, leftBezierPosition, rightBezierPosition }
}

export function WindowTransitionOverlay({
  snapshotCanvas,
  windowRect,
  dockIconRect,
  direction,
  onComplete,
  reduceMotion = false,
}: WindowTransitionOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) {
      onComplete()
      return
    }

    const initialRect: RectLike = {
      left: windowRect.left,
      top: windowRect.top,
      right: windowRect.right,
      bottom: windowRect.bottom,
      width: windowRect.width,
      height: windowRect.height,
    }

    const finalWidth = dockIconRect.width * 0.7
    const finalHeight = dockIconRect.height * 0.7
    const finalLeft = dockIconRect.left + (dockIconRect.width - finalWidth) / 2
    const finalTop = dockIconRect.top + (dockIconRect.height - finalHeight) / 2
    const finalRect: RectLike = {
      left: finalLeft,
      top: finalTop,
      right: finalLeft + finalWidth,
      bottom: finalTop + finalHeight,
      width: finalWidth,
      height: finalHeight,
    }

    canvas.width = Math.round(window.innerWidth * TARGET_OVERSAMPLE)
    canvas.height = Math.round(window.innerHeight * TARGET_OVERSAMPLE)
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    context.setTransform(TARGET_OVERSAMPLE, 0, 0, TARGET_OVERSAMPLE, 0, 0)
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'

    const windowArea = Math.max(1, windowRect.width * windowRect.height)
    const baseRowCount = Math.round(windowRect.height / 5.5)
    const densityScale = windowArea > 420_000 ? 0.62 : windowArea > 280_000 ? 0.78 : 1
    const rowCount = Math.max(56, Math.min(180, Math.round(baseRowCount * densityScale)))
    const duration = reduceMotion
      ? REDUCED_MOTION_DURATION_MS
      : direction === 'restore'
        ? DEFAULT_RESTORE_DURATION_MS
        : DEFAULT_DURATION_MS

    let animationFrame = 0
    let finished = false
    const startTime = performance.now()

    const drawWarpedFrame = (fraction: number) => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
      const geometry = getAnimationGeometry(initialRect, finalRect, fraction)
      const rows = rowCount

      for (let row = 0; row < rows; row += 1) {
        const p0 = row / rows
        const p1 = (row + 1) / rows

        const y0 = lerp(geometry.topEdgeY, geometry.bottomEdgeY, p0)
        const y1 = lerp(geometry.topEdgeY, geometry.bottomEdgeY, p1)
        const x0Left = geometry.leftBezierPosition(y0)
        const x0Right = geometry.rightBezierPosition(y0)
        const x1Left = geometry.leftBezierPosition(y1)
        const x1Right = geometry.rightBezierPosition(y1)

        const rawSrcY0 = Math.floor((row * snapshotCanvas.height) / rows)
        const rawSrcY1 = Math.floor(((row + 1) * snapshotCanvas.height) / rows)
        const srcY = Math.max(0, rawSrcY0 - 1)
        const srcStripHeight = Math.max(
          2,
          Math.min(snapshotCanvas.height - srcY, rawSrcY1 - rawSrcY0 + 2)
        )

        const minX = Math.min(x0Left, x1Left) - 1.25
        const maxX = Math.max(x0Right, x1Right) + 1.25
        const destTop = row === 0 ? y0 : y0 - 0.9
        const destBottom = row === rows - 1 ? y1 : y1 + 0.9
        const destHeight = Math.max(1.8, destBottom - destTop)

        context.save()
        context.beginPath()
        context.moveTo(x0Left, destTop)
        context.lineTo(x0Right, destTop)
        context.lineTo(x1Right, destBottom)
        context.lineTo(x1Left, destBottom)
        context.closePath()
        context.clip()
        context.drawImage(
          snapshotCanvas,
          0,
          srcY,
          snapshotCanvas.width,
          srcStripHeight,
          minX,
          destTop,
          Math.max(1, maxX - minX),
          destHeight
        )
        context.restore()
      }
    }

    const finish = () => {
      if (finished) return
      finished = true
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
      onComplete()
    }

    const frame = (now: number) => {
      const raw = clamp(0, (now - startTime) / duration, 1)
      const progress = direction === 'restore' ? 1 - raw : raw

      if (reduceMotion) {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight)
        context.globalAlpha = direction === 'restore' ? 1 - raw : 1 - raw
        context.drawImage(
          snapshotCanvas,
          0,
          0,
          snapshotCanvas.width,
          snapshotCanvas.height,
          initialRect.left,
          initialRect.top,
          initialRect.width,
          initialRect.height
        )
        context.globalAlpha = 1
      } else {
        drawWarpedFrame(progress)
      }

      if (raw >= 1) {
        finish()
        return
      }

      animationFrame = requestAnimationFrame(frame)
    }

    animationFrame = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(animationFrame)
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
    }
  }, [dockIconRect, direction, onComplete, reduceMotion, snapshotCanvas, windowRect])

  return <canvas ref={canvasRef} className="window-transition-overlay" aria-hidden />
}
