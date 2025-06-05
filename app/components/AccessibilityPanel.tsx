'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, X, Eye, Type, Contrast, Zap, Keyboard, Volume2 } from 'lucide-react'
import { useAccessibility } from './AccessibilityProvider'
import { useResponsive } from '../hooks/useResponsive'

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { settings, updateSetting, resetSettings } = useAccessibility()
  const { isMobile } = useResponsive()

  const fontSizeOptions = [
    { value: 'small', label: 'Petit', icon: '🔤' },
    { value: 'medium', label: 'Moyen', icon: '🔤' },
    { value: 'large', label: 'Grand', icon: '🔤' },
    { value: 'extra-large', label: 'Très grand', icon: '🔤' }
  ] as const

  const ToggleButton = ({ 
    checked, 
    onChange, 
    label, 
    icon: Icon,
    description 
  }: {
    checked: boolean
    onChange: (checked: boolean) => void
    label: string
    icon: React.ComponentType<{ className?: string }>
    description: string
  }) => (
    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-blue-400" />
        <div>
          <div className="font-medium text-white">{label}</div>
          <div className="text-sm text-gray-400">{description}</div>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
          checked ? 'bg-blue-600' : 'bg-gray-600'
        }`}
        aria-label={`${checked ? 'Désactiver' : 'Activer'} ${label}`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )

  return (
    <>
      {/* Bouton d'ouverture */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-label="Ouvrir les paramètres d'accessibilité"
      >
        <Settings className="w-6 h-6" />
      </motion.button>

      {/* Panneau */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Panneau */}
            <motion.div
              initial={isMobile ? { y: '100%' } : { x: '100%' }}
              animate={isMobile ? { y: 0 } : { x: 0 }}
              exit={isMobile ? { y: '100%' } : { x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed bg-gray-900 border-gray-700 z-50 overflow-y-auto ${
                isMobile 
                  ? 'bottom-0 left-0 right-0 h-[90vh] rounded-t-2xl border-t' 
                  : 'top-0 right-0 h-full w-96 border-l'
              }`}
              style={isMobile ? { maxHeight: '90vh' } : {}}
            >
              {/* Barre de glissement mobile */}
              {isMobile && (
                <div className="flex justify-center pt-2 pb-1">
                  <div className="w-12 h-1 bg-gray-600 rounded-full" />
                </div>
              )}
              
              {/* Header */}
              <div className={`flex items-center justify-between border-b border-gray-700 ${
                isMobile ? 'p-4' : 'p-6'
              }`}>
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-blue-400" />
                  <h2 className={`font-bold text-white ${
                    isMobile ? 'text-lg' : 'text-xl'
                  }`}>Accessibilité</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Fermer le panneau"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contenu */}
              <div className={`space-y-6 ${
                isMobile ? 'p-4 pb-8' : 'p-6'
              }`}>
                {/* Taille de police */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Type className="w-5 h-5 text-blue-400" />
                    Taille de police
                  </h3>
                  <div className={`grid gap-2 ${
                    isMobile ? 'grid-cols-1' : 'grid-cols-2'
                  }`}>
                    {fontSizeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateSetting('fontSize', option.value)}
                        className={`p-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          settings.fontSize === option.value
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <div className="text-lg mb-1">{option.icon}</div>
                        <div className="text-sm font-medium">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contraste */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Contrast className="w-5 h-5 text-blue-400" />
                    Contraste
                  </h3>
                  <div className={`grid gap-2 ${
                    isMobile ? 'grid-cols-1' : 'grid-cols-2'
                  }`}>
                    <button
                      onClick={() => updateSetting('contrast', 'normal')}
                      className={`p-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        settings.contrast === 'normal'
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className="text-lg mb-1">🌙</div>
                      <div className="text-sm font-medium">Normal</div>
                    </button>
                    <button
                      onClick={() => updateSetting('contrast', 'high')}
                      className={`p-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        settings.contrast === 'high'
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className="text-lg mb-1">☀️</div>
                      <div className="text-sm font-medium">Élevé</div>
                    </button>
                  </div>
                </div>

                {/* Options d'accessibilité */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-400" />
                    Options d&apos;accessibilité
                  </h3>

                  <ToggleButton
                    checked={settings.reducedMotion}
                    onChange={(checked) => updateSetting('reducedMotion', checked)}
                    label="Mouvement réduit"
                    icon={Zap}
                    description="Réduit les animations et transitions"
                  />

                  <ToggleButton
                    checked={settings.keyboardNavigation}
                    onChange={(checked) => updateSetting('keyboardNavigation', checked)}
                    label="Navigation clavier"
                    icon={Keyboard}
                    description="Améliore la navigation au clavier"
                  />

                  <ToggleButton
                    checked={settings.focusVisible}
                    onChange={(checked) => updateSetting('focusVisible', checked)}
                    label="Focus visible"
                    icon={Eye}
                    description="Affiche clairement l'élément focalisé"
                  />

                  <ToggleButton
                    checked={settings.screenReader}
                    onChange={(checked) => updateSetting('screenReader', checked)}
                    label="Lecteur d'écran"
                    icon={Volume2}
                    description="Optimise pour les lecteurs d'écran"
                  />
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-gray-700">
                  <button
                    onClick={resetSettings}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Réinitialiser les paramètres
                  </button>
                </div>

                {/* Informations */}
                <div className="text-sm text-gray-400 bg-gray-800/50 p-4 rounded-lg">
                  <p className="mb-2">
                    <strong>Raccourcis clavier :</strong>
                  </p>
                  <ul className="space-y-1">
                    <li>• Tab : Navigation suivante</li>
                    <li>• Shift + Tab : Navigation précédente</li>
                    <li>• Entrée : Activer l&apos;élément</li>
                    <li>• Échap : Fermer les panneaux</li>
                    <li>• Flèches : Navigation dans les listes</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
} 