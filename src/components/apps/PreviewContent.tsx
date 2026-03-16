import { useState, useRef, useCallback, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const MIN_SCALE = 0.25
const MAX_SCALE = 4
const DEFAULT_SCALE = 0.75
const ZOOM_STEP = 0.25
const PINCH_SENSITIVITY = 0.01

// Render once at 2x for retina sharpness; all zoom is pure CSS after that.
const RENDER_SCALE = 2

function clampScale(s: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s))
}

export function PreviewContent() {
  const [numPages, setNumPages] = useState<number>(0)
  const [scale, setScale] = useState(DEFAULT_SCALE)
  const [pageSize, setPageSize] = useState<{ w: number; h: number } | null>(null)
  const viewerRef = useRef<HTMLDivElement>(null)

  const zoomPercent = Math.round(scale * 100)

  const onDocumentLoadSuccess = useCallback(({ numPages: n }: { numPages: number }) => {
    setNumPages(n)
  }, [])

  const onPageLoadSuccess = useCallback(
    (page: { width: number; height: number }) => {
      if (!pageSize) {
        setPageSize({ w: page.width, h: page.height })
      }
    },
    [pageSize]
  )

  const zoomIn = () => setScale((s) => clampScale(s + ZOOM_STEP))
  const zoomOut = () => setScale((s) => clampScale(s - ZOOM_STEP))
  const zoomActual = () => setScale(1)

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      setScale((s) => clampScale(s - e.deltaY * PINCH_SENSITIVITY))
    }

    viewer.addEventListener('wheel', handleWheel, { passive: false })
    return () => viewer.removeEventListener('wheel', handleWheel)
  }, [])

  // CSS scale: the canvas is rendered at RENDER_SCALE, but we want to display at `scale`.
  // A PDF point is 1/72 inch; react-pdf at scale=2 renders 2px per point.
  // To display at `scale`, we need CSS transform = scale / RENDER_SCALE.
  const cssScale = scale / RENDER_SCALE

  // page.width/height from react-pdf already include RENDER_SCALE,
  // so divide by RENDER_SCALE to get base PDF point dimensions.
  const displayW = pageSize ? pageSize.w * cssScale : undefined
  const displayH = pageSize ? pageSize.h * cssScale : undefined

  return (
    <div className="preview">
      {/* Toolbar */}
      <div className="preview-toolbar">
        <div className="preview-toolbar-group">
          <button
            type="button"
            className="preview-toolbar-btn"
            aria-label="Sidebar"
            title="Toggle Sidebar"
          >
            <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor">
              <rect
                x="0"
                y="0"
                width="14"
                height="12"
                rx="1.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <line x1="4.5" y1="0" x2="4.5" y2="12" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
        </div>

        <div className="preview-toolbar-group">
          <button
            type="button"
            className="preview-toolbar-btn"
            onClick={zoomOut}
            disabled={scale <= MIN_SCALE}
            aria-label="Zoom out"
            title="Zoom Out"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            >
              <circle cx="6" cy="6" r="4.5" />
              <line x1="9.5" y1="9.5" x2="13" y2="13" />
              <line x1="3.5" y1="6" x2="8.5" y2="6" />
            </svg>
          </button>
          <button
            type="button"
            className="preview-toolbar-btn"
            onClick={zoomIn}
            disabled={scale >= MAX_SCALE}
            aria-label="Zoom in"
            title="Zoom In"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            >
              <circle cx="6" cy="6" r="4.5" />
              <line x1="9.5" y1="9.5" x2="13" y2="13" />
              <line x1="3.5" y1="6" x2="8.5" y2="6" />
              <line x1="6" y1="3.5" x2="6" y2="8.5" />
            </svg>
          </button>
        </div>

        <button type="button" className="preview-toolbar-btn" aria-label="Rotate" title="Rotate">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          >
            <path d="M2 7a5 5 0 0 1 9-3" />
            <polyline points="11 1 11 4 8 4" />
          </svg>
        </button>

        <div className="preview-toolbar-spacer" />

        <span className="preview-toolbar-zoom">{zoomPercent}%</span>

        <button
          type="button"
          className="preview-toolbar-btn preview-toolbar-actual"
          onClick={zoomActual}
          title="Actual Size"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect
              x="1"
              y="1"
              width="12"
              height="12"
              rx="1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <text
              x="7"
              y="10.5"
              textAnchor="middle"
              fontSize="7.5"
              fontWeight="bold"
              fill="currentColor"
              stroke="none"
            >
              1:1
            </text>
          </svg>
        </button>

        <span className="preview-toolbar-page">{numPages > 0 ? `Page 1 of ${numPages}` : ''}</span>

        <input type="search" className="preview-search" placeholder="Search" aria-label="Search" />
      </div>

      {/* PDF viewer area */}
      <div className="preview-viewer" ref={viewerRef}>
        <Document
          file="/Resume.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="preview-loading">Loading PDF…</div>}
          error={<div className="preview-error">Failed to load PDF.</div>}
        >
          {Array.from({ length: numPages }, (_, i) => (
            <div
              key={i}
              className="preview-page-sizer"
              style={
                displayW != null && displayH != null
                  ? { width: displayW, height: displayH }
                  : undefined
              }
            >
              <div
                className="preview-page-wrapper"
                style={{ transform: `scale(${cssScale})`, transformOrigin: 'top left' }}
              >
                <Page
                  pageNumber={i + 1}
                  scale={RENDER_SCALE}
                  renderTextLayer
                  renderAnnotationLayer
                  onLoadSuccess={onPageLoadSuccess}
                />
              </div>
            </div>
          ))}
        </Document>
      </div>
    </div>
  )
}
