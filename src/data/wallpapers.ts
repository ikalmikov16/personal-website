import type { WallpaperStyle, WallpaperOption } from '../types/content'
export type { WallpaperStyle, WallpaperOption }

export const WALLPAPER_OPTIONS: WallpaperOption[] = [
  { id: 'aurora', label: 'Aurora', url: '/wallpapers/aurora.jpg', style: { background: 'url(/wallpapers/aurora.jpg) center/cover no-repeat' } },
  { id: 'aurora-blue', label: 'Aurora Blue', url: '/wallpapers/aurora-blue.jpg', style: { background: 'url(/wallpapers/aurora-blue.jpg) center/cover no-repeat' } },
  { id: 'leopard-aurora', label: 'Leopard Aurora', url: '/wallpapers/leopard-aurora.jpg', style: { background: 'url(/wallpapers/leopard-aurora.jpg) center/cover no-repeat' } },
  { id: 'snow-leopard', label: 'Snow Leopard', url: '/wallpapers/snow-leopard.jpg', style: { background: 'url(/wallpapers/snow-leopard.jpg) center/cover no-repeat' } },
  { id: 'snow-leopard-prowl', label: 'Snow Leopard Prowl', url: '/wallpapers/snow-leopard-prowl.jpg', style: { background: 'url(/wallpapers/snow-leopard-prowl.jpg) center/cover no-repeat' } },
  { id: 'earth', label: 'Earth', url: '/wallpapers/earth.jpg', style: { background: 'url(/wallpapers/earth.jpg) center/cover no-repeat' } },
  { id: 'horizon', label: 'Horizon', url: '/wallpapers/horizon.jpg', style: { background: 'url(/wallpapers/horizon.jpg) center/cover no-repeat' } },
  { id: 'iceberg', label: 'Iceberg', url: '/wallpapers/iceberg.jpg', style: { background: 'url(/wallpapers/iceberg.jpg) center/cover no-repeat' } },
  { id: 'cirques', label: 'Cirques', url: '/wallpapers/cirques.jpg', style: { background: 'url(/wallpapers/cirques.jpg) center/cover no-repeat' } },
  { id: 'clown-fish', label: 'Clown Fish', url: '/wallpapers/clown-fish.jpg', style: { background: 'url(/wallpapers/clown-fish.jpg) center/cover no-repeat' } },
  { id: 'pond-reeds', label: 'Pond Reeds', url: '/wallpapers/pond-reeds.jpg', style: { background: 'url(/wallpapers/pond-reeds.jpg) center/cover no-repeat' } },
  { id: 'ladybug', label: 'Ladybug', url: '/wallpapers/ladybug.jpg', style: { background: 'url(/wallpapers/ladybug.jpg) center/cover no-repeat' } },
  { id: 'zebra', label: 'Zebra', url: '/wallpapers/zebra.jpg', style: { background: 'url(/wallpapers/zebra.jpg) center/cover no-repeat' } },
]

export const DEFAULT_WALLPAPER_ID = 'aurora'

export function getWallpaperStyle(id: string): WallpaperStyle {
  const opt = WALLPAPER_OPTIONS.find((o) => o.id === id)
  return opt?.style ?? WALLPAPER_OPTIONS[0]!.style
}
