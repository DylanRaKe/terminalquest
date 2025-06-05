import { MainInterface } from './components/MainInterface'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "TerminalQuest - Accueil | Apprenez les commandes CLI en jouant",
  description: "Découvrez TerminalQuest, la plateforme ludique pour maîtriser les commandes Linux et CLI. Jeux interactifs, quiz adaptatifs et documentation complète pour tous niveaux.",
  keywords: "TerminalQuest, CLI, Linux, commandes terminal, apprentissage ludique, jeu éducatif, bash, shell, débutant",
  openGraph: {
    title: "TerminalQuest - Maîtrisez les commandes CLI en jouant",
    description: "Plateforme d'apprentissage ludique pour les commandes Linux. Jeux, quiz et documentation pour tous niveaux.",
    type: "website"
  }
}

export default function Home() {
  return <MainInterface />
}
