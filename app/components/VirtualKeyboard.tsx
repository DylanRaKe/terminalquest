'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Delete, ArrowUp, ArrowDown, CornerDownLeft } from 'lucide-react'

interface VirtualKeyboardProps {
  isVisible: boolean
  onKeyPress: (key: string) => void
  onSpecialKey: (key: 'Enter' | 'Backspace' | 'ArrowUp' | 'ArrowDown' | 'Tab') => void
  onClose: () => void
}

export function VirtualKeyboard({ isVisible, onKeyPress, onSpecialKey, onClose }: VirtualKeyboardProps) {
  const [isShiftPressed, setIsShiftPressed] = useState(false)

  const commonCommands = [
    'ls', 'cd', 'pwd', 'cat', 'help', 'clear', 'history', 'echo'
  ]

  const basicKeys = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ]

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
  const symbols = ['-', '=', '[', ']', ';', "'", ',', '.', '/']

  const handleKeyPress = (key: string) => {
    const finalKey = isShiftPressed ? key.toUpperCase() : key
    onKeyPress(finalKey)
    if (isShiftPressed) {
      setIsShiftPressed(false)
    }
  }

  const handleSpecialKey = (key: 'Enter' | 'Backspace' | 'ArrowUp' | 'ArrowDown' | 'Tab') => {
    onSpecialKey(key)
  }

  const KeyButton = ({ 
    children, 
    onClick, 
    className = '', 
    variant = 'default' 
  }: { 
    children: React.ReactNode
    onClick: () => void
    className?: string
    variant?: 'default' | 'special' | 'command'
  }) => {
    const baseClasses = 'flex items-center justify-center rounded-lg font-medium transition-all duration-150 active:scale-95 select-none'
    
    const variantClasses = {
      default: 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 min-h-[44px] min-w-[32px]',
      special: 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 min-h-[44px]',
      command: 'bg-green-600 hover:bg-green-500 text-white border border-green-500 text-xs px-2 py-1 min-h-[32px]'
    }

    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        onClick={onClick}
      >
        {children}
      </motion.button>
    )
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800 border-t border-gray-600 p-4 max-h-[50vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-medium">Clavier CLI</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          {/* Commandes rapides */}
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2">Commandes rapides:</div>
            <div className="grid grid-cols-4 gap-2">
              {commonCommands.map((cmd) => (
                <KeyButton
                  key={cmd}
                  variant="command"
                  onClick={() => onKeyPress(cmd)}
                >
                  {cmd}
                </KeyButton>
              ))}
            </div>
          </div>

          {/* Chiffres */}
          <div className="grid grid-cols-10 gap-1 mb-2">
            {numbers.map((num) => (
              <KeyButton
                key={num}
                onClick={() => handleKeyPress(num)}
              >
                {num}
              </KeyButton>
            ))}
          </div>

          {/* Lettres */}
          {basicKeys.map((row, rowIndex) => (
            <div key={rowIndex} className="grid gap-1 mb-2" style={{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }}>
              {row.map((key) => (
                <KeyButton
                  key={key}
                  onClick={() => handleKeyPress(key)}
                >
                  {isShiftPressed ? key.toUpperCase() : key}
                </KeyButton>
              ))}
            </div>
          ))}

          {/* Symboles */}
          <div className="grid grid-cols-9 gap-1 mb-3">
            {symbols.map((symbol) => (
              <KeyButton
                key={symbol}
                onClick={() => handleKeyPress(symbol)}
              >
                {symbol}
              </KeyButton>
            ))}
          </div>

          {/* Touches spéciales */}
          <div className="grid grid-cols-6 gap-2">
            <KeyButton
              variant="special"
              onClick={() => setIsShiftPressed(!isShiftPressed)}
              className={isShiftPressed ? 'bg-blue-500' : ''}
            >
              Shift
            </KeyButton>
            
            <KeyButton
              variant="special"
              onClick={() => handleKeyPress(' ')}
            >
              Space
            </KeyButton>
            
            <KeyButton
              variant="special"
              onClick={() => handleSpecialKey('Tab')}
            >
              Tab
            </KeyButton>
            
            <KeyButton
              variant="special"
              onClick={() => handleSpecialKey('Backspace')}
            >
              <Delete className="w-4 h-4" />
            </KeyButton>
            
            <KeyButton
              variant="special"
              onClick={() => handleSpecialKey('ArrowUp')}
            >
              <ArrowUp className="w-4 h-4" />
            </KeyButton>
            
            <KeyButton
              variant="special"
              onClick={() => handleSpecialKey('Enter')}
            >
              <CornerDownLeft className="w-4 h-4" />
            </KeyButton>
          </div>

          {/* Navigation historique */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <KeyButton
              variant="special"
              onClick={() => handleSpecialKey('ArrowUp')}
            >
              <ArrowUp className="w-4 h-4 mr-1" />
              Historique ↑
            </KeyButton>
            
            <KeyButton
              variant="special"
              onClick={() => handleSpecialKey('ArrowDown')}
            >
              <ArrowDown className="w-4 h-4 mr-1" />
              Historique ↓
            </KeyButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 