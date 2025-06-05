import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Documentation CLI - TerminalQuest | Guide complet des commandes Linux",
  description: "Documentation complète des commandes CLI et Linux. Guides détaillés, exemples pratiques et références pour maîtriser le terminal. Ressource essentielle pour développeurs.",
  keywords: "documentation CLI, guide Linux, commandes terminal, référence bash, manuel shell, aide CLI, tutoriel Linux, formation développeur",
  openGraph: {
    title: "Documentation CLI TerminalQuest - Guide complet Linux",
    description: "Documentation exhaustive des commandes CLI avec exemples pratiques et explications détaillées.",
    type: "website"
  },
  alternates: {
    canonical: "https://terminalquest.com/docs"
  }
}

function DocsStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Documentation CLI TerminalQuest",
    "description": "Guide complet des commandes CLI et Linux avec exemples pratiques",
    "author": {
      "@type": "Organization",
      "name": "TerminalQuest"
    },
    "publisher": {
      "@type": "Organization",
      "name": "TerminalQuest"
    },
    "dateModified": new Date().toISOString(),
    "datePublished": new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://terminalquest.com/docs"
    },
    "articleSection": "Technology",
    "keywords": [
      "CLI",
      "Linux",
      "Terminal",
      "Commands",
      "Documentation"
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

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DocsStructuredData />
      {children}
    </>
  )
} 