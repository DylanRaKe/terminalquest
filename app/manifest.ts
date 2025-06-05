import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TerminalQuest - Apprenez les commandes CLI',
    short_name: 'TerminalQuest',
    description: 'Maîtrisez les commandes Linux et CLI avec des jeux interactifs, quiz adaptatifs et documentation complète.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#7c3aed',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    categories: ['education', 'games', 'productivity'],
    lang: 'fr',
    orientation: 'portrait-primary',
  }
} 