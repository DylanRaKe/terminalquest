import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Jeu Interactif CLI - TerminalQuest | Apprenez en jouant",
  description: "Jeu d'aventure interactif pour apprendre les commandes CLI et Linux. Explorez un monde fantastique tout en maîtrisant le terminal. Apprentissage ludique et progressif.",
  keywords: "jeu CLI, apprentissage ludique Linux, jeu éducatif terminal, aventure CLI, gamification Linux, jeu commandes",
  openGraph: {
    title: "Jeu CLI TerminalQuest - Aventure d'apprentissage Linux",
    description: "Apprenez les commandes Linux en jouant ! Jeu d'aventure interactif pour maîtriser le terminal.",
    type: "website"
  }
}

export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 