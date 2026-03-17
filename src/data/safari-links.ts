export type SafariLink = {
  label: string
  url: string
  color: string
  shortName: string
}

export const SAFARI_LINKS: SafariLink[] = [
  {
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/ikalmikov',
    color: '#0a66c2',
    shortName: 'LinkedIn',
  },
  { label: 'GitHub', url: 'https://github.com/ikalmikov16', color: '#24292e', shortName: 'GitHub' },
  { label: 'Live Tesserae', url: 'https://tesserae.live', color: '#6366f1', shortName: 'Tesserae' },
  {
    label: 'SketchOff (App Store)',
    url: 'https://apps.apple.com/app/sketchoff',
    color: '#f97316',
    shortName: 'SketchOff',
  },
  {
    label: 'SketchOff (Play Store)',
    url: 'https://play.google.com/store/apps/details?id=com.sketchoff',
    color: '#22c55e',
    shortName: 'SketchOff',
  },
  {
    label: 'Fordham Scheduler',
    url: 'https://fordham-exams.onrender.com/',
    color: '#7c1038',
    shortName: 'Fordham',
  },
]
