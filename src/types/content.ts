export type Project = {
  id: string
  title: string
  oneLiner: string
  tech: string[]
  links: {
    live?: string
    repo?: string
    appStore?: string
    playStore?: string
  }
  image?: string
}

export type ResumeSection = {
  title: string
  content: string
}

export type WallpaperStyle = { background: string }

export type WallpaperOption = {
  id: string
  label: string
  url: string
  style: WallpaperStyle
}
