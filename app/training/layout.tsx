import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Mode Entraînement - TerminalQuest | Terminal Sandbox CLI",
  description: "Pratiquez librement les commandes CLI dans notre terminal sandbox. Validation en temps réel, suggestions intelligentes et historique des commandes pour un apprentissage optimal.",
  keywords: "terminal sandbox, entraînement CLI, pratique Linux, simulation terminal, apprentissage commandes, sandbox interactif",
  openGraph: {
    title: "Mode Entraînement TerminalQuest - Terminal Sandbox",
    description: "Terminal sandbox pour pratiquer librement les commandes CLI avec validation en temps réel et suggestions intelligentes.",
    type: "website"
  },
  alternates: {
    canonical: "https://terminalquest.com/training"
  }
}

function TrainingStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "TerminalQuest Mode Entraînement",
    "description": "Terminal sandbox interactif pour pratiquer les commandes CLI et Linux",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "featureList": [
      "Terminal sandbox sécurisé",
      "Validation en temps réel",
      "Suggestions intelligentes",
      "Historique des commandes",
      "Auto-complétion",
      "Système de fichiers simulé"
    ],
    "educationalLevel": "Beginner to Advanced",
    "teaches": [
      "Linux Commands",
      "CLI Navigation",
      "File System Operations",
      "Terminal Usage"
    ],
    "inLanguage": "fr",
    "isAccessibleForFree": true
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TrainingStructuredData />
      {children}
    </>
  )
} 