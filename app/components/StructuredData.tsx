export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "TerminalQuest",
    "description": "Plateforme d'apprentissage ludique pour maîtriser les commandes CLI et Linux. Jeux interactifs, quiz adaptatifs et documentation complète.",
    "url": "https://terminalquest.com",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "creator": {
      "@type": "Organization",
      "name": "TerminalQuest"
    },
    "educationalLevel": "Beginner to Advanced",
    "teaches": [
      "Linux Commands",
      "CLI Usage",
      "Terminal Navigation",
      "Bash Scripting",
      "System Administration"
    ],
    "learningResourceType": [
      "Interactive Game",
      "Quiz",
      "Documentation",
      "Tutorial"
    ],
    "inLanguage": "fr",
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": [
        "student",
        "developer",
        "system administrator"
      ]
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
} 