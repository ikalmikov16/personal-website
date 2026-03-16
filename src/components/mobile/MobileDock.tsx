const DOCK_ITEMS = [
  { id: 'finder', icon: '/icons/finder.png', label: 'Projects' },
  { id: 'safari', icon: '/icons/safari.png', label: 'Links' },
  { id: 'terminal', icon: '/icons/terminal.png', label: 'About' },
  { id: 'mail', icon: '/icons/mail.png', label: 'Email', href: 'mailto:irakli.kalmikov@gmail.com' },
]

type MobileDockProps = {
  onOpenApp: (appId: string) => void
}

export function MobileDock({ onOpenApp }: MobileDockProps) {
  return (
    <div className="mobile-dock">
      {DOCK_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className="mobile-dock-icon"
          onClick={() => {
            if (item.href) {
              window.open(item.href, '_blank', 'noopener,noreferrer')
            } else {
              onOpenApp(item.id)
            }
          }}
          aria-label={item.label}
        >
          <span className="mobile-app-icon-wrap">
            <img src={item.icon} alt="" className="mobile-dock-icon-img" draggable={false} />
            <span className="mobile-app-icon-gloss mobile-dock-gloss" />
          </span>
        </button>
      ))}
    </div>
  )
}
