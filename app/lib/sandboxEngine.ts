export interface SandboxResponse {
  output: string[]
  error?: string
  suggestion?: string
  commandValid: boolean
  currentDirectory: string
  fileSystem: FileSystemNode
}

export interface FileSystemNode {
  name: string
  type: 'file' | 'directory'
  content?: string
  children?: FileSystemNode[]
  permissions?: string
  size?: number
  modified?: string
}

export class SandboxEngine {
  private currentDirectory: string = '/home/user'
  private commandHistory: string[] = []
  private fileSystem: FileSystemNode

  constructor() {
    this.fileSystem = this.createInitialFileSystem()
  }

  private createInitialFileSystem(): FileSystemNode {
    return {
      name: '/',
      type: 'directory',
      children: [
        {
          name: 'home',
          type: 'directory',
          children: [
            {
              name: 'user',
              type: 'directory',
              children: [
                {
                  name: 'documents',
                  type: 'directory',
                  children: [
                    {
                      name: 'readme.txt',
                      type: 'file',
                      content: 'Bienvenue dans TerminalQuest!\nCe fichier contient des informations utiles.',
                      permissions: '-rw-r--r--',
                      size: 89,
                      modified: '2024-12-01 10:30'
                    },
                    {
                      name: 'script.sh',
                      type: 'file',
                      content: '#!/bin/bash\necho "Hello from script!"',
                      permissions: '-rwxr-xr-x',
                      size: 45,
                      modified: '2024-12-01 09:15'
                    }
                  ]
                },
                {
                  name: 'projects',
                  type: 'directory',
                  children: [
                    {
                      name: 'website',
                      type: 'directory',
                      children: [
                        {
                          name: 'index.html',
                          type: 'file',
                          content: '<html><body><h1>Mon Site Web</h1></body></html>',
                          permissions: '-rw-r--r--',
                          size: 52,
                          modified: '2024-11-30 14:20'
                        }
                      ]
                    }
                  ]
                },
                {
                  name: '.bashrc',
                  type: 'file',
                  content: '# Configuration bash\nexport PATH=$PATH:/usr/local/bin',
                  permissions: '-rw-r--r--',
                  size: 58,
                  modified: '2024-11-29 16:45'
                }
              ]
            }
          ]
        },
        {
          name: 'etc',
          type: 'directory',
          children: [
            {
              name: 'passwd',
              type: 'file',
              content: 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash',
              permissions: '-rw-r--r--',
              size: 78,
              modified: '2024-11-28 12:00'
            }
          ]
        },
        {
          name: 'tmp',
          type: 'directory',
          children: []
        }
      ]
    }
  }

  executeCommand(command: string): SandboxResponse {
    const trimmedCommand = command.trim()
    if (!trimmedCommand) {
      return {
        output: [],
        commandValid: true,
        currentDirectory: this.currentDirectory,
        fileSystem: this.fileSystem
      }
    }

    this.commandHistory.push(trimmedCommand)
    const parts = trimmedCommand.split(' ')
    const cmd = parts[0]
    const args = parts.slice(1)

    try {
      switch (cmd) {
        case 'ls':
          return this.handleLs(args)
        case 'cd':
          return this.handleCd(args)
        case 'pwd':
          return this.handlePwd()
        case 'cat':
          return this.handleCat(args)
        case 'mkdir':
          return this.handleMkdir()
        case 'touch':
          return this.handleTouch()
        case 'rm':
          return this.handleRm()
        case 'cp':
          return this.handleCp()
        case 'mv':
          return this.handleMv()
        case 'find':
          return this.handleFind()
        case 'grep':
          return this.handleGrep()
        case 'echo':
          return this.handleEcho(args)
        case 'history':
          return this.handleHistory()
        case 'clear':
          return this.handleClear()
        case 'help':
          return this.handleHelp()
        default:
          return this.handleUnknownCommand(cmd)
      }
    } catch (error) {
      return {
        output: [],
        error: `Erreur lors de l'exécution de la commande: ${error}`,
        commandValid: false,
        currentDirectory: this.currentDirectory,
        fileSystem: this.fileSystem
      }
    }
  }

  private handleLs(args: string[]): SandboxResponse {
    const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al')
    const longFormat = args.includes('-l') || args.includes('-la') || args.includes('-al')
    
    const currentNode = this.getCurrentDirectoryNode()
    if (!currentNode || currentNode.type !== 'directory') {
      return {
        output: [],
        error: 'Répertoire introuvable',
        commandValid: false,
        currentDirectory: this.currentDirectory,
        fileSystem: this.fileSystem
      }
    }

    const children = currentNode.children || []
    const filteredChildren = showHidden ? children : children.filter(child => !child.name.startsWith('.'))

    let output: string[] = []
    
    if (longFormat) {
      filteredChildren.forEach(child => {
        const permissions = child.permissions || (child.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--')
        const size = child.size || 0
        const modified = child.modified || '2024-12-01 12:00'
        const name = child.type === 'directory' ? `${child.name}/` : child.name
        output.push(`${permissions} 1 user user ${size.toString().padStart(8)} ${modified} ${name}`)
      })
    } else {
      const names = filteredChildren.map(child => 
        child.type === 'directory' ? `${child.name}/` : child.name
      )
      output = [names.join('  ')]
    }

    return {
      output,
      commandValid: true,
      currentDirectory: this.currentDirectory,
      fileSystem: this.fileSystem,
      suggestion: args.length === 0 ? "Essayez 'ls -la' pour voir tous les fichiers avec détails" : undefined
    }
  }

  private handleCd(args: string[]): SandboxResponse {
    if (args.length === 0) {
      this.currentDirectory = '/home/user'
      return {
        output: [],
        commandValid: true,
        currentDirectory: this.currentDirectory,
        fileSystem: this.fileSystem
      }
    }

    const targetPath = args[0]
    let newPath: string

    if (targetPath.startsWith('/')) {
      newPath = targetPath
    } else if (targetPath === '..') {
      const pathParts = this.currentDirectory.split('/').filter(p => p)
      pathParts.pop()
      newPath = '/' + pathParts.join('/')
      if (newPath === '/') newPath = '/'
    } else {
      newPath = this.currentDirectory === '/' ? `/${targetPath}` : `${this.currentDirectory}/${targetPath}`
    }

    const targetNode = this.getNodeByPath(newPath)
    if (!targetNode || targetNode.type !== 'directory') {
      return {
        output: [],
        error: `cd: ${targetPath}: Aucun fichier ou dossier de ce type`,
        commandValid: false,
        currentDirectory: this.currentDirectory,
        fileSystem: this.fileSystem
      }
    }

    this.currentDirectory = newPath
    return {
      output: [],
      commandValid: true,
      currentDirectory: this.currentDirectory,
      fileSystem: this.fileSystem,
      suggestion: "Utilisez 'ls' pour voir le contenu du répertoire"
    }
  }

  private handlePwd(): SandboxResponse {
    return {
      output: [this.currentDirectory],
      commandValid: true,
      currentDirectory: this.currentDirectory,
      fileSystem: this.fileSystem
    }
  }

  private handleCat(args: string[]): SandboxResponse {
    if (args.length === 0) {
      return {
        output: [],
        error: 'cat: nom de fichier manquant',
        commandValid: false,
        currentDirectory: this.currentDirectory,
        fileSystem: this.fileSystem,
        suggestion: "Utilisez 'cat nom_fichier' pour afficher le contenu"
      }
    }

    const fileName = args[0]
    const filePath = fileName.startsWith('/') ? fileName : `${this.currentDirectory}/${fileName}`
    const fileNode = this.getNodeByPath(filePath)

    if (!fileNode) {
      return {
        output: [],
        error: `cat: ${fileName}: Aucun fichier ou dossier de ce type`,
        commandValid: false,
        currentDirectory: this.currentDirectory,
        fileSystem: this.fileSystem
      }
    }

    if (fileNode.type !== 'file') {
      return {
        output: [],
        error: `cat: ${fileName}: Est un dossier`,
        commandValid: false,
        currentDirectory: this.currentDirectory,
        fileSystem: this.fileSystem
      }
    }

    const content = fileNode.content || ''
    return {
      output: content.split('\n'),
      commandValid: true,
      currentDirectory: this.currentDirectory,
      fileSystem: this.fileSystem
    }
  }

  private handleEcho(args: string[]): SandboxResponse {
    const text = args.join(' ')
    return {
      output: [text],
      commandValid: true,
      currentDirectory: this.currentDirectory,
      fileSystem: this.fileSystem
    }
  }

  private handleHistory(): SandboxResponse {
    const output = this.commandHistory.map((cmd, index) => `${index + 1}  ${cmd}`)
    return {
      output,
      commandValid: true,
      currentDirectory: this.currentDirectory,
      fileSystem: this.fileSystem
    }
  }

  private handleClear(): SandboxResponse {
    return {
      output: ['CLEAR_TERMINAL'],
      commandValid: true,
      currentDirectory: this.currentDirectory,
      fileSystem: this.fileSystem
    }
  }

  private handleHelp(): SandboxResponse {
    const helpText = [
      'Commandes disponibles dans le mode entraînement:',
      '',
      'Navigation:',
      '  ls [-la]     - Lister les fichiers et dossiers',
      '  cd [dir]     - Changer de répertoire',
      '  pwd          - Afficher le répertoire courant',
      '',
      'Fichiers:',
      '  cat file     - Afficher le contenu d\'un fichier',
      '  mkdir dir    - Créer un répertoire',
      '  touch file   - Créer un fichier vide',
      '  rm file      - Supprimer un fichier',
      '',
      'Utilitaires:',
      '  echo text    - Afficher du texte',
      '  history      - Historique des commandes',
      '  clear        - Effacer l\'écran',
      '  help         - Afficher cette aide',
      '',
      'Astuce: Utilisez les flèches ↑↓ pour naviguer dans l\'historique'
    ]

    return {
      output: helpText,
      commandValid: true,
      currentDirectory: this.currentDirectory,
      fileSystem: this.fileSystem
    }
  }

  private handleUnknownCommand(cmd: string): SandboxResponse {
    const suggestions = this.getSuggestions(cmd)
    return {
      output: [],
      error: `${cmd}: commande introuvable`,
      commandValid: false,
      currentDirectory: this.currentDirectory,
      fileSystem: this.fileSystem,
      suggestion: suggestions.length > 0 ? `Vouliez-vous dire: ${suggestions.join(', ')} ?` : "Tapez 'help' pour voir les commandes disponibles"
    }
  }

  private getSuggestions(cmd: string): string[] {
    const availableCommands = ['ls', 'cd', 'pwd', 'cat', 'mkdir', 'touch', 'rm', 'cp', 'mv', 'find', 'grep', 'echo', 'history', 'clear', 'help']
    return availableCommands.filter(command => 
      command.includes(cmd) || this.levenshteinDistance(cmd, command) <= 2
    ).slice(0, 3)
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = []
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    return matrix[str2.length][str1.length]
  }

  private getCurrentDirectoryNode(): FileSystemNode | null {
    return this.getNodeByPath(this.currentDirectory)
  }

  private getNodeByPath(path: string): FileSystemNode | null {
    if (path === '/') return this.fileSystem
    
    const parts = path.split('/').filter(p => p)
    let current = this.fileSystem
    
    for (const part of parts) {
      if (!current.children) return null
      const found = current.children.find(child => child.name === part)
      if (!found) return null
      current = found
    }
    
    return current
  }

  // Méthodes pour les commandes non encore implémentées
  private handleMkdir(): SandboxResponse {
    return {
      output: ['mkdir: fonctionnalité en cours de développement'],
      commandValid: true,
      currentDirectory: this.currentDirectory,
      fileSystem: this.fileSystem
    }
  }

  private handleTouch(): SandboxResponse {
    return {
      output: ['touch: fonctionnalité en cours de développement'],
      commandValid: true,
      currentDirectory: this.currentDirectory,
      fileSystem: this.fileSystem
    }
  }

  private handleRm(): SandboxResponse {
    return {
      output: ['rm: fonctionnalité en cours de développement'],
      commandValid: true,
      currentDirectory: this.currentDirectory,
      fileSystem: this.fileSystem
    }
  }

  private handleCp(): SandboxResponse {
    return {
      output: ['cp: fonctionnalité en cours de développement'],
      commandValid: true,
      currentDirectory: this.currentDirectory,
      fileSystem: this.fileSystem
    }
  }

  private handleMv(): SandboxResponse {
    return {
      output: ['mv: fonctionnalité en cours de développement'],
      commandValid: true,
      currentDirectory: this.currentDirectory,
      fileSystem: this.fileSystem
    }
  }

  private handleFind(): SandboxResponse {
    return {
      output: ['find: fonctionnalité en cours de développement'],
      commandValid: true,
      currentDirectory: this.currentDirectory,
      fileSystem: this.fileSystem
    }
  }

  private handleGrep(): SandboxResponse {
    return {
      output: ['grep: fonctionnalité en cours de développement'],
      commandValid: true,
      currentDirectory: this.currentDirectory,
      fileSystem: this.fileSystem
    }
  }

  getCommandHistory(): string[] {
    return [...this.commandHistory]
  }

  getCurrentDirectory(): string {
    return this.currentDirectory
  }
} 