import { Tutorial } from '../stores/tutorialStore';





export const tutorials: Tutorial[] = [
  // TUTORIELS DÉBUTANT
  {
    id: 'basic-navigation',
    title: 'Navigation de Base',
    description: 'Apprenez à naviguer dans le système de fichiers avec pwd, ls et cd',
    level: 'beginner',
    estimatedTime: 15,
    steps: [
      {
        id: 'step-pwd',
        title: 'Où suis-je ?',
        description: 'Utilisez la commande pwd pour afficher votre répertoire actuel',
        command: 'pwd',
        hint: 'pwd signifie "print working directory" - tapez simplement pwd et appuyez sur Entrée',
        points: 10,
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
        validation: (output: string, command: string) => {
          return command.trim() === 'pwd' && output.includes('/home/user/Documents');
        }
      }
    ]
  },

  {
    id: 'file-operations',
    title: 'Opérations sur les Fichiers',
    description: 'Créez, copiez, déplacez et supprimez des fichiers',
    level: 'beginner',
    estimatedTime: 20,
    prerequisites: ['basic-navigation'],
    steps: [
      {
        id: 'step-touch',
        title: 'Créer un fichier',
        description: 'Utilisez touch pour créer un fichier vide nommé "test.txt"',
        command: 'touch test.txt',
        hint: 'touch crée un fichier vide s\'il n\'existe pas',
        points: 10,
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
        validation: (output: string, command: string) => {
          return command.trim() === 'rm test.txt';
        }
      }
    ]
  },

  // TUTORIELS INTERMÉDIAIRES
  {
    id: 'text-processing',
    title: 'Traitement de Texte',
    description: 'Maîtrisez grep, sort, uniq et les pipes pour traiter du texte',
    level: 'intermediate',
    estimatedTime: 25,
    prerequisites: ['file-operations'],
    steps: [
      {
        id: 'step-create-data',
        title: 'Créer des données de test',
        description: 'Créez un fichier avec plusieurs lignes de texte',
        command: 'echo -e "pomme\\nbanane\\npomme\\norange\\nbanane\\nkiwi" > fruits.txt',
        hint: 'L\'option -e permet d\'interpréter les caractères d\'échappement comme \\n',
        points: 15,
        validation: (output: string, command: string) => {
          return command.includes('echo -e') && command.includes('fruits.txt');
        }
      },
      {
        id: 'step-cat-data',
        title: 'Vérifier le contenu',
        description: 'Affichez le contenu du fichier fruits.txt',
        command: 'cat fruits.txt',
        hint: 'Vous devriez voir une liste de fruits, certains répétés',
        points: 10,
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
        validation: (output: string, command: string) => {
          return command.trim() === 'sort fruits.txt';
        }
      },
      {
        id: 'step-pipe-sort-uniq',
        title: 'Combiner sort et uniq',
        description: 'Utilisez un pipe pour trier et supprimer les doublons',
        command: 'sort fruits.txt | uniq',
        hint: 'Le pipe | connecte la sortie de sort à l\'entrée de uniq',
        points: 20,
        validation: (output: string, command: string) => {
          return command.includes('sort fruits.txt | uniq');
        }
      },
      {
        id: 'step-count-uniq',
        title: 'Compter les occurrences',
        description: 'Utilisez sort et uniq -c pour compter chaque fruit',
        command: 'sort fruits.txt | uniq -c',
        hint: 'L\'option -c de uniq compte les occurrences',
        points: 20,
        validation: (output: string, command: string) => {
          return command.includes('sort fruits.txt | uniq -c');
        }
      }
    ]
  },

  {
    id: 'file-permissions',
    title: 'Permissions de Fichiers',
    description: 'Comprenez et modifiez les permissions Unix',
    level: 'intermediate',
    estimatedTime: 20,
    prerequisites: ['file-operations'],
    steps: [
      {
        id: 'step-create-script',
        title: 'Créer un script',
        description: 'Créez un fichier script.sh avec echo',
        command: 'echo "#!/bin/bash\\necho \\"Hello from script\\"" > script.sh',
        hint: 'Nous créons un script bash simple',
        points: 15,
        validation: (output: string, command: string) => {
          return command.includes('echo') && command.includes('script.sh');
        }
      },
      {
        id: 'step-ls-permissions',
        title: 'Voir les permissions',
        description: 'Utilisez ls -l pour voir les permissions du script',
        command: 'ls -l script.sh',
        hint: 'Les permissions sont affichées au début de chaque ligne',
        points: 10,
        validation: (output: string, command: string) => {
          return command.trim() === 'ls -l script.sh' && output.includes('script.sh');
        }
      },
      {
        id: 'step-chmod-execute',
        title: 'Ajouter permission d\'exécution',
        description: 'Utilisez chmod +x pour rendre le script exécutable',
        command: 'chmod +x script.sh',
        hint: '+x ajoute la permission d\'exécution pour tous',
        points: 15,
        validation: (output: string, command: string) => {
          return command.trim() === 'chmod +x script.sh';
        }
      },
      {
        id: 'step-verify-permissions',
        title: 'Vérifier les nouvelles permissions',
        description: 'Utilisez ls -l pour voir que le script est maintenant exécutable',
        command: 'ls -l script.sh',
        hint: 'Vous devriez voir des "x" dans les permissions',
        points: 10,
        validation: (output: string, command: string) => {
          return command.trim() === 'ls -l script.sh';
        }
      },
      {
        id: 'step-chmod-numeric',
        title: 'Permissions numériques',
        description: 'Utilisez chmod 755 pour définir des permissions spécifiques',
        command: 'chmod 755 script.sh',
        hint: '755 = rwxr-xr-x (lecture/écriture/exécution pour le propriétaire, lecture/exécution pour les autres)',
        points: 20,
        validation: (output: string, command: string) => {
          return command.trim() === 'chmod 755 script.sh';
        }
      }
    ]
  },

  // TUTORIELS AVANCÉS
  {
    id: 'advanced-search',
    title: 'Recherche Avancée',
    description: 'Maîtrisez find, grep avec regex et les recherches complexes',
    level: 'advanced',
    estimatedTime: 30,
    prerequisites: ['text-processing', 'file-permissions'],
    steps: [
      {
        id: 'step-find-name',
        title: 'Rechercher par nom',
        description: 'Utilisez find pour chercher tous les fichiers .txt',
        command: 'find . -name "*.txt"',
        hint: 'find recherche dans l\'arborescence, -name filtre par nom',
        points: 15,
        validation: (output: string, command: string) => {
          return command.includes('find . -name "*.txt"');
        }
      },
      {
        id: 'step-find-type',
        title: 'Rechercher par type',
        description: 'Utilisez find pour chercher uniquement les répertoires',
        command: 'find . -type d',
        hint: '-type d filtre pour les répertoires (directories)',
        points: 15,
        validation: (output: string, command: string) => {
          return command.trim() === 'find . -type d';
        }
      },
      {
        id: 'step-grep-recursive',
        title: 'Recherche récursive',
        description: 'Utilisez grep -r pour chercher "Hello" dans tous les fichiers',
        command: 'grep -r "Hello" .',
        hint: '-r fait une recherche récursive dans tous les sous-dossiers',
        points: 20,
        validation: (output: string, command: string) => {
          return command.includes('grep -r "Hello" .');
        }
      },
      {
        id: 'step-grep-regex',
        title: 'Expressions régulières',
        description: 'Utilisez grep avec une regex pour trouver les mots commençant par "p"',
        command: 'grep "^p" fruits.txt',
        hint: '^ indique le début de ligne en regex',
        points: 25,
        validation: (output: string, command: string) => {
          return command.includes('grep "^p" fruits.txt');
        }
      },
      {
        id: 'step-complex-pipe',
        title: 'Pipeline complexe',
        description: 'Combinez find, grep et wc pour compter les lignes contenant "echo"',
        command: 'find . -name "*.sh" | xargs grep "echo" | wc -l',
        hint: 'xargs passe les résultats de find à grep, wc -l compte les lignes',
        points: 30,
        validation: (output: string, command: string) => {
          return command.includes('find') && command.includes('xargs') && command.includes('grep') && command.includes('wc -l');
        }
      }
    ]
  },

  {
    id: 'system-monitoring',
    title: 'Surveillance Système',
    description: 'Apprenez à surveiller les processus et l\'utilisation des ressources',
    level: 'advanced',
    estimatedTime: 25,
    prerequisites: ['advanced-search'],
    steps: [
      {
        id: 'step-ps',
        title: 'Lister les processus',
        description: 'Utilisez ps aux pour voir tous les processus en cours',
        command: 'ps aux',
        hint: 'ps aux affiche tous les processus avec des détails',
        points: 15,
        validation: (output: string, command: string) => {
          return command.trim() === 'ps aux';
        }
      },
      {
        id: 'step-ps-grep',
        title: 'Filtrer les processus',
        description: 'Utilisez ps et grep pour trouver les processus bash',
        command: 'ps aux | grep bash',
        hint: 'Combinez ps avec grep pour filtrer',
        points: 20,
        validation: (output: string, command: string) => {
          return command.includes('ps aux | grep bash');
        }
      },
      {
        id: 'step-top',
        title: 'Surveillance en temps réel',
        description: 'Utilisez top pour voir l\'utilisation des ressources (puis q pour quitter)',
        command: 'top',
        hint: 'top affiche les processus en temps réel, tapez q pour quitter',
        points: 15,
        validation: (output: string, command: string) => {
          return command.trim() === 'top';
        }
      },
      {
        id: 'step-df',
        title: 'Espace disque',
        description: 'Utilisez df -h pour voir l\'utilisation de l\'espace disque',
        command: 'df -h',
        hint: '-h affiche les tailles en format lisible (human readable)',
        points: 15,
        validation: (output: string, command: string) => {
          return command.trim() === 'df -h';
        }
      },
      {
        id: 'step-du',
        title: 'Taille des dossiers',
        description: 'Utilisez du -sh * pour voir la taille de chaque élément',
        command: 'du -sh *',
        hint: '-s résume, -h format lisible, * pour tous les éléments',
        points: 20,
        validation: (output: string, command: string) => {
          return command.trim() === 'du -sh *';
        }
      }
    ]
  }
];

// Fonctions utilitaires
export const getTutorialById = (id: string): Tutorial | undefined => {
  return tutorials.find(tutorial => tutorial.id === id);
};

export const getTutorialsByLevel = (level: 'beginner' | 'intermediate' | 'advanced'): Tutorial[] => {
  return tutorials.filter(tutorial => tutorial.level === level);
};

export const getAvailableTutorials = (completedTutorials: string[]): Tutorial[] => {
  return tutorials.filter(tutorial => {
    if (!tutorial.prerequisites) return true;
    return tutorial.prerequisites.every(prereq => completedTutorials.includes(prereq));
  });
};

export const getTotalSteps = (): number => {
  return tutorials.reduce((total, tutorial) => total + tutorial.steps.length, 0);
};

export const getTotalPoints = (): number => {
  return tutorials.reduce((total, tutorial) => 
    total + tutorial.steps.reduce((stepTotal, step) => stepTotal + step.points, 0), 0
  );
};

export const getNextTutorial = (currentId: string) => {
  const currentIndex = tutorials.findIndex(t => t.id === currentId);
  return currentIndex < tutorials.length - 1 ? tutorials[currentIndex + 1] : null;
}; 