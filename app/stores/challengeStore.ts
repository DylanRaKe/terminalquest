import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Challenge, ChallengeResult, Leaderboard } from '../lib/challenges';

interface ChallengeStore {
  // État actuel
  currentChallenge: Challenge | null;
  isActive: boolean;
  startTime: number | null;
  timeElapsed: number;
  attempts: number;
  
  // Résultats et progression
  completedChallenges: string[];
  challengeResults: ChallengeResult[];
  totalScore: number;
  totalXP: number;
  badges: string[];
  
  // Leaderboards
  leaderboards: Record<string, Leaderboard>;
  
  // Actions
  startChallenge: (challenge: Challenge) => void;
  submitChallenge: (command: string, output: string) => ChallengeResult;
  abandonChallenge: () => void;
  updateTimer: () => void;
  
  // Getters
  getChallengeResult: (challengeId: string) => ChallengeResult | undefined;
  getBestScore: (challengeId: string) => number;
  getBestTime: (challengeId: string) => number;
  getAttempts: (challengeId: string) => number;
  isCompleted: (challengeId: string) => boolean;
  
  // Leaderboard
  updateLeaderboard: (challengeId: string, result: ChallengeResult) => void;
  getLeaderboard: (challengeId: string) => Leaderboard | undefined;
  
  // Stats
  getStats: () => {
    totalCompleted: number;
    averageScore: number;
    totalTime: number;
    favoriteCategory: string;
    streak: number;
  };
}

export const useChallengeStore = create<ChallengeStore>()(
  persist(
    (set, get) => ({
      // État initial
      currentChallenge: null,
      isActive: false,
      startTime: null,
      timeElapsed: 0,
      attempts: 0,
      
      completedChallenges: [],
      challengeResults: [],
      totalScore: 0,
      totalXP: 0,
      badges: [],
      
      leaderboards: {},
      
      // Actions
      startChallenge: (challenge: Challenge) => {
        set({
          currentChallenge: challenge,
          isActive: true,
          startTime: Date.now(),
          timeElapsed: 0,
          attempts: 0
        });
      },
      
      submitChallenge: (command: string, output: string) => {
        const state = get();
        const { currentChallenge, startTime, attempts } = state;
        
        if (!currentChallenge || !startTime) {
          throw new Error('Aucun défi actif');
        }
        
        const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
        const validation = currentChallenge.validation(output, command, timeElapsed);
        
        const result: ChallengeResult = {
          challengeId: currentChallenge.id,
          userId: 'current-user', // TODO: Intégrer avec le système d'auth
          completed: validation.isValid,
          timeElapsed,
          score: validation.score,
          attempts: attempts + 1,
          completedAt: new Date(),
          command,
          feedback: validation.feedback
        };
        
        // Mettre à jour l'état
        const newState = {
          attempts: attempts + 1,
          challengeResults: [...state.challengeResults.filter(r => r.challengeId !== currentChallenge.id), result]
        };
        
        if (validation.isValid) {
          // Défi complété
          const newCompletedChallenges = state.completedChallenges.includes(currentChallenge.id)
            ? state.completedChallenges
            : [...state.completedChallenges, currentChallenge.id];
          
          const newBadges = currentChallenge.badge && !state.badges.includes(currentChallenge.badge)
            ? [...state.badges, currentChallenge.badge]
            : state.badges;
          
          Object.assign(newState, {
            isActive: false,
            currentChallenge: null,
            completedChallenges: newCompletedChallenges,
            totalScore: state.totalScore + validation.score,
            totalXP: state.totalXP + currentChallenge.xpReward,
            badges: newBadges
          });
          
          // Mettre à jour le leaderboard
          get().updateLeaderboard(currentChallenge.id, result);
        }
        
        set(newState);
        return result;
      },
      
      abandonChallenge: () => {
        set({
          currentChallenge: null,
          isActive: false,
          startTime: null,
          timeElapsed: 0,
          attempts: 0
        });
      },
      
      updateTimer: () => {
        const { startTime, isActive } = get();
        if (isActive && startTime) {
          const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
          set({ timeElapsed });
        }
      },
      
      // Getters
      getChallengeResult: (challengeId: string) => {
        return get().challengeResults.find(r => r.challengeId === challengeId);
      },
      
      getBestScore: (challengeId: string) => {
        const results = get().challengeResults.filter(r => r.challengeId === challengeId && r.completed);
        return results.length > 0 ? Math.max(...results.map(r => r.score)) : 0;
      },
      
      getBestTime: (challengeId: string) => {
        const results = get().challengeResults.filter(r => r.challengeId === challengeId && r.completed);
        return results.length > 0 ? Math.min(...results.map(r => r.timeElapsed)) : 0;
      },
      
      getAttempts: (challengeId: string) => {
        const results = get().challengeResults.filter(r => r.challengeId === challengeId);
        return results.reduce((sum, r) => sum + r.attempts, 0);
      },
      
      isCompleted: (challengeId: string) => {
        return get().completedChallenges.includes(challengeId);
      },
      
      // Leaderboard
      updateLeaderboard: (challengeId: string, result: ChallengeResult) => {
        const { leaderboards } = get();
        const currentLeaderboard = leaderboards[challengeId] || { challengeId, entries: [] };
        
        // Supprimer l'ancienne entrée de l'utilisateur s'il y en a une
        const filteredEntries = currentLeaderboard.entries.filter(e => e.userId !== result.userId);
        
        // Ajouter la nouvelle entrée
        const newEntry = {
          userId: result.userId,
          username: 'Joueur', // TODO: Intégrer avec le système d'auth
          score: result.score,
          timeElapsed: result.timeElapsed,
          completedAt: result.completedAt,
          rank: 0 // Sera calculé après le tri
        };
        
        // Trier et assigner les rangs
        const sortedEntries = [...filteredEntries, newEntry]
          .sort((a, b) => {
            if (a.score !== b.score) return b.score - a.score; // Score décroissant
            return a.timeElapsed - b.timeElapsed; // Temps croissant en cas d'égalité
          })
          .map((entry, index) => ({ ...entry, rank: index + 1 }))
          .slice(0, 100); // Garder seulement le top 100
        
        set({
          leaderboards: {
            ...leaderboards,
            [challengeId]: {
              challengeId,
              entries: sortedEntries
            }
          }
        });
      },
      
      getLeaderboard: (challengeId: string) => {
        return get().leaderboards[challengeId];
      },
      
      // Stats
      getStats: () => {
        const { challengeResults, completedChallenges } = get();
        const completedResults = challengeResults.filter(r => r.completed);
        
        const totalCompleted = completedChallenges.length;
        const averageScore = completedResults.length > 0 
          ? Math.round(completedResults.reduce((sum, r) => sum + r.score, 0) / completedResults.length)
          : 0;
        const totalTime = completedResults.reduce((sum, r) => sum + r.timeElapsed, 0);
        
        // Calculer la catégorie favorite (basée sur les défis complétés)
        // TODO: Implémenter quand on aura les catégories dans les résultats
        const favoriteCategory = 'daily';
        
        // Calculer la série actuelle
        // TODO: Implémenter le calcul de streak basé sur les dates
        const streak = 0;
        
        return {
          totalCompleted,
          averageScore,
          totalTime,
          favoriteCategory,
          streak
        };
      }
    }),
    {
      name: 'challenge-store',
      partialize: (state) => ({
        completedChallenges: state.completedChallenges,
        challengeResults: state.challengeResults,
        totalScore: state.totalScore,
        totalXP: state.totalXP,
        badges: state.badges,
        leaderboards: state.leaderboards
      })
    }
  )
); 