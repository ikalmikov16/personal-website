import type { AppItem, DesktopIconItem } from '../types/ui'
export type { AppItem, DesktopIconItem }

export const DOCK_APPS: AppItem[] = [
  { appId: 'finder', title: 'Finder', icon: '/icons/finder.png' },
  {
    appId: 'mail',
    title: 'Mail',
    icon: '/icons/mail.png',
    href: 'mailto:irakli.kalmikov@gmail.com',
  },
  { appId: 'safari', title: 'Safari', icon: '/icons/safari.png' },
  {
    appId: 'github',
    title: 'GitHub',
    icon: '/icons/github.png',
    href: 'https://github.com/ikalmikov16',
  },
  {
    appId: 'linkedin',
    title: 'LinkedIn',
    icon: '/icons/linkedin.png',
    href: 'https://linkedin.com/in/ikalmikov',
  },
  { appId: 'terminal', title: 'Terminal', icon: '/icons/terminal.png' },
  {
    appId: 'systempreferences',
    title: 'System Preferences',
    icon: '/icons/system-preferences.png',
  },
  { appId: 'stickies', title: 'Stickies', icon: '/icons/stickies.png' },
]

export const DOCK_RIGHT_APPS: AppItem[] = [
  { appId: 'trash', title: 'Trash', icon: '/icons/trash.png' },
]

export const TRANSIENT_DOCK_APPS: AppItem[] = [
  { appId: 'preview', title: 'Preview', icon: '/icons/preview.png' },
]

export const DESKTOP_ICONS: DesktopIconItem[] = [
  {
    label: 'Live Tesserae',
    appId: 'project-mosaic',
    title: 'Live Tesserae',
    icon: '/icons/live-tesserae.svg',
  },
  {
    label: 'SketchOff',
    appId: 'project-sketchoff',
    title: 'SketchOff',
    icon: '/icons/sketchoff.png',
  },
  {
    label: 'Fordham Scheduler',
    appId: 'project-fordham',
    title: 'Fordham Scheduler',
    icon: '/icons/fordham.png',
  },
  { label: 'Resume', appId: 'preview', title: 'Resume', icon: '/icons/document.png' },
]
