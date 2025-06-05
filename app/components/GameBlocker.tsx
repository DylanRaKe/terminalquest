'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Lock, BookOpen, Brain, Home } from 'lucide-react'

export function GameBlocker() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-black/50 backdrop-blur-lg rounded-2xl p-8 max-w-2xl text-center border border-red-500/30"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-red-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Jeu Temporairement Indisponible</h2>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <p className="text-xl text-gray-300 mb-4">
            Le jeu est actuellement en maintenance pour améliorer votre expérience d&apos;apprentissage.
          </p>
          <p className="text-gray-400">
            En attendant, vous pouvez continuer à apprendre avec nos autres ressources !
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 justify-center"
            >
              <Home className="w-5 h-5" />
              Accueil
            </Link>
            
            <Link
              href="/docs"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 justify-center"
            >
              <BookOpen className="w-5 h-5" />
              Documentation
            </Link>
            
            <Link
              href="/quiz"
              className="bg-gradient-to-r from-yellow-500 to-pink-500 hover:from-yellow-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 justify-center"
            >
              <Brain className="w-5 h-5" />
              Quiz
            </Link>
          </div>
          
          <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300">
              💡 <strong>Conseil :</strong> Commencez par la documentation pour apprendre les bases, 
              puis testez vos connaissances avec le quiz !
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
} 