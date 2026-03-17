type HomeApp = {
  id: string
  label: string
  icon: string
  href?: string
}

const HOME_APPS: HomeApp[] = [
  { id: 'finder', label: 'Projects', icon: '/icons/finder.png' },
  { id: 'safari', label: 'Links', icon: '/icons/safari.png' },
  { id: 'terminal', label: 'About', icon: '/icons/terminal.png' },
  { id: 'preview', label: 'Resume', icon: '/icons/document.png' },
  { id: 'stickies', label: 'Notes', icon: '/icons/stickies.png' },
  { id: 'systempreferences', label: 'Settings', icon: '/icons/system-preferences.png' },
  {
    id: 'github',
    label: 'GitHub',
    icon: '/icons/github.png',
    href: 'https://github.com/ikalmikov16',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: '/icons/linkedin.png',
    href: 'https://linkedin.com/in/ikalmikov',
  },
  { id: 'mail', label: 'Email', icon: '/icons/mail.png', href: 'mailto:irakli.kalmikov@gmail.com' },
]

type MobileHomeScreenProps = {
  onOpenApp: (appId: string) => void
}

export function MobileHomeScreen({ onOpenApp }: MobileHomeScreenProps) {
  return (
    <div className="mobile-home">
      <div className="mobile-home-grid">
        {HOME_APPS.map((app) => (
          <button
            key={app.id}
            type="button"
            className="mobile-app-icon"
            onClick={() => {
              if (app.href) {
                window.open(app.href, '_blank', 'noopener,noreferrer')
              } else {
                onOpenApp(app.id)
              }
            }}
          >
            <span className="mobile-app-icon-wrap">
              <img src={app.icon} alt="" className="mobile-app-icon-img" draggable={false} />
              <span className="mobile-app-icon-gloss" />
            </span>
            <span className="mobile-app-icon-label">{app.label}</span>
          </button>
        ))}
      </div>
      <div className="mobile-home-dots">
        <span className="mobile-home-dot mobile-home-dot--active" />
      </div>
    </div>
  )
}
