import { useState } from 'react'
import { SlideToUnlock } from './SlideToUnlock'
import { MobileStatusBar } from './MobileStatusBar'
import { MobileHomeScreen } from './MobileHomeScreen'
import { MobileDock } from './MobileDock'
import { MobileAppView } from './MobileAppView'
import { getWallpaperStyle } from '../../data/wallpapers'

type MobileShellProps = {
  wallpaperId: string
  onWallpaperChange: (id: string) => void
}

export function MobileShell({ wallpaperId, onWallpaperChange }: MobileShellProps) {
  const [locked, setLocked] = useState(() => {
    try {
      return sessionStorage.getItem('ika-os-mobile-unlocked') !== '1'
    } catch {
      return false
    }
  })
  const [activeApp, setActiveApp] = useState<string | null>(null)

  const wallpaperStyle = getWallpaperStyle(wallpaperId)

  const handleUnlock = () => {
    setLocked(false)
    try {
      sessionStorage.setItem('ika-os-mobile-unlocked', '1')
    } catch {
      /* ignore */
    }
  }

  if (locked) {
    return <SlideToUnlock onUnlock={handleUnlock} wallpaperStyle={wallpaperStyle} />
  }

  return (
    <div className="mobile-shell" style={wallpaperStyle}>
      <MobileStatusBar />
      {activeApp ? (
        <MobileAppView
          appId={activeApp}
          onBack={() => setActiveApp(null)}
          wallpaperId={wallpaperId}
          onWallpaperChange={onWallpaperChange}
        />
      ) : (
        <>
          <MobileHomeScreen onOpenApp={setActiveApp} />
          <MobileDock onOpenApp={setActiveApp} />
        </>
      )}
    </div>
  )
}
