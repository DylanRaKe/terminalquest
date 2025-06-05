import { GameLocation } from '../stores/gameStore'

export interface TerminalResponse {
  output: string
  success: boolean
  commandUsed?: string
  locationChanged?: string
  treasureUnlocked?: string
  error?: string
}

export class TerminalEngine {
  private currentLocation: GameLocation
  private locations: GameLocation[]
  private unlockedCommands: string[]
  private currentSubLocation: string = '' // Track sub-locations like /village/maison
  private fileContents: Record<string, string> = {
    // Village principal
    'bienvenue.txt': 'Welcome to the Starting Village!\n\nThis peaceful village is the starting point of your quest to master CLI commands.\nAround you, you can see:\n- A welcoming house with smoke coming from the chimney\n- A blacksmith shop glowing with forge fires\n- A mysterious chest that seems to be waiting for something...\n\nUse "ls" to explore in detail, "cd maison" to enter your home!',
    
    'guide.txt': 'Village Survival Guide:\n\nBASIC COMMANDS:\n- ls : see what surrounds you (functionality varies by location!)\n- cd : travel to a new place\n- cat : read ancient scrolls\n- ./coffre_*.sh : execute chest scripts to learn\n\nPLACES TO EXPLORE:\n- maison/ : Your home, full of memories\n- boutique/ : The blacksmith workshop, source of tools\n\nOUTER WORLD:\n- foret : The mystical forest with hidden secrets\n- donjon : The terrifying command dungeon\n- chateau : Final destination of your quest',
    
    'carte.txt': 'Detailed map of CLIearn world:\n\nStarting Village (2,2) - YOU ARE HERE\n├── maison/ - Your warm home\n├── boutique/ - Master craftsman forge\n└── Mysterious chest (command: cd)\n\nMystical Forest (1,1) - Ancient secrets\n├── grotte/ - Deep caverns\n├── clairiere/ - Meditation place\n└── Creation chest (command: mkdir)\n\nCommand Dungeon (3,1) - Trials\n├── salle_secrete/ - Hidden mysteries\n├── arsenal/ - Command weapons\n└── Reading chest (command: cat)\n\nFinal Castle (2,0) - Eternal glory\n├── trone/ - Seat of power\n├── bibliotheque/ - Ultimate knowledge\n└── Destruction chest (command: rm)',
    
    'coffre_cd.sh': '#!/bin/bash\n# Script du Coffre de Navigation du Village\necho "🎉 Vous avez déjà maîtrisé la commande cd !"\necho "💡 Utilisez: cd <lieu> pour voyager"\necho "🏠 Dans le village: cd maison, cd boutique"\necho "🗺️ Vers le monde: cd foret, cd donjon, cd chateau"\necho "📍 Astuce: Vous pouvez aussi faire cd .. pour revenir en arrière !"',

    // Maison
    'journal.txt': '📔 Journal Personnel - Entrée du jour\n\n"Aujourd\'hui marque le début de ma grande aventure dans l\'univers CLI !\nJ\'ai quitté ma vie tranquille pour apprendre les mystérieuses commandes qui régissent ce monde numérique.\n\nMa mère m\'a dit : \'Souviens-toi, chaque commande a son but. ls pour observer, cd pour voyager, cat pour comprendre.\'\n\nDemain, j\'explorerai la boutique du forgeron. On dit qu\'il connaît des secrets sur les outils de création..."\n\n💭 Note: N\'oubliez pas de lire la lettre_maman.txt !',
    
    'lettre_maman.txt': '💌 Lettre de Maman\n\n"Mon cher enfant,\n\nJe suis si fière que tu aies décidé de partir à l\'aventure pour apprendre les commandes CLI !\n\nVoici quelques conseils de ta vieille maman :\n\n🔍 Toujours observer avant d\'agir (ls est ton ami !)\n📖 Lire tous les parchemins que tu trouves (cat révèle des secrets)\n🗂️ Organiser tes affaires (mkdir et touch sont précieux)\n⚠️ Être prudent avec rm (destruction irréversible !)\n\nTa chambre est toujours là si tu veux te reposer.\nLa cuisine a de quoi te sustenter.\n\nAvec tout mon amour,\nMaman 💕\n\nP.S. : J\'ai laissé des surprises dans ta chambre..."',
    
    'recettes.txt': '👩‍🍳 Recettes de Grand-Mère\n\n🍲 SOUPE DE COMMANDES :\nIngrédients :\n- 1 tasse de ls (pour voir ce qu\'on a)\n- 2 cuillères de cd (pour naviguer)\n- 1 pincée de mkdir (pour organiser)\n- Assaisonnement de cat (pour comprendre)\n\nPréparation :\n1. Commencer par ls pour inventorier\n2. cd vers le bon répertoire\n3. mkdir pour préparer l\'espace\n4. cat pour lire les instructions\n5. Déguster avec modération !\n\n🎂 GÂTEAU DE LA RÉUSSITE :\nSe déguste après avoir ouvert tous les coffres du monde !\n\n💡 "Une bonne recette, comme une bonne commande, demande de la patience et de la précision." - Grand-Mère',
    
    'photo_famille.txt': '📷 Album Photo de Famille\n\n👨‍👩‍👧‍👦 PHOTOS DE FAMILLE :\n\n📸 Photo 1 : Premier jour d\'école CLI\n"Moi, tout petit, avec mon premier terminal. Papa m\'apprenait \'ls\'.\nJe ne comprenais pas pourquoi il fallait dire \'bonjour\' aux fichiers !"\n\n📸 Photo 2 : Remise de diplôme de Papa\n"Papa recevant sa certification \'Maître des Commandes\' du Château.\nIl était si fier ! Maintenant c\'est mon tour..."\n\n📸 Photo 3 : Grand-Mère et ses recettes\n"Grand-Mère dans sa cuisine, entourée de ses fameux parchemins de recettes.\nElle disait toujours : \'Cuisiner et programmer, c\'est pareil : il faut suivre la recette !\'"\n\n📸 Photo 4 : Dernier Noël ensemble\n"Toute la famille réunie. Bientôt, j\'aurai mes propres aventures à raconter !"\n\n💝 Ces souvenirs me donnent courage pour continuer !',

    // Boutique
    'inventaire.txt': '⚒️ Inventaire de la Forge\n\n🔨 OUTILS DISPONIBLES :\n- Marteau de Création (mkdir) - 50 pièces d\'or\n- Ciseau de Précision (touch) - 30 pièces d\'or\n- Loupe de Lecture (cat) - 40 pièces d\'or\n- Gants de Manipulation (cp, mv) - 75 pièces d\'or\n- Épée de Destruction (rm) - 100 pièces d\'or ⚠️\n\n💰 "Chaque outil a son prix, jeune aventurier !\nMais ici, on paie en connaissance, pas en or."\n- Maître Forgeron\n\n🎯 CONSEIL : Maîtrisez d\'abord les outils simples avant les plus puissants !',
    
    'commandes.txt': '📜 Catalogue des Commandes CLI\n\n🎓 NIVEAU DÉBUTANT :\n• ls - L\'œil qui voit tout (liste les fichiers)\n• cd - Les jambes qui marchent (change de répertoire)\n• cat - La voix qui lit (affiche le contenu)\n\n🎓 NIVEAU INTERMÉDIAIRE :\n• mkdir - Les mains qui créent (fait des dossiers)\n• touch - Le doigt magique (crée des fichiers)\n• cp - Le double parfait (copie des fichiers)\n\n🎓 NIVEAU AVANCÉ :\n• mv - Le déménageur (déplace/renomme)\n• rm - Le destructeur ⚠️ (supprime définitivement)\n\n💡 "Chaque commande est un outil. Un artisan ne vaut que par sa maîtrise de ses outils."\n- Maître Forgeron\n\n🏆 Conseil : Pratiquez dans l\'ordre ! Ne sautez pas d\'étapes !',
    
    'certifications.txt': '🎖️ Certificats de Maîtrise CLI\n\n📜 DIPLÔMES DÉCERNÉS PAR LA FORGE :\n\n🥉 Certificat Bronze - "Explorateur"\n✓ Maîtrise de ls et cd\n✓ Navigation de base\n✓ Lecture de fichiers simples\n\n🥈 Certificat Argent - "Créateur"\n✓ Création de fichiers et dossiers\n✓ Organisation de l\'espace de travail\n✓ Manipulation de base\n\n🥇 Certificat Or - "Maître Artisan"\n✓ Toutes les commandes maîtrisées\n✓ Capable d\'enseigner aux autres\n✓ Prêt pour les défis du monde réel\n\n🏆 "Un vrai maître CLI n\'est pas celui qui connaît toutes les commandes,\nmais celui qui sait laquelle utiliser au bon moment."\n- Devise de la Forge\n\n🎯 Votre objectif : Atteindre le Certificat Or !',

    // Anciens contenus (conservés)
    'parchemin.txt': '🗞️ "Pour ouvrir le coffre mystique, naviguez vers la grotte avec cd grotte"',
    'tresor.txt': '💎 Un trésor scintillant ! Vous avez trouvé des gemmes de sagesse.',
    'piege.txt': '⚠️ Attention ! Ce fichier était piégé, mais vous l\'avez désamorcé avec cat.',
    'couronne.txt': '👑 La couronne du maître des commandes ! Vous êtes maintenant un expert CLI.',
    'victoire.txt': '🎉 FÉLICITATIONS ! Vous avez maîtrisé l\'art des commandes. Votre quête est terminée !',
    'coffre_mkdir.sh': '#!/bin/bash\n# Script du Coffre de Création\necho "💰 COFFRE OUVERT !"\necho "🎉 Vous avez appris les commandes: mkdir et touch"\necho "📁 mkdir <nom> : créer des dossiers"\necho "📄 touch <nom> : créer des fichiers"',
    'coffre_cat.sh': '#!/bin/bash\n# Script du Coffre de Lecture\necho "💰 COFFRE OUVERT !"\necho "🎉 Vous avez appris les commandes: cat et cp"\necho "📖 cat <fichier> : lire le contenu"\necho "📋 cp <source> <dest> : copier des fichiers"',
    'coffre_rm.sh': '#!/bin/bash\n# Script du Coffre de Destruction\necho "💰 COFFRE FINAL OUVERT !"\necho "🎉 Vous avez appris les commandes: rm et mv"\necho "🗑️ rm <fichier> : supprimer des fichiers"\necho "🔄 mv <source> <dest> : déplacer/renommer"\necho "👑 Vous êtes maintenant un MAÎTRE des commandes CLI !"'
  }

  constructor(
    currentLocation: GameLocation,
    locations: GameLocation[],
    unlockedCommands: string[]
  ) {
    this.currentLocation = currentLocation
    this.locations = locations
    this.unlockedCommands = unlockedCommands
  }

  setSubLocation(subLocation: string) {
    this.currentSubLocation = subLocation
  }

  executeCommand(input: string): TerminalResponse {
    const trimmedInput = input.trim()
    if (!trimmedInput) {
      return { output: '', success: false, error: 'Commande vide' }
    }

    const [command, ...args] = trimmedInput.split(' ')
    
    // Handle script execution (./script.sh) - always available
    if (trimmedInput.startsWith('./') && trimmedInput.endsWith('.sh')) {
      return this.handleScript(trimmedInput)
    }

    // Check if command is unlocked
    if (!this.unlockedCommands.includes(command)) {
      return {
        output: `❌ Commande "${command}" non disponible. Trouvez d'abord le coffre qui la contient !`,
        success: false,
        error: 'Command not unlocked'
      }
    }

    switch (command) {
      case 'ls':
        return this.handleLs()
      case 'cd':
        return this.handleCd(args)
      case 'cat':
        return this.handleCat(args)
      case 'mkdir':
        return this.handleMkdir(args)
      case 'touch':
        return this.handleTouch(args)
      case 'cp':
        return this.handleCp(args)
      case 'mv':
        return this.handleMv(args)
      case 'rm':
        return this.handleRm(args)
      case 'help':
        return this.handleHelp()
      default:
        return {
          output: `❌ Commande "${command}" non reconnue. Tapez "help" pour voir les commandes disponibles.`,
          success: false,
          error: 'Unknown command'
        }
    }
  }

  private handleLs(): TerminalResponse {
    // Contextual ls based on current location and sub-location
    if (this.currentSubLocation) {
      return this.handleSubLocationLs()
    }

    let output = ''
    
    // Show directories first (like real ls)
    if (this.currentLocation.directories.length > 0) {
      this.currentLocation.directories.forEach(dir => {
        output += `${dir}/\n`
      })
    }

    // Show files
    if (this.currentLocation.files.length > 0) {
      this.currentLocation.files.forEach(file => {
        if (file.endsWith('.sh')) {
          output += `${file}*\n`  // Executable files marked with *
        } else {
          output += `${file}\n`
        }
      })
    }

    // Show treasure chest hint if present (but in terminal style)
    if (this.currentLocation.treasureChest && !this.currentLocation.treasureChest.unlocked) {
      output += `\n# Hint: Try using the '${this.currentLocation.treasureChest.command}' command\n`
    }

    return { output: output.trim(), success: true, commandUsed: 'ls' }
  }

  private handleSubLocationLs(): TerminalResponse {
    let output = ''
    
    switch (this.currentSubLocation) {
      case 'maison':
        // Show sub-directories first
        output += 'chambre/\n'
        output += 'cuisine/\n'
        output += 'salon/\n'
        
        // Show files
        output += 'journal.txt\n'
        output += 'lettre_maman.txt\n'
        output += 'recettes.txt\n'
        output += 'photo_famille.txt\n'
        break
        
      case 'boutique':
        // Show sub-directories first
        output += 'atelier/\n'
        output += 'stockage/\n'
        output += 'vitrine/\n'
        
        // Show files
        output += 'inventaire.txt\n'
        output += 'commandes.txt\n'
        output += 'certifications.txt\n'
        break
        
      default:
        output = `ls: cannot access '${this.currentSubLocation}': No such file or directory`
    }

    return { output: output.trim(), success: true, commandUsed: 'ls' }
  }

  private handleCd(args: string[]): TerminalResponse {
    if (args.length === 0) {
      return {
        output: 'cd: missing operand',
        success: false,
        error: 'Missing argument'
      }
    }

    const target = args[0]

    // Handle going back (..)
    if (target === '..') {
      if (this.currentSubLocation) {
        this.currentSubLocation = ''
        return {
          output: '',
          success: true,
          commandUsed: 'cd'
        }
      } else {
        return {
          output: 'cd: ..: No such file or directory',
          success: false,
          error: 'Already at root'
        }
      }
    }

    // Check if it's a directory in current location
    if (this.currentLocation.directories.includes(target)) {
      this.currentSubLocation = target

      // Check for treasure chest unlock
      if (this.currentLocation.treasureChest && 
          this.currentLocation.treasureChest.command === 'cd' &&
          !this.currentLocation.treasureChest.unlocked) {
        return {
          output: '# Achievement unlocked: New commands available!',
          success: true,
          commandUsed: 'cd',
          treasureUnlocked: 'mkdir'
        }
      }

      return {
        output: '',
        success: true,
        commandUsed: 'cd'
      }
    }

    // Check if it's a location name for world navigation
    const targetLocation = this.locations.find(loc => 
      loc.id === target || loc.name.toLowerCase().includes(target.toLowerCase())
    )

    if (targetLocation) {
      this.currentSubLocation = '' // Reset sub-location when traveling
      return {
        output: `# Traveling to ${targetLocation.name}...`,
        success: true,
        commandUsed: 'cd',
        locationChanged: targetLocation.id
      }
    }

    return {
      output: `cd: ${target}: No such file or directory`,
      success: false,
      error: 'Directory not found'
    }
  }

  private handleCat(args: string[]): TerminalResponse {
    if (args.length === 0) {
      return {
        output: 'cat: missing operand',
        success: false,
        error: 'Missing argument'
      }
    }

    const filename = args[0]

    // Check if we're in a sub-location
    if (this.currentSubLocation) {
      const subLocationFiles = this.getSubLocationFiles()
      if (!subLocationFiles.includes(filename)) {
        return {
          output: `cat: ${filename}: No such file or directory`,
          success: false,
          error: 'File not found'
        }
      }
    } else {
      // Check main location files
      if (!this.currentLocation.files.includes(filename)) {
        return {
          output: `cat: ${filename}: No such file or directory`,
          success: false,
          error: 'File not found'
        }
      }
    }

    const content = this.fileContents[filename] || `# Content of ${filename}\n(File is empty or content not defined)`

    // Check for treasure chest unlock (only in main location)
    if (!this.currentSubLocation && this.currentLocation.treasureChest && 
        this.currentLocation.treasureChest.command === 'cat' &&
        !this.currentLocation.treasureChest.unlocked) {
      return {
        output: `${content}\n\n# Achievement unlocked: New commands available!`,
        success: true,
        commandUsed: 'cat',
        treasureUnlocked: 'cp,touch'
      }
    }

    return {
      output: content,
      success: true,
      commandUsed: 'cat'
    }
  }

  private getSubLocationFiles(): string[] {
    switch (this.currentSubLocation) {
      case 'maison':
        return ['journal.txt', 'lettre_maman.txt', 'recettes.txt', 'photo_famille.txt']
      case 'boutique':
        return ['inventaire.txt', 'commandes.txt', 'certifications.txt']
      default:
        return []
    }
  }

  private handleMkdir(args: string[]): TerminalResponse {
    if (args.length === 0) {
      return {
        output: 'mkdir: missing operand',
        success: false,
        error: 'Missing argument'
      }
    }

    // Check for treasure chest unlock
    if (this.currentLocation.treasureChest && 
        this.currentLocation.treasureChest.command === 'mkdir' &&
        !this.currentLocation.treasureChest.unlocked) {
      return {
        output: `# Achievement unlocked: New commands available!`,
        success: true,
        commandUsed: 'mkdir',
        treasureUnlocked: 'touch'
      }
    }

    return {
      output: '',
      success: true,
      commandUsed: 'mkdir'
    }
  }

  private handleTouch(args: string[]): TerminalResponse {
    if (args.length === 0) {
      return {
        output: 'touch: missing operand',
        success: false,
        error: 'Missing argument'
      }
    }

    return {
      output: '',
      success: true,
      commandUsed: 'touch'
    }
  }

  private handleCp(args: string[]): TerminalResponse {
    if (args.length < 2) {
      return {
        output: 'cp: missing destination file operand',
        success: false,
        error: 'Missing arguments'
      }
    }

    return {
      output: '',
      success: true,
      commandUsed: 'cp'
    }
  }

  private handleMv(args: string[]): TerminalResponse {
    if (args.length < 2) {
      return {
        output: 'mv: missing destination file operand',
        success: false,
        error: 'Missing arguments'
      }
    }

    // Check for treasure chest unlock
    if (this.currentLocation.treasureChest && 
        this.currentLocation.treasureChest.command === 'mv' &&
        !this.currentLocation.treasureChest.unlocked) {
      return {
        output: `# Achievement unlocked: New commands available!`,
        success: true,
        commandUsed: 'mv',
        treasureUnlocked: 'rm'
      }
    }

    return {
      output: '',
      success: true,
      commandUsed: 'mv'
    }
  }

  private handleRm(args: string[]): TerminalResponse {
    if (args.length === 0) {
      return {
        output: 'rm: missing operand',
        success: false,
        error: 'Missing argument'
      }
    }

    // Check for treasure chest unlock (final command)
    if (this.currentLocation.treasureChest && 
        this.currentLocation.treasureChest.command === 'rm' &&
        !this.currentLocation.treasureChest.unlocked) {
      return {
        output: `# CONGRATULATIONS! You have mastered all CLI commands!`,
        success: true,
        commandUsed: 'rm',
        treasureUnlocked: 'master'
      }
    }

    return {
      output: '',
      success: true,
      commandUsed: 'rm'
    }
  }

  private handleHelp(): TerminalResponse {
    let output = 'Available commands:\n\n'
    
    this.unlockedCommands.forEach(cmd => {
      switch (cmd) {
        case 'ls':
          output += 'ls                    list directory contents\n'
          break
        case 'cd':
          output += 'cd <directory>        change directory\n'
          break
        case 'cat':
          output += 'cat <file>            display file contents\n'
          break
        case 'mkdir':
          output += 'mkdir <directory>     create directory\n'
          break
        case 'touch':
          output += 'touch <file>          create empty file\n'
          break
        case 'cp':
          output += 'cp <source> <dest>    copy files\n'
          break
        case 'mv':
          output += 'mv <source> <dest>    move/rename files\n'
          break
        case 'rm':
          output += 'rm <file>             remove files\n'
          break
      }
    })

    return { output, success: true }
  }

  private handleScript(scriptPath: string): TerminalResponse {
    const scriptName = scriptPath.replace('./', '')
    
    if (!this.currentLocation.files.includes(scriptName)) {
      return {
        output: `bash: ${scriptPath}: No such file or directory`,
        success: false,
        error: 'Script not found'
      }
    }

    const content = this.fileContents[scriptName]
    if (!content) {
      return {
        output: `bash: ${scriptPath}: Permission denied`,
        success: false,
        error: 'Script execution failed'
      }
    }

    // Extract the command to unlock from script name
    const commandMatch = scriptName.match(/coffre_(\w+)\.sh/)
    if (commandMatch) {
      const primaryCommand = commandMatch[1]
      
      // Special case for cd (already unlocked)
      if (primaryCommand === 'cd') {
        return {
          output: '# You already have the cd command!\n# Use: cd <location> to travel\n# Available: maison, boutique, foret, donjon, chateau',
          success: true,
          commandUsed: 'script'
        }
      }
      
      // Define command groups
      let commandsToUnlock = [primaryCommand]
      if (primaryCommand === 'mkdir') {
        commandsToUnlock = ['mkdir', 'touch']
      } else if (primaryCommand === 'cat') {
        commandsToUnlock = ['cat', 'cp']
      } else if (primaryCommand === 'rm') {
        commandsToUnlock = ['rm', 'mv']
      }
      
      // For other commands, unlock them
      return {
        output: `# TREASURE CHEST OPENED!\n# New commands unlocked: ${commandsToUnlock.join(', ')}`,
        success: true,
        commandUsed: 'script',
        treasureUnlocked: commandsToUnlock.join(',') // Multiple commands separated by comma
      }
    }

    // Regular script execution - clean output
    const lines = content.split('\n')
    const cleanOutput = lines
      .filter(line => line.trim().startsWith('echo'))
      .map(line => {
        const match = line.match(/echo\s+"(.+)"/)
        if (match) {
          return match[1]
            .replace(/🎉/g, '#')
            .replace(/💰/g, '#')
            .replace(/💡/g, '#')
            .replace(/🗺️/g, '#')
            .replace(/📁/g, '')
            .replace(/📄/g, '')
            .replace(/📋/g, '')
            .replace(/🔄/g, '')
            .replace(/🗑️/g, '')
            .replace(/👑/g, '#')
        }
        return line
      })
      .join('\n')

    return {
      output: cleanOutput,
      success: true,
      commandUsed: 'script'
    }
  }
} 