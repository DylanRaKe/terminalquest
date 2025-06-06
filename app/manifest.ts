import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TerminalQuest - Apprenez les commandes CLI',
    short_name: 'TerminalQuest',
    description: 'Maîtrisez les commandes Linux et CLI avec des jeux interactifs, quiz adaptatifs et documentation complète. Fonctionne hors-ligne !',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#7c3aed',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    categories: ['education', 'games', 'productivity', 'developer-tools'],
    lang: 'fr',
    orientation: 'portrait-primary',
    scope: '/',
    id: 'terminalquest-pwa',
    prefer_related_applications: false,
    screenshots: [
      {
        src: '/screenshot-wide.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Interface principale TerminalQuest'
      },
      {
        src: '/screenshot-narrow.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'TerminalQuest sur mobile'
      }
    ],
    shortcuts: [
      {
        name: 'Entraînement Terminal',
        short_name: 'Entraînement',
        description: 'Accès direct au mode entraînement libre',
        url: '/training',
        icons: [
          {
            src: '/icon-training.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'Quiz CLI',
        short_name: 'Quiz',
        description: 'Testez vos connaissances CLI',
        url: '/quiz',
        icons: [
          {
            src: '/icon-quiz.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'Glossaire',
        short_name: 'Glossaire',
        description: 'Dictionnaire des commandes CLI',
        url: '/glossary',
        icons: [
          {
            src: '/icon-glossary.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      }
    ]
  }
} 