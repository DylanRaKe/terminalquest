'use client'

import { motion } from 'framer-motion'
import { SandboxTerminal } from './SandboxTerminal'
import { BookOpen, Lightbulb, Target, Clock } from 'lucide-react'
import { useResponsive, useOrientation } from '../hooks/useResponsive'

export function TrainingInterface() {
  const { isMobile, isTablet } = useResponsive()
  const { isPortrait } = useOrientation()
  
  return (
    <div className="min-h-screen pt-20 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4"
          >
            🎯 Mode Entraînement
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-2"
          >
            Terminal sandbox pour pratiquer librement les commandes CLI
          </motion.p>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-gray-400"
          >
            Explorez, expérimentez et apprenez à votre rythme
          </motion.p>
        </motion.header>

        {/* Main Content */}
        <div className={`grid gap-6 ${
          isMobile || (isTablet && isPortrait) 
            ? 'grid-cols-1' 
            : isTablet 
              ? 'grid-cols-2' 
              : 'lg:grid-cols-3'
        }`}>
          {/* Terminal - 2/3 de l'espace */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2"
          >
            <div className={`${
              isMobile 
                ? 'h-[400px]' 
                : isTablet 
                  ? 'h-[500px]' 
                  : 'h-[600px]'
            }`}>
              <SandboxTerminal />
            </div>
          </motion.div>

          {/* Sidebar - 1/3 de l'espace */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="space-y-6"
          >
            {/* Guide rapide */}
            <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Guide Rapide</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="text-gray-300">
                  <span className="text-green-400 font-mono">ls</span> - Lister les fichiers
                </div>
                <div className="text-gray-300">
                  <span className="text-green-400 font-mono">cd [dir]</span> - Changer de répertoire
                </div>
                <div className="text-gray-300">
                  <span className="text-green-400 font-mono">pwd</span> - Répertoire courant
                </div>
                <div className="text-gray-300">
                  <span className="text-green-400 font-mono">cat [file]</span> - Lire un fichier
                </div>
                <div className="text-gray-300">
                  <span className="text-green-400 font-mono">help</span> - Aide complète
                </div>
              </div>
            </div>

            {/* Astuces */}
            <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Astuces</h3>
              </div>
              
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>Utilisez <kbd className="bg-gray-700 px-1 rounded">↑↓</kbd> pour naviguer dans l&apos;historique</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>Appuyez sur <kbd className="bg-gray-700 px-1 rounded">Tab</kbd> pour l&apos;auto-complétion</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>Tapez <span className="text-green-400 font-mono">clear</span> pour effacer l&apos;écran</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>Les suggestions apparaissent en jaune</span>
                </div>
              </div>
            </div>

            {/* Objectifs */}
            <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-white">Objectifs</h3>
              </div>
              
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Explorer le système de fichiers</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Lire le contenu des fichiers</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Naviguer entre les répertoires</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Maîtriser les commandes de base</span>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Session</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Temps d&apos;entraînement:</span>
                  <span className="text-white font-mono">Libre</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Commandes disponibles:</span>
                  <span className="text-white font-mono">15+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Système de fichiers:</span>
                  <span className="text-white font-mono">Simulé</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-center"
        >
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
            <p className="text-gray-400 text-sm">
              💡 <strong>Conseil :</strong> Commencez par taper <span className="text-green-400 font-mono">help</span> pour découvrir toutes les commandes disponibles.
              Explorez ensuite avec <span className="text-green-400 font-mono">ls</span> et <span className="text-green-400 font-mono">cd</span> !
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 