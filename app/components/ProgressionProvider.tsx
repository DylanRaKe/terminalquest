'use client'

import { useEffect, useState } from 'react'
import { useProgressionStore } from '../stores/progressionStore'

export function ProgressionProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Forcer l'hydratation du store côté client
    setIsHydrated(true)
    
    // Nettoyer les anciennes données corrompues si nécessaire
    const cleanupOldData = () => {
      try {
        const stored = localStorage.getItem('terminalquest-progression')
        if (stored) {
          const data = JSON.parse(stored)
          // Si les données semblent corrompues, les nettoyer
          if (data.state && data.state.badges) {
                                      const hasCorruptedDates = data.state.badges.some((badge: { unlockedAt?: string }) => 
               badge.unlockedAt && typeof badge.unlockedAt === 'string' && badge.unlockedAt.includes('Invalid')
             )
            if (hasCorruptedDates) {
              console.log('Nettoyage des données corrompues détecté')
              localStorage.removeItem('terminalquest-progression')
            }
          }
        }
      } catch (error) {
        console.warn('Erreur lors du nettoyage des données:', error)
        localStorage.removeItem('terminalquest-progression')
      }
    }
    
    cleanupOldData()
    
    // Débloquer le badge "early_adopter" au premier chargement
    const hasVisited = localStorage.getItem('terminalquest-visited')
    if (!hasVisited) {
      localStorage.setItem('terminalquest-visited', 'true')
      setTimeout(() => {
        const { unlockBadge, addXP } = useProgressionStore.getState()
        console.log('Premier chargement - déblocage badge early_adopter')
        unlockBadge('early_adopter')
        addXP(50, 'first_visit')
      }, 2000) // Délai pour que l'interface soit chargée
    }
  }, [])

  // Ne pas rendre les enfants tant que le store n'est pas hydraté
  if (!isHydrated) {
    return null
  }

  return <>{children}</>
} 