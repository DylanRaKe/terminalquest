import { Metadata } from 'next';
import { GlossaryInterface } from '../components/GlossaryInterface';

export const metadata: Metadata = {
  title: 'Glossaire CLI Interactif | TerminalQuest',
  description: 'Dictionnaire interactif des commandes CLI et concepts Linux. Recherche intelligente avec exemples d\'usage et liens croisés.',
  keywords: 'glossaire CLI, dictionnaire terminal, commandes Linux, référence ligne de commande, documentation CLI',
  openGraph: {
    title: 'Glossaire CLI Interactif | TerminalQuest',
    description: 'Dictionnaire interactif des commandes CLI et concepts Linux avec recherche intelligente.',
    type: 'website',
    images: [
      {
        url: '/og-glossary.jpg',
        width: 1200,
        height: 630,
        alt: 'Glossaire CLI TerminalQuest',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glossaire CLI Interactif | TerminalQuest',
    description: 'Dictionnaire interactif des commandes CLI et concepts Linux avec recherche intelligente.',
    images: ['/og-glossary.jpg'],
  },
};

export default function GlossaryPage() {
  return <GlossaryInterface />;
} 