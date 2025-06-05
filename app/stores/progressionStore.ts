'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types pour le système de progression
export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: 'quiz' | 'training' | 'exploration' | 'mastery' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: Date
  progress?: number
  maxProgress?: number
}

export interface UserLevel {
  level: number
  name: string
  minXP: number
  maxXP: number
  color: string
  icon: string
}

export interface Achievement {
  id: string
  type: 'command_mastery' | 'quiz_perfect' | 'streak' | 'exploration' | 'speed' | 'special'
  value: number
  timestamp: Date
  details?: Record<string, unknown>
}

export interface UserStats {
  totalCommands: number
  correctCommands: number
  quizzesTaken: number
  perfectQuizzes: number
  currentStreak: number
  longestStreak: number
  timeSpent: number // en minutes
  commandsLearned: string[]
  favoriteCommands: Record<string, number>
  lastActivity: Date
}

export interface ProgressionState {
  // Données utilisateur
  xp: number
  level: number
  badges: Badge[]
  achievements: Achievement[]
  stats: UserStats
  
  // Actions
  addXP: (amount: number, source: string) => void
  unlockBadge: (badgeId: string) => void
  recordAchievement: (achievement: Omit<Achievement, 'id' | 'timestamp'>) => void
  updateStats: (updates: Partial<UserStats>) => void
  recordCommand: (command: string, isCorrect: boolean) => void
  recordQuizResult: (score: number, total: number, isPerfect: boolean) => void
  
  // Getters
  getCurrentLevel: () => UserLevel
  getNextLevel: () => UserLevel | null
  getProgressToNextLevel: () => number
  getBadgesByCategory: (category: Badge['category']) => Badge[]
  getRecentAchievements: (limit?: number) => Achievement[]
}

// Définition des niveaux
export const USER_LEVELS: UserLevel[] = [
  { level: 1, name: 'Novice', minXP: 0, maxXP: 100, color: '#9CA3AF', icon: '🌱' },
  { level: 2, name: 'Apprenti', minXP: 100, maxXP: 250, color: '#10B981', icon: '📚' },
  { level: 3, name: 'Pratiquant', minXP: 250, maxXP: 500, color: '#3B82F6', icon: '⚡' },
  { level: 4, name: 'Compétent', minXP: 500, maxXP: 1000, color: '#8B5CF6', icon: '🎯' },
  { level: 5, name: 'Expérimenté', minXP: 1000, maxXP: 2000, color: '#F59E0B', icon: '🔥' },
  { level: 6, name: 'Expert', minXP: 2000, maxXP: 4000, color: '#EF4444', icon: '💎' },
  { level: 7, name: 'Maître', minXP: 4000, maxXP: 8000, color: '#EC4899', icon: '👑' },
  { level: 8, name: 'Légende', minXP: 8000, maxXP: Infinity, color: '#F97316', icon: '🏆' }
]

// Définition des badges
export const AVAILABLE_BADGES: Omit<Badge, 'unlockedAt' | 'progress'>[] = [
  // Quiz
  { id: 'first_quiz', name: 'Premier Quiz', description: 'Complétez votre premier quiz', icon: '🎯', category: 'quiz', rarity: 'common' },
  { id: 'quiz_perfect', name: 'Perfection', description: 'Obtenez 100% à un quiz', icon: '💯', category: 'quiz', rarity: 'rare' },
  { id: 'quiz_master', name: 'Maître Quiz', description: 'Obtenez 100% à 5 quiz différents', icon: '🏆', category: 'quiz', rarity: 'epic', maxProgress: 5 },
  { id: 'speed_demon', name: 'Démon de Vitesse', description: 'Complétez un quiz en moins de 30 secondes', icon: '⚡', category: 'quiz', rarity: 'rare' },
  
  // Training
  { id: 'first_command', name: 'Première Commande', description: 'Exécutez votre première commande', icon: '💻', category: 'training', rarity: 'common' },
  { id: 'command_explorer', name: 'Explorateur', description: 'Utilisez 10 commandes différentes', icon: '🗺️', category: 'training', rarity: 'rare', maxProgress: 10 },
  { id: 'terminal_ninja', name: 'Ninja Terminal', description: 'Exécutez 100 commandes correctes', icon: '🥷', category: 'training', rarity: 'epic', maxProgress: 100 },
  { id: 'help_seeker', name: 'Chercheur d\'Aide', description: 'Utilisez la commande "help" 5 fois', icon: '❓', category: 'training', rarity: 'common', maxProgress: 5 },
  
  // Exploration
  { id: 'directory_walker', name: 'Marcheur de Répertoires', description: 'Naviguez dans 5 répertoires différents', icon: '📁', category: 'exploration', rarity: 'common', maxProgress: 5 },
  { id: 'file_detective', name: 'Détective de Fichiers', description: 'Utilisez "cat" sur 10 fichiers différents', icon: '🔍', category: 'exploration', rarity: 'rare', maxProgress: 10 },
  { id: 'system_admin', name: 'Administrateur Système', description: 'Maîtrisez les commandes système de base', icon: '⚙️', category: 'exploration', rarity: 'epic' },
  
  // Mastery
  { id: 'ls_master', name: 'Maître du ls', description: 'Utilisez "ls" avec différentes options', icon: '📋', category: 'mastery', rarity: 'rare' },
  { id: 'cd_expert', name: 'Expert du cd', description: 'Maîtrisez la navigation avec "cd"', icon: '🧭', category: 'mastery', rarity: 'rare' },
  { id: 'grep_guru', name: 'Gourou du grep', description: 'Devenez expert en recherche de texte', icon: '🔎', category: 'mastery', rarity: 'epic' },
  
  // Special
  { id: 'early_adopter', name: 'Adopteur Précoce', description: 'Parmi les premiers utilisateurs', icon: '🌟', category: 'special', rarity: 'legendary' },
  { id: 'streak_warrior', name: 'Guerrier des Séries', description: 'Maintenez une série de 7 jours', icon: '🔥', category: 'special', rarity: 'epic', maxProgress: 7 },
  { id: 'night_owl', name: 'Oiseau de Nuit', description: 'Utilisez l\'app après minuit', icon: '🦉', category: 'special', rarity: 'rare' },
  { id: 'completionist', name: 'Complétionniste', description: 'Débloquez tous les autres badges', icon: '🎖️', category: 'special', rarity: 'legendary' }
]

export const useProgressionStore = create<ProgressionState>()(
  persist(
    (set, get) => ({
      // État initial
      xp: 0,
      level: 1,
      badges: [],
      achievements: [],
      stats: {
        totalCommands: 0,
        correctCommands: 0,
        quizzesTaken: 0,
        perfectQuizzes: 0,
        currentStreak: 0,
        longestStreak: 0,
        timeSpent: 0,
        commandsLearned: [],
        favoriteCommands: {},
        lastActivity: new Date()
      },

      // Actions
      addXP: (amount: number, source: string) => {
        console.log(`addXP appelé: +${amount} XP de ${source}`)
        
        set((state) => {
          const newXP = state.xp + amount
          const newLevel = USER_LEVELS.find(level => 
            newXP >= level.minXP && newXP < level.maxXP
          )?.level || state.level

          console.log(`XP: ${state.xp} -> ${newXP}, Niveau: ${state.level} -> ${newLevel}`)

          // Enregistrer l'achievement si level up
          const achievements = [...state.achievements]
          if (newLevel > state.level) {
            console.log(`Level up! ${state.level} -> ${newLevel}`)
            achievements.push({
              id: `level_${newLevel}_${Date.now()}`,
              type: 'special',
              value: newLevel,
              timestamp: new Date(),
              details: { source, previousLevel: state.level }
            })
          }

          return {
            xp: newXP,
            level: newLevel,
            achievements
          }
        })
      },

      unlockBadge: (badgeId: string) => {
        set((state) => {
          const badgeTemplate = AVAILABLE_BADGES.find(b => b.id === badgeId)
          if (!badgeTemplate || state.badges.some(b => b.id === badgeId)) {
            return state
          }

          const newBadge: Badge = {
            ...badgeTemplate,
            unlockedAt: new Date()
          }

          return {
            badges: [...state.badges, newBadge]
          }
        })
      },

      recordAchievement: (achievement) => {
        set((state) => ({
          achievements: [...state.achievements, {
            ...achievement,
            id: `${achievement.type}_${Date.now()}`,
            timestamp: new Date()
          }]
        }))
      },

      updateStats: (updates) => {
        set((state) => ({
          stats: { ...state.stats, ...updates, lastActivity: new Date() }
        }))
      },

      recordCommand: (command: string, isCorrect: boolean) => {
        console.log(`recordCommand appelé: ${command}, correct: ${isCorrect}`)
        
        set((state) => {
          const stats = { ...state.stats }
          stats.totalCommands++
          if (isCorrect) {
            stats.correctCommands++
            if (!stats.commandsLearned.includes(command)) {
              stats.commandsLearned.push(command)
            }
            stats.favoriteCommands[command] = (stats.favoriteCommands[command] || 0) + 1
          }
          stats.lastActivity = new Date()

          console.log('Stats après commande:', {
            totalCommands: stats.totalCommands,
            correctCommands: stats.correctCommands,
            commandsLearned: stats.commandsLearned
          })

          return { stats }
        })

        // Vérifier les badges
        const { stats, addXP, unlockBadge } = get()
        
        if (isCorrect) {
          console.log('Commande correcte - ajout de 5 XP')
          addXP(5, 'command_execution')
          
          if (stats.totalCommands === 1) {
            console.log('Première commande - déblocage badge first_command')
            unlockBadge('first_command')
          }
          if (stats.commandsLearned.length === 10) {
            console.log('10 commandes apprises - déblocage badge command_explorer')
            unlockBadge('command_explorer')
          }
          if (stats.correctCommands === 100) {
            console.log('100 commandes correctes - déblocage badge terminal_ninja')
            unlockBadge('terminal_ninja')
          }
        }
      },

      recordQuizResult: (score: number, total: number, isPerfect: boolean) => {
        console.log('recordQuizResult appelé avec:', { score, total, isPerfect })
        
        set((state) => {
          const stats = { ...state.stats }
          stats.quizzesTaken++
          if (isPerfect) {
            stats.perfectQuizzes++
          }
          stats.lastActivity = new Date()

          console.log('Stats mises à jour:', stats)
          return { stats }
        })

        // Vérifier les badges et XP
        const { stats, addXP, unlockBadge } = get()
        
        console.log('Ajout XP:', score * 2)
        addXP(score * 2, 'quiz_completion')
        
        if (stats.quizzesTaken === 1) {
          console.log('Déblocage badge first_quiz')
          unlockBadge('first_quiz')
        }
        if (isPerfect) {
          console.log('Quiz parfait! Déblocage badge quiz_perfect + 20 XP bonus')
          unlockBadge('quiz_perfect')
          addXP(20, 'perfect_quiz')
        }
        if (stats.perfectQuizzes === 5) {
          console.log('Déblocage badge quiz_master')
          unlockBadge('quiz_master')
        }
      },

      // Getters
      getCurrentLevel: () => {
        const { level } = get()
        return USER_LEVELS.find(l => l.level === level) || USER_LEVELS[0]
      },

      getNextLevel: () => {
        const { level } = get()
        return USER_LEVELS.find(l => l.level === level + 1) || null
      },

      getProgressToNextLevel: () => {
        const { xp } = get()
        const currentLevel = get().getCurrentLevel()
        const nextLevel = get().getNextLevel()
        
        if (!nextLevel) return 100
        
        const progress = ((xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100
        return Math.min(100, Math.max(0, progress))
      },

      getBadgesByCategory: (category) => {
        const { badges } = get()
        return badges.filter(badge => badge.category === category)
      },

      getRecentAchievements: (limit = 5) => {
        const { achievements } = get()
        return achievements
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, limit)
      }
    }),
    {
      name: 'terminalquest-progression',
      version: 2, // Incrémenté pour forcer la migration
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Reconvertir les chaînes en objets Date après désérialisation
          try {
            state.badges = state.badges.map(badge => ({
              ...badge,
              unlockedAt: badge.unlockedAt && typeof badge.unlockedAt === 'string' 
                ? new Date(badge.unlockedAt) 
                : badge.unlockedAt
            }))
            state.achievements = state.achievements.map(achievement => ({
              ...achievement,
              timestamp: typeof achievement.timestamp === 'string'
                ? new Date(achievement.timestamp)
                : achievement.timestamp
            }))
            if (typeof state.stats.lastActivity === 'string') {
              state.stats.lastActivity = new Date(state.stats.lastActivity)
            }
          } catch (error) {
            console.warn('Erreur lors de la conversion des dates:', error)
          }
        }
      }
    }
  )
) 