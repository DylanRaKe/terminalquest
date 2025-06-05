export interface QuizResult {
  difficulty: string
  score: number
  totalQuestions: number
  percentage: number
  completedAt: string
  isPerfect: boolean
}

export interface QuizStats {
  [difficulty: string]: QuizResult
}

const QUIZ_STORAGE_KEY = 'cliearn_quiz_results'

export const quizStorage = {
  // Sauvegarder un résultat de quiz
  saveResult: (difficulty: string, score: number, totalQuestions: number): void => {
    const percentage = Math.round((score / totalQuestions) * 100)
    const isPerfect = percentage === 100
    
    const result: QuizResult = {
      difficulty,
      score,
      totalQuestions,
      percentage,
      completedAt: new Date().toISOString(),
      isPerfect
    }

    const existingStats = quizStorage.getStats()
    existingStats[difficulty] = result
    
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(existingStats))
  },

  // Récupérer tous les résultats
  getStats: (): QuizStats => {
    if (typeof window === 'undefined') return {}
    
    try {
      const stored = localStorage.getItem(QUIZ_STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error('Erreur lors de la lecture du localStorage:', error)
      return {}
    }
  },

  // Récupérer le résultat d'un niveau spécifique
  getResult: (difficulty: string): QuizResult | null => {
    const stats = quizStorage.getStats()
    return stats[difficulty] || null
  },

  // Vérifier si un niveau a été terminé
  isCompleted: (difficulty: string): boolean => {
    const result = quizStorage.getResult(difficulty)
    return result !== null
  },

  // Vérifier si un niveau a été parfait (100%)
  isPerfect: (difficulty: string): boolean => {
    const result = quizStorage.getResult(difficulty)
    return result?.isPerfect || false
  },

  // Obtenir le meilleur score pour un niveau
  getBestScore: (difficulty: string): number => {
    const result = quizStorage.getResult(difficulty)
    return result?.percentage || 0
  },

  // Effacer tous les résultats (pour debug/reset)
  clearAll: (): void => {
    localStorage.removeItem(QUIZ_STORAGE_KEY)
  },

  // Obtenir les statistiques globales
  getGlobalStats: () => {
    const stats = quizStorage.getStats()
    const difficulties = Object.keys(stats)
    
    return {
      totalCompleted: difficulties.length,
      totalPerfect: difficulties.filter(d => stats[d].isPerfect).length,
      averageScore: difficulties.length > 0 
        ? Math.round(difficulties.reduce((sum, d) => sum + stats[d].percentage, 0) / difficulties.length)
        : 0,
      lastCompleted: difficulties.length > 0
        ? Math.max(...difficulties.map(d => new Date(stats[d].completedAt).getTime()))
        : null
    }
  }
} 