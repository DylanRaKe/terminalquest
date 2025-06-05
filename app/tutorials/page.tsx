import { Metadata } from 'next';
import { TutorialInterface } from '../components/TutorialInterface';

export const metadata: Metadata = {
  title: 'Tutoriels Guidés CLI | TerminalQuest',
  description: 'Apprenez les commandes CLI étape par étape avec nos tutoriels interactifs guidés. Parcours structurés pour débutants, intermédiaires et avancés.',
  keywords: 'tutoriels CLI, apprentissage terminal, commandes Linux, formation ligne de commande, exercices pratiques',
  openGraph: {
    title: 'Tutoriels Guidés CLI | TerminalQuest',
    description: 'Apprenez les commandes CLI étape par étape avec nos tutoriels interactifs guidés.',
    type: 'website',
    images: [
      {
        url: '/og-tutorials.jpg',
        width: 1200,
        height: 630,
        alt: 'Tutoriels Guidés TerminalQuest',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tutoriels Guidés CLI | TerminalQuest',
    description: 'Apprenez les commandes CLI étape par étape avec nos tutoriels interactifs guidés.',
    images: ['/og-tutorials.jpg'],
  },
};

export default function TutorialsPage() {
  return <TutorialInterface />;
} 