import type { Project } from '../types/content'
export type { Project }

// Add live URLs to links when deployed (see content-plan.md). Repo links are real.
export const PROJECTS: Project[] = [
  {
    id: 'mosaic',
    title: 'Live Mosaic',
    oneLiner:
      'Interactive, live-updating mosaic: 1 million tiles of 32×32 pixel images that users can color; updates in real time for everyone.',
    tech: ['React', 'FastAPI', 'WebSockets', 'AWS'],
    links: { repo: 'https://github.com/ikalmikov16' }, // TODO: add live URL when deployed
  },
  {
    id: 'sketchoff',
    title: 'SketchOff',
    oneLiner:
      "Multiplayer drawing game on App Store and Google Play. Players draw, rate each other's drawings, and compete for the highest overall score.",
    tech: ['React Native', 'Firebase'],
    links: {
      appStore: 'https://apps.apple.com/app/sketchoff',
      playStore: 'https://play.google.com/store/apps/details?id=com.sketchoff',
    },
  },
  {
    id: 'fordham-scheduler',
    title: 'Fordham Final Exam Scheduler',
    oneLiner:
      'Web app for students to build their final exam schedule and export to calendar. Deployed on Render; scaled to ~17k students.',
    tech: ['React', 'Django', 'PostgreSQL'],
    links: { repo: 'https://github.com/ikalmikov16' }, // TODO: add live URL if still up
  },
]
