'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { Package, Lock, Unlock, CheckCircle } from 'lucide-react'

export function CommandInventory() {
  const { commands } = useGameStore()

  const getCommandIcon = (commandId: string, unlocked: boolean, used: boolean) => {
    if (!unlocked) return <Lock className="w-4 h-4 text-gray-500" />
    if (used) return <CheckCircle className="w-4 h-4 text-green-500" />
    return <Unlock className="w-4 h-4 text-yellow-500" />
  }

  const getCommandColor = (unlocked: boolean, used: boolean) => {
    if (!unlocked) return 'bg-gray-800 border-gray-600 text-gray-500'
    if (used) return 'bg-green-900/50 border-green-500 text-green-300'
    return 'bg-yellow-900/50 border-yellow-500 text-yellow-300'
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Inventaire CLI
        </h3>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
        <AnimatePresence>
          {commands.map((command, index) => (
            <motion.div
              key={command.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border transition-all duration-200 ${getCommandColor(
                command.unlocked,
                command.used
              )}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getCommandIcon(command.id, command.unlocked, command.used)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="font-mono font-bold text-sm">
                      {command.name}
                    </code>
                    {command.unlocked && !command.used && (
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-xs bg-yellow-500 text-black px-1 py-0.5 rounded"
                      >
                        NOUVEAU
                      </motion.span>
                    )}
                    {command.used && (
                      <span className="text-xs bg-green-500 text-black px-1 py-0.5 rounded">
                        UTILISÉ
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs opacity-80 mb-2">
                    {command.description}
                  </p>
                  
                  {command.unlocked && (
                    <code className="text-xs font-mono opacity-60 block">
                      {command.syntax}
                    </code>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Progress Summary */}
      <div className="mt-4 pt-4 border-t border-purple-500/30">
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">
            Progression des commandes
          </p>
          <div className="flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span className="text-gray-400">
                {commands.filter(c => !c.unlocked).length} verrouillées
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-yellow-400">
                {commands.filter(c => c.unlocked && !c.used).length} disponibles
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-400">
                {commands.filter(c => c.used).length} maîtrisées
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 