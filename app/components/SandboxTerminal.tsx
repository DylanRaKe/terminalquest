'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { SandboxEngine, SandboxResponse } from '../lib/sandboxEngine'
import { useResponsive, useTouchDevice, useReducedMotion } from '../hooks/useResponsive'
import { VirtualKeyboard } from './VirtualKeyboard'
import { Keyboard } from 'lucide-react'

interface TerminalLine {
  type: 'command' | 'output' | 'error' | 'suggestion'
  content: string
  directory?: string
}

export function SandboxTerminal() {
  const [engine] = useState(() => new SandboxEngine())
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: 'output',
      content: '🎯 Bienvenue dans le Mode Entraînement TerminalQuest!'
    },
    {
      type: 'output', 
      content: 'Tapez "help" pour voir les commandes disponibles.'
    },
    {
      type: 'output',
      content: ''
    }
  ])
  const [currentCommand, setCurrentCommand] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentDirectory, setCurrentDirectory] = useState('/home/user')
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false)
  
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Hooks pour la responsivité
  const { isMobile, isTablet, windowSize } = useResponsive()
  const { isTouchDevice } = useTouchDevice()
  const { prefersReducedMotion } = useReducedMotion()

  useEffect(() => {
    // Auto-focus sur l'input
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    // Auto-scroll vers le bas
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  const handleCommand = (command: string) => {
    if (!command.trim()) return

    // Ajouter la commande à l'affichage
    const newLines: TerminalLine[] = [
      ...lines,
      {
        type: 'command',
        content: command,
        directory: currentDirectory
      }
    ]

    // Exécuter la commande
    const response: SandboxResponse = engine.executeCommand(command)

    // Gérer la commande clear
    if (response.output.includes('CLEAR_TERMINAL')) {
      setLines([])
      setCurrentDirectory(response.currentDirectory)
      setCurrentCommand('')
      setHistoryIndex(-1)
      return
    }

    // Ajouter la sortie
    if (response.output.length > 0) {
      response.output.forEach(line => {
        newLines.push({
          type: 'output',
          content: line
        })
      })
    }

    // Ajouter l'erreur si présente
    if (response.error) {
      newLines.push({
        type: 'error',
        content: response.error
      })
    }

    // Ajouter la suggestion si présente
    if (response.suggestion) {
      newLines.push({
        type: 'suggestion',
        content: `💡 ${response.suggestion}`
      })
    }

    // Ajouter une ligne vide pour l'espacement
    newLines.push({
      type: 'output',
      content: ''
    })

    setLines(newLines)
    setCurrentDirectory(response.currentDirectory)
    setCurrentCommand('')
    setHistoryIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const history = engine.getCommandHistory()

    if (e.key === 'Enter') {
      e.preventDefault()
      handleCommand(currentCommand)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentCommand(history[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= history.length) {
          setHistoryIndex(-1)
          setCurrentCommand('')
        } else {
          setHistoryIndex(newIndex)
          setCurrentCommand(history[newIndex])
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Auto-complétion basique
      const availableCommands = ['ls', 'cd', 'pwd', 'cat', 'mkdir', 'touch', 'rm', 'cp', 'mv', 'find', 'grep', 'echo', 'history', 'clear', 'help']
      const matches = availableCommands.filter(cmd => cmd.startsWith(currentCommand))
      if (matches.length === 1) {
        setCurrentCommand(matches[0])
      }
    }
  }

  const getPrompt = () => {
    const shortPath = currentDirectory === '/home/user' ? '~' : currentDirectory
    return `user@terminalquest:${shortPath}$`
  }

  const renderLine = (line: TerminalLine, index: number) => {
    switch (line.type) {
      case 'command':
        return (
          <div key={index} className="flex items-start gap-2">
            <span className="text-green-400 font-mono text-sm">
              {line.directory === '/home/user' ? 'user@terminalquest:~$' : `user@terminalquest:${line.directory}$`}
            </span>
            <span className="text-white font-mono text-sm">{line.content}</span>
          </div>
        )
      case 'output':
        return (
          <div key={index} className="text-gray-300 font-mono text-sm whitespace-pre-wrap">
            {line.content}
          </div>
        )
      case 'error':
        return (
          <div key={index} className="text-red-400 font-mono text-sm">
            {line.content}
          </div>
        )
      case 'suggestion':
        return (
          <div key={index} className="text-yellow-400 font-mono text-sm italic">
            {line.content}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black rounded-lg border border-gray-700 h-full flex flex-col"
    >
      {/* Terminal Header */}
      <div className="bg-gray-800 rounded-t-lg px-4 py-2 flex items-center gap-2 border-b border-gray-700">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-gray-400 text-sm font-mono ml-4">
          TerminalQuest - Mode Entraînement
        </span>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Lines */}
        <div className="space-y-1">
          {lines.map((line, index) => renderLine(line, index))}
        </div>

        {/* Current Input Line */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-green-400 font-mono text-sm">
            {getPrompt()}
          </span>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-white font-mono text-sm outline-none w-full"
              placeholder="Tapez une commande..."
              autoComplete="off"
              spellCheck={false}
            />
            {/* Cursor */}
            <div className="absolute top-0 bg-white w-2 h-5 opacity-75 animate-pulse" 
                 style={{ left: `${currentCommand.length * 0.6}em` }} />
          </div>
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="bg-gray-800 rounded-b-lg px-4 py-2 border-t border-gray-700">
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>Utilisez ↑↓ pour l'historique, Tab pour l'auto-complétion</span>
          <span>{currentDirectory}</span>
        </div>
      </div>
    </motion.div>
  )
} 