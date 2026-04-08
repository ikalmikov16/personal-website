/**
 * Architecture diagram for Live Tesserae — pure SVG, no DOM measurement.
 *
 *                React Frontend
 *               /              \
 *     FastAPI Server      CloudFront CDN
 *        /       \              |
 *   PostgreSQL    AWS S3 -------+
 *
 * Frontend → FastAPI over REST + WebSocket (tile CRUD, live updates).
 * Frontend → CloudFront CDN for chunk/overview images.
 * FastAPI → PostgreSQL (tile data) + S3 (rendered chunk images).
 * CloudFront origin is S3.
 */

const W = 440
const H = 220

type Node = {
  id: string
  x: number
  y: number
  label: string
  sub?: string
  accent?: boolean
}

const NODES: Node[] = [
  { id: 'frontend', x: 220, y: 30, label: 'React Frontend', accent: true },
  { id: 'fastapi', x: 125, y: 108, label: 'FastAPI Server', accent: true, sub: 'REST + WebSocket' },
  { id: 'cdn', x: 325, y: 108, label: 'CloudFront CDN', sub: 'Images' },
  { id: 'pg', x: 70, y: 188, label: 'PostgreSQL', sub: 'Tile data' },
  { id: 's3', x: 235, y: 188, label: 'AWS S3', sub: 'Chunk images' },
]

const EDGES: [string, string][] = [
  ['frontend', 'fastapi'],
  ['frontend', 'cdn'],
  ['fastapi', 'pg'],
  ['fastapi', 's3'],
  ['cdn', 's3'],
]

const PAD_X = 12
const CHAR_W = 6.2
const BOX_H_SINGLE = 24
const BOX_H_SUB = 36

function getBoxRect(n: Node) {
  const textLen = Math.max(n.label.length, n.sub ? n.sub.length : 0)
  const w = textLen * CHAR_W + PAD_X * 2
  const h = n.sub ? BOX_H_SUB : BOX_H_SINGLE
  return { x: n.x - w / 2, y: n.y - h / 2, w, h }
}

function edgeEndpoints(from: Node, to: Node) {
  const fBox = getBoxRect(from)
  const tBox = getBoxRect(to)
  return {
    x1: from.x,
    y1: fBox.y + fBox.h,
    x2: to.x,
    y2: tBox.y,
  }
}

const nodeMap = new Map(NODES.map((n) => [n.id, n]))

export function ArchDiagram() {
  return (
    <div className="lt-arch-tree">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, display: 'block' }}>
        {/* Connector lines (drawn first, behind nodes) */}
        {EDGES.map(([fromId, toId]) => {
          const pts = edgeEndpoints(nodeMap.get(fromId)!, nodeMap.get(toId)!)
          return (
            <line
              key={`${fromId}-${toId}`}
              x1={pts.x1}
              y1={pts.y1}
              x2={pts.x2}
              y2={pts.y2}
              stroke="rgba(74,158,255,0.6)"
              strokeWidth={1.8}
            />
          )
        })}

        {/* Nodes */}
        {NODES.map((n) => {
          const r = getBoxRect(n)
          return (
            <g key={n.id}>
              <rect
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                rx={6}
                fill={n.accent ? 'rgba(74,158,255,0.12)' : 'rgba(255,255,255,0.06)'}
                stroke={n.accent ? 'rgba(74,158,255,0.5)' : 'rgba(255,255,255,0.18)'}
                strokeWidth={1}
              />
              <text
                x={n.x}
                y={n.sub ? n.y - 4 : n.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={n.accent ? '#fff' : 'rgba(255,255,255,0.85)'}
                fontSize={11}
                fontWeight={500}
                fontFamily="'Lucida Grande', 'Lucida Sans Unicode', sans-serif"
              >
                {n.label}
              </text>
              {n.sub && (
                <text
                  x={n.x}
                  y={n.y + 11}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="rgba(255,255,255,0.35)"
                  fontSize={9}
                  fontFamily="'Lucida Grande', 'Lucida Sans Unicode', sans-serif"
                >
                  {n.sub}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
