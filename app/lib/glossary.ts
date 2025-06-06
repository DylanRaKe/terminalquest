import Fuse from 'fuse.js';

export interface GlossaryEntry {
  id: string;
  term: string;
  category: 'command' | 'concept' | 'option' | 'file-type' | 'shortcut' | 'pattern';
  shortDescription: string;
  fullDescription: string;
  syntax?: string;
  examples: {
    command: string;
    description: string;
    output?: string;
    interactive?: boolean;
    explanation?: string;
  }[];
  relatedTerms: string[];
  aliases?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  prerequisites?: string[];
  tips?: string[];
  warnings?: string[];
  useCases?: string[];
  cheatSheet?: {
    title: string;
    commands: { cmd: string; desc: string }[];
  };
}

export const glossaryEntries: GlossaryEntry[] = [
  // COMMANDES DE BASE
  {
    id: 'ls',
    term: 'ls',
    category: 'command',
    shortDescription: 'Liste le contenu d\'un répertoire',
    fullDescription: 'La commande ls (list) affiche la liste des fichiers et dossiers contenus dans un répertoire. C\'est l\'une des commandes les plus utilisées en ligne de commande pour explorer le système de fichiers.',
    syntax: 'ls [options] [répertoire]',
    examples: [
      {
        command: 'ls',
        description: 'Liste les fichiers du répertoire courant',
        output: 'Documents  Downloads  Pictures  Videos',
        interactive: true,
        explanation: 'Affiche uniquement les fichiers et dossiers visibles'
      },
      {
        command: 'ls -l',
        description: 'Affichage détaillé avec permissions, taille, date',
        output: 'drwxr-xr-x  5 user  staff   160 Dec 15 10:30 Documents',
        explanation: 'Format long avec toutes les métadonnées'
      },
      {
        command: 'ls -la',
        description: 'Inclut les fichiers cachés (commençant par .)',
        output: '.bashrc  .profile  Documents  Downloads',
        explanation: 'Le -a affiche TOUS les fichiers, y compris cachés'
      },
      {
        command: 'ls -lh',
        description: 'Tailles lisibles par l\'humain (K, M, G)',
        output: 'drwxr-xr-x  5 user  staff   160B Dec 15 10:30 Documents',
        explanation: 'Le -h rend les tailles plus compréhensibles'
      },
      {
        command: 'ls -lt',
        description: 'Tri par date de modification (plus récent en premier)',
        explanation: 'Utile pour voir les fichiers récemment modifiés'
      },
      {
        command: 'ls *.txt',
        description: 'Liste uniquement les fichiers .txt',
        output: 'readme.txt  notes.txt  config.txt',
        explanation: 'Utilise les wildcards pour filtrer'
      }
    ],
    relatedTerms: ['pwd', 'cd', 'find', 'tree', 'stat'],
    aliases: ['dir'],
    difficulty: 'beginner',
    tags: ['navigation', 'fichiers', 'listing', 'exploration'],
    tips: [
      'Utilisez ls -la pour voir tous les fichiers cachés',
      'ls -lh rend les tailles plus lisibles',
      'ls -lt trie par date de modification',
      'Combinez les options : ls -lath pour tout voir trié par date'
    ],
    useCases: [
      'Explorer le contenu d\'un dossier',
      'Vérifier les permissions de fichiers',
      'Trouver les fichiers récemment modifiés',
      'Lister des fichiers par extension'
    ],
    cheatSheet: {
      title: 'Options ls essentielles',
      commands: [
        { cmd: 'ls -l', desc: 'Format long détaillé' },
        { cmd: 'ls -a', desc: 'Inclut fichiers cachés' },
        { cmd: 'ls -h', desc: 'Tailles lisibles' },
        { cmd: 'ls -t', desc: 'Tri par date' },
        { cmd: 'ls -r', desc: 'Ordre inverse' },
        { cmd: 'ls -S', desc: 'Tri par taille' }
      ]
    }
  },

  {
    id: 'cd',
    term: 'cd',
    category: 'command',
    shortDescription: 'Change de répertoire courant',
    fullDescription: 'La commande cd (change directory) permet de naviguer dans l\'arborescence des fichiers en changeant le répertoire de travail courant. C\'est la commande de navigation principale en ligne de commande.',
    syntax: 'cd [répertoire]',
    examples: [
      {
        command: 'cd /home/user',
        description: 'Va au répertoire /home/user (chemin absolu)',
        explanation: 'Chemin absolu : commence par / et part de la racine'
      },
      {
        command: 'cd Documents',
        description: 'Va au dossier Documents (chemin relatif)',
        explanation: 'Chemin relatif : part du répertoire courant'
      },
      {
        command: 'cd ..',
        description: 'Remonte d\'un niveau dans l\'arborescence',
        interactive: true,
        explanation: '.. représente le répertoire parent'
      },
      {
        command: 'cd ~',
        description: 'Va au répertoire personnel de l\'utilisateur',
        explanation: '~ est un raccourci vers votre dossier home'
      },
      {
        command: 'cd -',
        description: 'Retourne au répertoire précédent',
        explanation: 'Très utile pour naviguer entre deux dossiers'
      },
      {
        command: 'cd',
        description: 'Va au répertoire personnel (équivalent à cd ~)',
        explanation: 'cd sans argument = retour à la maison'
      }
    ],
    relatedTerms: ['pwd', 'ls', 'mkdir', 'pushd', 'popd'],
    difficulty: 'beginner',
    tags: ['navigation', 'répertoire', 'déplacement'],
    tips: [
      'Utilisez la tabulation pour l\'autocomplétion des noms',
      'cd - pour alterner entre deux répertoires',
      'cd sans argument retourne toujours au home',
      'Utilisez pwd après cd pour confirmer votre position'
    ],
    useCases: [
      'Naviguer dans l\'arborescence de fichiers',
      'Aller rapidement au répertoire personnel',
      'Remonter dans l\'arborescence',
      'Alterner entre deux dossiers de travail'
    ],
    cheatSheet: {
      title: 'Raccourcis cd essentiels',
      commands: [
        { cmd: 'cd ~', desc: 'Répertoire personnel' },
        { cmd: 'cd ..', desc: 'Répertoire parent' },
        { cmd: 'cd -', desc: 'Répertoire précédent' },
        { cmd: 'cd /', desc: 'Racine du système' },
        { cmd: 'cd ../..', desc: 'Remonter 2 niveaux' }
      ]
    }
  },

  {
    id: 'pwd',
    term: 'pwd',
    category: 'command',
    shortDescription: 'Affiche le répertoire courant',
    fullDescription: 'La commande pwd (print working directory) affiche le chemin complet du répertoire dans lequel vous vous trouvez actuellement. Essentielle pour s\'orienter dans le système de fichiers.',
    syntax: 'pwd [options]',
    examples: [
      {
        command: 'pwd',
        description: 'Affiche le répertoire courant',
        output: '/home/user/Documents',
        interactive: true,
        explanation: 'Montre votre position exacte dans l\'arborescence'
      },
      {
        command: 'pwd -P',
        description: 'Affiche le chemin physique (résout les liens symboliques)',
        explanation: 'Utile quand vous travaillez avec des liens symboliques'
      }
    ],
    relatedTerms: ['cd', 'ls', 'realpath'],
    difficulty: 'beginner',
    tags: ['navigation', 'position', 'répertoire', 'orientation'],
    tips: [
      'Utilisez pwd quand vous êtes perdu dans l\'arborescence',
      'Combinez avec ls pour voir où vous êtes et ce qu\'il y a',
      'pwd -P résout les liens symboliques'
    ],
    useCases: [
      'Vérifier sa position dans l\'arborescence',
      'Confirmer le répertoire après navigation',
      'Débugger des scripts qui changent de répertoire',
      'Copier le chemin courant pour d\'autres commandes'
    ]
  },

  {
    id: 'mkdir',
    term: 'mkdir',
    category: 'command',
    shortDescription: 'Crée un ou plusieurs répertoires',
    fullDescription: 'La commande mkdir (make directory) permet de créer un ou plusieurs nouveaux répertoires. Elle peut créer des structures complexes d\'un coup avec l\'option -p.',
    syntax: 'mkdir [options] répertoire...',
    examples: [
      {
        command: 'mkdir nouveau_dossier',
        description: 'Crée un dossier nommé "nouveau_dossier"',
        interactive: true,
        explanation: 'Création simple d\'un répertoire'
      },
      {
        command: 'mkdir -p projet/src/components',
        description: 'Crée l\'arborescence complète si elle n\'existe pas',
        explanation: '-p crée tous les répertoires parents nécessaires'
      },
      {
        command: 'mkdir dossier1 dossier2 dossier3',
        description: 'Crée plusieurs dossiers en une seule commande',
        explanation: 'Création multiple en une fois'
      },
      {
        command: 'mkdir -m 755 public_folder',
        description: 'Crée avec des permissions spécifiques',
        explanation: '-m définit les permissions lors de la création'
      },
      {
        command: 'mkdir -v backup_$(date +%Y%m%d)',
        description: 'Crée un dossier avec la date du jour',
        explanation: 'Utilise la substitution de commande pour le nom'
      }
    ],
    relatedTerms: ['rmdir', 'rm', 'cd', 'ls', 'chmod'],
    difficulty: 'beginner',
    tags: ['création', 'répertoire', 'dossier', 'structure'],
    tips: [
      'Utilisez -p pour créer des arborescences complexes',
      'mkdir -v pour voir ce qui est créé',
      'Combinez avec date pour des noms uniques',
      'Vérifiez avec ls après création'
    ],
    warnings: [
      'mkdir échoue si le répertoire existe déjà (sans -p)',
      'Attention aux espaces dans les noms (utilisez des guillemets)'
    ],
    useCases: [
      'Organiser des projets avec des dossiers',
      'Créer des structures de sauvegarde',
      'Préparer l\'arborescence pour des scripts',
      'Organiser des téléchargements par catégorie'
    ],
    cheatSheet: {
      title: 'Options mkdir utiles',
      commands: [
        { cmd: 'mkdir -p', desc: 'Crée parents si nécessaire' },
        { cmd: 'mkdir -v', desc: 'Mode verbeux' },
        { cmd: 'mkdir -m', desc: 'Définit permissions' },
        { cmd: 'mkdir {a,b,c}', desc: 'Création multiple avec expansion' }
      ]
    }
  },

  {
    id: 'cat',
    term: 'cat',
    category: 'command',
    shortDescription: 'Affiche le contenu d\'un fichier',
    fullDescription: 'La commande cat (concatenate) affiche le contenu d\'un ou plusieurs fichiers. Elle peut aussi être utilisée pour créer, concaténer des fichiers ou rediriger du contenu.',
    syntax: 'cat [options] [fichier...]',
    examples: [
      {
        command: 'cat fichier.txt',
        description: 'Affiche le contenu de fichier.txt',
        output: 'Contenu du fichier...',
        interactive: true,
        explanation: 'Lecture simple d\'un fichier'
      },
      {
        command: 'cat fichier1.txt fichier2.txt',
        description: 'Affiche le contenu des deux fichiers bout à bout',
        explanation: 'Concaténation de plusieurs fichiers'
      },
      {
        command: 'cat -n fichier.txt',
        description: 'Affiche avec numérotation des lignes',
        output: '1  Première ligne\n2  Deuxième ligne',
        explanation: '-n ajoute les numéros de ligne'
      },
      {
        command: 'cat -A fichier.txt',
        description: 'Affiche tous les caractères, y compris invisibles',
        explanation: 'Utile pour débugger des problèmes de formatage'
      },
      {
        command: 'cat > nouveau.txt',
        description: 'Crée un nouveau fichier (Ctrl+D pour terminer)',
        explanation: 'Redirection pour créer du contenu'
      },
      {
        command: 'cat fichier1.txt fichier2.txt > fusion.txt',
        description: 'Fusionne deux fichiers dans un nouveau',
        explanation: 'Concaténation avec redirection'
      }
    ],
    relatedTerms: ['less', 'more', 'head', 'tail', 'echo', 'tac'],
    difficulty: 'beginner',
    tags: ['lecture', 'fichier', 'contenu', 'affichage', 'concaténation'],
    tips: [
      'Utilisez less ou more pour les gros fichiers',
      'cat -n pour numéroter les lignes',
      'cat -A pour voir les caractères invisibles',
      'Combinez avec grep pour filtrer : cat file.txt | grep "motif"'
    ],
    warnings: [
      'cat affiche tout d\'un coup, peut être illisible pour gros fichiers',
      'Attention à la redirection > qui écrase le fichier existant'
    ],
    useCases: [
      'Lire rapidement un petit fichier',
      'Fusionner plusieurs fichiers',
      'Créer des fichiers simples',
      'Débugger des problèmes de formatage'
    ],
    cheatSheet: {
      title: 'Options cat essentielles',
      commands: [
        { cmd: 'cat -n', desc: 'Numéroter les lignes' },
        { cmd: 'cat -A', desc: 'Montrer caractères invisibles' },
        { cmd: 'cat -s', desc: 'Supprimer lignes vides multiples' },
        { cmd: 'cat -b', desc: 'Numéroter lignes non-vides' }
      ]
    }
  },

  {
    id: 'grep',
    term: 'grep',
    category: 'command',
    shortDescription: 'Recherche des motifs dans du texte',
    fullDescription: 'La commande grep (global regular expression print) recherche des lignes contenant un motif spécifique dans un ou plusieurs fichiers. C\'est l\'outil de recherche textuelle le plus puissant en ligne de commande.',
    syntax: 'grep [options] motif [fichier...]',
    examples: [
      {
        command: 'grep "erreur" log.txt',
        description: 'Recherche le mot "erreur" dans log.txt',
        output: 'Ligne 45: Une erreur s\'est produite',
        interactive: true,
        explanation: 'Recherche simple et sensible à la casse'
      },
      {
        command: 'grep -i "ERROR" log.txt',
        description: 'Recherche insensible à la casse',
        explanation: '-i ignore la différence majuscules/minuscules'
      },
      {
        command: 'grep -n "TODO" *.txt',
        description: 'Recherche avec numéros de ligne dans tous les .txt',
        output: 'notes.txt:12: TODO: Finir le projet',
        explanation: '-n affiche le numéro de ligne de chaque résultat'
      },
      {
        command: 'grep -r "function" src/',
        description: 'Recherche récursive dans tous les fichiers du dossier src',
        explanation: '-r parcourt tous les sous-dossiers'
      },
      {
        command: 'ls -l | grep "^d"',
        description: 'Filtre pour n\'afficher que les répertoires',
        explanation: 'Utilise grep avec un pipe pour filtrer la sortie de ls'
      },
      {
        command: 'grep -v "commentaire" code.js',
        description: 'Affiche toutes les lignes SAUF celles contenant "commentaire"',
        explanation: '-v inverse la sélection'
      },
      {
        command: 'grep -E "^[0-9]+$" numbers.txt',
        description: 'Utilise les expressions régulières étendues',
        explanation: '-E active les regex étendues pour des motifs complexes'
      }
    ],
    relatedTerms: ['find', 'sed', 'awk', 'sort', 'cut', 'rg'],
    difficulty: 'intermediate',
    tags: ['recherche', 'filtrage', 'texte', 'motif', 'regex'],
    prerequisites: ['cat', 'ls'],
    tips: [
      'Utilisez -i pour ignorer la casse',
      'Combinez avec -n pour voir les numéros de ligne',
      'grep -r pour chercher dans tous les sous-dossiers',
      'Utilisez des guillemets pour les motifs avec espaces'
    ],
    warnings: [
      'grep est sensible à la casse par défaut',
      'Les caractères spéciaux dans les motifs doivent être échappés'
    ],
    useCases: [
      'Chercher des erreurs dans les logs',
      'Filtrer la sortie d\'autres commandes',
      'Trouver des fonctions dans le code',
      'Analyser des fichiers de configuration'
    ],
    cheatSheet: {
      title: 'Options grep essentielles',
      commands: [
        { cmd: 'grep -i', desc: 'Insensible à la casse' },
        { cmd: 'grep -n', desc: 'Affiche numéros de ligne' },
        { cmd: 'grep -r', desc: 'Recherche récursive' },
        { cmd: 'grep -v', desc: 'Inverse la sélection' },
        { cmd: 'grep -c', desc: 'Compte les occurrences' },
        { cmd: 'grep -l', desc: 'Affiche seulement noms fichiers' }
      ]
    }
  },

  {
    id: 'find',
    term: 'find',
    category: 'command',
    shortDescription: 'Recherche des fichiers et répertoires',
    fullDescription: 'La commande find recherche des fichiers et répertoires dans une arborescence selon différents critères (nom, taille, date, permissions, etc.).',
    syntax: 'find [chemin] [critères] [actions]',
    examples: [
      {
        command: 'find . -name "*.txt"',
        description: 'Trouve tous les fichiers .txt dans le répertoire courant',
        output: './documents/readme.txt\n./notes.txt'
      },
      {
        command: 'find /home -type d -name "Documents"',
        description: 'Trouve tous les dossiers nommés "Documents"',
      },
      {
        command: 'find . -size +1M',
        description: 'Trouve les fichiers de plus de 1 Mo',
      },
      {
        command: 'find . -mtime -7',
        description: 'Trouve les fichiers modifiés dans les 7 derniers jours',
      }
    ],
    relatedTerms: ['locate', 'grep', 'ls', 'which'],
    difficulty: 'intermediate',
    tags: ['recherche', 'fichiers', 'arborescence']
  },

  {
    id: 'touch',
    term: 'touch',
    category: 'command',
    shortDescription: 'Crée un fichier vide ou met à jour la date de modification',
    fullDescription: 'La commande touch crée un nouveau fichier vide s\'il n\'existe pas, ou met à jour la date de dernière modification s\'il existe déjà.',
    syntax: 'touch [options] fichier...',
    examples: [
      {
        command: 'touch nouveau_fichier.txt',
        description: 'Crée un fichier vide nommé "nouveau_fichier.txt"',
      },
      {
        command: 'touch fichier1.txt fichier2.txt fichier3.txt',
        description: 'Crée plusieurs fichiers en une seule commande',
      },
      {
        command: 'touch -t 202312151030 fichier.txt',
        description: 'Crée un fichier avec une date spécifique',
      }
    ],
    relatedTerms: ['mkdir', 'rm', 'ls', 'cat'],
    difficulty: 'beginner',
    tags: ['création', 'fichier', 'timestamp']
  },

  {
    id: 'rm',
    term: 'rm',
    category: 'command',
    shortDescription: 'Supprime des fichiers et répertoires',
    fullDescription: 'La commande rm (remove) supprime des fichiers et répertoires. Attention : cette suppression est définitive !',
    syntax: 'rm [options] fichier...',
    examples: [
      {
        command: 'rm fichier.txt',
        description: 'Supprime le fichier "fichier.txt"',
      },
      {
        command: 'rm -r dossier/',
        description: 'Supprime récursivement un dossier et son contenu',
      },
      {
        command: 'rm -f fichier_protege.txt',
        description: 'Force la suppression sans demander confirmation',
      },
      {
        command: 'rm -rf dossier_complet/',
        description: 'Supprime récursivement et force (très dangereux !)',
      }
    ],
    relatedTerms: ['rmdir', 'mv', 'cp', 'trash'],
    difficulty: 'beginner',
    tags: ['suppression', 'fichier', 'répertoire', 'dangereux']
  },

  {
    id: 'cp',
    term: 'cp',
    category: 'command',
    shortDescription: 'Copie des fichiers et répertoires',
    fullDescription: 'La commande cp (copy) copie des fichiers et répertoires d\'un emplacement vers un autre.',
    syntax: 'cp [options] source destination',
    examples: [
      {
        command: 'cp fichier.txt copie.txt',
        description: 'Copie "fichier.txt" vers "copie.txt"',
      },
      {
        command: 'cp fichier.txt /chemin/vers/destination/',
        description: 'Copie un fichier vers un autre répertoire',
      },
      {
        command: 'cp -r dossier/ copie_dossier/',
        description: 'Copie récursivement un dossier complet',
      },
      {
        command: 'cp *.txt backup/',
        description: 'Copie tous les fichiers .txt vers le dossier backup',
      }
    ],
    relatedTerms: ['mv', 'rm', 'rsync'],
    difficulty: 'beginner',
    tags: ['copie', 'fichier', 'répertoire', 'sauvegarde']
  },

  {
    id: 'mv',
    term: 'mv',
    category: 'command',
    shortDescription: 'Déplace ou renomme des fichiers et répertoires',
    fullDescription: 'La commande mv (move) déplace des fichiers/répertoires vers un nouvel emplacement ou les renomme.',
    syntax: 'mv [options] source destination',
    examples: [
      {
        command: 'mv ancien_nom.txt nouveau_nom.txt',
        description: 'Renomme un fichier',
      },
      {
        command: 'mv fichier.txt /autre/repertoire/',
        description: 'Déplace un fichier vers un autre répertoire',
      },
      {
        command: 'mv dossier/ nouveau_dossier/',
        description: 'Renomme un répertoire',
      },
      {
        command: 'mv *.log logs/',
        description: 'Déplace tous les fichiers .log vers le dossier logs',
      }
    ],
    relatedTerms: ['cp', 'rm', 'rename'],
    difficulty: 'beginner',
    tags: ['déplacement', 'renommage', 'fichier', 'répertoire']
  },

  {
    id: 'echo',
    term: 'echo',
    category: 'command',
    shortDescription: 'Affiche du texte à l\'écran',
    fullDescription: 'La commande echo affiche du texte à l\'écran ou le redirige vers un fichier. Très utile pour créer du contenu ou afficher des variables.',
    syntax: 'echo [options] texte',
    examples: [
      {
        command: 'echo "Hello World"',
        description: 'Affiche "Hello World" à l\'écran',
        output: 'Hello World'
      },
      {
        command: 'echo "Contenu" > fichier.txt',
        description: 'Écrit "Contenu" dans fichier.txt (écrase)',
      },
      {
        command: 'echo "Nouvelle ligne" >> fichier.txt',
        description: 'Ajoute "Nouvelle ligne" à la fin de fichier.txt',
      },
      {
        command: 'echo $HOME',
        description: 'Affiche la valeur de la variable d\'environnement HOME',
        output: '/home/user'
      }
    ],
    relatedTerms: ['cat', 'printf', 'redirection'],
    difficulty: 'beginner',
    tags: ['affichage', 'texte', 'variables', 'redirection']
  },

  {
    id: 'head',
    term: 'head',
    category: 'command',
    shortDescription: 'Affiche les premières lignes d\'un fichier',
    fullDescription: 'La commande head affiche les premières lignes d\'un fichier (10 par défaut). Très utile pour examiner le début de gros fichiers.',
    syntax: 'head [options] fichier...',
    examples: [
      {
        command: 'head fichier.txt',
        description: 'Affiche les 10 premières lignes de fichier.txt',
      },
      {
        command: 'head -n 5 fichier.txt',
        description: 'Affiche les 5 premières lignes',
      },
      {
        command: 'head -c 100 fichier.txt',
        description: 'Affiche les 100 premiers caractères',
      }
    ],
    relatedTerms: ['tail', 'cat', 'less', 'more'],
    difficulty: 'beginner',
    tags: ['lecture', 'fichier', 'début', 'aperçu']
  },

  {
    id: 'tail',
    term: 'tail',
    category: 'command',
    shortDescription: 'Affiche les dernières lignes d\'un fichier',
    fullDescription: 'La commande tail affiche les dernières lignes d\'un fichier (10 par défaut). Très utile pour surveiller les logs en temps réel.',
    syntax: 'tail [options] fichier...',
    examples: [
      {
        command: 'tail fichier.txt',
        description: 'Affiche les 10 dernières lignes de fichier.txt',
      },
      {
        command: 'tail -n 20 log.txt',
        description: 'Affiche les 20 dernières lignes',
      },
      {
        command: 'tail -f log.txt',
        description: 'Suit le fichier en temps réel (mode follow)',
      }
    ],
    relatedTerms: ['head', 'cat', 'less', 'watch'],
    difficulty: 'beginner',
    tags: ['lecture', 'fichier', 'fin', 'surveillance', 'logs']
  },

  {
    id: 'wc',
    term: 'wc',
    category: 'command',
    shortDescription: 'Compte les lignes, mots et caractères',
    fullDescription: 'La commande wc (word count) compte les lignes, mots et caractères dans un fichier ou une entrée.',
    syntax: 'wc [options] fichier...',
    examples: [
      {
        command: 'wc fichier.txt',
        description: 'Affiche le nombre de lignes, mots et caractères',
        output: '  42  156  892 fichier.txt'
      },
      {
        command: 'wc -l fichier.txt',
        description: 'Compte uniquement les lignes',
        output: '42 fichier.txt'
      },
      {
        command: 'wc -w fichier.txt',
        description: 'Compte uniquement les mots',
        output: '156 fichier.txt'
      },
      {
        command: 'ls | wc -l',
        description: 'Compte le nombre de fichiers dans le répertoire',
      }
    ],
    relatedTerms: ['cat', 'grep', 'sort', 'uniq'],
    difficulty: 'intermediate',
    tags: ['comptage', 'statistiques', 'analyse', 'texte']
  },

  {
    id: 'sort',
    term: 'sort',
    category: 'command',
    shortDescription: 'Trie les lignes d\'un fichier',
    fullDescription: 'La commande sort trie les lignes d\'un fichier ou d\'une entrée selon différents critères (alphabétique, numérique, etc.).',
    syntax: 'sort [options] fichier...',
    examples: [
      {
        command: 'sort fichier.txt',
        description: 'Trie les lignes par ordre alphabétique',
      },
      {
        command: 'sort -n nombres.txt',
        description: 'Trie numériquement',
      },
      {
        command: 'sort -r fichier.txt',
        description: 'Trie en ordre inverse (décroissant)',
      },
      {
        command: 'sort -u fichier.txt',
        description: 'Trie et supprime les doublons',
      }
    ],
    relatedTerms: ['uniq', 'grep', 'wc', 'cat'],
    difficulty: 'intermediate',
    tags: ['tri', 'organisation', 'texte', 'données']
  },

  {
    id: 'uniq',
    term: 'uniq',
    category: 'command',
    shortDescription: 'Supprime les lignes dupliquées consécutives',
    fullDescription: 'La commande uniq supprime les lignes dupliquées consécutives d\'un fichier trié. Souvent utilisée avec sort.',
    syntax: 'uniq [options] fichier',
    examples: [
      {
        command: 'uniq fichier.txt',
        description: 'Supprime les doublons consécutifs',
      },
      {
        command: 'sort fichier.txt | uniq',
        description: 'Trie puis supprime tous les doublons',
      },
      {
        command: 'uniq -c fichier.txt',
        description: 'Compte les occurrences de chaque ligne',
        output: '  3 ligne répétée\n  1 ligne unique'
      },
      {
        command: 'uniq -d fichier.txt',
        description: 'Affiche uniquement les lignes dupliquées',
      }
    ],
    relatedTerms: ['sort', 'grep', 'wc', 'awk'],
    difficulty: 'intermediate',
    tags: ['doublons', 'nettoyage', 'données', 'tri']
  },

  // CONCEPTS AVANCÉS
  {
    id: 'pipe',
    term: 'Pipe (|)',
    category: 'concept',
    shortDescription: 'Connecte la sortie d\'une commande à l\'entrée d\'une autre',
    fullDescription: 'Le pipe (|) est un mécanisme fondamental qui permet de chaîner des commandes en connectant la sortie standard d\'une commande à l\'entrée standard de la suivante. C\'est la base de la philosophie Unix.',
    syntax: 'commande1 | commande2 | commande3',
    examples: [
      {
        command: 'ls -l | grep "txt"',
        description: 'Liste les fichiers puis filtre ceux contenant "txt"',
        interactive: true,
        explanation: 'La sortie de ls devient l\'entrée de grep'
      },
      {
        command: 'cat fichier.txt | sort | uniq',
        description: 'Affiche, trie et supprime les doublons',
        explanation: 'Chaîne de 3 commandes pour traiter le texte'
      },
      {
        command: 'ps aux | grep python | wc -l',
        description: 'Compte le nombre de processus Python en cours',
        explanation: 'Pipeline complexe pour analyser les processus'
      },
      {
        command: 'history | tail -10',
        description: 'Affiche les 10 dernières commandes de l\'historique',
        explanation: 'Combine historique et affichage des dernières lignes'
      }
    ],
    relatedTerms: ['redirection', 'stdout', 'stdin', 'tee'],
    difficulty: 'intermediate',
    tags: ['pipeline', 'chaînage', 'flux', 'unix'],
    tips: [
      'Pensez en termes de flux de données',
      'Chaque commande transforme les données',
      'Testez chaque étape du pipeline séparément',
      'Utilisez tee pour voir les données intermédiaires'
    ],
    useCases: [
      'Filtrer et transformer des données',
      'Analyser des logs complexes',
      'Traiter des listes de fichiers',
      'Créer des rapports personnalisés'
    ]
  },

  {
    id: 'redirection',
    term: 'Redirection (>, >>, <)',
    category: 'concept',
    shortDescription: 'Redirige les flux d\'entrée et de sortie',
    fullDescription: 'La redirection permet de contrôler où vont les données en entrée et sortie des commandes. Essentiel pour sauvegarder des résultats ou traiter des fichiers.',
    syntax: 'commande > fichier (sortie), commande < fichier (entrée)',
    examples: [
      {
        command: 'ls -l > liste.txt',
        description: 'Sauvegarde la liste des fichiers dans liste.txt',
        interactive: true,
        explanation: '> redirige la sortie vers un fichier (écrase)'
      },
      {
        command: 'echo "nouvelle ligne" >> fichier.txt',
        description: 'Ajoute du texte à la fin du fichier',
        explanation: '>> ajoute à la fin sans écraser'
      },
      {
        command: 'sort < noms.txt',
        description: 'Trie le contenu du fichier noms.txt',
        explanation: '< utilise le fichier comme entrée'
      },
      {
        command: 'grep "erreur" log.txt > erreurs.txt 2>&1',
        description: 'Redirige sortie standard ET erreurs vers le fichier',
        explanation: '2>&1 redirige aussi les erreurs'
      }
    ],
    relatedTerms: ['pipe', 'stdout', 'stderr', 'stdin'],
    difficulty: 'intermediate',
    tags: ['flux', 'fichier', 'sauvegarde', 'entrée-sortie'],
    warnings: [
      '> écrase complètement le fichier existant',
      'Attention à ne pas rediriger vers le fichier source'
    ],
    useCases: [
      'Sauvegarder des résultats de commandes',
      'Créer des logs personnalisés',
      'Traiter des fichiers de données',
      'Automatiser des rapports'
    ]
  },

  {
    id: 'wildcards',
    term: 'Wildcards (*?[])',
    category: 'concept',
    shortDescription: 'Caractères spéciaux pour la correspondance de motifs',
    fullDescription: 'Les wildcards sont des caractères spéciaux qui permettent de faire correspondre des motifs dans les noms de fichiers et répertoires.',
    examples: [
      {
        command: 'ls *.txt',
        description: '* correspond à n\'importe quelle séquence de caractères',
        output: 'fichier1.txt  fichier2.txt  notes.txt'
      },
      {
        command: 'ls fichier?.txt',
        description: '? correspond à exactement un caractère',
        output: 'fichier1.txt  fichier2.txt'
      },
      {
        command: 'ls fichier[12].txt',
        description: '[] correspond à un caractère dans la liste',
        output: 'fichier1.txt  fichier2.txt'
      },
      {
        command: 'rm temp*',
        description: 'Supprime tous les fichiers commençant par "temp"',
      }
    ],
    relatedTerms: ['glob', 'regex', 'find'],
    difficulty: 'intermediate',
    tags: ['motifs', 'correspondance', 'fichiers', 'glob']
  },

  {
    id: 'permissions',
    term: 'Permissions Unix',
    category: 'concept',
    shortDescription: 'Système de droits d\'accès aux fichiers',
    fullDescription: 'Les permissions Unix définissent qui peut lire, écrire ou exécuter un fichier. Elles sont représentées par 9 bits organisés en 3 groupes de 3.',
    examples: [
      {
        command: 'ls -l fichier.txt',
        description: 'Affiche les permissions d\'un fichier',
        output: '-rw-r--r--  1 user  group  1024 Dec 15 10:30 fichier.txt'
      },
      {
        command: 'chmod 755 script.sh',
        description: 'Donne tous les droits au propriétaire, lecture+exécution aux autres',
      },
      {
        command: 'chmod u+x script.sh',
        description: 'Ajoute le droit d\'exécution pour le propriétaire',
      },
      {
        command: 'chmod go-w fichier.txt',
        description: 'Retire le droit d\'écriture pour le groupe et les autres',
      }
    ],
    relatedTerms: ['chmod', 'chown', 'umask', 'ls'],
    difficulty: 'advanced',
    tags: ['sécurité', 'droits', 'accès', 'système']
  },

  {
    id: 'environment-variables',
    term: 'Variables d\'environnement',
    category: 'concept',
    shortDescription: 'Variables globales du système',
    fullDescription: 'Les variables d\'environnement stockent des informations sur l\'environnement système et sont accessibles par tous les programmes.',
    examples: [
      {
        command: 'echo $HOME',
        description: 'Affiche le répertoire personnel',
        output: '/home/user'
      },
      {
        command: 'echo $PATH',
        description: 'Affiche les répertoires de recherche des commandes',
        output: '/usr/bin:/bin:/usr/local/bin'
      },
      {
        command: 'export MA_VARIABLE="valeur"',
        description: 'Définit une nouvelle variable d\'environnement',
      },
      {
        command: 'env',
        description: 'Liste toutes les variables d\'environnement',
      }
    ],
    relatedTerms: ['export', 'env', 'set', 'bash'],
    difficulty: 'intermediate',
    tags: ['variables', 'environnement', 'système', 'configuration']
  }
];

// Configuration Fuse.js pour recherche avancée
const fuseOptions = {
  keys: [
    { name: 'term', weight: 0.4 },
    { name: 'shortDescription', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
    { name: 'aliases', weight: 0.1 }
  ],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2
};

const fuse = new Fuse(glossaryEntries, fuseOptions);

export const searchGlossary = (query: string): GlossaryEntry[] => {
  if (!query.trim()) {
    return glossaryEntries;
  }

  const results = fuse.search(query);
  return results.map(result => result.item);
};

export const getAdvancedSearch = (query: string, filters: {
  category?: string;
  difficulty?: string;
  tags?: string[];
}) => {
  let results = searchGlossary(query);
  
  if (filters.category && filters.category !== 'all') {
    results = results.filter(entry => entry.category === filters.category);
  }
  
  if (filters.difficulty && filters.difficulty !== 'all') {
    results = results.filter(entry => entry.difficulty === filters.difficulty);
  }
  
  if (filters.tags && filters.tags.length > 0) {
    results = results.filter(entry => 
      filters.tags!.some(tag => entry.tags.includes(tag))
    );
  }
  
  return results;
};

export const getGlossaryByCategory = (category: GlossaryEntry['category']) => {
  return glossaryEntries.filter(entry => entry.category === category);
};

export const getGlossaryByDifficulty = (difficulty: GlossaryEntry['difficulty']) => {
  return glossaryEntries.filter(entry => entry.difficulty === difficulty);
};

export const getRelatedEntries = (entryId: string): GlossaryEntry[] => {
  const entry = glossaryEntries.find(e => e.id === entryId);
  if (!entry) return [];
  
  return glossaryEntries.filter(e => 
    entry.relatedTerms.includes(e.id) || 
    e.relatedTerms.includes(entryId)
  );
};

export const getGlossaryEntry = (id: string) => {
  return glossaryEntries.find(entry => entry.id === id);
};

export const getAutocompleteSuggestions = (query: string, limit: number = 5): string[] => {
  if (!query.trim()) return [];
  
  const suggestions = new Set<string>();
  
  glossaryEntries.forEach(entry => {
    if (entry.term.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(entry.term);
    }
    entry.aliases?.forEach(alias => {
      if (alias.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(alias);
      }
    });
    entry.tags.forEach(tag => {
      if (tag.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(tag);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, limit);
};

export const getAllTags = (): string[] => {
  const tags = new Set<string>();
  glossaryEntries.forEach(entry => {
    entry.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
};

export const getGlossaryStats = () => {
  const stats = {
    total: glossaryEntries.length,
    byCategory: {} as Record<string, number>,
    byDifficulty: {} as Record<string, number>,
    totalTags: getAllTags().length
  };
  
  glossaryEntries.forEach(entry => {
    stats.byCategory[entry.category] = (stats.byCategory[entry.category] || 0) + 1;
    stats.byDifficulty[entry.difficulty] = (stats.byDifficulty[entry.difficulty] || 0) + 1;
  });
  
  return stats;
}; 