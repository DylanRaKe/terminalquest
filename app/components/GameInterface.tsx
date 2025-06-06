'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { TerminalEngine, TerminalResponse } from '../lib/terminalEngine'
import { GameMap } from './GameMap'
import { Terminal } from './Terminal'
import { PlayerStats } from './PlayerStats'
import { CommandInventory } from './CommandInventory'
import { NPCGuide } from './NPCGuide'

export function GameInterface() {
  const {
    currentLocation,
    currentPath,
    locations,
    unlockedCommands,
    playerName,
    gameCompleted,
    setCurrentLocation,
    setCurrentPath,
    unlockCommand,
    addToHistory,
    completeGame,
    startGame,
    timeStarted
  } = useGameStore()

  const [terminalEngine, setTerminalEngine] = useState<TerminalEngine | null>(null)
  const [showWelcome, setShowWelcome] = useState(!timeStarted)
  const [npcMessage, setNpcMessage] = useState('')

  // Initialize terminal engine when game state changes
  useEffect(() => {
    const currentLoc = locations.find(loc => loc.id === currentLocation)
    if (currentLoc) {
      const engine = new TerminalEngine(currentLoc, locations, unlockedCommands)
      
      // Set sub-location if we're in one
      const pathParts = currentPath.split('/')
      if (pathParts.length > 2) {
        const subLocation = pathParts[pathParts.length - 1]
        engine.setSubLocation(subLocation)
      }
      
      setTerminalEngine(engine)
    }
  }, [currentLocation, currentPath, locations, unlockedCommands])

  // Handle game start
  const handleStartGame = () => {
    if (!timeStarted) {
      startGame()
    }
    setShowWelcome(false)
    setNpcMessage('🧙‍♂️ Bienvenue, brave aventurier ! Commencez par taper "ls" pour explorer votre environnement.')
  }

  // Handle terminal command execution
  const handleCommandExecution = (command: string): TerminalResponse => {
    if (!terminalEngine) {
      return { output: 'Erreur : Terminal non initialisé', success: false }
    }

    const response = terminalEngine.executeCommand(command)
    
    // Add to history
    addToHistory(`$ ${command}`)
    addToHistory(response.output)

    // Handle command usage
    if (response.commandUsed) {
      // Use the store action directly
      const gameStore = useGameStore.getState()
      gameStore.useCommand(response.commandUsed)
    }

    // Handle sub-location changes (cd into directories)
    if (response.commandUsed === 'cd' && response.success) {
      const [, ...args] = command.split(' ')
      if (args.length > 0) {
        const target = args[0]
        const currentLoc = locations.find(loc => loc.id === currentLocation)
        
        if (target === '..') {
          // Going back - update path
          if (currentPath.includes('/')) {
            const newPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || `/${currentLocation}`
            setCurrentPath(newPath)
            // Update terminal engine sub-location
            const subLocation = newPath.split('/').pop()
            if (subLocation && subLocation !== currentLocation) {
              terminalEngine.setSubLocation(subLocation)
            } else {
              terminalEngine.setSubLocation('')
            }
          }
        } else if (currentLoc?.directories.includes(target)) {
          // Going into a directory
          const newPath = `${currentPath}/${target}`
          setCurrentPath(newPath)
          terminalEngine.setSubLocation(target)
        }
      }
    }

    // Handle treasure unlocking
    if (response.treasureUnlocked) {
      if (response.treasureUnlocked === 'master') {
        // Game completed
        completeGame()
        setNpcMessage('🎉 FÉLICITATIONS ! Vous avez terminé votre quête ! Vous êtes maintenant un maître des commandes CLI !')
      } else {
        // Handle multiple commands (comma-separated)
        const commands = response.treasureUnlocked.split(',')
        commands.forEach(cmd => unlockCommand(cmd.trim()))
        
        if (commands.length > 1) {
          setNpcMessage(`🎉 Nouvelles commandes débloquées : ${commands.join(', ')} ! Tapez "help" pour voir toutes vos commandes.`)
        } else {
          setNpcMessage(`🎉 Nouvelle commande débloquée : "${response.treasureUnlocked}" ! Tapez "help" pour voir toutes vos commandes.`)
        }
      }
    }

    // Handle location changes
    if (response.locationChanged) {
      setCurrentLocation(response.locationChanged)
      setCurrentPath(`/${response.locationChanged}`)
      setNpcMessage('🗺️ Vous avez voyagé vers un nouveau lieu ! Explorez avec "ls" pour découvrir ce qui vous entoure.')
    }

    return response
  }

  if (showWelcome) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/50 backdrop-blur-lg rounded-2xl p-8 max-w-2xl text-center border border-purple-500/30"
        >
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4"
          >
            TerminalQuest
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-300 mb-8"
          >
            🗡️ L&apos;Aventure des Commandes CLI 🏰
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-gray-400 mb-8 space-y-2"
          >
            <p>🎯 Objectif : Maîtriser les commandes Linux de base</p>
            <p>⏱️ Durée estimée : 20 minutes</p>
            <p>🏆 Défi : Atteindre le château final en débloquant toutes les commandes</p>
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartGame}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            🚀 Commencer l&apos;Aventure
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen text-white pt-16">
      <div className="container mx-auto p-4 h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-4 bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30"
        >
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              TerminalQuest
            </h1>
            <a
                              href="/glossary"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors"
            >
              📚 Documentation
            </a>
          </div>
          <PlayerStats />
        </motion.header>

        {/* Main Game Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
          {/* Left Panel - Map and NPC */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <GameMap />
            <NPCGuide message={npcMessage} />
          </motion.div>

          {/* Center Panel - Terminal */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <Terminal onCommandExecute={handleCommandExecution} />
          </motion.div>

          {/* Right Panel - Inventory */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <CommandInventory />
          </motion.div>
        </div>

        {/* Game Completed Modal */}
        <AnimatePresence>
          {gameCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-8 max-w-md text-center text-black"
              >
                <h2 className="text-3xl font-bold mb-4">🎉 VICTOIRE ! 🎉</h2>
                <p className="text-lg mb-4">
                  Félicitations {playerName} ! Vous avez maîtrisé toutes les commandes CLI !
                </p>
                <p className="text-sm mb-6">
                  Vous êtes maintenant prêt à conquérir le terminal dans la vraie vie !
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                >
                  🔄 Rejouer
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 