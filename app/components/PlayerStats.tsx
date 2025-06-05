'use client'

import { motion } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { Trophy, Clock, Star, User, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

export function PlayerStats() {
  const { playerName, score, timeStarted, unlockedCommands, commands, resetGame } = useGameStore()
  const [elapsedTime, setElapsedTime] = useState(0)

  // Update elapsed time every second
  useEffect(() => {
    if (!timeStarted) return

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - timeStarted)
    }, 1000)

    return () => clearInterval(interval)
  }, [timeStarted])

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const completionPercentage = Math.round((unlockedCommands.length / commands.length) * 100)

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir recommencer le jeu ? Toute progression sera perdue.')) {
      resetGame()
      window.location.reload()
    }
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      {/* Player Name */}
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-blue-400" />
        <span className="text-gray-300">
          {playerName || 'Aventurier'}
        </span>
      </div>

      {/* Score */}
      <motion.div 
        className="flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
      >
        <Trophy className="w-4 h-4 text-yellow-400" />
        <span className="text-yellow-400 font-bold">
          {score.toLocaleString()}
        </span>
      </motion.div>

      {/* Time */}
      {timeStarted && (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-mono">
            {formatTime(elapsedTime)}
          </span>
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 text-purple-400" />
        <div className="flex items-center gap-1">
          <span className="text-purple-400 font-bold">
            {completionPercentage}%
          </span>
          <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <motion.button
        onClick={handleReset}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1 px-3 py-1 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-colors text-xs"
        title="Recommencer le jeu"
      >
        <RotateCcw className="w-3 h-3" />
        Reset
      </motion.button>
    </div>
  )
} 