'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { GamepadIcon, BookOpen, Brain, Trophy, Clock, Target, Lock } from 'lucide-react'
import { useDebugMode } from '../hooks/useDebugMode'
import { Logo } from './Logo'
import { useResponsive } from '../hooks/useResponsive'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'
import { useState, useRef, useEffect, useCallback } from 'react'


export function MainInterface() {
  const isDebugMode = useDebugMode()
  const { isMobile, isTablet } = useResponsive()
  const [focusedCardIndex, setFocusedCardIndex] = useState(-1)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const cards = [
    { id: 'game', href: '/game', available: isDebugMode },
    { id: 'training', href: '/training', available: true },
    { id: 'docs', href: '/docs', available: true },
    { id: 'quiz', href: '/quiz', available: true }
  ]

  const navigateLeft = useCallback(() => {
    setFocusedCardIndex(prev => {
      const newIndex = prev <= 0 ? cards.length - 1 : prev - 1
      cardRefs.current[newIndex]?.focus()
      return newIndex
    })
  }, [cards.length])

  const navigateRight = useCallback(() => {
    setFocusedCardIndex(prev => {
      const newIndex = prev >= cards.length - 1 ? 0 : prev + 1
      cardRefs.current[newIndex]?.focus()
      return newIndex
    })
  }, [cards.length])

  const selectCard = useCallback(() => {
    if (focusedCardIndex >= 0 && cards[focusedCardIndex].available) {
      window.location.href = cards[focusedCardIndex].href
    }
  }, [focusedCardIndex, cards])

  useKeyboardNavigation({
    onArrowLeft: navigateLeft,
    onArrowRight: navigateRight,
    onEnter: selectCard
  })

  useEffect(() => {
    // Focus sur la première carte disponible au chargement
    const firstAvailableIndex = cards.findIndex(card => card.available)
    if (firstAvailableIndex >= 0) {
      setFocusedCardIndex(firstAvailableIndex)
    }
  }, [isDebugMode, cards])
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-6 mb-4">
            <Logo size="xl" />
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-7xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
            >
              TerminalQuest
            </motion.h1>
          </div>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl text-gray-300 mb-2"
          >
            🗡️ Maîtrisez les Commandes CLI 🏰
          </motion.p>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-gray-400"
          >
            Apprenez, pratiquez et testez vos connaissances des commandes Linux
          </motion.p>
        </motion.header>

        {/* Navigation Cards */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={`grid gap-6 mb-8 ${
            isMobile 
              ? 'grid-cols-1' 
              : isTablet 
                ? 'grid-cols-2' 
                : 'lg:grid-cols-4'
          }`}
        >
          {/* Game Card */}
          <motion.div
            whileHover={isDebugMode ? { scale: 1.05, y: -10 } : {}}
            whileTap={isDebugMode ? { scale: 0.95 } : {}}
            className="group"
          >
            {isDebugMode ? (
              <Link href="/game">
                <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 h-full cursor-pointer">
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
                      <GamepadIcon className="w-10 h-10 text-white" />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white mb-4">🎮 Jeu</h2>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      Embarquez dans une aventure interactive pour apprendre les commandes CLI en explorant un monde fantastique.
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>20-30 minutes</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>Apprentissage progressif</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-6 rounded-xl group-hover:from-green-600 group-hover:to-blue-600 transition-all duration-200">
                      Commencer l'Aventure
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-600/30 transition-all duration-300 h-full opacity-60 cursor-not-allowed">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                    <Lock className="w-10 h-10 text-white" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-400 mb-4">🎮 Jeu</h2>
                  <p className="text-gray-500 mb-6 leading-relaxed">
                    Le jeu est temporairement indisponible pour maintenance.
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Bientôt disponible</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Target className="w-4 h-4" />
                                              <span>En cours d&apos;amélioration</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 font-bold py-3 px-6 rounded-xl transition-all duration-200">
                    Indisponible
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Training Card */}
          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            className="group"
          >
            <Link href="/training">
              <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 h-full cursor-pointer">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  
                                      <h2 className="text-3xl font-bold text-white mb-4">🎯 Entraînement</h2>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Pratiquez librement dans un terminal sandbox avec validation en temps réel et suggestions intelligentes.
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <Target className="w-4 h-4" />
                      <span>Pratique libre</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Feedback instantané</span>
                    </div>
                  </div>
                  
                                      <div className="mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-6 rounded-xl group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-200">
                      Commencer l&apos;Entraînement
                    </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Documentation Card */}
          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            className="group"
          >
            <Link href="/docs">
              <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-8 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 h-full cursor-pointer">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4">📚 Documentation</h2>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Consultez la référence complète des commandes CLI avec des exemples pratiques et des explications détaillées.
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Guide complet</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Target className="w-4 h-4" />
                      <span>Exemples pratiques</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-xl group-hover:from-orange-600 group-hover:to-red-600 transition-all duration-200">
                    Consulter la Doc
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Quiz Card */}
          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            className="group"
          >
            <Link href="/quiz">
              <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-8 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 h-full cursor-pointer">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-yellow-500 to-pink-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-yellow-500/25 transition-all duration-300">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4">🧠 Quiz</h2>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Testez vos connaissances avec 4 niveaux de difficulté et 57 questions sur les commandes CLI.
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span>4 niveaux de difficulté</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>57 questions au total</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gradient-to-r from-yellow-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl group-hover:from-yellow-600 group-hover:to-pink-600 transition-all duration-200">
                    Commencer le Quiz
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
                                <h3 className="text-xl font-bold text-white mb-4">🎯 Objectifs d&apos;apprentissage</h3>
            <div className="grid md:grid-cols-3 gap-6 text-gray-400">
              <div>
                <div className="text-2xl mb-2">🗂️</div>
                <p className="text-sm">Navigation dans les répertoires</p>
              </div>
              <div>
                <div className="text-2xl mb-2">📁</div>
                <p className="text-sm">Gestion des fichiers et dossiers</p>
              </div>
              <div>
                <div className="text-2xl mb-2">🔍</div>
                <p className="text-sm">Recherche et manipulation de données</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 