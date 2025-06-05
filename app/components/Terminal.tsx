'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useGameStore } from '../stores/gameStore'
import { TerminalResponse } from '../lib/terminalEngine'
import { Terminal as TerminalIcon, Send } from 'lucide-react'

interface TerminalProps {
  onCommandExecute: (command: string) => TerminalResponse
}

interface FormData {
  command: string
}

export function Terminal({ onCommandExecute }: TerminalProps) {
  const { gameHistory, currentPath, unlockedCommands, locations, currentLocation } = useGameStore()
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  
  const { register, handleSubmit, reset, watch, setValue } = useForm<FormData>()
  const commandValue = watch('command', '')

  // Get autocomplete suggestions based on current input
  const getAutocompleteSuggestions = (input: string): string[] => {
    const [command, ...args] = input.split(' ')
    const currentLocationData = locations.find(loc => loc.id === currentLocation)
    
    if (!currentLocationData) return []

    // If we're still typing the command
    if (args.length === 0) {
      const availableCommands = [...unlockedCommands, 'help']
      return availableCommands.filter(cmd => cmd.startsWith(command.toLowerCase()))
    }

    // If we're typing arguments
    const lastArg = args[args.length - 1] || ''
    
    switch (command.toLowerCase()) {
      case 'cd':
        // Suggest directories and other locations
        const suggestions = [
          ...currentLocationData.directories,
          ...locations.map(loc => loc.id).filter(id => id !== currentLocation)
        ]
        return suggestions.filter(item => item.startsWith(lastArg.toLowerCase()))
      
      case 'cat':
        // Suggest files
        return currentLocationData.files.filter(file => file.startsWith(lastArg.toLowerCase()))
      
      case './':
        // Suggest executable files
        return currentLocationData.files
          .filter(file => file.endsWith('.sh') && file.startsWith(lastArg.toLowerCase().replace('./', '')))
          .map(file => `./${file}`)
      
      default:
        if (command.startsWith('./')) {
          return currentLocationData.files
            .filter(file => file.endsWith('.sh') && file.startsWith(command.toLowerCase().replace('./', '')))
        }
        return []
    }
  }

  // Update suggestions when command changes
  useEffect(() => {
    if (commandValue.trim()) {
      const newSuggestions = getAutocompleteSuggestions(commandValue)
      setSuggestions(newSuggestions)
      setSelectedSuggestion(-1)
    } else {
      setSuggestions([])
      setSelectedSuggestion(-1)
    }
  }, [commandValue, currentLocation, unlockedCommands])

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [gameHistory])

  const onSubmit = (data: FormData) => {
    if (!data.command.trim()) return

    // Execute command - the parent component will handle adding to history
    onCommandExecute(data.command.trim())
    
    reset()
    setSuggestions([])
    setSelectedSuggestion(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      
      if (suggestions.length > 0) {
        const suggestionToUse = selectedSuggestion >= 0 ? suggestions[selectedSuggestion] : suggestions[0]
        
        // Apply the suggestion
        const [currentCommand, ...currentArgs] = commandValue.split(' ')
        let newCommand = ''
        
        if (currentArgs.length === 0) {
          // Completing command
          newCommand = suggestionToUse + ' '
        } else {
          // Completing argument
          currentArgs[currentArgs.length - 1] = suggestionToUse
          newCommand = [currentCommand, ...currentArgs].join(' ')
        }
        
        setValue('command', newCommand)
        setSuggestions([])
        setSelectedSuggestion(-1)
        
        // Focus back on input
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus()
            inputRef.current.setSelectionRange(newCommand.length, newCommand.length)
          }
        }, 0)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (suggestions.length > 0) {
        setSelectedSuggestion(prev => prev <= 0 ? suggestions.length - 1 : prev - 1)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (suggestions.length > 0) {
        setSelectedSuggestion(prev => prev >= suggestions.length - 1 ? 0 : prev + 1)
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(onSubmit)()
    } else if (e.key === 'Escape') {
      setSuggestions([])
      setSelectedSuggestion(-1)
    }
  }

  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-lg border border-green-500/30 h-full flex flex-col min-h-[600px] max-h-[600px]">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 p-3 border-b border-green-500/30 bg-black/40 shrink-0">
        <TerminalIcon className="w-5 h-5 text-green-400" />
        <span className="text-green-400 font-mono text-sm">CLIearn Terminal</span>
        <div className="flex gap-1 ml-auto">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      {/* Terminal Output */}
      <div 
        ref={outputRef}
        className="flex-1 p-4 font-mono text-sm overflow-y-auto scrollbar-thin scrollbar-thumb-green-500/50 scrollbar-track-transparent min-h-0"
      >
        {/* Welcome message */}
        {gameHistory.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-400 mb-4"
          >
             <p>Welcome to CLIearn terminal!</p>
              <p>Type &quot;help&quot; to see available commands</p>
              <p>Start with &quot;ls&quot; to explore your environment</p>
              <p>Use TAB for autocompletion and arrows to navigate</p>
             <br />
          </motion.div>
        )}

        {/* Game history from store */}
        {gameHistory.map((entry: string, index: number) => (
          <motion.div
            key={`history-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`mb-2 whitespace-pre-wrap ${
              entry.startsWith('$') 
                ? 'text-yellow-400 font-bold' 
                : entry.startsWith('❌') 
                ? 'text-red-400'
                : entry.startsWith('🎉') || entry.startsWith('💰')
                ? 'text-green-400'
                : 'text-gray-300'
            }`}
          >
            {entry}
          </motion.div>
        ))}
      </div>

      {/* Terminal Input */}
      <div className="relative">
        {/* Autocomplete suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute bottom-full left-4 right-4 mb-1 bg-black/90 border border-green-500/30 rounded-lg max-h-40 overflow-y-auto z-10">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion}
                className={`px-3 py-2 font-mono text-sm cursor-pointer ${
                  index === selectedSuggestion 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'text-green-400 hover:bg-green-500/10'
                }`}
                onClick={() => {
                  const [currentCommand, ...currentArgs] = commandValue.split(' ')
                  let newCommand = ''
                  
                  if (currentArgs.length === 0) {
                    newCommand = suggestion + ' '
                  } else {
                    currentArgs[currentArgs.length - 1] = suggestion
                    newCommand = [currentCommand, ...currentArgs].join(' ')
                  }
                  
                  setValue('command', newCommand)
                  setSuggestions([])
                  setSelectedSuggestion(-1)
                  inputRef.current?.focus()
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 border-t border-green-500/30 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-mono text-sm shrink-0">
              {currentPath}$
            </span>
            <div className="flex-1 relative">
              <input
                {...register('command')}
                ref={(e) => {
                  register('command').ref(e)
                  inputRef.current = e
                }}
                type="text"
                placeholder="Tapez votre commande ici... (TAB pour autocomplétion)"
                className="w-full bg-transparent text-green-400 font-mono text-sm outline-none placeholder-green-400/50 pr-10"
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoFocus
              />
              <button
                type="submit"
                disabled={!commandValue.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Command suggestions */}
          <div className="mt-2 text-xs text-gray-500">
            💡 TAB: autocomplétion | ↑↓: navigation | ENTER: exécuter | ESC: annuler
          </div>
        </form>
      </div>
    </div>
  )
} 