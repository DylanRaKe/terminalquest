'use client'

import { motion } from 'framer-motion'
import { Badge } from '../stores/progressionStore'
import { useReducedMotion } from '../hooks/useResponsive'

interface BadgeComponentProps {
  badge: Badge
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
  onClick?: () => void
  className?: string
}

export function BadgeComponent({
  badge,
  size = 'md',
  showProgress = false,
  onClick,
  className = ''
}: BadgeComponentProps) {
  const { prefersReducedMotion } = useReducedMotion()

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl'
  }

  const rarityColors = {
    common: 'from-gray-500 to-gray-600 border-gray-400',
    rare: 'from-blue-500 to-blue-600 border-blue-400',
    epic: 'from-purple-500 to-purple-600 border-purple-400',
    legendary: 'from-yellow-500 to-orange-500 border-yellow-400'
  }

  const rarityGlow = {
    common: 'shadow-gray-500/20',
    rare: 'shadow-blue-500/30',
    epic: 'shadow-purple-500/30',
    legendary: 'shadow-yellow-500/40'
  }

  const isUnlocked = !!badge.unlockedAt
  const progress = badge.progress || 0
  const maxProgress = badge.maxProgress || 1
  const progressPercentage = (progress / maxProgress) * 100

  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
      whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
      onClick={onClick}
    >
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full border-2 flex items-center justify-center
          transition-all duration-300 cursor-pointer
          ${isUnlocked 
            ? `bg-gradient-to-br ${rarityColors[badge.rarity]} shadow-lg ${rarityGlow[badge.rarity]}` 
            : 'bg-gray-800 border-gray-600 opacity-50'
          }
        `}
      >
        <span className={isUnlocked ? 'filter-none' : 'filter grayscale'}>
          {badge.icon}
        </span>

        {/* Effet de brillance pour les badges légendaires */}
        {isUnlocked && badge.rarity === 'legendary' && !prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              ease: "linear",
              repeat: Infinity
            }}
          />
        )}

        {/* Indicateur de progression */}
        {showProgress && badge.maxProgress && badge.maxProgress > 1 && (
          <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1">
            <div className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {progress}/{maxProgress}
              </span>
            </div>
          </div>
        )}

        {/* Badge "Nouveau" */}
        {isUnlocked && badge.unlockedAt && 
         new Date().getTime() - badge.unlockedAt.getTime() < 24 * 60 * 60 * 1000 && (
          <motion.div
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            NEW
          </motion.div>
        )}
      </div>

      {/* Barre de progression pour badges avec progression */}
      {showProgress && badge.maxProgress && badge.maxProgress > 1 && !isUnlocked && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-full">
          <div className="bg-gray-700 rounded-full h-1 overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Composant pour afficher les détails d'un badge
export function BadgeDetails({ badge }: { badge: Badge }) {
  const rarityLabels = {
    common: 'Commun',
    rare: 'Rare',
    epic: 'Épique',
    legendary: 'Légendaire'
  }

  const categoryLabels = {
    quiz: 'Quiz',
    training: 'Entraînement',
    exploration: 'Exploration',
    mastery: 'Maîtrise',
    special: 'Spécial'
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-start gap-4">
        <BadgeComponent badge={badge} size="lg" />
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">{badge.name}</h3>
          <p className="text-gray-300 mb-2">{badge.description}</p>
          
          <div className="flex gap-4 text-sm">
            <span className="text-gray-400">
              Catégorie: <span className="text-blue-400">{categoryLabels[badge.category]}</span>
            </span>
            <span className="text-gray-400">
              Rareté: <span className="text-purple-400">{rarityLabels[badge.rarity]}</span>
            </span>
          </div>

          {badge.unlockedAt && (
            <div className="mt-2 text-sm text-green-400">
              Débloqué le {badge.unlockedAt.toLocaleDateString('fr-FR')}
            </div>
          )}

          {badge.maxProgress && badge.maxProgress > 1 && (
            <div className="mt-2">
              <div className="text-sm text-gray-400 mb-1">
                Progression: {badge.progress || 0}/{badge.maxProgress}
              </div>
              <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${((badge.progress || 0) / badge.maxProgress) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 