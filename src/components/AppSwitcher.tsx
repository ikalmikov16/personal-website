export type AppSwitcherApp = {
  appId: string
  title: string
  icon: string
}

type AppSwitcherProps = {
  apps: AppSwitcherApp[]
  selectedIndex: number
  reduceMotion: boolean
}

export function AppSwitcher({ apps, selectedIndex, reduceMotion }: AppSwitcherProps) {
  if (apps.length === 0) return null

  return (
    <div className="app-switcher-backdrop" role="dialog" aria-label="App Switcher">
      <div className={`app-switcher${reduceMotion ? '' : ' app-switcher--entering'}`}>
        {apps.map((app, i) => (
          <div
            key={app.appId}
            className={`app-switcher-item${i === selectedIndex ? ' app-switcher-item--selected' : ''}`}
          >
            <img
              src={app.icon}
              alt=""
              className="app-switcher-icon"
              draggable={false}
            />
            <span className="app-switcher-label">{app.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
