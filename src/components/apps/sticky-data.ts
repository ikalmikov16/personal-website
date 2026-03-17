export type StickyColor = 'yellow' | 'blue' | 'pink' | 'green' | 'purple' | 'gray'

export type StickyNoteData = {
  id: string
  color: StickyColor
  text: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
}

export const STICKY_COLOR_LABELS: { color: StickyColor; label: string }[] = [
  { color: 'yellow', label: 'Yellow' },
  { color: 'blue', label: 'Blue' },
  { color: 'green', label: 'Green' },
  { color: 'pink', label: 'Pink' },
  { color: 'purple', label: 'Purple' },
  { color: 'gray', label: 'Gray' },
]

export const STICKY_COLORS: Record<
  StickyColor,
  { bg: string; header: string; border: string; rule: string }
> = {
  yellow: { bg: '#FDFD96', header: '#F0E848', border: '#D4C830', rule: 'rgba(0,0,0,0.06)' },
  blue: { bg: '#AEC6CF', header: '#96B4BE', border: '#7A9CA8', rule: 'rgba(0,0,0,0.07)' },
  pink: { bg: '#FFB7CE', header: '#F098B0', border: '#D87898', rule: 'rgba(0,0,0,0.06)' },
  green: { bg: '#B2F2BB', header: '#8AD898', border: '#6ABE78', rule: 'rgba(0,0,0,0.06)' },
  purple: { bg: '#D8B4FE', header: '#C098EE', border: '#A878D4', rule: 'rgba(0,0,0,0.06)' },
  gray: { bg: '#E8E8E8', header: '#D4D4D4', border: '#BCBCBC', rule: 'rgba(0,0,0,0.06)' },
}

export function createStickyNote(existingCount: number): StickyNoteData {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 800
  const vh = typeof window !== 'undefined' ? window.innerHeight : 600
  const jitter = () => Math.floor(Math.random() * 60) - 30
  return {
    id: `sticky-${Date.now()}`,
    color: 'yellow',
    text: '',
    x: vw / 2 - 100 + jitter(),
    y: vh / 2 - 100 + jitter(),
    width: 200,
    height: 200,
    zIndex: existingCount,
  }
}

export function createDefaultStickyNotes(): StickyNoteData[] {
  return [
    {
      id: 'default-welcome',
      color: 'yellow',
      text: [
        `Hello World!`,
        `My name is Irakli, I'm a Software Engineer. Welcome to my portfolio website!`,
        `This is my attempt at replicating Mac OS X Snow Leopard as much as possible. This is still a work in progress pls bare with me :P `,
        `Try hovering over the dock, changing the wallpaper, creating a sticky note, searching in Spotlight...`,
        `And pls don't sue me Apple, this was made with love :DD`,
      ].join('\n\n'),
      x: 50,
      y: 80,
      width: 240,
      height: 300,
      zIndex: 0,
    },
    {
      id: 'default-projects',
      color: 'blue',
      text: [
        `Check out my Projects over there!!!`,
        `>>>>>>>>>>>>>>>>>>>>>>`,
        `>>>>>>>>>>>>>>>>>>>>>>`,
        `>>>>>>>>>>>>>>>>>>>>>>`,
        `>>>>>>>>>>>>>>>>>>>>>>`,
      ].join('\n'),
      x: 320,
      y: 120,
      width: 220,
      height: 160,
      zIndex: 1,
    },
  ]
}
