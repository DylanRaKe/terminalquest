'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, FolderOpen, Copy, Move, Trash2, Plus, Eye, Terminal, Search, Settings, Download, Upload } from 'lucide-react'

interface Command {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  syntax: string
  examples: string[]
  terminalExamples: { command: string; output: string }[]
  options: { flag: string; description: string }[]
  notes: string[]
  category: 'navigation' | 'file-management' | 'content' | 'system' | 'concepts'
}

const commands: Command[] = [
  {
    id: 'ls',
    name: 'ls',
    icon: <Eye className="w-5 h-5" />,
    description: 'Affiche le contenu des répertoires. Montre les fichiers et dossiers dans l\'emplacement actuel.',
    syntax: 'ls [options] [répertoire]',
    examples: [
      'ls',
      'ls -l',
      'ls -la',
      'ls /home/user'
    ],
    terminalExamples: [
      {
        command: 'ls',
        output: 'Documents/\nDownloads/\nPictures/\nfile.txt\nscript.sh*'
      },
      {
        command: 'ls -l',
        output: 'total 24\ndrwxr-xr-x 2 user user 4096 Dec 25 10:30 Documents/\ndrwxr-xr-x 2 user user 4096 Dec 25 10:30 Downloads/\ndrwxr-xr-x 2 user user 4096 Dec 25 10:30 Pictures/\n-rw-r--r-- 1 user user  156 Dec 25 10:30 file.txt\n-rwxr-xr-x 1 user user  245 Dec 25 10:30 script.sh*'
      },
      {
        command: 'ls -la',
        output: 'total 32\ndrwxr-xr-x 5 user user 4096 Dec 25 10:30 ./\ndrwxr-xr-x 3 root root 4096 Dec 25 10:00 ../\n-rw-r--r-- 1 user user  220 Dec 25 10:00 .bashrc\ndrwxr-xr-x 2 user user 4096 Dec 25 10:30 Documents/\ndrwxr-xr-x 2 user user 4096 Dec 25 10:30 Downloads/\n-rw-r--r-- 1 user user  156 Dec 25 10:30 file.txt'
      }
    ],
    options: [
      { flag: '-l', description: 'Utilise le format de liste détaillé' },
      { flag: '-a', description: 'Affiche les fichiers cachés (commençant par .)' },
      { flag: '-h', description: 'Tailles de fichiers lisibles par l\'humain' },
      { flag: '-t', description: 'Trie par date de modification' }
    ],
    notes: [
      'Les répertoires sont affichés avec un slash final /',
      'Les fichiers exécutables sont marqués d\'un astérisque *',
      'Les fichiers cachés commencent par un point et ne sont pas affichés par défaut'
    ],
    category: 'navigation'
  },
  {
    id: 'cd',
    name: 'cd',
    icon: <FolderOpen className="w-5 h-5" />,
    description: 'Change de répertoire. Navigue entre les dossiers du système de fichiers.',
    syntax: 'cd [répertoire]',
    examples: [
      'cd',
      'cd /home/user',
      'cd ..',
      'cd ~/Documents',
      'cd -'
    ],
    terminalExamples: [
      {
        command: 'pwd\n/home/user/Documents\ncd ..\npwd',
        output: '/home/user/Documents\n/home/user'
      },
      {
        command: 'cd ~/Pictures\npwd',
        output: '/home/user/Pictures'
      },
      {
        command: 'cd /nonexistent',
        output: 'cd: No such file or directory: /nonexistent'
      }
    ],
    options: [
      { flag: '..', description: 'Aller au répertoire parent' },
      { flag: '~', description: 'Aller au répertoire personnel' },
      { flag: '-', description: 'Aller au répertoire précédent' },
      { flag: '/', description: 'Aller au répertoire racine' }
    ],
    notes: [
      'cd sans arguments va au répertoire personnel',
      'Utilisez la complétion par tabulation pour naviguer plus vite',
      'Les chemins relatifs partent du répertoire actuel',
      'Les chemins absolus partent de la racine /'
    ],
    category: 'navigation'
  },
  {
    id: 'cat',
    name: 'cat',
    icon: <FileText className="w-5 h-5" />,
    description: 'Affiche le contenu des fichiers. Lit et affiche le contenu des fichiers texte.',
    syntax: 'cat [options] fichier...',
    examples: [
      'cat file.txt',
      'cat file1.txt file2.txt',
      'cat -n document.txt',
      'cat > newfile.txt'
    ],
    terminalExamples: [
      {
        command: 'cat hello.txt',
        output: 'Hello World!\nThis is a sample file.\nEnd of file.'
      },
      {
        command: 'cat -n hello.txt',
        output: '     1\tHello World!\n     2\tThis is a sample file.\n     3\tEnd of file.'
      },
      {
        command: 'cat nonexistent.txt',
        output: 'cat: nonexistent.txt: No such file or directory'
      }
    ],
    options: [
      { flag: '-n', description: 'Numéroter toutes les lignes de sortie' },
      { flag: '-b', description: 'Numéroter seulement les lignes non vides' },
      { flag: '-s', description: 'Supprimer les lignes vides répétées' },
      { flag: '-A', description: 'Afficher tous les caractères y compris non-imprimables' }
    ],
    notes: [
      'Peut concaténer plusieurs fichiers',
      'Utiliser avec > pour créer des fichiers',
      'Utiliser avec >> pour ajouter à des fichiers',
      'Idéal pour les petits fichiers texte'
    ],
    category: 'content'
  },
  {
    id: 'mkdir',
    name: 'mkdir',
    icon: <Plus className="w-5 h-5" />,
    description: 'Crée des répertoires. Fait de nouveaux dossiers dans le système de fichiers.',
    syntax: 'mkdir [options] répertoire...',
    examples: [
      'mkdir newfolder',
      'mkdir dir1 dir2 dir3',
      'mkdir -p path/to/nested/dir',
      'mkdir -m 755 publicdir'
    ],
    terminalExamples: [
      {
        command: 'mkdir newfolder\nls',
        output: 'Documents/\nDownloads/\nnewfolder/\nfile.txt'
      },
      {
        command: 'mkdir -p deep/nested/structure\nls -la deep/nested/',
        output: 'total 8\ndrwxr-xr-x 3 user user 4096 Dec 25 10:30 ./\ndrwxr-xr-x 3 user user 4096 Dec 25 10:30 ../\ndrwxr-xr-x 2 user user 4096 Dec 25 10:30 structure/'
      },
      {
        command: 'mkdir existing_folder',
        output: 'mkdir: cannot create directory \'existing_folder\': File exists'
      }
    ],
    options: [
      { flag: '-p', description: 'Créer les répertoires parents si nécessaire' },
      { flag: '-m', description: 'Définir le mode de fichier (permissions)' },
      { flag: '-v', description: 'Afficher un message pour chaque répertoire créé' }
    ],
    notes: [
      'Les noms de répertoires ne peuvent pas contenir certains caractères spéciaux',
      'Utiliser -p pour créer des structures de répertoires imbriqués',
      'Les permissions peuvent être définies lors de la création',
      'Plusieurs répertoires peuvent être créés en une fois'
    ],
    category: 'file-management'
  },
  {
    id: 'touch',
    name: 'touch',
    icon: <FileText className="w-5 h-5" />,
    description: 'Crée des fichiers vides ou met à jour les horodatages de fichiers.',
    syntax: 'touch [options] fichier...',
    examples: [
      'touch newfile.txt',
      'touch file1.txt file2.txt',
      'touch -t 202312251200 file.txt',
      'touch -r reference.txt target.txt'
    ],
    terminalExamples: [
      {
        command: 'touch newfile.txt\nls -la newfile.txt',
        output: '-rw-r--r-- 1 user user 0 Dec 25 10:30 newfile.txt'
      },
      {
        command: 'touch file1.txt file2.txt file3.txt\nls *.txt',
        output: 'file1.txt\nfile2.txt\nfile3.txt'
      },
      {
        command: 'ls -l existing.txt\ntouch existing.txt\nls -l existing.txt',
        output: '-rw-r--r-- 1 user user 156 Dec 25 10:00 existing.txt\n-rw-r--r-- 1 user user 156 Dec 25 10:30 existing.txt'
      }
    ],
    options: [
      { flag: '-a', description: 'Changer seulement l\'heure d\'accès' },
      { flag: '-m', description: 'Changer seulement l\'heure de modification' },
      { flag: '-t', description: 'Utiliser l\'heure spécifiée au lieu de l\'heure actuelle' },
      { flag: '-r', description: 'Utiliser l\'heure du fichier de référence' }
    ],
    notes: [
      'Crée le fichier s\'il n\'existe pas',
      'Met à jour l\'horodatage si le fichier existe',
      'Utile pour créer des fichiers de substitution',
      'Peut définir des horodatages spécifiques'
    ],
    category: 'file-management'
  },
  {
    id: 'cp',
    name: 'cp',
    icon: <Copy className="w-5 h-5" />,
    description: 'Copie des fichiers et répertoires. Duplique des fichiers ou dossiers.',
    syntax: 'cp [options] source destination',
    examples: [
      'cp file.txt backup.txt',
      'cp -r folder/ backup_folder/',
      'cp *.txt /backup/',
      'cp -i file.txt existing.txt'
    ],
    terminalExamples: [
      {
        command: 'cp file.txt backup.txt\nls *.txt',
        output: 'backup.txt\nfile.txt'
      },
      {
        command: 'cp -r Documents/ Backup_Documents/\nls',
        output: 'Backup_Documents/\nDocuments/\nDownloads/\nfile.txt'
      },
      {
        command: 'cp -i file.txt existing.txt',
        output: 'cp: overwrite \'existing.txt\'? (y/n)'
      }
    ],
    options: [
      { flag: '-r', description: 'Copier les répertoires récursivement' },
      { flag: '-i', description: 'Demander avant d\'écraser' },
      { flag: '-f', description: 'Forcer la copie, écraser sans demander' },
      { flag: '-p', description: 'Préserver les attributs de fichier' },
      { flag: '-v', description: 'Sortie détaillée' }
    ],
    notes: [
      'Utiliser -r pour copier les répertoires',
      'Les caractères génériques peuvent être utilisés pour plusieurs fichiers',
      'Le fichier original reste inchangé',
      'Attention à l\'écrasement de fichiers existants'
    ],
    category: 'file-management'
  },
  {
    id: 'mv',
    name: 'mv',
    icon: <Move className="w-5 h-5" />,
    description: 'Déplace ou renomme des fichiers et répertoires.',
    syntax: 'mv [options] source destination',
    examples: [
      'mv oldname.txt newname.txt',
      'mv file.txt /new/location/',
      'mv *.txt documents/',
      'mv -i file.txt existing.txt'
    ],
    terminalExamples: [
      {
        command: 'ls\nmv oldname.txt newname.txt\nls',
        output: 'Documents/\noldname.txt\nfile.txt\nDocuments/\nnewname.txt\nfile.txt'
      },
      {
        command: 'mv file.txt Documents/\nls Documents/',
        output: 'file.txt\nother_files.txt'
      },
      {
        command: 'mv -i file.txt existing.txt',
        output: 'mv: overwrite \'existing.txt\'? (y/n)'
      }
    ],
    options: [
      { flag: '-i', description: 'Demander avant d\'écraser' },
      { flag: '-f', description: 'Forcer le déplacement, écraser sans demander' },
      { flag: '-n', description: 'Ne jamais écraser les fichiers existants' },
      { flag: '-v', description: 'Sortie détaillée' }
    ],
    notes: [
      'Peut renommer des fichiers et répertoires',
      'Peut déplacer des fichiers vers différents emplacements',
      'Le fichier original est supprimé après le déplacement',
      'Utiliser avec précaution pour éviter la perte de données'
    ],
    category: 'file-management'
  },
  {
    id: 'rm',
    name: 'rm',
    icon: <Trash2 className="w-5 h-5" />,
    description: 'Supprime des fichiers et répertoires. Supprime définitivement des fichiers.',
    syntax: 'rm [options] fichier...',
    examples: [
      'rm file.txt',
      'rm -r directory/',
      'rm -i *.tmp',
      'rm -rf old_project/'
    ],
    terminalExamples: [
      {
        command: 'ls\nrm file.txt\nls',
        output: 'Documents/\nfile.txt\nscript.sh\nDocuments/\nscript.sh'
      },
      {
        command: 'rm -i important.txt',
        output: 'rm: remove regular file \'important.txt\'? (y/n)'
      },
      {
        command: 'rm nonexistent.txt',
        output: 'rm: cannot remove \'nonexistent.txt\': No such file or directory'
      }
    ],
    options: [
      { flag: '-r', description: 'Supprimer les répertoires récursivement' },
      { flag: '-i', description: 'Demander avant chaque suppression' },
      { flag: '-f', description: 'Forcer la suppression, ignorer les fichiers inexistants' },
      { flag: '-v', description: 'Sortie détaillée' }
    ],
    notes: [
      'DANGER : La suppression est permanente !',
      'Utiliser -r pour supprimer les répertoires',
      'Utiliser -i pour la confirmation interactive',
      'Être extrêmement prudent avec la combinaison -rf'
    ],
    category: 'file-management'
  },
  {
    id: 'pwd',
    name: 'pwd',
    icon: <FolderOpen className="w-5 h-5" />,
    description: 'Affiche le répertoire de travail actuel. Montre le chemin complet du répertoire où vous vous trouvez.',
    syntax: 'pwd',
    examples: [
      'pwd'
    ],
    terminalExamples: [
      {
        command: 'pwd',
        output: '/home/user/Documents'
      },
      {
        command: 'cd /var/log\npwd',
        output: '/var/log'
      }
    ],
    options: [],
    notes: [
      'Très utile pour savoir où vous êtes dans le système de fichiers',
      'Affiche toujours le chemin absolu',
      'Aucune option nécessaire'
    ],
    category: 'navigation'
  },
  {
    id: 'grep',
    name: 'grep',
    icon: <Search className="w-5 h-5" />,
    description: 'Recherche des motifs dans les fichiers. Filtre les lignes contenant un texte spécifique.',
    syntax: 'grep [options] motif [fichier...]',
    examples: [
      'grep "error" log.txt',
      'grep -i "hello" file.txt',
      'grep -r "TODO" .',
      'ls | grep ".txt"'
    ],
    terminalExamples: [
      {
        command: 'grep "error" system.log',
        output: '[2023-12-25 10:30:15] ERROR: Connection failed\n[2023-12-25 10:35:22] ERROR: File not found'
      },
      {
        command: 'grep -i "hello" greeting.txt',
        output: 'Hello World!\nSay hello to everyone\nHELLO there!'
      },
      {
        command: 'ls | grep ".txt"',
        output: 'document.txt\nreadme.txt\nnotes.txt'
      }
    ],
    options: [
      { flag: '-i', description: 'Ignorer la casse (majuscules/minuscules)' },
      { flag: '-r', description: 'Recherche récursive dans les sous-répertoires' },
      { flag: '-n', description: 'Afficher les numéros de ligne' },
      { flag: '-v', description: 'Inverser la recherche (lignes ne contenant PAS le motif)' }
    ],
    notes: [
      'Très puissant pour filtrer et rechercher du contenu',
      'Peut être combiné avec d\'autres commandes via des pipes |',
      'Supporte les expressions régulières',
      'Essentiel pour l\'analyse de logs'
    ],
    category: 'content'
  },
  {
    id: 'chmod',
    name: 'chmod',
    icon: <Settings className="w-5 h-5" />,
    description: 'Change les permissions des fichiers et répertoires. Contrôle qui peut lire, écrire ou exécuter.',
    syntax: 'chmod [options] mode fichier...',
    examples: [
      'chmod 755 script.sh',
      'chmod +x program',
      'chmod -w file.txt',
      'chmod u+r,g-w,o-x file'
    ],
    terminalExamples: [
      {
        command: 'ls -l script.sh\nchmod +x script.sh\nls -l script.sh',
        output: '-rw-r--r-- 1 user user 245 Dec 25 10:30 script.sh\n-rwxr-xr-x 1 user user 245 Dec 25 10:30 script.sh'
      },
      {
        command: 'chmod 755 myprogram\nls -l myprogram',
        output: '-rwxr-xr-x 1 user user 1024 Dec 25 10:30 myprogram'
      }
    ],
    options: [
      { flag: '+x', description: 'Ajouter la permission d\'exécution' },
      { flag: '-w', description: 'Retirer la permission d\'écriture' },
      { flag: '-R', description: 'Appliquer récursivement aux sous-répertoires' },
      { flag: '755', description: 'rwxr-xr-x (propriétaire: tout, groupe/autres: lecture+exécution)' }
    ],
    notes: [
      'Les permissions sont cruciales pour la sécurité',
      '755 est courant pour les scripts exécutables',
      '644 est courant pour les fichiers de données',
      'Utilisez +x pour rendre un script exécutable'
    ],
    category: 'system'
  },
  {
    id: 'script-execution',
    name: './script.sh',
    icon: <Terminal className="w-5 h-5" />,
    description: 'Exécute un script ou programme. Le ./ indique l\'exécution depuis le répertoire actuel.',
    syntax: './nom_du_script [arguments]',
    examples: [
      './script.sh',
      './program --help',
      './backup.sh /home/user',
      'bash script.sh'
    ],
    terminalExamples: [
      {
        command: 'ls -l script.sh\n./script.sh',
        output: '-rwxr-xr-x 1 user user 245 Dec 25 10:30 script.sh\nHello World!\nScript executed successfully!'
      },
      {
        command: './script.sh',
        output: 'bash: ./script.sh: Permission denied'
      },
      {
        command: 'chmod +x script.sh\n./script.sh',
        output: 'Script is now executable!\nRunning backup process...'
      }
    ],
    options: [
      { flag: './', description: 'Exécuter depuis le répertoire actuel' },
      { flag: 'bash', description: 'Exécuter avec l\'interpréteur bash explicitement' },
      { flag: '--help', description: 'Afficher l\'aide (si supporté par le script)' }
    ],
    notes: [
      'Le fichier doit avoir les permissions d\'exécution (+x)',
      'Le ./ est nécessaire pour les scripts dans le répertoire actuel',
      'Alternative: bash script.sh (sans permission d\'exécution)',
      'Toujours vérifier la source avant d\'exécuter un script'
    ],
    category: 'system'
  },
  {
    id: 'wget',
    name: 'wget',
    icon: <Download className="w-5 h-5" />,
    description: 'Télécharge des fichiers depuis Internet. Outil en ligne de commande pour récupérer du contenu web.',
    syntax: 'wget [options] URL',
    examples: [
      'wget https://example.com/file.zip',
      'wget -O newname.txt https://site.com/file.txt',
      'wget -r https://site.com/',
      'wget --no-check-certificate https://site.com/file'
    ],
    terminalExamples: [
      {
        command: 'wget https://example.com/document.pdf',
        output: '--2023-12-25 10:30:15--  https://example.com/document.pdf\nResolving example.com... 93.184.216.34\nConnecting to example.com|93.184.216.34|:443... connected.\nHTTP request sent, awaiting response... 200 OK\nLength: 1048576 (1.0M) [application/pdf]\nSaving to: \'document.pdf\'\n\ndocument.pdf    100%[===================>]   1.00M  2.50MB/s    in 0.4s\n\n2023-12-25 10:30:16 (2.50 MB/s) - \'document.pdf\' saved [1048576/1048576]'
      },
      {
        command: 'wget -O rapport.pdf https://site.com/annual-report.pdf',
        output: '--2023-12-25 10:30:20--  https://site.com/annual-report.pdf\nSaving to: \'rapport.pdf\'\nrapport.pdf     100%[===================>]   2.50M  1.80MB/s    in 1.4s'
      }
    ],
    options: [
      { flag: '-O', description: 'Spécifier le nom du fichier de sortie' },
      { flag: '-r', description: 'Téléchargement récursif (site entier)' },
      { flag: '-c', description: 'Continuer un téléchargement interrompu' },
      { flag: '--no-check-certificate', description: 'Ignorer les erreurs de certificat SSL' }
    ],
    notes: [
      'Très utile pour télécharger des fichiers en ligne de commande',
      'Supporte HTTP, HTTPS et FTP',
      'Peut reprendre les téléchargements interrompus',
      'Alternative moderne: curl'
    ],
    category: 'system'
  },
  {
    id: 'curl',
    name: 'curl',
    icon: <Upload className="w-5 h-5" />,
    description: 'Transfère des données vers/depuis un serveur. Plus polyvalent que wget pour les APIs et requêtes HTTP.',
    syntax: 'curl [options] URL',
    examples: [
      'curl https://api.github.com/users/octocat',
      'curl -o file.html https://example.com',
      'curl -X POST -d "data=value" https://api.com/endpoint',
      'curl -H "Authorization: Bearer token" https://api.com'
    ],
    terminalExamples: [
      {
        command: 'curl https://httpbin.org/ip',
        output: '{\n  "origin": "203.0.113.42"\n}'
      },
      {
        command: 'curl -o page.html https://example.com',
        output: '  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n                                 Dload  Upload   Total   Spent    Left  Speed\n100  1256  100  1256    0     0   8960      0 --:--:-- --:--:-- --:--:--  9014'
      },
      {
        command: 'curl -I https://google.com',
        output: 'HTTP/2 200\ndate: Mon, 25 Dec 2023 10:30:15 GMT\ncontent-type: text/html; charset=ISO-8859-1\nserver: gws'
      }
    ],
    options: [
      { flag: '-o', description: 'Sauvegarder dans un fichier' },
      { flag: '-I', description: 'Afficher seulement les en-têtes HTTP' },
      { flag: '-X', description: 'Spécifier la méthode HTTP (GET, POST, PUT, etc.)' },
      { flag: '-H', description: 'Ajouter un en-tête HTTP personnalisé' },
      { flag: '-d', description: 'Envoyer des données (POST)' }
    ],
    notes: [
      'Excellent pour tester des APIs REST',
      'Plus puissant que wget pour les requêtes HTTP complexes',
      'Supporte de nombreux protocoles (HTTP, FTP, SMTP, etc.)',
      'Indispensable pour le développement web'
         ],
     category: 'system'
   },
   {
     id: 'pipes',
     name: 'Pipes |',
     icon: <Terminal className="w-5 h-5" />,
     description: 'Connecte la sortie d\'une commande à l\'entrée d\'une autre. Permet de chaîner les commandes.',
     syntax: 'commande1 | commande2',
     examples: [
       'ls | grep ".txt"',
       'cat file.txt | grep "error"',
       'ps aux | grep "firefox"',
       'history | tail -10'
     ],
     terminalExamples: [
       {
         command: 'ls -la | grep "Dec 25"',
         output: '-rw-r--r-- 1 user user  156 Dec 25 10:30 file.txt\n-rwxr-xr-x 1 user user  245 Dec 25 10:30 script.sh'
       },
       {
         command: 'cat access.log | grep "404" | wc -l',
         output: '23'
       },
       {
         command: 'ps aux | grep "python" | head -5',
         output: 'user     1234  0.5  2.1 123456 87654 ?        S    10:30   0:01 python script.py\nuser     5678  0.2  1.8 98765  65432 ?        S    10:25   0:00 python -m http.server'
       }
     ],
     options: [
       { flag: '|', description: 'Pipe standard - passe la sortie à la commande suivante' },
       { flag: '>', description: 'Redirection vers un fichier (écrase)' },
       { flag: '>>', description: 'Redirection vers un fichier (ajoute)' },
       { flag: '<', description: 'Redirection depuis un fichier' }
     ],
     notes: [
       'Concept fondamental pour combiner des commandes',
       'Permet de créer des chaînes de traitement puissantes',
       'La sortie de gauche devient l\'entrée de droite',
       'Très utile pour filtrer et traiter des données'
     ],
     category: 'concepts'
   },
   {
     id: 'wildcards',
     name: 'Wildcards *?',
     icon: <Search className="w-5 h-5" />,
     description: 'Caractères spéciaux pour faire correspondre des motifs de noms de fichiers.',
     syntax: '* (tout) ? (un caractère) [abc] (caractères spécifiques)',
     examples: [
       'ls *.txt',
       'rm temp*',
       'cp *.jpg backup/',
       'ls file?.txt'
     ],
     terminalExamples: [
       {
         command: 'ls *.txt',
         output: 'document.txt\nreadme.txt\nnotes.txt'
       },
       {
         command: 'ls file?.txt',
         output: 'file1.txt\nfile2.txt\nfileA.txt'
       },
       {
         command: 'ls [abc]*.txt',
         output: 'archive.txt\nbackup.txt\nconfig.txt'
       }
     ],
     options: [
       { flag: '*', description: 'Correspond à zéro ou plusieurs caractères' },
       { flag: '?', description: 'Correspond à exactement un caractère' },
       { flag: '[abc]', description: 'Correspond à un des caractères spécifiés' },
       { flag: '[a-z]', description: 'Correspond à une plage de caractères' }
     ],
     notes: [
       'Très utile pour sélectionner plusieurs fichiers',
       'Attention: * peut correspondre à beaucoup de fichiers',
       'Utilisez ls d\'abord pour vérifier ce qui sera sélectionné',
       'Les wildcards sont interprétés par le shell'
     ],
     category: 'concepts'
   },
   {
     id: 'paths',
     name: 'Chemins',
     icon: <FolderOpen className="w-5 h-5" />,
     description: 'Comprendre les chemins absolus et relatifs dans le système de fichiers.',
     syntax: '/chemin/absolu ou chemin/relatif',
     examples: [
       '/home/user/Documents',
       '../parent/file.txt',
       './current/file.txt',
       '~/Documents/file.txt'
     ],
     terminalExamples: [
       {
         command: 'pwd\ncd ../\npwd',
         output: '/home/user/Documents\n/home/user'
       },
       {
         command: 'ls ~/Desktop',
         output: 'file1.txt\nfolder1/\nimage.png'
       },
       {
         command: 'cat ./config/settings.txt',
         output: 'debug=true\nport=8080\nhost=localhost'
       }
     ],
     options: [
       { flag: '/', description: 'Chemin absolu depuis la racine' },
       { flag: './', description: 'Répertoire actuel' },
       { flag: '../', description: 'Répertoire parent' },
       { flag: '~/', description: 'Répertoire personnel de l\'utilisateur' }
     ],
     notes: [
       'Les chemins absolus commencent toujours par /',
       'Les chemins relatifs dépendent de votre position actuelle',
       '~ est un raccourci vers votre dossier personnel',
       '. représente le répertoire actuel, .. le parent'
     ],
     category: 'concepts'
   }
 ]

const categories = {
  navigation: { name: 'Navigation', color: 'from-blue-500 to-cyan-500' },
  'file-management': { name: 'Gestion de Fichiers', color: 'from-green-500 to-emerald-500' },
  content: { name: 'Contenu', color: 'from-purple-500 to-violet-500' },
  system: { name: 'Système', color: 'from-orange-500 to-red-500' },
  concepts: { name: 'Concepts de Base', color: 'from-pink-500 to-rose-500' }
}

export function CLIDocumentation() {
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')

  const filteredCommands = commands.filter(cmd => {
    const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory
    const matchesSearch = searchTerm === '' || 
      cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.notes.some(note => note.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen text-white pt-16">
      <div className="container mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
            Référence des Commandes CLI
          </h1>
          <p className="text-gray-300 text-lg">
            Guide complet de l&apos;interface en ligne de commande Linux
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-md mx-auto mb-6"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une commande..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-white text-black'
                : 'bg-black/30 text-gray-300 hover:bg-black/50'
            }`}
          >
            Toutes les Commandes
          </button>
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === key
                  ? `bg-gradient-to-r ${category.color} text-white`
                  : 'bg-black/30 text-gray-300 hover:bg-black/50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Commands Grid */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredCommands.map((command, index) => (
            <motion.div
              key={command.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCommand(command)}
              className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-gray-500 cursor-pointer transition-all group"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${categories[command.category].color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {command.icon}
              </div>
              <h3 className="text-xl font-bold text-green-400 mb-2 font-mono">
                {command.name}
              </h3>
              <p className="text-gray-300 text-sm mb-3">
                {command.description}
              </p>
              <div className="text-xs text-gray-500 bg-black/30 rounded px-2 py-1 font-mono">
                {command.syntax}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Command Detail Modal */}
        <AnimatePresence>
          {selectedCommand && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedCommand(null)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-800 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-600"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${categories[selectedCommand.category].color} flex items-center justify-center`}>
                      {selectedCommand.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-green-400 font-mono">
                        {selectedCommand.name}
                      </h2>
                      <p className="text-gray-400">
                        {categories[selectedCommand.category].name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCommand(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                                 {/* Description */}
                 <div className="mb-6">
                   <h3 className="text-xl font-semibold mb-3 text-yellow-400">Description</h3>
                   <p className="text-gray-300 leading-relaxed">
                     {selectedCommand.description}
                   </p>
                 </div>

                 {/* Syntax */}
                 <div className="mb-6">
                   <h3 className="text-xl font-semibold mb-3 text-yellow-400">Syntaxe</h3>
                   <div className="bg-black/50 rounded-lg p-4 font-mono text-green-400 border border-gray-600">
                     {selectedCommand.syntax}
                   </div>
                 </div>

                 {/* Examples */}
                 <div className="mb-6">
                   <h3 className="text-xl font-semibold mb-3 text-yellow-400">Exemples</h3>
                   <div className="space-y-2">
                     {selectedCommand.examples.map((example, index) => (
                       <div key={index} className="bg-black/50 rounded-lg p-3 font-mono text-green-400 border border-gray-700">
                         $ {example}
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Terminal Examples */}
                 <div className="mb-6">
                   <h3 className="text-xl font-semibold mb-3 text-yellow-400">Exemples Terminal avec Sortie</h3>
                   <div className="space-y-4">
                     {selectedCommand.terminalExamples.map((example, index) => (
                       <div key={index} className="bg-black/70 rounded-lg border border-gray-600 overflow-hidden">
                         <div className="bg-gray-800 px-4 py-2 text-sm text-gray-300 border-b border-gray-600">
                           Session Terminal
                         </div>
                         <div className="p-4 font-mono text-sm">
                           <div className="text-green-400 mb-2">
                             {example.command.split('\n').map((line, lineIndex) => (
                               <div key={lineIndex}>
                                 {line.startsWith('/') ? (
                                   <span className="text-blue-400">{line}</span>
                                 ) : (
                                   <>
                                     <span className="text-gray-400">$ </span>
                                     <span className="text-green-400">{line}</span>
                                   </>
                                 )}
                               </div>
                             ))}
                           </div>
                           <div className="text-gray-300 whitespace-pre-line border-t border-gray-700 pt-2">
                             {example.output}
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Options */}
                 {selectedCommand.options.length > 0 && (
                   <div className="mb-6">
                     <h3 className="text-xl font-semibold mb-3 text-yellow-400">Options Courantes</h3>
                     <div className="space-y-3">
                       {selectedCommand.options.map((option, index) => (
                         <div key={index} className="flex items-start gap-4 bg-black/30 rounded-lg p-3">
                           <code className="text-green-400 font-mono font-bold min-w-[60px]">
                             {option.flag}
                           </code>
                           <p className="text-gray-300">
                             {option.description}
                           </p>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}

                 {/* Notes */}
                 {selectedCommand.notes.length > 0 && (
                   <div>
                     <h3 className="text-xl font-semibold mb-3 text-yellow-400">Notes Importantes</h3>
                     <div className="space-y-2">
                       {selectedCommand.notes.map((note, index) => (
                         <div key={index} className="flex items-start gap-3">
                           <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                           <p className="text-gray-300">
                             {note}
                           </p>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 