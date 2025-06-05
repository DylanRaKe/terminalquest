import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Quiz CLI - TerminalQuest | Testez vos connaissances Linux",
  description: "Évaluez votre maîtrise des commandes CLI avec nos quiz interactifs. 4 niveaux de difficulté, 57 questions pour progresser de débutant à expert Linux.",
  keywords: "quiz CLI, test Linux, évaluation commandes, quiz terminal, bash quiz, shell quiz, apprentissage Linux, certification CLI",
  openGraph: {
    title: "Quiz CLI TerminalQuest - Testez vos compétences Linux",
    description: "Quiz interactifs pour tester vos connaissances des commandes CLI. 4 niveaux de difficulté pour tous les profils.",
    type: "website"
  },
  alternates: {
    canonical: "https://terminalquest.com/quiz"
  }
}

function QuizStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": "Quiz CLI TerminalQuest",
    "description": "Quiz interactif pour tester vos connaissances des commandes CLI et Linux",
    "educationalLevel": ["Beginner", "Intermediate", "Advanced", "Expert"],
    "teaches": [
      "Linux Commands",
      "CLI Navigation",
      "File Management",
      "Process Management",
      "System Administration"
    ],
    "numberOfQuestions": 57,
    "timeRequired": "PT30M",
    "inLanguage": "fr",
    "isAccessibleForFree": true,
    "provider": {
      "@type": "Organization",
      "name": "TerminalQuest"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <QuizStructuredData />
      {children}
    </>
  )
} 