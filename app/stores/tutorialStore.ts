'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  command: string;
  expectedOutput?: string;
  hint?: string;
  points: number;
  validation: (output: string, command: string) => boolean;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // en minutes
  steps: TutorialStep[];
  prerequisites?: string[];
}

export interface TutorialProgress {
  tutorialId: string;
  completedSteps: string[];
  currentStepIndex: number;
  startedAt: Date;
  completedAt?: Date;
  totalPoints: number;
}

interface TutorialStore {
  // État
  currentTutorial: Tutorial | null;
  currentStepIndex: number;
  tutorialProgress: Record<string, TutorialProgress>;
  completedTutorials: string[];

  // Actions
  startTutorial: (tutorial: Tutorial) => void;
  getCurrentStep: () => TutorialStep | null;
  nextStep: () => void;
  previousStep: () => void;
  completeStep: (stepId: string, points: number) => void;
  completeTutorial: () => void;
  isStepCompleted: (stepId: string) => boolean;
  getTutorialProgress: (tutorialId: string) => TutorialProgress | null;
  resetTutorial: (tutorialId: string) => void;
  resetAllProgress: () => void;
}

export const useTutorialStore = create<TutorialStore>()(
  persist(
    (set, get) => ({
      // État initial
      currentTutorial: null,
      currentStepIndex: 0,
      tutorialProgress: {},
      completedTutorials: [],

      // Actions
      startTutorial: (tutorial: Tutorial) => {
        const existingProgress = get().tutorialProgress[tutorial.id];
        const currentStepIndex = existingProgress?.currentStepIndex || 0;

        set({
          currentTutorial: tutorial,
          currentStepIndex,
        });

        // Créer ou mettre à jour la progression
        if (!existingProgress) {
          const newProgress: TutorialProgress = {
            tutorialId: tutorial.id,
            completedSteps: [],
            currentStepIndex: 0,
            startedAt: new Date(),
            totalPoints: 0,
          };

          set((state) => ({
            tutorialProgress: {
              ...state.tutorialProgress,
              [tutorial.id]: newProgress,
            },
          }));
        }
      },

      getCurrentStep: () => {
        const { currentTutorial, currentStepIndex } = get();
        if (!currentTutorial || currentStepIndex >= currentTutorial.steps.length) {
          return null;
        }
        return currentTutorial.steps[currentStepIndex];
      },

      nextStep: () => {
        const { currentTutorial, currentStepIndex } = get();
        if (!currentTutorial) return;

        const nextIndex = currentStepIndex + 1;
        if (nextIndex < currentTutorial.steps.length) {
          set({ currentStepIndex: nextIndex });
          
          // Mettre à jour la progression
          set((state) => ({
            tutorialProgress: {
              ...state.tutorialProgress,
              [currentTutorial.id]: {
                ...state.tutorialProgress[currentTutorial.id],
                currentStepIndex: nextIndex,
              },
            },
          }));
        }
      },

      previousStep: () => {
        const { currentTutorial, currentStepIndex } = get();
        if (!currentTutorial) return;

        const prevIndex = Math.max(0, currentStepIndex - 1);
        set({ currentStepIndex: prevIndex });
        
        // Mettre à jour la progression
        set((state) => ({
          tutorialProgress: {
            ...state.tutorialProgress,
            [currentTutorial.id]: {
              ...state.tutorialProgress[currentTutorial.id],
              currentStepIndex: prevIndex,
            },
          },
        }));
      },

      completeStep: (stepId: string, points: number) => {
        const { currentTutorial } = get();
        if (!currentTutorial) return;

        set((state) => {
          const progress = state.tutorialProgress[currentTutorial.id];
          if (!progress) return state;

          const completedSteps = [...progress.completedSteps];
          if (!completedSteps.includes(stepId)) {
            completedSteps.push(stepId);
          }

          return {
            tutorialProgress: {
              ...state.tutorialProgress,
              [currentTutorial.id]: {
                ...progress,
                completedSteps,
                totalPoints: progress.totalPoints + points,
              },
            },
          };
        });
      },

      completeTutorial: () => {
        const { currentTutorial } = get();
        if (!currentTutorial) return;

        set((state) => {
          const completedTutorials = [...state.completedTutorials];
          if (!completedTutorials.includes(currentTutorial.id)) {
            completedTutorials.push(currentTutorial.id);
          }

          return {
            completedTutorials,
            tutorialProgress: {
              ...state.tutorialProgress,
              [currentTutorial.id]: {
                ...state.tutorialProgress[currentTutorial.id],
                completedAt: new Date(),
              },
            },
            currentTutorial: null,
            currentStepIndex: 0,
          };
        });
      },

      isStepCompleted: (stepId: string) => {
        const { currentTutorial, tutorialProgress } = get();
        if (!currentTutorial) return false;

        const progress = tutorialProgress[currentTutorial.id];
        return progress?.completedSteps.includes(stepId) || false;
      },

      getTutorialProgress: (tutorialId: string) => {
        return get().tutorialProgress[tutorialId] || null;
      },

      resetTutorial: (tutorialId: string) => {
        set((state) => {
          const newProgress = { ...state.tutorialProgress };
          delete newProgress[tutorialId];

          return {
            tutorialProgress: newProgress,
            completedTutorials: state.completedTutorials.filter(id => id !== tutorialId),
            currentTutorial: state.currentTutorial?.id === tutorialId ? null : state.currentTutorial,
            currentStepIndex: state.currentTutorial?.id === tutorialId ? 0 : state.currentStepIndex,
          };
        });
      },

      resetAllProgress: () => {
        set({
          currentTutorial: null,
          currentStepIndex: 0,
          tutorialProgress: {},
          completedTutorials: [],
        });
      },
    }),
    {
      name: 'tutorial-storage',
      version: 1,
    }
  )
); 