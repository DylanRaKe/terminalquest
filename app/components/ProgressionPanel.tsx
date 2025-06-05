'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, TrendingUp, Award, X } from 'lucide-react'
import { useProgressionStore, AVAILABLE_BADGES } from '../stores/progressionStore'
import { BadgeComponent, BadgeDetails } from './BadgeComponent'
import { ProgressBar } from './ProgressBar'
import { useResponsive } from '../hooks/useResponsive'

export function ProgressionPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const { isMobile } = useResponsive()

  const {
    xp,
    level,
    badges,
    stats,
    getCurrentLevel,
    getNextLevel,
    getProgressToNextLevel,

    getRecentAchievements
  } = useProgressionStore()

  const currentLevel = getCurrentLevel()
  const nextLevel = getNextLevel()
  const progressToNext = getProgressToNextLevel()
  const recentAchievements = getRecentAchievements(3)

  // Créer la liste complète des badges avec statut
  const allBadgesWithStatus = AVAILABLE_BADGES.map(template => {
    const unlockedBadge = badges.find(b => b.id === template.id)
    return unlockedBadge || { ...template, unlockedAt: undefined }
  })

  const filteredBadges = filterCategory === 'all' 
    ? allBadgesWithStatus
    : allBadgesWithStatus.filter(badge => badge.category === filterCategory)

  const categories = [
    { id: 'all', name: 'Tous', icon: '🏆' },
    { id: 'quiz', name: 'Quiz', icon: '🎯' },
    { id: 'training', name: 'Entraînement', icon: '💻' },
    { id: 'exploration', name: 'Exploration', icon: '🗺️' },
    { id: 'mastery', name: 'Maîtrise', icon: '⚡' },
    { id: 'special', name: 'Spécial', icon: '🌟' }
  ]

  const selectedBadgeData = selectedBadge 
    ? allBadgesWithStatus.find(b => b.id === selectedBadge)
    : null

  return (
    <>
      {/* Bouton d'ouverture - Widget de progression compact */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 z-40 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-lg shadow-lg border border-purple-500/30"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentLevel.icon}</span>
            <div className="text-left">
              <div className="text-sm font-bold">{currentLevel.name}</div>
              <div className="text-xs opacity-80">{xp} XP</div>
            </div>
          </div>
          <Trophy className="w-5 h-5" />
        </div>
      </motion.button>

      {/* Panneau principal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Panneau */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 right-0 h-full bg-gray-900 border-l border-gray-700 z-50 overflow-y-auto ${
                isMobile ? 'w-full' : 'w-96'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl font-bold text-white">Progression</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contenu */}
              <div className="p-6 space-y-6">
                {/* Niveau actuel */}
                <div className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 rounded-lg p-4 border border-purple-500/30">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{currentLevel.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{currentLevel.name}</h3>
                      <p className="text-purple-300">Niveau {level}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">XP: {xp}</span>
                      {nextLevel && (
                        <span className="text-gray-300">Prochain: {nextLevel.minXP} XP</span>
                      )}
                    </div>
                    
                    {nextLevel ? (
                      <ProgressBar
                        progress={progressToNext}
                        color={nextLevel.color}
                        height={12}
                        showPercentage
                      />
                    ) : (
                      <div className="text-center text-yellow-400 font-bold">
                        🏆 Niveau Maximum Atteint !
                      </div>
                    )}
                  </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{stats.totalCommands}</div>
                    <div className="text-sm text-gray-400">Commandes</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{stats.quizzesTaken}</div>
                    <div className="text-sm text-gray-400">Quiz</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">{badges.length}</div>
                    <div className="text-sm text-gray-400">Badges</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-400">{stats.currentStreak}</div>
                    <div className="text-sm text-gray-400">Série</div>
                  </div>
                </div>

                {/* Achievements récents */}
                {recentAchievements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      Récents Accomplissements
                    </h3>
                    <div className="space-y-2">
                      {recentAchievements.map((achievement) => (
                        <div key={achievement.id} className="bg-gray-800 rounded-lg p-3 border-l-4 border-green-500">
                          <div className="text-sm text-white font-medium">
                            {achievement.type === 'special' && `Niveau ${achievement.value} atteint !`}
                            {achievement.type === 'quiz_perfect' && 'Quiz parfait !'}
                            {achievement.type === 'command_mastery' && 'Commande maîtrisée !'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {achievement.timestamp.toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filtres de badges */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    Collection de Badges
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setFilterCategory(category.id)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          filterCategory === category.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {category.icon} {category.name}
                      </button>
                    ))}
                  </div>

                  {/* Grille de badges */}
                  <div className="grid grid-cols-4 gap-3">
                    {filteredBadges.map((badge) => (
                      <BadgeComponent
                        key={badge.id}
                        badge={badge}
                        size="md"
                        showProgress
                        onClick={() => setSelectedBadge(badge.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Modal de détails du badge */}
            {selectedBadgeData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 flex items-center justify-center z-60 p-4"
                onClick={() => setSelectedBadge(null)}
              >
                <div 
                  className="max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <BadgeDetails badge={selectedBadgeData} />
                  <button
                    onClick={() => setSelectedBadge(null)}
                    className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  )
} 