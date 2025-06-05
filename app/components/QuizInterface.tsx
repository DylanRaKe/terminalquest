'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { CheckCircle, XCircle, RotateCcw, BookOpen, Star, Zap, Flame, Crown, Award, Trophy } from 'lucide-react'
import Link from 'next/link'
import { quizStorage, QuizStats } from '../lib/quizStorage'

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: string
}

interface QuizFormData {
  [key: string]: number
}

type DifficultyLevel = 'facile' | 'moyen' | 'difficile' | 'experimente'

const difficultyConfig = {
  facile: {
    name: 'Facile',
    icon: Star,
    color: 'from-green-500 to-blue-500',
    description: 'Commandes de base pour débuter',
    questions: 10
  },
  moyen: {
    name: 'Moyen',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    description: 'Commandes intermédiaires et options',
    questions: 12
  },
  difficile: {
    name: 'Difficile',
    icon: Flame,
    color: 'from-orange-500 to-red-500',
    description: 'Commandes avancées et combinaisons',
    questions: 15
  },
  experimente: {
    name: 'Expérimenté',
    icon: Crown,
    color: 'from-purple-500 to-pink-500',
    description: 'Maîtrise complète et cas complexes',
    questions: 20
  }
}

const quizQuestions: Record<DifficultyLevel, QuizQuestion[]> = {
  facile: [
    {
      id: 1,
      question: "Quelle commande permet de lister le contenu d'un répertoire ?",
      options: ["ls", "dir", "list", "show"],
      correctAnswer: 0,
      explanation: "La commande 'ls' (list) est utilisée pour afficher le contenu d'un répertoire sous Linux/Unix.",
      category: "Navigation"
    },
    {
      id: 2,
      question: "Comment changer de répertoire vers le dossier parent ?",
      options: ["cd ..", "cd parent", "cd up", "cd /"],
      correctAnswer: 0,
      explanation: "La commande 'cd ..' permet de remonter d'un niveau dans l'arborescence des dossiers.",
      category: "Navigation"
    },
    {
      id: 3,
      question: "Quelle commande affiche le répertoire de travail actuel ?",
      options: ["cwd", "pwd", "where", "current"],
      correctAnswer: 1,
      explanation: "La commande 'pwd' (print working directory) affiche le chemin complet du répertoire actuel.",
      category: "Navigation"
    },
    {
      id: 4,
      question: "Comment créer un nouveau répertoire nommé 'test' ?",
      options: ["create test", "mkdir test", "new test", "make test"],
      correctAnswer: 1,
      explanation: "La commande 'mkdir' (make directory) permet de créer un nouveau répertoire.",
      category: "Gestion de fichiers"
    },
    {
      id: 5,
      question: "Quelle commande permet de copier un fichier ?",
      options: ["copy", "cp", "duplicate", "clone"],
      correctAnswer: 1,
      explanation: "La commande 'cp' (copy) est utilisée pour copier des fichiers ou des répertoires.",
      category: "Gestion de fichiers"
    },
    {
      id: 6,
      question: "Comment supprimer un fichier nommé 'document.txt' ?",
      options: ["delete document.txt", "rm document.txt", "remove document.txt", "del document.txt"],
      correctAnswer: 1,
      explanation: "La commande 'rm' (remove) permet de supprimer des fichiers.",
      category: "Gestion de fichiers"
    },
    {
      id: 7,
      question: "Quelle commande affiche le contenu d'un fichier texte ?",
      options: ["show", "cat", "display", "read"],
      correctAnswer: 1,
      explanation: "La commande 'cat' (concatenate) affiche le contenu d'un ou plusieurs fichiers.",
      category: "Lecture de fichiers"
    },
    {
      id: 8,
      question: "Comment rechercher un fichier nommé 'config.txt' dans le système ?",
      options: ["search config.txt", "find . -name config.txt", "locate config.txt", "grep config.txt"],
      correctAnswer: 1,
      explanation: "La commande 'find . -name config.txt' recherche le fichier dans le répertoire actuel et ses sous-répertoires.",
      category: "Recherche"
    },
    {
      id: 9,
      question: "Quelle commande permet de voir les processus en cours d'exécution ?",
      options: ["processes", "ps", "tasks", "running"],
      correctAnswer: 1,
      explanation: "La commande 'ps' (process status) affiche la liste des processus en cours d'exécution.",
      category: "Système"
    },
    {
      id: 10,
      question: "Comment afficher l'aide d'une commande, par exemple 'ls' ?",
      options: ["ls help", "help ls", "ls --help", "man ls"],
      correctAnswer: 3,
      explanation: "La commande 'man ls' affiche le manuel complet de la commande ls. 'ls --help' fonctionne aussi pour un résumé rapide.",
      category: "Aide"
    }
  ],
  moyen: [
    {
      id: 11,
      question: "Comment lister les fichiers cachés avec ls ?",
      options: ["ls -h", "ls -a", "ls --hidden", "ls -show"],
      correctAnswer: 1,
      explanation: "L'option '-a' (all) de ls affiche tous les fichiers, y compris les fichiers cachés qui commencent par un point.",
      category: "Navigation"
    },
    {
      id: 12,
      question: "Quelle commande permet de déplacer/renommer un fichier ?",
      options: ["move", "mv", "rename", "rn"],
      correctAnswer: 1,
      explanation: "La commande 'mv' (move) permet à la fois de déplacer et de renommer des fichiers et répertoires.",
      category: "Gestion de fichiers"
    },
    {
      id: 13,
      question: "Comment copier récursivement un répertoire et son contenu ?",
      options: ["cp -r", "cp --recursive", "cp -R", "Toutes les réponses"],
      correctAnswer: 3,
      explanation: "Les options -r, -R et --recursive de cp permettent toutes de copier récursivement un répertoire.",
      category: "Gestion de fichiers"
    },
    {
      id: 14,
      question: "Quelle commande affiche les dernières lignes d'un fichier ?",
      options: ["tail", "end", "last", "bottom"],
      correctAnswer: 0,
      explanation: "La commande 'tail' affiche les dernières lignes d'un fichier (10 par défaut).",
      category: "Lecture de fichiers"
    },
    {
      id: 15,
      question: "Comment rechercher du texte dans un fichier ?",
      options: ["search", "find", "grep", "look"],
      correctAnswer: 2,
      explanation: "La commande 'grep' permet de rechercher des motifs de texte dans des fichiers.",
      category: "Recherche"
    },
    {
      id: 16,
      question: "Quelle commande affiche l'utilisation de l'espace disque ?",
      options: ["disk", "df", "space", "usage"],
      correctAnswer: 1,
      explanation: "La commande 'df' (disk free) affiche l'utilisation de l'espace disque des systèmes de fichiers montés.",
      category: "Système"
    },
    {
      id: 17,
      question: "Comment changer les permissions d'un fichier ?",
      options: ["chmod", "perm", "access", "rights"],
      correctAnswer: 0,
      explanation: "La commande 'chmod' (change mode) permet de modifier les permissions d'accès aux fichiers et répertoires.",
      category: "Permissions"
    },
    {
      id: 18,
      question: "Quelle commande affiche qui est connecté au système ?",
      options: ["users", "who", "logged", "connected"],
      correctAnswer: 1,
      explanation: "La commande 'who' affiche la liste des utilisateurs actuellement connectés au système.",
      category: "Système"
    },
    {
      id: 19,
      question: "Comment afficher les premières lignes d'un fichier ?",
      options: ["head", "top", "first", "begin"],
      correctAnswer: 0,
      explanation: "La commande 'head' affiche les premières lignes d'un fichier (10 par défaut).",
      category: "Lecture de fichiers"
    },
    {
      id: 20,
      question: "Quelle commande permet de compter les lignes d'un fichier ?",
      options: ["count", "wc", "lines", "num"],
      correctAnswer: 1,
      explanation: "La commande 'wc' (word count) avec l'option -l compte le nombre de lignes dans un fichier.",
      category: "Analyse de fichiers"
    },
    {
      id: 21,
      question: "Comment créer un lien symbolique ?",
      options: ["link", "ln -s", "symlink", "mklink"],
      correctAnswer: 1,
      explanation: "La commande 'ln -s' crée un lien symbolique vers un fichier ou répertoire.",
      category: "Gestion de fichiers"
    },
    {
      id: 22,
      question: "Quelle commande affiche l'historique des commandes ?",
      options: ["hist", "history", "past", "log"],
      correctAnswer: 1,
      explanation: "La commande 'history' affiche l'historique des commandes exécutées dans le shell.",
      category: "Shell"
    }
  ],
  difficile: [
    {
      id: 23,
      question: "Comment rediriger la sortie d'une commande vers un fichier en ajoutant à la fin ?",
      options: ["command > file", "command >> file", "command -> file", "command append file"],
      correctAnswer: 1,
      explanation: "L'opérateur '>>' redirige la sortie en l'ajoutant à la fin du fichier, contrairement à '>' qui écrase le contenu.",
      category: "Redirection"
    },
    {
      id: 24,
      question: "Quelle commande permet de surveiller les processus en temps réel ?",
      options: ["ps -f", "top", "watch ps", "monitor"],
      correctAnswer: 1,
      explanation: "La commande 'top' affiche et met à jour en temps réel la liste des processus actifs.",
      category: "Système"
    },
    {
      id: 25,
      question: "Comment exécuter une commande en arrière-plan ?",
      options: ["command &", "bg command", "command --background", "background command"],
      correctAnswer: 0,
      explanation: "L'ajout de '&' à la fin d'une commande l'exécute en arrière-plan.",
      category: "Processus"
    },
    {
      id: 26,
      question: "Quelle commande permet de compresser des fichiers en tar.gz ?",
      options: ["tar -czf", "gzip -r", "compress", "zip -r"],
      correctAnswer: 0,
      explanation: "La commande 'tar -czf archive.tar.gz files' crée une archive compressée avec gzip.",
      category: "Archives"
    },
    {
      id: 27,
      question: "Comment afficher les variables d'environnement ?",
      options: ["vars", "env", "export", "set"],
      correctAnswer: 1,
      explanation: "La commande 'env' affiche toutes les variables d'environnement définies.",
      category: "Environnement"
    },
    {
      id: 28,
      question: "Quelle commande permet de tuer un processus par son nom ?",
      options: ["kill -name", "pkill", "killall", "pkill et killall"],
      correctAnswer: 3,
      explanation: "Les commandes 'pkill' et 'killall' permettent de tuer des processus par leur nom.",
      category: "Processus"
    },
    {
      id: 29,
      question: "Comment rechercher des fichiers modifiés dans les dernières 24h ?",
      options: ["find . -mtime -1", "find . -newer 24h", "find . -modified 1d", "find . -time 24"],
      correctAnswer: 0,
      explanation: "L'option '-mtime -1' de find recherche les fichiers modifiés dans les dernières 24 heures.",
      category: "Recherche"
    },
    {
      id: 30,
      question: "Quelle commande permet de synchroniser des répertoires ?",
      options: ["sync", "rsync", "copy -sync", "mirror"],
      correctAnswer: 1,
      explanation: "La commande 'rsync' permet de synchroniser efficacement des fichiers et répertoires.",
      category: "Synchronisation"
    },
    {
      id: 31,
      question: "Comment afficher les connexions réseau actives ?",
      options: ["netstat", "connections", "network", "ports"],
      correctAnswer: 0,
      explanation: "La commande 'netstat' affiche les connexions réseau, tables de routage et statistiques d'interface.",
      category: "Réseau"
    },
    {
      id: 32,
      question: "Quelle commande permet de changer le propriétaire d'un fichier ?",
      options: ["owner", "chown", "chmod", "setowner"],
      correctAnswer: 1,
      explanation: "La commande 'chown' (change owner) permet de changer le propriétaire d'un fichier ou répertoire.",
      category: "Permissions"
    },
    {
      id: 33,
      question: "Comment créer plusieurs répertoires imbriqués en une fois ?",
      options: ["mkdir -r", "mkdir -p", "mkdir --parents", "mkdir -p et --parents"],
      correctAnswer: 3,
      explanation: "Les options '-p' et '--parents' de mkdir créent les répertoires parents si nécessaire.",
      category: "Gestion de fichiers"
    },
    {
      id: 34,
      question: "Quelle commande permet de suivre les modifications d'un fichier en temps réel ?",
      options: ["watch", "tail -f", "follow", "monitor"],
      correctAnswer: 1,
      explanation: "La commande 'tail -f' suit les modifications d'un fichier en temps réel.",
      category: "Surveillance"
    },
    {
      id: 35,
      question: "Comment exécuter une commande avec les privilèges d'un autre utilisateur ?",
      options: ["su -c", "sudo", "runas", "su et sudo"],
      correctAnswer: 3,
      explanation: "Les commandes 'su' et 'sudo' permettent d'exécuter des commandes avec les privilèges d'autres utilisateurs.",
      category: "Sécurité"
    },
    {
      id: 36,
      question: "Quelle commande permet de comparer deux fichiers ?",
      options: ["compare", "diff", "cmp", "diff et cmp"],
      correctAnswer: 3,
      explanation: "Les commandes 'diff' et 'cmp' permettent de comparer des fichiers, avec des approches différentes.",
      category: "Comparaison"
    },
    {
      id: 37,
      question: "Comment afficher l'utilisation mémoire du système ?",
      options: ["memory", "free", "mem", "ram"],
      correctAnswer: 1,
      explanation: "La commande 'free' affiche l'utilisation de la mémoire RAM et du swap.",
      category: "Système"
    }
  ],
  experimente: [
    {
      id: 38,
      question: "Comment utiliser sed pour remplacer toutes les occurrences d'un mot dans un fichier ?",
      options: ["sed 's/old/new/g' file", "sed 'replace/old/new' file", "sed -r 'old/new' file", "sed --replace old new file"],
      correctAnswer: 0,
      explanation: "La syntaxe 'sed s/old/new/g' remplace toutes les occurrences (flag g) d'un motif dans un fichier.",
      category: "Édition de texte"
    },
    {
      id: 39,
      question: "Quelle commande awk affiche la deuxième colonne d'un fichier CSV ?",
      options: ["awk '{print $2}' file", "awk -F',' '{print $2}' file", "awk 'column 2' file", "awk --field=2 file"],
      correctAnswer: 1,
      explanation: "L'option -F',' définit la virgule comme séparateur de champs, $2 représente la deuxième colonne.",
      category: "Traitement de données"
    },
    {
      id: 40,
      question: "Comment créer un tunnel SSH avec redirection de port ?",
      options: ["ssh -L port:host:port user@server", "ssh -tunnel port user@server", "ssh -forward port user@server", "ssh -redirect port user@server"],
      correctAnswer: 0,
      explanation: "L'option -L de ssh crée un tunnel local avec redirection de port : -L local_port:remote_host:remote_port.",
      category: "Réseau"
    },
    {
      id: 41,
      question: "Quelle commande permet de surveiller l'activité disque en temps réel ?",
      options: ["diskstat", "iostat", "hdstat", "diskmon"],
      correctAnswer: 1,
      explanation: "La commande 'iostat' affiche les statistiques d'entrée/sortie des périphériques de stockage.",
      category: "Performance"
    },
    {
      id: 42,
      question: "Comment utiliser xargs pour exécuter une commande sur chaque ligne d'entrée ?",
      options: ["xargs -I {} command {}", "xargs -L 1 command", "xargs --line command", "xargs -I {} et -L 1"],
      correctAnswer: 3,
      explanation: "Les options -I {} et -L 1 permettent d'exécuter une commande pour chaque ligne d'entrée.",
      category: "Pipelines"
    },
    {
      id: 43,
      question: "Quelle commande permet de créer un système de fichiers ext4 ?",
      options: ["mkfs.ext4", "format ext4", "create-fs ext4", "newfs ext4"],
      correctAnswer: 0,
      explanation: "La commande 'mkfs.ext4' crée un système de fichiers ext4 sur un périphérique.",
      category: "Système de fichiers"
    },
    {
      id: 44,
      question: "Comment utiliser find avec exec pour exécuter une commande sur chaque fichier trouvé ?",
      options: ["find . -exec command {} \\;", "find . -run command", "find . -do command", "find . --execute command"],
      correctAnswer: 0,
      explanation: "L'option -exec de find exécute une commande sur chaque fichier trouvé, {} représente le fichier, \\; termine la commande.",
      category: "Recherche avancée"
    },
    {
      id: 45,
      question: "Quelle commande permet de monter un système de fichiers distant via NFS ?",
      options: ["mount -t nfs server:/path /mountpoint", "nfs-mount server:/path /mountpoint", "mount-nfs server:/path /mountpoint", "mount --nfs server:/path /mountpoint"],
      correctAnswer: 0,
      explanation: "La commande 'mount -t nfs' monte un système de fichiers NFS distant.",
      category: "Réseau"
    },
    {
      id: 46,
      question: "Comment utiliser screen pour créer une session détachable ?",
      options: ["screen -S session_name", "screen --session session_name", "screen -create session_name", "screen -new session_name"],
      correctAnswer: 0,
      explanation: "L'option -S de screen crée une nouvelle session avec un nom spécifique.",
      category: "Sessions"
    },
    {
      id: 47,
      question: "Quelle commande permet d'analyser les logs système en temps réel ?",
      options: ["logwatch", "journalctl -f", "syslog -f", "logmon"],
      correctAnswer: 1,
      explanation: "La commande 'journalctl -f' suit les logs système en temps réel (systemd).",
      category: "Logs"
    },
    {
      id: 48,
      question: "Comment utiliser tcpdump pour capturer le trafic réseau ?",
      options: ["tcpdump -i interface", "tcpdump --interface interface", "tcpdump -capture interface", "tcpdump -listen interface"],
      correctAnswer: 0,
      explanation: "L'option -i de tcpdump spécifie l'interface réseau à surveiller.",
      category: "Réseau"
    },
    {
      id: 49,
      question: "Quelle commande permet de créer un RAID logiciel ?",
      options: ["mdadm --create", "raid --create", "mkraid", "create-raid"],
      correctAnswer: 0,
      explanation: "La commande 'mdadm --create' crée un array RAID logiciel sous Linux.",
      category: "Stockage"
    },
    {
      id: 50,
      question: "Comment utiliser strace pour tracer les appels système d'un processus ?",
      options: ["strace -p PID", "strace --pid PID", "strace -trace PID", "strace -follow PID"],
      correctAnswer: 0,
      explanation: "L'option -p de strace permet de tracer les appels système d'un processus existant.",
      category: "Débogage"
    },
    {
      id: 51,
      question: "Quelle commande permet de configurer les interfaces réseau ?",
      options: ["ifconfig", "ip addr", "netconfig", "ifconfig et ip addr"],
      correctAnswer: 3,
      explanation: "Les commandes 'ifconfig' (ancienne) et 'ip addr' (moderne) permettent de configurer les interfaces réseau.",
      category: "Réseau"
    },
    {
      id: 52,
      question: "Comment utiliser crontab pour programmer une tâche quotidienne à 2h30 ?",
      options: ["30 2 * * * command", "2:30 * * * command", "30 2 daily command", "2 30 * * * command"],
      correctAnswer: 0,
      explanation: "La syntaxe cron '30 2 * * *' programme une tâche à 2h30 tous les jours.",
      category: "Planification"
    },
    {
      id: 53,
      question: "Quelle commande permet de chiffrer un fichier avec GPG ?",
      options: ["gpg --encrypt file", "gpg -e file", "gpg --cipher file", "gpg -e et --encrypt"],
      correctAnswer: 3,
      explanation: "Les options -e et --encrypt de gpg permettent de chiffrer un fichier.",
      category: "Sécurité"
    },
    {
      id: 54,
      question: "Comment utiliser lsof pour voir les fichiers ouverts par un processus ?",
      options: ["lsof -p PID", "lsof --pid PID", "lsof -process PID", "lsof -files PID"],
      correctAnswer: 0,
      explanation: "L'option -p de lsof affiche les fichiers ouverts par un processus spécifique.",
      category: "Surveillance"
    },
    {
      id: 55,
      question: "Quelle commande permet de créer une image disque avec dd ?",
      options: ["dd if=/dev/sda of=image.img", "dd --input=/dev/sda --output=image.img", "dd copy /dev/sda image.img", "dd clone /dev/sda image.img"],
      correctAnswer: 0,
      explanation: "La syntaxe 'dd if=source of=destination' crée une copie bit à bit du périphérique source.",
      category: "Sauvegarde"
    },
    {
      id: 56,
      question: "Comment utiliser iptables pour bloquer un port ?",
      options: ["iptables -A INPUT -p tcp --dport PORT -j DROP", "iptables --block-port PORT", "iptables -deny PORT", "iptables --close PORT"],
      correctAnswer: 0,
      explanation: "Cette règle iptables ajoute (-A) une règle à la chaîne INPUT pour rejeter (DROP) le trafic TCP sur un port spécifique.",
      category: "Firewall"
    },
    {
      id: 57,
      question: "Quelle commande permet de vérifier l'intégrité d'un système de fichiers ?",
      options: ["fsck", "checkfs", "verify-fs", "test-fs"],
      correctAnswer: 0,
      explanation: "La commande 'fsck' (file system check) vérifie et répare les systèmes de fichiers.",
      category: "Maintenance"
    }
  ]
}

export function QuizInterface() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizStats, setQuizStats] = useState<QuizStats>({})

  const { register, handleSubmit, watch, reset } = useForm<QuizFormData>()

  // Charger les statistiques au montage du composant
  useEffect(() => {
    setQuizStats(quizStorage.getStats())
  }, [])

  const currentQuestions = selectedDifficulty ? quizQuestions[selectedDifficulty] : []
  const currentQ = currentQuestions[currentQuestion]
  const watchedAnswer = watch(`question_${currentQ?.id}`)

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty)
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setShowExplanation(false)
    setScore(0)
    reset()
  }

  const handleAnswerSubmit = (data: QuizFormData) => {
    const questionId = currentQ.id
    const selectedAnswer = parseInt(data[`question_${questionId}`].toString())
    
    setAnswers(prev => ({ ...prev, [questionId]: selectedAnswer }))
    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    setShowExplanation(false)
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      calculateScore()
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    let correctAnswers = 0
    currentQuestions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })
    setScore(correctAnswers)
    
    // Sauvegarder le résultat dans localStorage
    if (selectedDifficulty) {
      quizStorage.saveResult(selectedDifficulty, correctAnswers, currentQuestions.length)
      // Mettre à jour les stats locales
      setQuizStats(quizStorage.getStats())
    }
  }

  const resetQuiz = () => {
    setSelectedDifficulty(null)
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setShowExplanation(false)
    setScore(0)
    reset()
  }

  const getScoreMessage = () => {
    const percentage = (score / currentQuestions.length) * 100
    if (percentage >= 90) return "🏆 Excellent ! Vous maîtrisez parfaitement ce niveau !"
    if (percentage >= 70) return "🎉 Très bien ! Vous avez une bonne maîtrise de ce niveau."
    if (percentage >= 50) return "👍 Pas mal ! Continuez à pratiquer pour améliorer vos compétences."
    return "📚 Il faut encore un peu de pratique. Retournez au jeu ou consultez la documentation !"
  }

  const getScoreColor = () => {
    const percentage = (score / currentQuestions.length) * 100
    if (percentage >= 90) return "text-yellow-400"
    if (percentage >= 70) return "text-green-400"
    if (percentage >= 50) return "text-blue-400"
    return "text-orange-400"
  }

  // Difficulty Selection Screen
  if (!selectedDifficulty) {
    return (
      <div className="min-h-screen text-white p-4 pt-20">
        <div className="container mx-auto max-w-6xl">
          <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
              TerminalQuest Quiz
            </h1>
            <p className="text-xl text-gray-400 mb-4">Choisissez votre niveau de difficulté</p>
            
            {/* Statistiques globales */}
            {Object.keys(quizStats).length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-black/30 backdrop-blur-lg rounded-xl p-4 max-w-md mx-auto mb-4"
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {Object.keys(quizStats).length}
                    </div>
                    <div className="text-xs text-gray-400">Niveaux terminés</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {Object.values(quizStats).filter(stat => stat.isPerfect).length}
                    </div>
                    <div className="text-xs text-gray-400">Scores parfaits</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">
                      {Object.keys(quizStats).length > 0 
                        ? Math.round(Object.values(quizStats).reduce((sum, stat) => sum + stat.percentage, 0) / Object.keys(quizStats).length)
                        : 0}%
                    </div>
                    <div className="text-xs text-gray-400">Moyenne</div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.header>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(difficultyConfig).map(([key, config], index) => {
              const Icon = config.icon
              const isCompleted = quizStorage.isCompleted(key)
              const isPerfect = quizStorage.isPerfect(key)
              const bestScore = quizStorage.getBestScore(key)
              
              // Déterminer la bordure selon le statut
              let borderClass = "border-gray-600/30 hover:border-gray-400/50"
              if (isPerfect) {
                borderClass = "border-yellow-400/70 hover:border-yellow-400 shadow-lg shadow-yellow-400/20"
              } else if (isCompleted) {
                borderClass = "border-green-500/70 hover:border-green-500 shadow-lg shadow-green-500/20"
              }
              
              return (
                <motion.div
                  key={key}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  className="group cursor-pointer relative"
                  onClick={() => handleDifficultySelect(key as DifficultyLevel)}
                >
                  <div className={`bg-black/50 backdrop-blur-lg rounded-2xl p-6 border-2 ${borderClass} transition-all duration-300 h-full relative`}>
                    {/* Indicateur de statut en haut à droite */}
                    {isPerfect && (
                      <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg">
                        <Trophy className="w-4 h-4 text-yellow-900" />
                      </div>
                    )}
                    {isCompleted && !isPerfect && (
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className={`bg-gradient-to-r ${config.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2">{config.name}</h3>
                      <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                        {config.description}
                      </p>
                      
                      <div className="text-sm text-gray-500 mb-4">
                        {config.questions} questions
                        {isCompleted && (
                          <div className="mt-1 text-xs">
                            <span className={isPerfect ? "text-yellow-400" : "text-green-400"}>
                              Meilleur score: {bestScore}%
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className={`bg-gradient-to-r ${config.color} text-white font-bold py-2 px-4 rounded-lg group-hover:shadow-lg transition-all duration-200`}>
                        {isCompleted ? 'Recommencer' : 'Commencer'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Results Screen
  if (showResults) {
    const difficulty = difficultyConfig[selectedDifficulty]
    const Icon = difficulty.icon
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-black/50 backdrop-blur-lg rounded-2xl p-8 max-w-2xl text-center border border-purple-500/30"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className={`bg-gradient-to-r ${difficulty.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">Quiz {difficulty.name} Terminé !</h2>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>
              {score}/{currentQuestions.length}
            </div>
            <div className="text-xl text-gray-300 mb-4">
              {Math.round((score / currentQuestions.length) * 100)}% de réussite
            </div>
            <p className="text-lg text-gray-400">
              {getScoreMessage()}
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => handleDifficultySelect(selectedDifficulty)}
                className={`bg-gradient-to-r ${difficulty.color} hover:shadow-lg text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2`}
              >
                <RotateCcw className="w-5 h-5" />
                Recommencer ce niveau
              </button>
              
              <button
                onClick={resetQuiz}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Changer de niveau
              </button>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Link
                href="/game"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
              >
                🎮 Retour au Jeu
              </Link>
              <Link
                href="/docs"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Documentation
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // Quiz Screen
  const difficulty = difficultyConfig[selectedDifficulty]
  const DifficultyIcon = difficulty.icon

  return (
    <div className="min-h-screen text-white p-4 pt-20">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`bg-gradient-to-r ${difficulty.color} rounded-full w-12 h-12 flex items-center justify-center`}>
              <DifficultyIcon className="w-6 h-6 text-white" />
            </div>
                         <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
               TerminalQuest - {difficulty.name}
             </h1>
          </div>
          <p className="text-gray-400">{difficulty.description}</p>
        </motion.header>

        {/* Progress Bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">
              Question {currentQuestion + 1} sur {currentQuestions.length}
            </span>
            <span className="text-sm text-gray-400">
              {currentQ.category}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className={`bg-gradient-to-r ${difficulty.color} h-2 rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / currentQuestions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-black/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 mb-6"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              {currentQ.question}
            </h2>

            <form onSubmit={handleSubmit(handleAnswerSubmit)} className="space-y-4">
              {currentQ.options.map((option, index) => (
                <motion.label
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    showExplanation
                      ? index === currentQ.correctAnswer
                        ? 'border-green-500 bg-green-500/20'
                        : answers[currentQ.id] === index
                        ? 'border-red-500 bg-red-500/20'
                        : 'border-gray-600 bg-gray-800/50'
                      : 'border-gray-600 bg-gray-800/50 hover:border-purple-500 hover:bg-purple-500/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      value={index}
                      {...register(`question_${currentQ.id}`, { required: true })}
                      disabled={showExplanation}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-lg">{option}</span>
                    {showExplanation && index === currentQ.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                    )}
                    {showExplanation && answers[currentQ.id] === index && index !== currentQ.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-500 ml-auto" />
                    )}
                  </div>
                </motion.label>
              ))}

              {!showExplanation && (
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  type="submit"
                  disabled={watchedAnswer === undefined}
                  className={`w-full bg-gradient-to-r ${difficulty.color} hover:shadow-lg disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-200`}
                >
                  Valider la réponse
                </motion.button>
              )}
            </form>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg"
                >
                  <h3 className="font-bold text-blue-300 mb-2">Explication :</h3>
                  <p className="text-gray-300">{currentQ.explanation}</p>
                  
                  <button
                    onClick={handleNextQuestion}
                    className={`mt-4 bg-gradient-to-r ${difficulty.color} hover:shadow-lg text-white font-bold py-2 px-4 rounded-lg transition-all duration-200`}
                  >
                    {currentQuestion < currentQuestions.length - 1 ? 'Question suivante' : 'Voir les résultats'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
} 