'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useReducedMotion, useColorScheme } from '../hooks/useResponsive'

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  contrast: 'normal' | 'high'
  reducedMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
  focusVisible: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void
  resetSettings: () => void
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 'medium',
  contrast: 'normal',
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: true,
  focusVisible: false
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const { prefersReducedMotion } = useReducedMotion()
  const { isDark } = useColorScheme()

  // Appliquer le thème sombre/clair automatiquement
  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  // Détecter les préférences système
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      reducedMotion: prefersReducedMotion
    }))
  }, [prefersReducedMotion])

  // Appliquer les styles CSS personnalisés
  useEffect(() => {
    const root = document.documentElement

    // Taille de police
    const fontSizeMap = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'extra-large': '20px'
    }
    root.style.setProperty('--base-font-size', fontSizeMap[settings.fontSize])

    // Contraste
    if (settings.contrast === 'high') {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Mouvement réduit
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }

    // Focus visible
    if (settings.focusVisible) {
      root.classList.add('focus-visible')
    } else {
      root.classList.remove('focus-visible')
    }

    // Navigation clavier
    if (settings.keyboardNavigation) {
      root.classList.add('keyboard-navigation')
    } else {
      root.classList.remove('keyboard-navigation')
    }
  }, [settings])

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    
    // Sauvegarder dans localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify({
      ...settings,
      [key]: value
    }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.removeItem('accessibility-settings')
  }

  // Charger les paramètres sauvegardés
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings')
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved)
        setSettings({ ...defaultSettings, ...parsedSettings })
      } catch (error) {
        console.warn('Erreur lors du chargement des paramètres d\'accessibilité:', error)
      }
    }
  }, [])

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

// Hook pour les annonces aux lecteurs d'écran
export function useScreenReader() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    // Nettoyer après 1 seconde
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  return { announce }
}

// Styles CSS à ajouter au global.css
export const accessibilityStyles = `
/* Styles d'accessibilité */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.focus-visible *:focus-visible {
  outline: 3px solid #3b82f6;
  outline-offset: 2px;
}

.high-contrast {
  --bg-primary: #000000;
  --text-primary: #ffffff;
  --border-color: #ffffff;
}

.reduce-motion * {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}

.keyboard-navigation button:focus,
.keyboard-navigation a:focus,
.keyboard-navigation input:focus,
.keyboard-navigation textarea:focus,
.keyboard-navigation select:focus {
  outline: 3px solid #3b82f6;
  outline-offset: 2px;
}

/* Tailles de police responsive */
html {
  font-size: var(--base-font-size, 16px);
}

@media (max-width: 768px) {
  html {
    font-size: calc(var(--base-font-size, 16px) * 0.9);
  }
}
` 