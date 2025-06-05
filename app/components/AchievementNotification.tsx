'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, X } from 'lucide-react'
import { useProgressionStore, Badge } from '../stores/progressionStore'
import { BadgeComponent } from './BadgeComponent'
import { useReducedMotion } from '../hooks/useResponsive'

interface Notification {
  id: string
  type: 'badge' | 'level' | 'xp'
  title: string
  description: string
  icon?: string
  badge?: Badge
  timestamp: Date
}

export function AchievementNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { prefersReducedMotion } = useReducedMotion()
  const { badges, level } = useProgressionStore()
  
  // Garder une trace des notifications déjà affichées
  const shownBadges = useRef<Set<string>>(new Set())
  const shownLevels = useRef<Set<number>>(new Set())

  // Surveiller les nouveaux badges
  useEffect(() => {
    const recentBadges = badges.filter(badge => {
      if (!badge.unlockedAt || shownBadges.current.has(badge.id)) return false
      
      // S'assurer que unlockedAt est un objet Date
      const unlockedDate = badge.unlockedAt instanceof Date 
        ? badge.unlockedAt 
        : new Date(badge.unlockedAt)
      
      return new Date().getTime() - unlockedDate.getTime() < 5000 // 5 secondes
    })

    recentBadges.forEach(badge => {
      shownBadges.current.add(badge.id)
      
      const notification: Notification = {
        id: `badge_${badge.id}`,
        type: 'badge',
        title: 'Nouveau Badge !',
        description: badge.name,
        badge,
        timestamp: new Date()
      }
      
      setNotifications(prev => [...prev, notification])
      
      // Auto-remove après 5 secondes
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id))
      }, 5000)
    })
  }, [badges])

  // Surveiller les changements de niveau
  useEffect(() => {
    if (level > 1 && !shownLevels.current.has(level)) {
      shownLevels.current.add(level)
      
      const notification: Notification = {
        id: `level_${level}_${Date.now()}`,
        type: 'level',
        title: 'Niveau Supérieur !',
        description: `Vous avez atteint le niveau ${level}`,
        icon: '🎉',
        timestamp: new Date()
      }
      
      setNotifications(prev => [...prev, notification])
      
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id))
      }, 5000)
    }
  }, [level])

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const NotificationItem = ({ notification }: { notification: Notification }) => {
    const getRarityColor = (rarity?: string) => {
      switch (rarity) {
        case 'common': return 'from-gray-600 to-gray-700 border-gray-500'
        case 'rare': return 'from-blue-600 to-blue-700 border-blue-500'
        case 'epic': return 'from-purple-600 to-purple-700 border-purple-500'
        case 'legendary': return 'from-yellow-600 to-orange-600 border-yellow-500'
        default: return 'from-green-600 to-green-700 border-green-500'
      }
    }

    return (
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { 
          type: 'spring', 
          damping: 25, 
          stiffness: 200 
        }}
        className={`
          bg-gradient-to-r ${getRarityColor(notification.badge?.rarity)}
          rounded-lg p-4 shadow-lg border-2 min-w-80 max-w-sm
        `}
      >
        <div className="flex items-start gap-3">
          {/* Icône ou Badge */}
          <div className="flex-shrink-0">
            {notification.badge ? (
              <BadgeComponent badge={notification.badge} size="md" />
            ) : (
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                {notification.icon || <Trophy className="w-6 h-6" />}
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">
                  {notification.title}
                </h3>
                <p className="text-white/90 text-sm mt-1">
                  {notification.description}
                </p>
                {notification.badge?.description && (
                  <p className="text-white/70 text-xs mt-1">
                    {notification.badge.description}
                  </p>
                )}
              </div>
              
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-white/70 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Effet de brillance pour les badges légendaires */}
        {notification.badge?.rarity === 'legendary' && !prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 1
            }}
          />
        )}

        {/* Barre de progression pour l'auto-dismiss */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-lg"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 5, ease: 'linear' }}
        />
      </motion.div>
    )
  }

  return (
    <div className="fixed top-24 right-4 z-50 space-y-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <NotificationItem notification={notification} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook pour déclencher manuellement des notifications
export function useAchievementNotifications() {
  const showBadgeNotification = (badge: Badge) => {
    // Cette fonction pourrait être utilisée pour déclencher des notifications personnalisées
    console.log('Badge unlocked:', badge.name)
  }

  const showLevelNotification = (level: number) => {
    console.log('Level up:', level)
  }

  const showXPNotification = (amount: number, source: string) => {
    console.log('XP gained:', amount, 'from', source)
  }

  return {
    showBadgeNotification,
    showLevelNotification,
    showXPNotification
  }
} 