'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { GamepadIcon, BookOpen, Brain, Trophy, Clock, Target, Lock } from 'lucide-react'
import { useDebugMode } from '../hooks/useDebugMode'
import { Logo } from './Logo'
import { useResponsive } from '../hooks/useResponsive'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'


export function MainInterface() {
  const isDebugMode = useDebugMode()
  const { isMobile, isTablet } = useResponsive()
  const [focusedCardIndex, setFocusedCardIndex] = useState(-1)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  
  const cards = useMemo(() => [
    { id: 'game', href: '/game', available: isDebugMode },
    { id: 'training', href: '/training', available: true },
    { id: 'glossary', href: '/glossary', available: true },
    { id: 'quiz', href: '/quiz', available: true }
  ], [isDebugMode])

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
    const firstAvailableIndex = cards.findIndex((card: { available: boolean }) => card.available)
    if (firstAvailableIndex >= 0) {
      setFocusedCardIndex(firstAvailableIndex)
    }
  }, [isDebugMode, cards])
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${
      isMobile ? 'p-2 pt-16 pb-8' : 'p-4 pt-20'
    }`}>
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className={`flex items-center justify-center mb-4 ${
            isMobile ? 'flex-col gap-2' : 'gap-6'
          }`}>
            <Logo size={isMobile ? "md" : "xl"} />
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent ${
                isMobile ? 'text-3xl sm:text-4xl' : 'text-5xl md:text-6xl lg:text-7xl'
              }`}
            >
              TerminalQuest
            </motion.h1>
          </div>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-gray-300 mb-2 ${
              isMobile ? 'text-lg px-4' : 'text-xl md:text-2xl'
            }`}
          >
            🗡️ Maîtrisez les Commandes CLI 🏰
          </motion.p>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`text-gray-400 ${
              isMobile ? 'text-sm px-4' : 'text-base md:text-lg'
            }`}
          >
            Apprenez, pratiquez et testez vos connaissances des commandes Linux
          </motion.p>
        </motion.header>

        {/* Navigation Cards */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid gap-8 mb-12"
          style={{
            gridTemplateColumns: isMobile 
              ? '1fr' 
              : isTablet 
                ? 'repeat(2, 1fr)' 
                : 'repeat(auto-fit, minmax(320px, 1fr))'
          }}
        >
                    {/* Game Card */}
          <motion.div
            whileHover={isDebugMode ? { scale: 1.02, y: -5 } : {}}
            whileTap={isDebugMode ? { scale: 0.98 } : {}}
            className="group relative"
          >
            {isDebugMode ? (
              <Link href="/game" className="block h-full">
                <div className="relative bg-gradient-to-br from-purple-900/80 to-blue-900/80 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 h-full cursor-pointer overflow-hidden">
                  {/* Effet de brillance */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl w-16 h-16 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
                        <GamepadIcon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">🎮 Jeu Interactif</h2>
                        <p className="text-purple-300 text-sm">Aventure CLI</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                      Explorez un monde fantastique tout en apprenant les commandes CLI de manière progressive et ludique.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-black/20 rounded-lg p-3 text-center">
                        <Clock className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                        <span className="text-xs text-gray-300">20-30 min</span>
                      </div>
                      <div className="bg-black/20 rounded-lg p-3 text-center">
                        <Target className="w-4 h-4 mx-auto mb-1 text-green-400" />
                        <span className="text-xs text-gray-300">Progressif</span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl text-center group-hover:from-green-600 group-hover:to-blue-600 transition-all duration-200">
                      Commencer l&apos;Aventure
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-600/30 transition-all duration-300 h-full opacity-60 cursor-not-allowed overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl w-16 h-16 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-400">🎮 Jeu Interactif</h2>
                      <p className="text-gray-500 text-sm">En maintenance</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-500 mb-6 leading-relaxed text-sm">
                    Le jeu est temporairement indisponible pour maintenance et améliorations.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <Clock className="w-4 h-4 mx-auto mb-1 text-gray-500" />
                      <span className="text-xs text-gray-500">Bientôt</span>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <Target className="w-4 h-4 mx-auto mb-1 text-gray-500" />
                      <span className="text-xs text-gray-500">En cours</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 font-semibold py-3 px-6 rounded-xl text-center">
                    Indisponible
                  </div>
                </div>
              </div>
            )}
          </motion.div>

                    {/* Training Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="group relative"
          >
            <Link href="/training" className="block h-full">
              <div className="relative bg-gradient-to-br from-blue-900/80 to-cyan-900/80 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/30 hover:border-blue-400/60 transition-all duration-500 h-full cursor-pointer overflow-hidden">
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl w-16 h-16 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">🎯 Entraînement</h2>
                      <p className="text-blue-300 text-sm">Terminal Sandbox</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                    Pratiquez librement dans un environnement sécurisé avec validation en temps réel et suggestions intelligentes.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <Target className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                      <span className="text-xs text-gray-300">Libre</span>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <Clock className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                      <span className="text-xs text-gray-300">Instantané</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl text-center group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-200">
                    Commencer l&apos;Entraînement
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Tutorials Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="group relative"
          >
            <Link href="/tutorials" className="block h-full">
              <div className="relative bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 h-full cursor-pointer overflow-hidden">
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl w-16 h-16 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">📚 Tutoriels Guidés</h2>
                      <p className="text-purple-300 text-sm">Apprentissage structuré</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                    Suivez des parcours d&apos;apprentissage structurés avec validation automatique et progression sauvegardée.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <Target className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                      <span className="text-xs text-gray-300">3 niveaux</span>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <Clock className="w-4 h-4 mx-auto mb-1 text-pink-400" />
                      <span className="text-xs text-gray-300">Guidé</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl text-center group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-200">
                    Commencer les Tutoriels
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Glossary Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="group relative"
          >
            <Link href="/glossary" className="block h-full">
              <div className="relative bg-gradient-to-br from-green-900/80 to-emerald-900/80 backdrop-blur-xl rounded-3xl p-8 border border-green-500/30 hover:border-green-400/60 transition-all duration-500 h-full cursor-pointer overflow-hidden">
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl w-16 h-16 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">📖 Glossaire CLI</h2>
                      <p className="text-green-300 text-sm">Référence interactive</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                    Dictionnaire interactif avec recherche intelligente, exemples d&apos;usage et liens croisés.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <BookOpen className="w-4 h-4 mx-auto mb-1 text-green-400" />
                      <span className="text-xs text-gray-300">Recherche</span>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <Target className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                      <span className="text-xs text-gray-300">Exemples</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl text-center group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-200">
                    Explorer le Glossaire
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Documentation Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="group relative"
          >
                            <Link href="/glossary" className="block h-full">
              <div className="relative bg-gradient-to-br from-orange-900/80 to-red-900/80 backdrop-blur-xl rounded-3xl p-8 border border-orange-500/30 hover:border-orange-400/60 transition-all duration-500 h-full cursor-pointer overflow-hidden">
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl w-16 h-16 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">📚 Documentation</h2>
                      <p className="text-orange-300 text-sm">Référence CLI</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                    Consultez la référence complète des commandes CLI avec des exemples pratiques et explications détaillées.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <BookOpen className="w-4 h-4 mx-auto mb-1 text-orange-400" />
                      <span className="text-xs text-gray-300">Complet</span>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <Target className="w-4 h-4 mx-auto mb-1 text-red-400" />
                      <span className="text-xs text-gray-300">Pratique</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-xl text-center group-hover:from-orange-600 group-hover:to-red-600 transition-all duration-200">
                    Consulter la Doc
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Quiz Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="group relative"
          >
            <Link href="/quiz" className="block h-full">
              <div className="relative bg-gradient-to-br from-yellow-900/80 to-pink-900/80 backdrop-blur-xl rounded-3xl p-8 border border-yellow-500/30 hover:border-yellow-400/60 transition-all duration-500 h-full cursor-pointer overflow-hidden">
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-r from-yellow-500 to-pink-500 rounded-2xl w-16 h-16 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-yellow-500/25 transition-all duration-300">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">🧠 Quiz Interactif</h2>
                      <p className="text-yellow-300 text-sm">Test de connaissances</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                    Testez vos connaissances avec 4 niveaux de difficulté et 57 questions sur les commandes CLI.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <Trophy className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
                      <span className="text-xs text-gray-300">4 niveaux</span>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <Clock className="w-4 h-4 mx-auto mb-1 text-pink-400" />
                      <span className="text-xs text-gray-300">57 questions</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl text-center group-hover:from-yellow-600 group-hover:to-pink-600 transition-all duration-200">
                    Commencer le Quiz
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>

                {/* Features & Stats */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="grid gap-8"
          style={{
            gridTemplateColumns: isMobile 
              ? '1fr' 
              : isTablet 
                ? '1fr' 
                : 'repeat(2, 1fr)'
          }}
        >
          {/* Objectifs d'apprentissage */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              Objectifs d&apos;apprentissage
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4 p-4 bg-black/20 rounded-xl">
                <div className="text-3xl">🗂️</div>
                <div>
                  <h4 className="font-semibold text-white">Navigation</h4>
                  <p className="text-sm text-gray-400">Maîtrisez les répertoires et l&apos;arborescence</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-black/20 rounded-xl">
                <div className="text-3xl">📁</div>
                <div>
                  <h4 className="font-semibold text-white">Gestion de fichiers</h4>
                  <p className="text-sm text-gray-400">Créez, modifiez et organisez vos fichiers</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-black/20 rounded-xl">
                <div className="text-3xl">🔍</div>
                <div>
                  <h4 className="font-semibold text-white">Recherche & manipulation</h4>
                  <p className="text-sm text-gray-400">Trouvez et traitez vos données efficacement</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques de la plateforme */}
          <div className="bg-gradient-to-br from-purple-900/80 to-blue-900/80 backdrop-blur-xl rounded-3xl p-8 border border-purple-700/50">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">📊</span>
              Plateforme TerminalQuest
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-black/20 rounded-xl">
                <div className="text-3xl font-bold text-blue-400 mb-1">57</div>
                <div className="text-sm text-gray-400">Questions Quiz</div>
              </div>
              <div className="text-center p-4 bg-black/20 rounded-xl">
                <div className="text-3xl font-bold text-green-400 mb-1">15+</div>
                <div className="text-sm text-gray-400">Commandes CLI</div>
              </div>
              <div className="text-center p-4 bg-black/20 rounded-xl">
                <div className="text-3xl font-bold text-yellow-400 mb-1">4</div>
                <div className="text-sm text-gray-400">Niveaux difficulté</div>
              </div>
              <div className="text-center p-4 bg-black/20 rounded-xl">
                <div className="text-3xl font-bold text-purple-400 mb-1">17</div>
                <div className="text-sm text-gray-400">Badges à débloquer</div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl border border-purple-500/30">
              <p className="text-center text-sm text-gray-300">
                🚀 <strong>Système de progression</strong> avec XP, niveaux et achievements
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 