import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "./components/Navigation";
import { StructuredData } from "./components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TerminalQuest - Apprenez les commandes CLI de manière ludique",
  description: "Maîtrisez les commandes Linux et CLI avec TerminalQuest : jeux interactifs, quiz adaptatifs et documentation complète. Apprentissage ludique pour débutants et experts.",
  keywords: "CLI, Linux, commandes, terminal, apprentissage, jeu éducatif, quiz, documentation, bash, shell, formation Linux, tutoriel CLI, apprentissage interactif",
  authors: [{ name: "TerminalQuest" }],
  creator: "TerminalQuest",
  publisher: "TerminalQuest",
  robots: "index, follow",
  category: "education",
  classification: "Educational Game",
  other: {
    "google-site-verification": "your-google-verification-code",
    "msvalidate.01": "your-bing-verification-code"
  },
  openGraph: {
    title: "TerminalQuest - Maîtrisez les commandes CLI en jouant",
    description: "Apprenez les commandes Linux de manière interactive avec des jeux, quiz et documentation complète.",
    type: "website",
    locale: "fr_FR",
    siteName: "TerminalQuest",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TerminalQuest - Plateforme d'apprentissage CLI"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "TerminalQuest - Apprenez les commandes CLI",
    description: "Maîtrisez Linux et CLI avec des jeux interactifs et quiz adaptatifs",
    images: ["/twitter-image.jpg"]
  },
  alternates: {
    canonical: "https://terminalquest.com"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <div className="min-h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  );
}
