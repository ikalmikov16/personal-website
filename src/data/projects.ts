import type { Project } from '../types/content'
export type { Project }

// Add live URLs to links when deployed (see content-plan.md). Repo links are real.
export const PROJECTS: Project[] = [
  {
    id: 'mosaic',
    title: 'Live Tesserae',
    oneLiner:
      'A collaborative, real-time mosaic canvas — 1 million tiles of 32×32 pixel art that anyone can draw on, with changes appearing live for all viewers.',
    tech: ['React', 'FastAPI', 'WebSockets', 'AWS'],
    links: { live: 'https://tesserae.live', repo: 'https://github.com/ikalmikov16' },
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
    links: {
      live: 'https://fordham-exams.onrender.com/',
      repo: 'https://github.com/ikalmikov16/Fordham-Final-Exam-Scheduler',
    },
  },
]
