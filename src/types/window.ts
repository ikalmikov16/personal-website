export type WindowPosition = { x: number; y: number }

export type WindowSize = { width: number; height: number }

export type WindowEntry = {
  id: string
  appId: string
  title: string
  position: WindowPosition
  size: WindowSize
  minimized?: boolean
  wasRestored?: boolean
  preZoomRect?: { x: number; y: number; width: number; height: number } | null
}

export const DEFAULT_WINDOW_SIZE: WindowSize = { width: 650, height: 450 }

export const MIN_WINDOW_WIDTH = 320
export const MIN_WINDOW_HEIGHT = 240
export const MAX_WINDOW_WIDTH = 1200
export const MAX_WINDOW_HEIGHT = 800
