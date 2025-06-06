export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'special' | 'community';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  timeLimit: number; // en secondes
  points: number;
  xpReward: number;
  badge?: string;
  task: string;
  expectedCommand: string;
  validation: (output: string, command: string, timeElapsed: number) => {
    isValid: boolean;
    score: number;
    feedback: string;
  };
  hints: string[];
  startDate?: Date;
  endDate?: Date;
  participants?: number;
  completions?: number;
  bestTime?: number;
  tags: string[];
  prerequisites?: string[];
}

export interface ChallengeResult {
  challengeId: string;
  userId: string;
  completed: boolean;
  timeElapsed: number;
  score: number;
  attempts: number;
  completedAt: Date;
  command: string;
  feedback: string;
}

export interface Leaderboard {
  challengeId: string;
  entries: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  timeElapsed: number;
  completedAt: Date;
  rank: number;
}

export const challenges: Challenge[] = [
  // DÉFIS QUOTIDIENS
  {
    id: 'daily-file-hunt',
    title: '🔍 Chasse aux Fichiers',
    description: 'Trouvez tous les fichiers .txt dans le répertoire courant et ses sous-dossiers',
    category: 'daily',
    difficulty: 'beginner',
    timeLimit: 60,
    points: 50,
    xpReward: 25,
    task: 'Utilisez find pour localiser tous les fichiers avec l\'extension .txt',
    expectedCommand: 'find . -name "*.txt"',
    validation: (output: string, command: string, timeElapsed: number) => {
      const isValid = command.includes('find') && command.includes('*.txt');
      const timeBonus = Math.max(0, (60 - timeElapsed) / 60);
      const score = isValid ? Math.round(50 + (timeBonus * 50)) : 0;
      return {
        isValid,
        score,
        feedback: isValid 
          ? `Excellent ! Trouvé en ${timeElapsed}s. Score: ${score}/100`
          : 'Utilisez find avec le pattern *.txt'
      };
    },
    hints: [
      'find recherche des fichiers selon des critères',
      'L\'option -name permet de filtrer par nom',
      'Les wildcards comme * fonctionnent avec -name'
    ],
    tags: ['find', 'search', 'files'],
    prerequisites: []
  },

  {
    id: 'daily-text-count',
    title: '📊 Compteur Express',
    description: 'Comptez le nombre de lignes contenant le mot "error" dans un fichier log',
    category: 'daily',
    difficulty: 'intermediate',
    timeLimit: 45,
    points: 75,
    xpReward: 40,
    task: 'Créez d\'abord un fichier test avec quelques lignes contenant "error", puis comptez-les',
    expectedCommand: 'grep -c "error"',
    validation: (output: string, command: string, timeElapsed: number) => {
      const isValid = command.includes('grep') && (command.includes('-c') || command.includes('wc -l'));
      const timeBonus = Math.max(0, (45 - timeElapsed) / 45);
      const score = isValid ? Math.round(75 + (timeBonus * 25)) : 0;
      return {
        isValid,
        score,
        feedback: isValid 
          ? `Parfait ! Résolu en ${timeElapsed}s. Score: ${score}/100`
          : 'Utilisez grep -c pour compter les occurrences'
      };
    },
    hints: [
      'grep peut chercher des motifs dans du texte',
      'L\'option -c compte les lignes correspondantes',
      'Vous pouvez aussi utiliser grep | wc -l'
    ],
    tags: ['grep', 'count', 'text'],
    prerequisites: []
  },

  // DÉFIS HEBDOMADAIRES
  {
    id: 'weekly-log-analysis',
    title: '🕵️ Analyse de Logs Avancée',
    description: 'Analysez un fichier de log complexe pour extraire des statistiques précises',
    category: 'weekly',
    difficulty: 'advanced',
    timeLimit: 300,
    points: 200,
    xpReward: 100,
    badge: 'log-detective',
    task: 'Trouvez les 5 adresses IP les plus fréquentes dans un fichier de log Apache',
    expectedCommand: 'awk \'{print $1}\' access.log | sort | uniq -c | sort -nr | head -5',
    validation: (output: string, command: string, timeElapsed: number) => {
      const hasAwk = command.includes('awk');
      const hasSort = command.includes('sort');
      const hasUniq = command.includes('uniq');
      const hasHead = command.includes('head');
      const isValid = hasAwk && hasSort && hasUniq && hasHead;
      const timeBonus = Math.max(0, (300 - timeElapsed) / 300);
      const score = isValid ? Math.round(200 + (timeBonus * 100)) : 0;
      return {
        isValid,
        score,
        feedback: isValid 
          ? `Magistral ! Analyse complète en ${Math.round(timeElapsed/60)}min. Score: ${score}/300`
          : 'Combinez awk, sort, uniq et head pour l\'analyse'
      };
    },
    hints: [
      'awk peut extraire des colonnes spécifiques',
      'sort | uniq -c compte les occurrences',
      'sort -nr trie numériquement en ordre décroissant',
      'head -5 affiche les 5 premiers résultats'
    ],
    tags: ['awk', 'sort', 'uniq', 'logs', 'analysis'],
    prerequisites: ['text-processing']
  },

  // DÉFIS SPÉCIAUX
  {
    id: 'special-one-liner',
    title: '⚡ One-Liner Master',
    description: 'Résolvez un problème complexe en une seule ligne de commande',
    category: 'special',
    difficulty: 'expert',
    timeLimit: 180,
    points: 300,
    xpReward: 150,
    badge: 'one-liner-master',
    task: 'Trouvez tous les fichiers modifiés dans les dernières 24h, triez-les par taille décroissante',
    expectedCommand: 'find . -mtime -1 -type f -exec ls -la {} \\; | sort -k5 -nr',
    validation: (output: string, command: string, timeElapsed: number) => {
      const hasFind = command.includes('find');
      const hasMtime = command.includes('-mtime');
      const hasExec = command.includes('-exec') || command.includes('-ls');
      const hasSort = command.includes('sort');
      const isValid = hasFind && hasMtime && hasExec && hasSort;
      const timeBonus = Math.max(0, (180 - timeElapsed) / 180);
      const score = isValid ? Math.round(300 + (timeBonus * 200)) : 0;
      return {
        isValid,
        score,
        feedback: isValid 
          ? `LÉGENDAIRE ! One-liner parfait en ${Math.round(timeElapsed/60)}min. Score: ${score}/500`
          : 'Combinez find -mtime, -exec et sort pour une solution élégante'
      };
    },
    hints: [
      'find -mtime -1 trouve les fichiers des dernières 24h',
      '-exec permet d\'exécuter une commande sur chaque fichier',
      'sort -k5 -nr trie par la 5ème colonne (taille) en ordre décroissant',
      'Pensez à échapper le point-virgule avec \\;'
    ],
    tags: ['find', 'sort', 'one-liner', 'expert'],
    prerequisites: ['intermediate-search', 'text-processing']
  },

  // DÉFIS COMMUNAUTAIRES
  {
    id: 'community-backup-script',
    title: '💾 Script de Sauvegarde Communautaire',
    description: 'Créez un script de sauvegarde intelligent avec la communauté',
    category: 'community',
    difficulty: 'advanced',
    timeLimit: 600,
    points: 400,
    xpReward: 200,
    badge: 'backup-hero',
    task: 'Créez un script qui sauvegarde tous les fichiers .conf avec horodatage',
    expectedCommand: 'tar -czf backup_$(date +%Y%m%d_%H%M%S).tar.gz *.conf',
    validation: (output: string, command: string, timeElapsed: number) => {
      const hasTar = command.includes('tar');
      const hasDate = command.includes('date') || command.includes('$(date');
      const hasConf = command.includes('*.conf') || command.includes('.conf');
      const isValid = hasTar && hasDate && hasConf;
      const timeBonus = Math.max(0, (600 - timeElapsed) / 600);
      const score = isValid ? Math.round(400 + (timeBonus * 100)) : 0;
      return {
        isValid,
        score,
        feedback: isValid 
          ? `Excellent travail d'équipe ! Script créé en ${Math.round(timeElapsed/60)}min. Score: ${score}/500`
          : 'Utilisez tar avec $(date) pour créer une archive horodatée'
      };
    },
    hints: [
      'tar -czf crée une archive compressée',
      '$(date +%Y%m%d_%H%M%S) génère un timestamp',
      '*.conf sélectionne tous les fichiers de configuration',
      'Combinez tout pour un nom de fichier unique'
    ],
    tags: ['tar', 'backup', 'date', 'scripting'],
    prerequisites: ['file-operations']
  }
];

export const getChallengesByCategory = (category: Challenge['category']): Challenge[] => {
  return challenges.filter(challenge => challenge.category === category);
};

export const getChallengesByDifficulty = (difficulty: Challenge['difficulty']): Challenge[] => {
  return challenges.filter(challenge => challenge.difficulty === difficulty);
};

export const getAvailableChallenges = (completedTutorials: string[]): Challenge[] => {
  return challenges.filter(challenge => {
    if (!challenge.prerequisites) return true;
    return challenge.prerequisites.every(prereq => completedTutorials.includes(prereq));
  });
};

export const getDailyChallenge = (): Challenge => {
  const dailyChallenges = getChallengesByCategory('daily');
  const today = new Date().getDate();
  return dailyChallenges[today % dailyChallenges.length];
};

export const getWeeklyChallenge = (): Challenge => {
  const weeklyChallenges = getChallengesByCategory('weekly');
  const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return weeklyChallenges[week % weeklyChallenges.length];
};

export const calculateChallengeScore = (
  challenge: Challenge, 
  timeElapsed: number, 
  isCorrect: boolean
): number => {
  if (!isCorrect) return 0;
  
  const baseScore = challenge.points;
  const timeBonus = Math.max(0, (challenge.timeLimit - timeElapsed) / challenge.timeLimit);
  const difficultyMultiplier = {
    beginner: 1,
    intermediate: 1.2,
    advanced: 1.5,
    expert: 2
  }[challenge.difficulty];
  
  return Math.round(baseScore * (1 + timeBonus * 0.5) * difficultyMultiplier);
};

export const getChallengeStats = () => {
  return {
    total: challenges.length,
    byCategory: {
      daily: getChallengesByCategory('daily').length,
      weekly: getChallengesByCategory('weekly').length,
      special: getChallengesByCategory('special').length,
      community: getChallengesByCategory('community').length
    },
    byDifficulty: {
      beginner: getChallengesByDifficulty('beginner').length,
      intermediate: getChallengesByDifficulty('intermediate').length,
      advanced: getChallengesByDifficulty('advanced').length,
      expert: getChallengesByDifficulty('expert').length
    },
    totalPoints: challenges.reduce((sum, c) => sum + c.points, 0),
    totalXP: challenges.reduce((sum, c) => sum + c.xpReward, 0)
  };
}; 