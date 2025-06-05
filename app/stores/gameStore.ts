import { create } from 'zustand'

export interface Command {
  id: string
  name: string
  description: string
  syntax: string
  unlocked: boolean
  used: boolean
}

export interface GameLocation {
  id: string
  name: string
  description: string
  x: number
  y: number
  files: string[]
  directories: string[]
  treasureChest?: {
    command: string
    unlocked: boolean
  }
}

export interface GameState {
  // Player state
  currentLocation: string
  currentPath: string
  playerName: string
  
  // Game progression
  level: number
  score: number
  timeStarted: number | null
  gameCompleted: boolean
  
  // Commands and inventory
  commands: Command[]
  unlockedCommands: string[]
  
  // Game world
  locations: GameLocation[]
  gameHistory: string[]
  
  // Actions
  setPlayerName: (name: string) => void
  setCurrentLocation: (locationId: string) => void
  setCurrentPath: (path: string) => void
  unlockCommand: (commandId: string) => void
  useCommand: (commandId: string) => void
  addToHistory: (entry: string) => void
  startGame: () => void
  completeGame: () => void
  resetGame: () => void
  updateScore: (points: number) => void
}

const initialCommands: Command[] = [
  {
    id: 'ls',
    name: 'ls',
    description: 'Liste le contenu du répertoire courant',
    syntax: 'ls [options] [répertoire]',
    unlocked: true,
    used: false
  },
  {
    id: 'cd',
    name: 'cd',
    description: 'Change de répertoire',
    syntax: 'cd [répertoire]',
    unlocked: true,
    used: false
  },
  {
    id: 'mkdir',
    name: 'mkdir',
    description: 'Crée un nouveau répertoire',
    syntax: 'mkdir [nom_répertoire]',
    unlocked: false,
    used: false
  },
  {
    id: 'touch',
    name: 'touch',
    description: 'Crée un nouveau fichier vide',
    syntax: 'touch [nom_fichier]',
    unlocked: false,
    used: false
  },
  {
    id: 'cat',
    name: 'cat',
    description: 'Affiche le contenu d\'un fichier',
    syntax: 'cat [nom_fichier]',
    unlocked: false,
    used: false
  },
  {
    id: 'cp',
    name: 'cp',
    description: 'Copie un fichier ou répertoire',
    syntax: 'cp [source] [destination]',
    unlocked: false,
    used: false
  },
  {
    id: 'mv',
    name: 'mv',
    description: 'Déplace ou renomme un fichier/répertoire',
    syntax: 'mv [source] [destination]',
    unlocked: false,
    used: false
  },
  {
    id: 'rm',
    name: 'rm',
    description: 'Supprime un fichier ou répertoire',
    syntax: 'rm [options] [fichier/répertoire]',
    unlocked: false,
    used: false
  }
]

const initialLocations: GameLocation[] = [
  {
    id: 'village',
    name: 'Village de Départ',
    description: '🏘️ Un paisible village où commence votre aventure. La place centrale est animée par les habitants qui vaquent à leurs occupations. Une fontaine murmure doucement au centre, entourée de maisons accueillantes et d\'ateliers d\'artisans. Un mystérieux coffre ancien attire votre attention...',
    x: 2,
    y: 2,
    files: ['bienvenue.txt', 'guide.txt', 'carte.txt', 'coffre_cd.sh'],
    directories: ['maison', 'boutique'],
    treasureChest: {
      command: 'cd',
      unlocked: false
    }
  },
  {
    id: 'foret',
    name: 'Forêt Mystique',
    description: '🌲 Une forêt dense et mystérieuse où les arbres centenaires murmurent des secrets anciens. La lumière filtrée par la canopée crée une atmosphère magique. Des sentiers serpentent entre les troncs massifs, menant vers des lieux inconnus. L\'air vibre d\'une énergie mystique qui semble receler des commandes oubliées.',
    x: 1,
    y: 1,
    files: ['parchemin.txt', 'carte.txt', 'coffre_mkdir.sh'],
    directories: ['grotte', 'clairiere'],
    treasureChest: {
      command: 'mkdir',
      unlocked: false
    }
  },
  {
    id: 'donjon',
    name: 'Donjon des Commandes',
    description: '🏰 Un donjon sombre et imposant taillé dans la roche noire. Des torches vacillantes éclairent les couloirs de pierre, projetant des ombres dansantes sur les murs gravés de commandes anciennes. L\'écho de vos pas résonne dans les profondeurs. Ici, seuls les plus courageux peuvent découvrir les commandes les plus puissantes.',
    x: 3,
    y: 1,
    files: ['tresor.txt', 'piege.txt', 'coffre_cat.sh'],
    directories: ['salle_secrete', 'arsenal'],
    treasureChest: {
      command: 'cat',
      unlocked: false
    }
  },
  {
    id: 'chateau',
    name: 'Château Final',
    description: '👑 Le majestueux château du Maître des Commandes se dresse devant vous dans toute sa splendeur. Ses tours élancées percent les nuages, et ses murs de marbre blanc brillent sous la lumière dorée. C\'est ici que réside la connaissance ultime des commandes CLI. Votre quête touche à sa fin.',
    x: 2,
    y: 0,
    files: ['couronne.txt', 'victoire.txt', 'coffre_rm.sh'],
    directories: ['trone', 'bibliotheque'],
    treasureChest: {
      command: 'rm',
      unlocked: false
    }
  }
]

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  currentLocation: 'village',
  currentPath: '/village',
  playerName: '',
  level: 1,
  score: 0,
  timeStarted: null,
  gameCompleted: false,
  commands: initialCommands,
  unlockedCommands: ['ls', 'cd'],
  locations: initialLocations,
  gameHistory: [],

  // Actions
  setPlayerName: (name: string) => set({ playerName: name }),
  
  setCurrentLocation: (locationId: string) => {
    const location = get().locations.find((loc: GameLocation) => loc.id === locationId)
    if (location) {
      set({ 
        currentLocation: locationId,
        currentPath: `/${locationId}`
      })
    }
  },
  
  setCurrentPath: (path: string) => set({ currentPath: path }),
  
  unlockCommand: (commandId: string) => {
    const state = get()
    const updatedCommands = state.commands.map((cmd: Command) => 
      cmd.id === commandId ? { ...cmd, unlocked: true } : cmd
    )
    const updatedUnlocked = [...state.unlockedCommands, commandId]
    
    set({ 
      commands: updatedCommands,
      unlockedCommands: updatedUnlocked,
      score: state.score + 100
    })
  },
  
  useCommand: (commandId: string) => {
    const state = get()
    const updatedCommands = state.commands.map((cmd: Command) => 
      cmd.id === commandId ? { ...cmd, used: true } : cmd
    )
    
    set({ 
      commands: updatedCommands,
      score: state.score + 10
    })
  },
  
  addToHistory: (entry: string) => {
    const state = get()
    set({ 
      gameHistory: [...state.gameHistory, entry].slice(-50) // Keep last 50 entries
    })
  },
  
  startGame: () => set({ 
    timeStarted: Date.now(),
    gameHistory: ['Welcome to CLIearn! Your adventure begins...']
  }),
  
  completeGame: () => {
    const state = get()
    const timeElapsed = state.timeStarted ? Date.now() - state.timeStarted : 0
    const timeBonus = Math.max(0, 1200000 - timeElapsed) / 1000 // Bonus for completing under 20 min
    
    set({ 
      gameCompleted: true,
      score: state.score + timeBonus
    })
  },
  
  resetGame: () => set({
    currentLocation: 'village',
    currentPath: '/village',
    level: 1,
    score: 0,
    timeStarted: null,
    gameCompleted: false,
    commands: initialCommands,
    unlockedCommands: ['ls', 'cd'],
    locations: initialLocations,
    gameHistory: []
  }),
  
  updateScore: (points: number) => {
    const state = get()
    set({ score: state.score + points })
  }
})) 