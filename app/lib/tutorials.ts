import { Tutorial } from '../stores/tutorialStore';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  command: string;
  hint: string;
  points: number;
  validation: (output: string, command: string) => boolean;
  explanation?: string;
  tips?: string[];
  commonMistakes?: string[];
  bonusChallenge?: {
    description: string;
    command: string;
    points: number;
  };
  interactiveDemo?: boolean;
  expectedOutput?: string;
}

export interface TutorialCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const tutorialCategories: TutorialCategory[] = [
  {
    id: 'basics',
    name: 'Bases du Terminal',
    description: 'Navigation et commandes fondamentales',
    icon: '🚀',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'files',
    name: 'Gestion de Fichiers',
    description: 'Créer, modifier et organiser vos fichiers',
    icon: '📁',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'text',
    name: 'Traitement de Texte',
    description: 'Rechercher, filtrer et transformer du texte',
    icon: '📝',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'advanced',
    name: 'Techniques Avancées',
    description: 'Scripts, automatisation et optimisation',
    icon: '⚡',
    color: 'from-orange-500 to-red-500'
  }
];

export const tutorials: Tutorial[] = [
  // TUTORIELS DÉBUTANT
  {
    id: 'basic-navigation',
    title: 'Navigation de Base',
    description: 'Apprenez à naviguer dans le système de fichiers avec pwd, ls et cd. Maîtrisez les commandes essentielles pour vous orienter.',
    level: 'beginner',
    category: 'basics',
    estimatedTime: 15,
    learningObjectives: [
      'Comprendre la structure des répertoires',
      'Utiliser pwd pour connaître sa position',
      'Explorer avec ls et ses options',
      'Naviguer avec cd efficacement'
    ],
    steps: [
      {
        id: 'step-pwd',
        title: 'Où suis-je ?',
        description: 'Utilisez la commande pwd pour afficher votre répertoire actuel',
        command: 'pwd',
        hint: 'pwd signifie "print working directory" - tapez simplement pwd et appuyez sur Entrée',
        points: 10,
        explanation: 'La commande pwd affiche le chemin complet du répertoire dans lequel vous vous trouvez. C\'est votre "position" dans l\'arborescence des fichiers.',
        tips: [
          'pwd est utile quand vous êtes perdu dans l\'arborescence',
          'Le chemin commence toujours par / (racine du système)',
          'Chaque / sépare un niveau de répertoire'
        ],
        expectedOutput: '/home/user',
        validation: (output: string, command: string) => {
          return command.trim() === 'pwd' && output.includes('/home/user');
        }
      },
      {
        id: 'step-ls',
        title: 'Que contient ce répertoire ?',
        description: 'Utilisez ls pour lister le contenu du répertoire actuel',
        command: 'ls',
        hint: 'ls liste tous les fichiers et dossiers du répertoire courant',
        points: 10,
        explanation: 'La commande ls (list) affiche tous les fichiers et dossiers visibles dans le répertoire courant. Les dossiers apparaissent souvent en couleur différente.',
        tips: [
          'Les dossiers se terminent souvent par / dans l\'affichage',
          'Les fichiers cachés (commençant par .) ne sont pas affichés par défaut',
          'Utilisez les flèches pour naviguer dans l\'historique des commandes'
        ],
        commonMistakes: [
          'Oublier l\'espace entre ls et les options',
          'Confondre ls (list) avec sl (train qui passe !)'
        ],
        validation: (output: string, command: string) => {
          return command.trim() === 'ls' && (output.includes('Documents') || output.includes('Desktop'));
        }
      },
      {
        id: 'step-ls-l',
        title: 'Plus de détails',
        description: 'Utilisez ls -l pour afficher plus d\'informations sur les fichiers',
        command: 'ls -l',
        hint: 'L\'option -l affiche les permissions, tailles et dates de modification',
        points: 15,
        explanation: 'L\'option -l (long format) affiche des informations détaillées : permissions, nombre de liens, propriétaire, groupe, taille, et date de modification.',
        tips: [
          'La première lettre indique le type : d=dossier, -=fichier',
          'Les 9 caractères suivants sont les permissions (rwx pour read/write/execute)',
          'La taille est en octets par défaut'
        ],
        bonusChallenge: {
          description: 'Essayez ls -lh pour des tailles plus lisibles',
          command: 'ls -lh',
          points: 5
        },
        validation: (output: string, command: string) => {
          return command.trim() === 'ls -l' && output.includes('drwx');
        }
      },
      {
        id: 'step-cd',
        title: 'Changer de répertoire',
        description: 'Utilisez cd Documents pour aller dans le dossier Documents',
        command: 'cd Documents',
        hint: 'cd signifie "change directory" - tapez cd suivi du nom du dossier',
        points: 15,
        explanation: 'La commande cd permet de changer de répertoire de travail. Vous pouvez utiliser des chemins relatifs (à partir du répertoire actuel) ou absolus (à partir de la racine).',
        tips: [
          'Utilisez la tabulation pour l\'autocomplétion des noms',
          'cd sans argument vous ramène au répertoire personnel',
          'cd .. remonte d\'un niveau dans l\'arborescence',
          'cd - retourne au répertoire précédent'
        ],
        commonMistakes: [
          'Oublier l\'espace entre cd et le nom du dossier',
          'Essayer d\'aller dans un fichier au lieu d\'un dossier',
          'Casse incorrecte (Linux est sensible à la casse)'
        ],
        validation: (output: string, command: string) => {
          return command.trim() === 'cd Documents';
        }
      },
      {
        id: 'step-pwd-verify',
        title: 'Vérifier la position',
        description: 'Utilisez pwd pour confirmer que vous êtes dans le dossier Documents',
        command: 'pwd',
        hint: 'Vous devriez maintenant voir /home/user/Documents',
        points: 10,
        explanation: 'Toujours vérifier sa position après un changement de répertoire est une bonne pratique. Cela évite les erreurs dans les commandes suivantes.',
        tips: [
          'Combinez pwd et ls pour vous orienter rapidement',
          'Le prompt du terminal indique souvent le répertoire courant'
        ],
        bonusChallenge: {
          description: 'Retournez au répertoire parent avec cd ..',
          command: 'cd ..',
          points: 5
        },
        validation: (output: string, command: string) => {
          return command.trim() === 'pwd' && output.includes('/home/user/Documents');
        }
      },
      {
        id: 'step-ls-hidden',
        title: 'Fichiers cachés',
        description: 'Utilisez ls -a pour voir tous les fichiers, y compris les fichiers cachés',
        command: 'ls -a',
        hint: 'L\'option -a affiche tous les fichiers, même ceux qui commencent par un point',
        points: 15,
        explanation: 'Les fichiers cachés sous Unix/Linux commencent par un point (.). Ils sont masqués par défaut mais -a les révèle.',
        tips: [
          'Les fichiers cachés commencent par un point (.)',
          '. = répertoire actuel, .. = répertoire parent',
          'Les fichiers de configuration sont souvent cachés'
        ],
        validation: (output: string, command: string) => {
          return command.trim() === 'ls -a';
        }
      },
      {
        id: 'step-ls-size',
        title: 'Tailles lisibles',
        description: 'Utilisez ls -lh pour afficher les tailles en format lisible (KB, MB, GB)',
        command: 'ls -lh',
        hint: 'L\'option -h rend les tailles "human readable" (lisibles par l\'humain)',
        points: 15,
        explanation: 'L\'option -h convertit les tailles en octets vers des unités plus lisibles comme KB, MB, GB.',
        tips: [
          '-h fonctionne avec de nombreuses commandes (du, df, etc.)',
          'Plus facile de comparer les tailles de fichiers',
          'Combine parfaitement avec -l pour les détails'
        ],
        bonusChallenge: {
          description: 'Essayez ls -lah pour combiner toutes les options',
          command: 'ls -lah',
          points: 5
        },
        validation: (output: string, command: string) => {
          return command.trim() === 'ls -lh';
        }
      },
      {
        id: 'step-cd-multiple',
        title: 'Navigation en plusieurs étapes',
        description: 'Naviguez vers un sous-dossier avec cd Documents/subfolder (créez-le d\'abord si nécessaire)',
        command: 'mkdir -p Documents/subfolder && cd Documents/subfolder',
        hint: 'mkdir -p crée les dossiers parents si nécessaire, && exécute la commande suivante si la première réussit',
        points: 20,
        explanation: 'Vous pouvez chaîner les commandes avec && et naviguer dans des sous-dossiers en une fois.',
        tips: [
          'mkdir -p crée tous les dossiers parents nécessaires',
          '&& exécute la commande suivante seulement si la première réussit',
          'Vous pouvez naviguer directement : cd path/to/deep/folder'
        ],
        validation: (output: string, command: string) => {
          return command.includes('mkdir -p') && command.includes('cd Documents/subfolder');
        }
      }
    ]
  },

  {
    id: 'file-operations',
    title: 'Opérations sur les Fichiers',
    description: 'Maîtrisez la création, copie, déplacement et suppression de fichiers. Apprenez les commandes essentielles pour gérer vos données.',
    level: 'beginner',
    category: 'files',
    estimatedTime: 25,
    prerequisites: ['basic-navigation'],
    learningObjectives: [
      'Créer des fichiers avec touch et echo',
      'Lire le contenu avec cat',
      'Copier et déplacer des fichiers',
      'Supprimer des fichiers en sécurité'
    ],
    steps: [
      {
        id: 'step-touch',
        title: 'Créer un fichier vide',
        description: 'Utilisez touch pour créer un fichier vide nommé "test.txt"',
        command: 'touch test.txt',
        hint: 'touch crée un fichier vide s\'il n\'existe pas',
        points: 10,
        explanation: 'La commande touch crée un fichier vide ou met à jour la date de modification d\'un fichier existant. C\'est la façon la plus simple de créer un nouveau fichier.',
        tips: [
          'touch peut créer plusieurs fichiers en une fois : touch file1.txt file2.txt',
          'Si le fichier existe déjà, touch met juste à jour sa date',
          'Utilisez des guillemets pour les noms avec espaces : touch "mon fichier.txt"'
        ],
        validation: (output: string, command: string) => {
          return command.trim() === 'touch test.txt';
        }
      },
      {
        id: 'step-echo',
        title: 'Ajouter du contenu',
        description: 'Utilisez echo pour écrire "Hello World" dans le fichier test.txt',
        command: 'echo "Hello World" > test.txt',
        hint: 'Le symbole > redirige la sortie vers un fichier',
        points: 15,
        explanation: 'La commande echo affiche du texte. Avec la redirection >, on peut écrire ce texte dans un fichier. Attention : > écrase le contenu existant !',
        tips: [
          'Utilisez >> pour ajouter à la fin sans écraser',
          'Les guillemets préservent les espaces et caractères spéciaux',
          'echo sans redirection affiche simplement le texte'
        ],
        commonMistakes: [
          'Oublier les guillemets autour du texte avec espaces',
          'Confondre > (écraser) et >> (ajouter)',
          'Rediriger vers un fichier important par erreur'
        ],
        bonusChallenge: {
          description: 'Ajoutez une deuxième ligne avec echo "Ligne 2" >> test.txt',
          command: 'echo "Ligne 2" >> test.txt',
          points: 5
        },
        validation: (output: string, command: string) => {
          return command.includes('echo') && command.includes('Hello World') && command.includes('>');
        }
      },
      {
        id: 'step-cat',
        title: 'Lire le contenu',
        description: 'Utilisez cat pour afficher le contenu du fichier test.txt',
        command: 'cat test.txt',
        hint: 'cat affiche le contenu complet d\'un fichier',
        points: 10,
        explanation: 'La commande cat (concatenate) affiche le contenu d\'un ou plusieurs fichiers. C\'est parfait pour lire des fichiers texte courts.',
        tips: [
          'cat peut afficher plusieurs fichiers : cat file1.txt file2.txt',
          'Pour les gros fichiers, utilisez less ou more',
          'cat -n ajoute les numéros de ligne'
        ],
        expectedOutput: 'Hello World',
        validation: (output: string, command: string) => {
          return command.trim() === 'cat test.txt' && output.includes('Hello World');
        }
      },
      {
        id: 'step-cp',
        title: 'Copier le fichier',
        description: 'Utilisez cp pour copier test.txt vers backup.txt',
        command: 'cp test.txt backup.txt',
        hint: 'cp source destination - copie le premier fichier vers le second',
        points: 15,
        explanation: 'La commande cp copie des fichiers ou dossiers. Le fichier original reste intact, une copie est créée avec le nouveau nom.',
        tips: [
          'cp -r copie récursivement les dossiers',
          'cp -i demande confirmation avant d\'écraser',
          'Vous pouvez copier vers un autre répertoire : cp file.txt /path/to/destination/'
        ],
        commonMistakes: [
          'Inverser source et destination',
          'Oublier -r pour copier un dossier',
          'Écraser un fichier important sans le vouloir'
        ],
        validation: (output: string, command: string) => {
          return command.trim() === 'cp test.txt backup.txt';
        }
      },
      {
        id: 'step-mv',
        title: 'Renommer le fichier',
        description: 'Utilisez mv pour renommer backup.txt en sauvegarde.txt',
        command: 'mv backup.txt sauvegarde.txt',
        hint: 'mv peut déplacer ou renommer des fichiers',
        points: 15,
        explanation: 'La commande mv (move) déplace ou renomme des fichiers. Contrairement à cp, le fichier original disparaît.',
        tips: [
          'mv peut déplacer vers un autre répertoire',
          'mv -i demande confirmation avant d\'écraser',
          'mv fonctionne aussi pour renommer des dossiers'
        ],
        bonusChallenge: {
          description: 'Créez un dossier "archives" et déplacez-y sauvegarde.txt',
          command: 'mkdir archives && mv sauvegarde.txt archives/',
          points: 10
        },
        validation: (output: string, command: string) => {
          return command.trim() === 'mv backup.txt sauvegarde.txt';
        }
      },
      {
        id: 'step-rm',
        title: 'Supprimer un fichier',
        description: 'Utilisez rm pour supprimer le fichier test.txt',
        command: 'rm test.txt',
        hint: 'Attention : rm supprime définitivement les fichiers !',
        points: 10,
        explanation: 'La commande rm supprime définitivement des fichiers. Il n\'y a pas de corbeille en ligne de commande, soyez prudent !',
        tips: [
          'rm -i demande confirmation pour chaque fichier',
          'rm -r supprime récursivement les dossiers',
          'rm -f force la suppression sans confirmation'
        ],
        commonMistakes: [
          'Supprimer le mauvais fichier par erreur',
          'Utiliser rm -rf sans précaution',
          'Oublier de faire une sauvegarde avant suppression'
        ],
        validation: (output: string, command: string) => {
          return command.trim() === 'rm test.txt';
        }
      },
      {
        id: 'step-mkdir',
        title: 'Créer un dossier',
        description: 'Créez un nouveau dossier nommé "mon_projet" avec mkdir',
        command: 'mkdir mon_projet',
        hint: 'mkdir crée un nouveau répertoire',
        points: 10,
        explanation: 'mkdir (make directory) crée un nouveau dossier. Le nom ne doit pas contenir d\'espaces sans guillemets.',
        tips: [
          'Évitez les espaces dans les noms de dossiers',
          'Utilisez des underscores _ ou tirets - à la place',
          'mkdir -p crée les dossiers parents si nécessaire'
        ],
        validation: (output: string, command: string) => {
          return command.trim() === 'mkdir mon_projet';
        }
      },
      {
        id: 'step-cp-file',
        title: 'Copier un fichier',
        description: 'Copiez test.txt vers le dossier mon_projet avec cp test.txt mon_projet/',
        command: 'cp test.txt mon_projet/',
        hint: 'cp copie un fichier vers une destination',
        points: 15,
        explanation: 'cp (copy) duplique un fichier. La destination peut être un fichier ou un dossier.',
        tips: [
          'cp fichier dossier/ copie dans le dossier',
          'cp fichier nouveau_nom renomme en copiant',
          'cp -r copie récursivement les dossiers'
        ],
        validation: (output: string, command: string) => {
          return command.includes('cp test.txt mon_projet/');
        }
      },
      {
        id: 'step-mv-file',
        title: 'Déplacer/Renommer',
        description: 'Renommez test.txt en ancien_test.txt avec mv',
        command: 'mv test.txt ancien_test.txt',
        hint: 'mv peut déplacer ET renommer des fichiers',
        points: 15,
        explanation: 'mv (move) déplace ou renomme des fichiers. C\'est la même opération en Unix.',
        tips: [
          'mv fichier nouveau_nom = renommer',
          'mv fichier dossier/ = déplacer',
          'mv peut déplacer plusieurs fichiers vers un dossier'
        ],
        validation: (output: string, command: string) => {
          return command.includes('mv test.txt ancien_test.txt');
        }
      },
      {
        id: 'step-ls-verify',
        title: 'Vérifier les changements',
        description: 'Utilisez ls -la pour vérifier que vos fichiers et dossiers ont été créés',
        command: 'ls -la',
        hint: 'Vérifiez que mon_projet/ et ancien_test.txt sont présents',
        points: 10,
        explanation: 'Toujours vérifier le résultat de vos opérations sur les fichiers est une bonne pratique.',
        tips: [
          'Prenez l\'habitude de vérifier après chaque opération',
          'ls -la montre tout : fichiers, dossiers, permissions',
          'La vérification évite les erreurs en cascade'
        ],
        validation: (output: string, command: string) => {
          return command.trim() === 'ls -la';
        }
      }
    ]
  },

  // TUTORIELS INTERMÉDIAIRES
  {
    id: 'text-processing',
    title: 'Traitement de Texte Avancé',
    description: 'Maîtrisez grep, sort, uniq et les pipes pour traiter efficacement du texte. Devenez un expert de la manipulation de données textuelles.',
    level: 'intermediate',
    category: 'text',
    estimatedTime: 30,
    prerequisites: ['file-operations'],
    learningObjectives: [
      'Rechercher dans les fichiers avec grep',
      'Trier et dédupliquer avec sort et uniq',
      'Chaîner les commandes avec les pipes',
      'Compter et analyser du texte'
    ],
    steps: [
      {
        id: 'step-create-data',
        title: 'Créer des données de test',
        description: 'Créez un fichier avec plusieurs lignes de texte pour nos exercices',
        command: 'echo -e "pomme\\nbanane\\npomme\\norange\\nbanane\\nkiwi\\nfraise\\npomme" > fruits.txt',
        hint: 'L\'option -e permet d\'interpréter les caractères d\'échappement comme \\n',
        points: 15,
        explanation: 'Nous créons un fichier de test avec des données répétées pour pratiquer les outils de traitement de texte.',
        tips: [
          'echo -e interprète \\n comme un retour à la ligne',
          'Vous pouvez aussi utiliser printf pour plus de contrôle',
          'Les données de test sont essentielles pour apprendre'
        ],
        validation: (output: string, command: string) => {
          return command.includes('echo -e') && command.includes('fruits.txt');
        }
      },
      {
        id: 'step-cat-data',
        title: 'Vérifier le contenu',
        description: 'Affichez le contenu du fichier fruits.txt pour voir nos données',
        command: 'cat fruits.txt',
        hint: 'Vous devriez voir une liste de fruits, certains répétés',
        points: 10,
        explanation: 'Toujours vérifier ses données avant de les traiter. Cela aide à comprendre les résultats des commandes suivantes.',
        expectedOutput: 'pomme\nbanane\npomme\norange\nbanane\nkiwi\nfraise\npomme',
        validation: (output: string, command: string) => {
          return command.trim() === 'cat fruits.txt' && output.includes('pomme');
        }
      },
      {
        id: 'step-grep',
        title: 'Rechercher du texte',
        description: 'Utilisez grep pour trouver toutes les lignes contenant "pomme"',
        command: 'grep "pomme" fruits.txt',
        hint: 'grep recherche un motif dans un fichier',
        points: 15,
        explanation: 'grep est l\'outil de recherche le plus puissant en ligne de commande. Il peut utiliser des expressions régulières pour des recherches complexes.',
        tips: [
          'grep -i ignore la casse (majuscules/minuscules)',
          'grep -n affiche les numéros de ligne',
          'grep -v inverse la recherche (lignes qui ne contiennent PAS le motif)'
        ],
        bonusChallenge: {
          description: 'Comptez les occurrences avec grep -c "pomme" fruits.txt',
          command: 'grep -c "pomme" fruits.txt',
          points: 5
        },
        validation: (output: string, command: string) => {
          return command.includes('grep') && command.includes('pomme') && command.includes('fruits.txt');
        }
      },
      {
        id: 'step-sort',
        title: 'Trier les lignes',
        description: 'Utilisez sort pour trier alphabétiquement le contenu de fruits.txt',
        command: 'sort fruits.txt',
        hint: 'sort trie les lignes par ordre alphabétique',
        points: 15,
        explanation: 'La commande sort trie les lignes d\'un fichier. Par défaut, le tri est alphabétique et sensible à la casse.',
        tips: [
          'sort -r trie en ordre inverse',
          'sort -n trie numériquement',
          'sort -u trie et supprime les doublons en une fois'
        ],
        validation: (output: string, command: string) => {
          return command.trim() === 'sort fruits.txt';
        }
      },
      {
        id: 'step-pipe-sort-uniq',
        title: 'Combiner sort et uniq',
        description: 'Utilisez sort fruits.txt | uniq pour supprimer les doublons',
        command: 'sort fruits.txt | uniq',
        hint: 'Le pipe | connecte la sortie de sort à l\'entrée de uniq',
        points: 20,
        explanation: 'Les pipes permettent de chaîner les commandes. uniq supprime les lignes consécutives identiques, d\'où la nécessité de trier d\'abord.',
        tips: [
          'uniq -c compte les occurrences de chaque ligne',
          'uniq -d affiche seulement les lignes dupliquées',
          'Les pipes sont la base de la puissance Unix'
        ],
        interactiveDemo: true,
        validation: (output: string, command: string) => {
          return command.includes('sort fruits.txt | uniq');
        }
      },
      {
        id: 'step-wc',
        title: 'Compter les éléments',
        description: 'Utilisez wc -l fruits.txt pour compter le nombre de lignes',
        command: 'wc -l fruits.txt',
        hint: 'wc signifie "word count" et peut compter lignes, mots et caractères',
        points: 15,
        explanation: 'La commande wc compte les lignes (-l), mots (-w) et caractères (-c) dans un fichier.',
        tips: [
          'wc sans option affiche lignes, mots et caractères',
          'wc peut traiter plusieurs fichiers à la fois',
          'Combinez avec pipes pour des analyses complexes'
        ],
        bonusChallenge: {
          description: 'Comptez les fruits uniques avec sort fruits.txt | uniq | wc -l',
          command: 'sort fruits.txt | uniq | wc -l',
          points: 10
        },
        validation: (output: string, command: string) => {
          return command.includes('wc -l') && command.includes('fruits.txt');
        }
      }
    ]
  },

  // TUTORIELS INTERMÉDIAIRES
  {
    id: 'intermediate-navigation',
    title: 'Navigation Avancée',
    description: 'Maîtrisez les techniques avancées de navigation : chemins absolus/relatifs, liens symboliques et raccourcis.',
    level: 'intermediate',
    category: 'basics',
    estimatedTime: 20,
    prerequisites: ['basic-navigation', 'file-operations'],
    learningObjectives: [
      'Comprendre les chemins absolus vs relatifs',
      'Utiliser les raccourcis de navigation',
      'Maîtriser les liens symboliques',
      'Optimiser ses déplacements'
    ],
    steps: [
      {
        id: 'step-absolute-path',
        title: 'Chemin absolu',
        description: 'Naviguez vers /home/user/Documents en utilisant le chemin absolu',
        command: 'cd /home/user/Documents',
        hint: 'Un chemin absolu commence toujours par / (racine)',
        points: 15,
        explanation: 'Les chemins absolus partent de la racine (/) et spécifient l\'emplacement complet. Ils fonctionnent depuis n\'importe où.',
        tips: [
          'Les chemins absolus commencent toujours par /',
          'Ils sont plus longs mais plus précis',
          'Utiles dans les scripts pour éviter les erreurs'
        ],
        validation: (output: string, command: string) => {
          return command.trim() === 'cd /home/user/Documents';
        }
      },
      {
        id: 'step-relative-path',
        title: 'Navigation relative',
        description: 'Remontez au répertoire parent avec cd ..',
        command: 'cd ..',
        hint: '.. représente le répertoire parent',
        points: 10,
        explanation: 'Les chemins relatifs partent du répertoire actuel. .. = parent, . = actuel, ~ = home',
        tips: [
          '. = répertoire actuel',
          '.. = répertoire parent',
          '~ = répertoire home de l\'utilisateur',
          'cd - = retour au répertoire précédent'
        ],
        validation: (output: string, command: string) => {
          return command.trim() === 'cd ..';
        }
      },
      {
        id: 'step-home-shortcut',
        title: 'Raccourci vers home',
        description: 'Retournez rapidement au répertoire home avec cd ~',
        command: 'cd ~',
        hint: '~ est un raccourci vers votre répertoire personnel',
        points: 10,
        explanation: 'Le tilde ~ est un raccourci universel vers le répertoire home de l\'utilisateur actuel.',
        tips: [
          'cd ~ équivaut à cd /home/username',
          'cd sans argument fait la même chose',
          '~/Documents = /home/user/Documents'
        ],
        validation: (output: string, command: string) => {
          return command.trim() === 'cd ~';
        }
      },
      {
        id: 'step-previous-dir',
        title: 'Répertoire précédent',
        description: 'Utilisez cd - pour retourner au répertoire précédent',
        command: 'cd -',
        hint: '- vous ramène au répertoire d\'où vous venez',
        points: 15,
        explanation: 'cd - est un raccourci pratique pour alterner entre deux répertoires.',
        tips: [
          'Très utile pour naviguer entre deux dossiers',
          'Affiche le chemin du répertoire de destination',
          'Équivalent à un "retour" dans un navigateur'
        ],
        validation: (output: string, command: string) => {
          return command.trim() === 'cd -';
        }
      }
    ]
  },

  {
    id: 'intermediate-file-management',
    title: 'Gestion Avancée des Fichiers',
    description: 'Techniques avancées de gestion de fichiers : permissions, propriétés et organisation.',
    level: 'intermediate',
    category: 'files',
    estimatedTime: 30,
    prerequisites: ['file-operations'],
    learningObjectives: [
      'Comprendre et modifier les permissions',
      'Gérer les propriétaires de fichiers',
      'Organiser efficacement ses fichiers',
      'Utiliser les métadonnées'
    ],
    steps: [
      {
        id: 'step-permissions',
        title: 'Voir les permissions',
        description: 'Utilisez ls -la pour voir tous les fichiers avec leurs permissions',
        command: 'ls -la',
        hint: '-a affiche les fichiers cachés, -l affiche les détails',
        points: 15,
        explanation: 'Les permissions Unix contrôlent qui peut lire (r), écrire (w) et exécuter (x) un fichier.',
        tips: [
          'Premier caractère : type (d=dossier, -=fichier, l=lien)',
          '3 groupes de 3 : propriétaire, groupe, autres',
          'rwx = read, write, execute'
        ],
        validation: (output: string, command: string) => {
          return command.trim() === 'ls -la';
        }
      },
      {
        id: 'step-chmod',
        title: 'Modifier les permissions',
        description: 'Rendez le fichier test.txt exécutable avec chmod +x test.txt',
        command: 'chmod +x test.txt',
        hint: '+x ajoute la permission d\'exécution',
        points: 20,
        explanation: 'chmod modifie les permissions. +x ajoute l\'exécution, -x la retire, =rwx définit exactement.',
        tips: [
          '+x ajoute l\'exécution pour tous',
          'u+x = utilisateur, g+x = groupe, o+x = autres',
          'chmod 755 = notation octale (rwxr-xr-x)'
        ],
        validation: (output: string, command: string) => {
          return command.includes('chmod +x test.txt');
        }
      },
      {
        id: 'step-file-info',
        title: 'Informations détaillées',
        description: 'Utilisez file test.txt pour connaître le type du fichier',
        command: 'file test.txt',
        hint: 'file analyse et décrit le contenu d\'un fichier',
        points: 10,
        explanation: 'La commande file examine le contenu et détermine le type de fichier, indépendamment de l\'extension.',
        tips: [
          'file analyse le contenu, pas l\'extension',
          'Utile pour identifier des fichiers sans extension',
          'Peut détecter les encodages de texte'
        ],
        validation: (output: string, command: string) => {
          return command.trim() === 'file test.txt';
        }
      }
    ]
  },

  {
    id: 'intermediate-search',
    title: 'Recherche et Filtrage',
    description: 'Maîtrisez les outils de recherche : find, grep et leurs options avancées.',
    level: 'intermediate',
    category: 'text',
    estimatedTime: 25,
    prerequisites: ['text-processing'],
    learningObjectives: [
      'Utiliser find pour localiser des fichiers',
      'Maîtriser grep pour chercher dans le contenu',
      'Combiner les outils de recherche',
      'Optimiser ses recherches'
    ],
    steps: [
      {
        id: 'step-find-name',
        title: 'Rechercher par nom',
        description: 'Utilisez find . -name "*.txt" pour trouver tous les fichiers .txt',
        command: 'find . -name "*.txt"',
        hint: '. = répertoire actuel, -name cherche par nom, * = joker',
        points: 20,
        explanation: 'find recherche des fichiers selon différents critères. -name cherche par nom avec support des jokers.',
        tips: [
          '. = chercher dans le répertoire actuel',
          '* = n\'importe quels caractères',
          '? = un seul caractère',
          'Utilisez des guillemets pour protéger les jokers'
        ],
        validation: (output: string, command: string) => {
          return command.includes('find . -name "*.txt"');
        }
      },
      {
        id: 'step-grep-content',
        title: 'Rechercher dans le contenu',
        description: 'Utilisez grep "Hello" *.txt pour chercher "Hello" dans tous les fichiers .txt',
        command: 'grep "Hello" *.txt',
        hint: 'grep cherche un motif dans le contenu des fichiers',
        points: 20,
        explanation: 'grep recherche des motifs (texte) dans le contenu des fichiers et affiche les lignes correspondantes.',
        tips: [
          'grep est sensible à la casse par défaut',
          'grep -i ignore la casse',
          'grep -n affiche les numéros de ligne',
          'grep -r recherche récursivement'
        ],
        validation: (output: string, command: string) => {
          return command.includes('grep "Hello" *.txt');
        }
      },
      {
        id: 'step-find-grep',
        title: 'Combiner find et grep',
        description: 'Combinez find et grep : find . -name "*.txt" -exec grep "Hello" {} \\;',
        command: 'find . -name "*.txt" -exec grep "Hello" {} \\;',
        hint: '-exec exécute une commande sur chaque fichier trouvé',
        points: 25,
        explanation: 'La combinaison find + grep permet de chercher du texte dans des fichiers spécifiques trouvés par find.',
        tips: [
          '-exec exécute une commande sur chaque résultat',
          '{} est remplacé par le nom du fichier',
          '\\; termine la commande -exec',
          'Alternative moderne : find ... | xargs grep ...'
        ],
        validation: (output: string, command: string) => {
          return command.includes('find . -name "*.txt" -exec grep "Hello" {} \\;');
        }
      }
    ]
  },

  // TUTORIEL AVANCÉ
  {
    id: 'advanced-pipes',
    title: 'Maîtrise des Pipes et Redirections',
    description: 'Apprenez les techniques avancées de chaînage de commandes, redirections et traitement de flux de données.',
    level: 'advanced',
    category: 'advanced',
    estimatedTime: 35,
    prerequisites: ['text-processing'],
    learningObjectives: [
      'Maîtriser les pipes complexes',
      'Comprendre les redirections avancées',
      'Utiliser tee pour diviser les flux',
      'Créer des pipelines de traitement de données'
    ],
    steps: [
      {
        id: 'step-complex-pipe',
        title: 'Pipeline complexe',
        description: 'Créez un pipeline qui trouve les 3 fruits les plus fréquents',
        command: 'sort fruits.txt | uniq -c | sort -nr | head -3',
        hint: 'Chaînez sort, uniq -c, sort -nr et head pour analyser les fréquences',
        points: 25,
        explanation: 'Ce pipeline complexe trie, compte les occurrences, retrie par fréquence décroissante et affiche le top 3.',
        tips: [
          'Décomposez les pipelines complexes étape par étape',
          'sort -nr trie numériquement en ordre décroissant',
          'head -n affiche les n premières lignes'
        ],
        interactiveDemo: true,
        validation: (output: string, command: string) => {
          return command.includes('sort fruits.txt | uniq -c | sort -nr | head -3');
        }
      },
      {
        id: 'step-tee',
        title: 'Diviser le flux avec tee',
        description: 'Utilisez tee pour sauvegarder et afficher simultanément',
        command: 'sort fruits.txt | uniq -c | tee comptage.txt | sort -nr',
        hint: 'tee sauvegarde dans un fichier tout en passant les données au pipe suivant',
        points: 20,
        explanation: 'La commande tee permet de "diviser" un flux : elle sauvegarde dans un fichier ET passe les données à la commande suivante.',
        tips: [
          'tee -a ajoute au fichier au lieu d\'écraser',
          'Très utile pour débugger des pipelines complexes',
          'Permet de sauvegarder des résultats intermédiaires'
        ],
        validation: (output: string, command: string) => {
          return command.includes('tee comptage.txt');
        }
      }
    ]
  },

  {
    id: 'advanced-file-operations',
    title: 'Opérations Avancées sur les Fichiers',
    description: 'Techniques avancées : liens symboliques, archives, compression et synchronisation de fichiers.',
    level: 'advanced',
    category: 'files',
    estimatedTime: 40,
    prerequisites: ['intermediate-file-management'],
    learningObjectives: [
      'Créer et gérer les liens symboliques',
      'Compresser et décompresser des archives',
      'Synchroniser des répertoires',
      'Gérer les attributs étendus'
    ],
    steps: [
      {
        id: 'step-symlink',
        title: 'Créer un lien symbolique',
        description: 'Créez un lien symbolique vers test.txt avec ln -s test.txt lien_test',
        command: 'ln -s test.txt lien_test',
        hint: 'ln -s crée un lien symbolique (raccourci)',
        points: 20,
        explanation: 'Les liens symboliques sont des raccourcis vers d\'autres fichiers. Ils permettent d\'accéder au même fichier depuis plusieurs emplacements.',
        tips: [
          'ln -s crée un lien symbolique (soft link)',
          'ln sans -s crée un lien dur (hard link)',
          'Les liens symboliques peuvent pointer vers des dossiers',
          'ls -l affiche la destination des liens'
        ],
        validation: (output: string, command: string) => {
          return command.includes('ln -s test.txt lien_test');
        }
      },
      {
        id: 'step-tar-create',
        title: 'Créer une archive',
        description: 'Créez une archive tar de votre dossier avec tar -czf mon_projet.tar.gz mon_projet/',
        command: 'tar -czf mon_projet.tar.gz mon_projet/',
        hint: '-c crée, -z compresse avec gzip, -f spécifie le nom du fichier',
        points: 25,
        explanation: 'tar est l\'outil standard pour créer des archives. Les options -czf créent une archive compressée.',
        tips: [
          '-c = create (créer)',
          '-z = gzip compression',
          '-f = file (nom du fichier)',
          '-v = verbose (afficher les détails)'
        ],
        validation: (output: string, command: string) => {
          return command.includes('tar -czf mon_projet.tar.gz mon_projet/');
        }
      },
      {
        id: 'step-tar-extract',
        title: 'Extraire une archive',
        description: 'Extrayez l\'archive avec tar -xzf mon_projet.tar.gz',
        command: 'tar -xzf mon_projet.tar.gz',
        hint: '-x extrait au lieu de créer',
        points: 20,
        explanation: 'L\'extraction d\'archives est l\'opération inverse de la création. -x remplace -c pour extraire.',
        tips: [
          '-x = extract (extraire)',
          'tar -tzf archive.tar.gz liste le contenu sans extraire',
          'Ajoutez -v pour voir les fichiers extraits'
        ],
        validation: (output: string, command: string) => {
          return command.includes('tar -xzf mon_projet.tar.gz');
        }
      }
    ]
  },

  // TUTORIELS EXPERT
  {
    id: 'expert-scripting',
    title: 'Scripting Bash Avancé',
    description: 'Maîtrisez les techniques avancées de scripting bash : variables, boucles, conditions et fonctions.',
    level: 'expert',
    category: 'advanced',
    estimatedTime: 45,
    prerequisites: ['advanced-pipes'],
    learningObjectives: [
      'Créer des scripts bash complexes',
      'Utiliser les variables et paramètres',
      'Maîtriser les structures de contrôle',
      'Gérer les erreurs et codes de retour'
    ],
    steps: [
      {
        id: 'step-script-creation',
        title: 'Créer un script exécutable',
        description: 'Créez un script backup.sh avec #!/bin/bash et rendez-le exécutable',
        command: 'echo "#!/bin/bash" > backup.sh && chmod +x backup.sh',
        hint: 'Utilisez echo avec redirection puis chmod +x pour rendre exécutable',
        points: 20,
        explanation: 'Le shebang #!/bin/bash indique l\'interpréteur à utiliser. chmod +x ajoute les permissions d\'exécution.',
        tips: [
          'Toujours commencer par le shebang approprié',
          'chmod +x rend un fichier exécutable',
          'Utilisez ./script.sh pour exécuter un script local'
        ],
        validation: (output: string, command: string) => {
          return command.includes('echo "#!/bin/bash" > backup.sh') && command.includes('chmod +x backup.sh');
        }
      },
      {
        id: 'step-variables',
        title: 'Utiliser des variables',
        description: 'Créez une variable DATE=$(date +%Y%m%d) et affichez-la',
        command: 'DATE=$(date +%Y%m%d) && echo "Backup du $DATE"',
        hint: 'Utilisez $() pour l\'exécution de commande et $VAR pour afficher une variable',
        points: 25,
        explanation: 'Les variables bash stockent des valeurs. $() exécute une commande et capture sa sortie.',
        tips: [
          'Pas d\'espaces autour du = dans les affectations',
          '$() est préférable aux backticks ``',
          'Utilisez ${VAR} pour délimiter clairement les variables'
        ],
        validation: (output: string, command: string) => {
          return command.includes('DATE=$(date +%Y%m%d)') && command.includes('echo');
        }
      }
    ]
  },

  {
    id: 'expert-system-admin',
    title: 'Administration Système Avancée',
    description: 'Techniques d\'administration système : processus, services, monitoring et automatisation.',
    level: 'expert',
    category: 'advanced',
    estimatedTime: 50,
    prerequisites: ['expert-scripting'],
    learningObjectives: [
      'Monitorer les processus système',
      'Gérer les services et démons',
      'Analyser les logs système',
      'Automatiser les tâches d\'administration'
    ],
    steps: [
      {
        id: 'step-process-monitoring',
        title: 'Surveiller les processus',
        description: 'Utilisez ps aux | grep bash pour voir les processus bash',
        command: 'ps aux | grep bash',
        hint: 'ps aux liste tous les processus, grep filtre ceux contenant "bash"',
        points: 20,
        explanation: 'ps aux affiche tous les processus avec détails. grep filtre les résultats selon un motif.',
        tips: [
          'ps aux montre tous les processus de tous les utilisateurs',
          'grep -v grep exclut la commande grep elle-même',
          'top et htop offrent une vue en temps réel'
        ],
        validation: (output: string, command: string) => {
          return command.includes('ps aux | grep bash');
        }
      },
      {
        id: 'step-system-info',
        title: 'Informations système',
        description: 'Affichez l\'utilisation disque avec df -h',
        command: 'df -h',
        hint: 'df affiche l\'espace disque, -h rend les tailles lisibles',
        points: 15,
        explanation: 'df (disk free) montre l\'espace disque disponible. -h affiche en format humain (KB, MB, GB).',
        tips: [
          'df -h est plus lisible que df seul',
          'du -h <dossier> montre la taille d\'un dossier',
          'free -h affiche l\'utilisation mémoire'
        ],
        validation: (output: string, command: string) => {
          return command.trim() === 'df -h';
        }
      }
    ]
  }
];

// Fonctions utilitaires améliorées
export const getTutorialById = (id: string): Tutorial | undefined => {
  return tutorials.find(tutorial => tutorial.id === id);
};

export const getTutorialsByLevel = (level: 'beginner' | 'intermediate' | 'advanced' | 'expert'): Tutorial[] => {
  return tutorials.filter(tutorial => tutorial.level === level);
};

export const getTutorialsByCategory = (category: string): Tutorial[] => {
  return tutorials.filter(tutorial => tutorial.category === category);
};

export const getAvailableTutorials = (completedTutorials: string[]): Tutorial[] => {
  return tutorials.filter(tutorial => {
    if (!tutorial.prerequisites) return true;
    return tutorial.prerequisites.every(prereq => completedTutorials.includes(prereq));
  });
};

export const getTutorialProgress = (tutorialId: string, completedSteps: string[]) => {
  const tutorial = getTutorialById(tutorialId);
  if (!tutorial) return null;
  
  const completed = tutorial.steps.filter(step => completedSteps.includes(step.id)).length;
  const total = tutorial.steps.length;
  const percentage = (completed / total) * 100;
  
  return {
    completed,
    total,
    percentage,
    isComplete: completed === total
  };
};

export const getTotalSteps = (): number => {
  return tutorials.reduce((total, tutorial) => total + tutorial.steps.length, 0);
};

export const getTotalPoints = (): number => {
  return tutorials.reduce((total, tutorial) => 
    total + tutorial.steps.reduce((stepTotal, step) => stepTotal + step.points, 0), 0
  );
};

export const getNextTutorial = (currentId: string, completedTutorials: string[]) => {
  const currentIndex = tutorials.findIndex(t => t.id === currentId);
  if (currentIndex === -1) return null;
  
  // Chercher le prochain tutoriel disponible
  for (let i = currentIndex + 1; i < tutorials.length; i++) {
    const tutorial = tutorials[i];
    if (!tutorial.prerequisites || 
        tutorial.prerequisites.every(prereq => completedTutorials.includes(prereq))) {
      return tutorial;
    }
  }
  
  return null;
};

export const getTutorialStats = () => {
  const stats = {
    total: tutorials.length,
    byLevel: {
      beginner: getTutorialsByLevel('beginner').length,
      intermediate: getTutorialsByLevel('intermediate').length,
      advanced: getTutorialsByLevel('advanced').length,
      expert: getTutorialsByLevel('expert').length
    },
    byCategory: {} as Record<string, number>,
    totalSteps: getTotalSteps(),
    totalPoints: getTotalPoints(),
    averageTime: Math.round(tutorials.reduce((sum, t) => sum + t.estimatedTime, 0) / tutorials.length)
  };
  
  tutorialCategories.forEach(category => {
    stats.byCategory[category.id] = getTutorialsByCategory(category.id).length;
  });
  
  return stats;
};

export const searchTutorials = (query: string): Tutorial[] => {
  if (!query.trim()) return tutorials;
  
  const searchTerm = query.toLowerCase();
  return tutorials.filter(tutorial => 
    tutorial.title.toLowerCase().includes(searchTerm) ||
    tutorial.description.toLowerCase().includes(searchTerm) ||
    tutorial.steps.some(step => 
      step.title.toLowerCase().includes(searchTerm) ||
      step.description.toLowerCase().includes(searchTerm) ||
      step.command.toLowerCase().includes(searchTerm)
    )
  );
}; 