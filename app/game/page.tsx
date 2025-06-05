'use client'

import { GameInterface } from '../components/GameInterface'
import { GameBlocker } from '../components/GameBlocker'
import { useDebugMode } from '../hooks/useDebugMode'
// Les métadonnées SEO sont gérées dans layout.tsx

export default function GamePage() {
  const isDebugMode = useDebugMode()

  if (!isDebugMode) {
    return <GameBlocker />
  }

  return <GameInterface />
} 