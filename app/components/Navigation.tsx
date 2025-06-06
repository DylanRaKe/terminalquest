'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, GamepadIcon, BookOpen, Brain, Menu, X, Lock, Target, Search } from 'lucide-react'
import { useDebugMode } from '../hooks/useDebugMode'
import { Logo } from './Logo'
export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isDebugMode = useDebugMode()

  const navItems = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/game', label: 'Jeu', icon: GamepadIcon },
    { href: '/training', label: 'Entraînement', icon: Target },
    { href: '/tutorials', label: 'Tutoriels', icon: BookOpen },
    { href: '/glossary', label: 'Glossaire', icon: Search },
    { href: '/quiz', label: 'Quiz', icon: Brain },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <Logo size="sm" />
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
              >
                TerminalQuest
              </motion.div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isGameItem = item.href === '/game'
                const isDisabled = isGameItem && !isDebugMode
                
                if (isDisabled) {
                  return (
                    <motion.div
                      key={item.href}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 cursor-not-allowed opacity-50"
                    >
                      <Lock className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </motion.div>
                  )
                }
                
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-white/20 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                )
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden bg-black/90 backdrop-blur-lg border-b border-white/10"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isGameItem = item.href === '/game'
                  const isDisabled = isGameItem && !isDebugMode
                  
                  if (isDisabled) {
                    return (
                      <motion.div
                        key={item.href}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-500 cursor-not-allowed opacity-50"
                      >
                        <Lock className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </motion.div>
                    )
                  }
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive(item.href)
                            ? 'bg-white/20 text-white'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navigation */}
      <div className="h-16" />
    </>
  )
} 