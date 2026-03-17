import { MiniSketchPad } from './MiniSketchPad'

const TECH_TAGS = [
  'React Native',
  'Expo',
  'Firebase Auth',
  'Firebase Realtime DB',
  'Firebase Storage',
  'React Navigation',
]

const FEATURES = [
  'Real-time multiplayer via Firebase Realtime Database',
  '100+ drawing prompts across 10 themed categories',
  'In-app drawing canvas with pen colors, eraser, and undo',
  'QR code and room code sharing for easy joins',
  'Sound effects and haptic feedback',
  'Works offline in Single Device mode',
]

const SCREENSHOTS = [
  { src: '/sketchoff/welcome.png', label: 'Welcome' },
  { src: '/sketchoff/drawing.png', label: 'Draw' },
  { src: '/sketchoff/rating.png', label: 'Rate' },
  { src: '/sketchoff/results.png', label: 'Results' },
]

const FLOW_STEPS = [
  {
    icon: '\u270F\uFE0F',
    name: 'Draw',
    desc: 'Everyone draws the same prompt on their own device',
  },
  {
    icon: '\u2B50',
    name: 'Rate',
    desc: 'Swipe through and rate each drawing from 0 to 10',
  },
  {
    icon: '\uD83C\uDFC6',
    name: 'Compete',
    desc: 'See the final standings and crown the winner',
  },
]

export function SketchOffContent() {
  return (
    <div className="so">
      {/* Toolbar */}
      <div className="so-toolbar">
        <div className="so-toolbar-left">
          <img src="/icons/sketchoff.png" alt="" className="so-toolbar-icon" draggable={false} />
          <span className="so-toolbar-title">SketchOff</span>
        </div>
        <a
          className="so-toolbar-btn"
          href="https://apps.apple.com/app/sketchoff"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="11" height="13" viewBox="0 0 11 13" fill="currentColor" aria-hidden="true">
            <path d="M8.77 6.84c-.01-1.56 1.27-2.31 1.33-2.35-.72-1.06-1.85-1.2-2.25-1.22-0.96-.1-1.87.56-2.36.56-.49 0-1.24-.55-2.04-.53A3.01 3.01 0 001 5.37c-1.08 1.87-.28 4.64.78 6.16.51.74 1.13 1.58 1.93 1.55.78-.03 1.07-.5 2.01-.5s1.2.5 2.02.48c.84-.01 1.37-.76 1.87-1.5.59-.86.83-1.7.85-1.74-.02-.01-1.63-.63-1.64-2.48h-.05zM7.23 2.14c.43-.52.72-1.24.64-1.96-.62.03-1.37.41-1.81.93-.4.46-.75 1.2-.65 1.9.69.06 1.39-.35 1.82-.87z" />
          </svg>
          App Store
        </a>
        <a
          className="so-toolbar-btn"
          href="https://play.google.com/store/apps/details?id=com.sketchoff"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="11" height="12" viewBox="0 0 11 12" fill="currentColor" aria-hidden="true">
            <path d="M0 .94C0 .56.2.22.54.04L6.7 5.6.54 11.16A.86.86 0 010 10.76V.94zm.96 10.54L7.52 6.2l1.44 1.32-7.2 4.16a.76.76 0 01-.8-.2zM9.52 5.08L7.52 6.2.96.22a.76.76 0 01.8-.2l7.76 5.06zM10.28 5.4l-1.2.68L7.92 5.6l1.16-.48 1.2.68c.28.16.28.44 0 .6z" />
          </svg>
          Play Store
        </a>
      </div>

      {/* Scrollable content */}
      <div className="so-content">
        {/* Hero: sketchpad + description */}
        <div className="so-hero">
          <MiniSketchPad />
          <div className="so-desc">
            <h2 className="so-desc-title">SketchOff</h2>
            <p className="so-desc-subtitle">Draw. Rate. Compete.</p>
            <p className="so-desc-text">
              A multiplayer drawing game on App Store and Google Play. Players get a prompt, draw it
              on their phone, then rate each other's artwork. The best artist wins. Play online with
              friends or pass one device around at a party.
            </p>
            <div className="so-stats">
              <span className="so-stat">100+ Prompts</span>
              <span className="so-stat">10 Themes</span>
              <span className="so-stat">Real-time Multiplayer</span>
            </div>
          </div>
        </div>

        {/* Game Flow */}
        <div className="so-section">
          <h4 className="so-section-label">How It Works</h4>
          <div className="so-flow">
            {FLOW_STEPS.map((step) => (
              <div key={step.name} className="so-flow-card">
                <span className="so-flow-icon">{step.icon}</span>
                <span className="so-flow-name">{step.name}</span>
                <span className="so-flow-desc">{step.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Screenshots */}
        <div className="so-section">
          <h4 className="so-section-label">Screenshots</h4>
          <div className="so-screenshots">
            {SCREENSHOTS.map((s) => (
              <div key={s.label} className="so-phone">
                <div className="so-phone-frame">
                  <img src={s.src} alt={s.label} draggable={false} />
                </div>
                <span className="so-phone-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div className="so-section">
          <h4 className="so-section-label">Technologies</h4>
          <div className="so-tags">
            {TECH_TAGS.map((t) => (
              <span key={t} className="so-tag">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="so-section">
          <h4 className="so-section-label">Key Features</h4>
          <ul className="so-features">
            {FEATURES.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
