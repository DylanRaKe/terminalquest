'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Lightbulb } from 'lucide-react'

interface NPCGuideProps {
  message: string
}

export function NPCGuide({ message }: NPCGuideProps) {
  const defaultMessages = [
    "🧙‍♂️ Salutations, brave aventurier ! Je suis votre guide dans cette quête.",
    "💡 Astuce : Commencez toujours par 'ls' pour explorer votre environnement.",
    "🗝️ Les coffres contiennent de nouvelles commandes. Utilisez les bonnes commandes pour les ouvrir !",
    "🗺️ Naviguez entre les lieux avec 'cd' suivi du nom du lieu.",
    "📚 Tapez 'help' à tout moment pour voir vos commandes disponibles."
  ]

  const displayMessage = message || defaultMessages[0]

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Guide Mystique
        </h3>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={displayMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {/* NPC Avatar */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl shrink-0">
              🧙‍♂️
            </div>
            
            <div className="flex-1 bg-blue-900/30 rounded-lg p-3 border border-blue-500/20">
              <p className="text-sm text-blue-100 leading-relaxed">
                {displayMessage}
              </p>
            </div>
          </div>

          {/* Tips section */}
          {!message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-400">
                  Conseils de démarrage
                </span>
              </div>
                             <ul className="text-xs text-yellow-200 space-y-1">
                 <li>• Tapez &quot;ls&quot; pour voir ce qui vous entoure</li>
                 <li>• Lisez les fichiers avec &quot;cat nom_fichier.txt&quot;</li>
                 <li>• Cherchez les coffres mystérieux dans chaque lieu</li>
                 <li>• Utilisez &quot;help&quot; pour voir vos commandes</li>
               </ul>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
} 