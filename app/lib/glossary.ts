export interface GlossaryEntry {
  id: string;
  term: string;
  category: 'command' | 'concept' | 'option' | 'file-type';
  shortDescription: string;
  fullDescription: string;
  syntax?: string;
  examples: {
    command: string;
    description: string;
    output?: string;
  }[];
  relatedTerms: string[];
  aliases?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export const glossaryEntries: GlossaryEntry[] = [
  // COMMANDES DE BASE
  {
    id: 'ls',
    term: 'ls',
    category: 'command',
    shortDescription: 'Liste le contenu d\'un répertoire',
    fullDescription: 'La commande ls (list) affiche la liste des fichiers et dossiers contenus dans un répertoire. C\'est l\'une des commandes les plus utilisées en ligne de commande.',
    syntax: 'ls [options] [répertoire]',
    examples: [
      {
        command: 'ls',
        description: 'Liste les fichiers du répertoire courant',
        output: 'Documents  Downloads  Pictures  Videos'
      },
      {
        command: 'ls -l',
        description: 'Affichage détaillé avec permissions, taille, date',
        output: 'drwxr-xr-x  5 user  staff   160 Dec 15 10:30 Documents'
      },
      {
        command: 'ls -la',
        description: 'Inclut les fichiers cachés (commençant par .)',
        output: '.bashrc  .profile  Documents  Downloads'
      },
      {
        command: 'ls *.txt',
        description: 'Liste uniquement les fichiers .txt',
        output: 'readme.txt  notes.txt  config.txt'
      }
    ],
    relatedTerms: ['pwd', 'cd', 'find', 'tree'],
    aliases: ['dir'],
    difficulty: 'beginner',
    tags: ['navigation', 'fichiers', 'listing']
  },

  {
    id: 'cd',
    term: 'cd',
    category: 'command',
    shortDescription: 'Change de répertoire courant',
    fullDescription: 'La commande cd (change directory) permet de naviguer dans l\'arborescence des fichiers en changeant le répertoire de travail courant.',
    syntax: 'cd [répertoire]',
    examples: [
      {
        command: 'cd /home/user',
        description: 'Va au répertoire /home/user (chemin absolu)',
      },
      {
        command: 'cd Documents',
        description: 'Va au dossier Documents (chemin relatif)',
      },
      {
        command: 'cd ..',
        description: 'Remonte d\'un niveau dans l\'arborescence',
      },
      {
        command: 'cd ~',
        description: 'Va au répertoire personnel de l\'utilisateur',
      },
      {
        command: 'cd -',
        description: 'Retourne au répertoire précédent',
      }
    ],
    relatedTerms: ['pwd', 'ls', 'mkdir'],
    difficulty: 'beginner',
    tags: ['navigation', 'répertoire', 'déplacement']
  },

  {
    id: 'pwd',
    term: 'pwd',
    category: 'command',
    shortDescription: 'Affiche le répertoire courant',
    fullDescription: 'La commande pwd (print working directory) affiche le chemin complet du répertoire dans lequel vous vous trouvez actuellement.',
    syntax: 'pwd',
    examples: [
      {
        command: 'pwd',
        description: 'Affiche le répertoire courant',
        output: '/home/user/Documents'
      }
    ],
    relatedTerms: ['cd', 'ls'],
    difficulty: 'beginner',
    tags: ['navigation', 'position', 'répertoire']
  },

  {
    id: 'mkdir',
    term: 'mkdir',
    category: 'command',
    shortDescription: 'Crée un ou plusieurs répertoires',
    fullDescription: 'La commande mkdir (make directory) permet de créer un ou plusieurs nouveaux répertoires.',
    syntax: 'mkdir [options] répertoire...',
    examples: [
      {
        command: 'mkdir nouveau_dossier',
        description: 'Crée un dossier nommé "nouveau_dossier"',
      },
      {
        command: 'mkdir -p dossier/sous-dossier',
        description: 'Crée l\'arborescence complète si elle n\'existe pas',
      },
      {
        command: 'mkdir dossier1 dossier2 dossier3',
        description: 'Crée plusieurs dossiers en une seule commande',
      }
    ],
    relatedTerms: ['rmdir', 'rm', 'cd', 'ls'],
    difficulty: 'beginner',
    tags: ['création', 'répertoire', 'dossier']
  },

  {
    id: 'cat',
    term: 'cat',
    category: 'command',
    shortDescription: 'Affiche le contenu d\'un fichier',
    fullDescription: 'La commande cat (concatenate) affiche le contenu d\'un ou plusieurs fichiers. Elle peut aussi être utilisée pour créer ou concaténer des fichiers.',
    syntax: 'cat [options] fichier...',
    examples: [
      {
        command: 'cat fichier.txt',
        description: 'Affiche le contenu de fichier.txt',
        output: 'Contenu du fichier...'
      },
      {
        command: 'cat fichier1.txt fichier2.txt',
        description: 'Affiche le contenu des deux fichiers bout à bout',
      },
      {
        command: 'cat -n fichier.txt',
        description: 'Affiche avec numérotation des lignes',
        output: '1  Première ligne\n2  Deuxième ligne'
      }
    ],
    relatedTerms: ['less', 'more', 'head', 'tail', 'echo'],
    difficulty: 'beginner',
    tags: ['lecture', 'fichier', 'contenu', 'affichage']
  },

  {
    id: 'grep',
    term: 'grep',
    category: 'command',
    shortDescription: 'Recherche des motifs dans du texte',
    fullDescription: 'La commande grep (global regular expression print) recherche des lignes contenant un motif spécifique dans un ou plusieurs fichiers.',
    syntax: 'grep [options] motif [fichier...]',
    examples: [
      {
        command: 'grep "erreur" log.txt',
        description: 'Recherche le mot "erreur" dans log.txt',
        output: 'Ligne 45: Une erreur s\'est produite'
      },
      {
        command: 'grep -i "ERROR" log.txt',
        description: 'Recherche insensible à la casse',
      },
      {
        command: 'grep -n "TODO" *.txt',
        description: 'Recherche avec numéros de ligne dans tous les .txt',
        output: 'notes.txt:12: TODO: Finir le projet'
      },
      {
        command: 'ls -l | grep "^d"',
        description: 'Filtre pour n\'afficher que les répertoires',
      }
    ],
    relatedTerms: ['find', 'sed', 'awk', 'sort'],
    difficulty: 'intermediate',
    tags: ['recherche', 'filtrage', 'texte', 'motif']
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
    fullDescription: 'Le pipe (|) est un mécanisme qui permet de rediriger la sortie d\'une commande vers l\'entrée d\'une autre commande, créant ainsi une chaîne de traitement.',
    syntax: 'commande1 | commande2',
    examples: [
      {
        command: 'ls -l | grep "txt"',
        description: 'Liste les fichiers puis filtre ceux contenant "txt"',
        output: '-rw-r--r--  1 user  staff  1024 Dec 15 10:30 readme.txt'
      },
      {
        command: 'cat fichier.txt | sort | uniq',
        description: 'Affiche, trie et supprime les doublons',
      },
      {
        command: 'ps aux | grep python',
        description: 'Liste les processus puis filtre ceux contenant "python"',
      },
      {
        command: 'history | tail -20',
        description: 'Affiche les 20 dernières commandes de l\'historique',
      }
    ],
    relatedTerms: ['redirection', 'stdout', 'stdin'],
    difficulty: 'intermediate',
    tags: ['redirection', 'chaînage', 'flux']
  },

  {
    id: 'redirection',
    term: 'Redirection',
    category: 'concept',
    shortDescription: 'Redirige les flux d\'entrée/sortie',
    fullDescription: 'La redirection permet de diriger les flux d\'entrée et de sortie des commandes vers des fichiers ou d\'autres commandes.',
    examples: [
      {
        command: 'echo "Hello" > fichier.txt',
        description: 'Écrit dans un fichier (écrase le contenu)',
      },
      {
        command: 'echo "World" >> fichier.txt',
        description: 'Ajoute à la fin d\'un fichier',
      },
      {
        command: 'commande < fichier.txt',
        description: 'Utilise un fichier comme entrée',
      },
      {
        command: 'commande 2> erreurs.log',
        description: 'Redirige les erreurs vers un fichier',
      },
      {
        command: 'commande > sortie.txt 2>&1',
        description: 'Redirige sortie et erreurs vers le même fichier',
      }
    ],
    relatedTerms: ['pipe', 'stdout', 'stderr', 'stdin'],
    difficulty: 'intermediate',
    tags: ['flux', 'fichier', 'sortie', 'entrée']
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

// Fonctions utilitaires pour la recherche
export const searchGlossary = (query: string): GlossaryEntry[] => {
  if (!query.trim()) return glossaryEntries;
  
  const searchTerm = query.toLowerCase().trim();
  
  return glossaryEntries.filter(entry => {
    // Recherche dans le terme principal
    if (entry.term.toLowerCase().includes(searchTerm)) return true;
    
    // Recherche dans les alias
    if (entry.aliases?.some(alias => alias.toLowerCase().includes(searchTerm))) return true;
    
    // Recherche dans la description courte
    if (entry.shortDescription.toLowerCase().includes(searchTerm)) return true;
    
    // Recherche dans les tags
    if (entry.tags.some(tag => tag.toLowerCase().includes(searchTerm))) return true;
    
    // Recherche dans les exemples
    if (entry.examples.some(example => 
      example.command.toLowerCase().includes(searchTerm) ||
      example.description.toLowerCase().includes(searchTerm)
    )) return true;
    
    return false;
  });
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
    entry.relatedTerms.includes(e.id) || e.relatedTerms.includes(entryId)
  );
};

export const getGlossaryEntry = (id: string) => {
  return glossaryEntries.find(entry => entry.id === id);
};

// Auto-complétion
export const getAutocompleteSuggestions = (query: string, limit: number = 5): string[] => {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase();
  const suggestions = new Set<string>();
  
  glossaryEntries.forEach(entry => {
    // Suggestions basées sur le terme principal
    if (entry.term.toLowerCase().startsWith(searchTerm)) {
      suggestions.add(entry.term);
    }
    
    // Suggestions basées sur les alias
    entry.aliases?.forEach(alias => {
      if (alias.toLowerCase().startsWith(searchTerm)) {
        suggestions.add(alias);
      }
    });
    
    // Suggestions basées sur les tags
    entry.tags.forEach(tag => {
      if (tag.toLowerCase().startsWith(searchTerm)) {
        suggestions.add(tag);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, limit);
}; 