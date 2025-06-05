'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  CheckCircle, 
  Trophy,
  Clock,
  Target,
  ArrowLeft,
  Play
} from 'lucide-react';
import { tutorials, getTutorialsByLevel } from '../lib/tutorials';
import { useTutorialStore, Tutorial } from '../stores/tutorialStore';
// import { useProgressionStore } from '../stores/progressionStore';
import { TutorialPlayer } from './TutorialPlayer';

interface TutorialInterfaceProps {
  onBack?: () => void;
}

export const TutorialInterface: React.FC<TutorialInterfaceProps> = ({ onBack }) => {
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  
  const { 
    currentTutorial, 
    startTutorial, 
    getTutorialProgress, 
    completedTutorials 
  } = useTutorialStore();
  
  // const { addXP } = useProgressionStore();

  const levelTutorials = getTutorialsByLevel(selectedLevel);

  const handleStartTutorial = (tutorial: Tutorial) => {
    startTutorial(tutorial);
    setSelectedTutorial(tutorial);
  };

  const handleBackToList = () => {
    setSelectedTutorial(null);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'from-green-500 to-emerald-500';
      case 'intermediate': return 'from-blue-500 to-cyan-500';
      case 'advanced': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'advanced': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Si un tutoriel est en cours ou sélectionné, afficher le player
  if (currentTutorial || selectedTutorial) {
    return (
      <TutorialPlayer 
        tutorial={currentTutorial || selectedTutorial!}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-black/20 hover:bg-black/30 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
            )}
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <BookOpen className="w-10 h-10 text-blue-400" />
                Tutoriels Guidés
              </h1>
              <p className="text-gray-300 mt-2">
                Apprenez les commandes CLI étape par étape avec des exercices pratiques
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {completedTutorials.length}/{tutorials.length}
            </div>
            <div className="text-sm text-gray-400">Tutoriels complétés</div>
          </div>
        </motion.div>

        {/* Sélecteur de niveau */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex gap-4 justify-center">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedLevel === level
                    ? `bg-gradient-to-r ${getLevelColor(level)} text-white shadow-lg`
                    : 'bg-black/20 text-gray-400 hover:bg-black/30 hover:text-white'
                }`}
              >
                {level === 'beginner' && '🌱 Débutant'}
                {level === 'intermediate' && '🚀 Intermédiaire'}
                {level === 'advanced' && '⚡ Avancé'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Liste des tutoriels */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="wait">
            {levelTutorials.map((tutorial, index) => {
              const progress = getTutorialProgress(tutorial.id);
              const isCompleted = completedTutorials.includes(tutorial.id);
              const completedSteps = progress?.completedSteps.length || 0;
              const totalSteps = tutorial.steps.length;
              const progressPercentage = (completedSteps / totalSteps) * 100;

              return (
                <motion.div
                  key={tutorial.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className={`relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 hover:border-gray-600/60 transition-all duration-500 h-full cursor-pointer overflow-hidden`}>
                    {/* Effet de brillance */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    <div className="relative z-10">
                      {/* Header avec badge de niveau */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLevelBadgeColor(tutorial.level)}`}>
                          {tutorial.level.toUpperCase()}
                        </div>
                        {isCompleted && (
                          <div className="bg-green-500/20 p-2 rounded-full">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          </div>
                        )}
                      </div>

                      {/* Titre et description */}
                      <h3 className="text-xl font-bold text-white mb-2">{tutorial.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        {tutorial.description}
                      </p>

                      {/* Métadonnées */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{tutorial.estimatedTime} min</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Target className="w-4 h-4" />
                          <span>{tutorial.steps.length} étapes</span>
                        </div>
                      </div>

                      {/* Barre de progression */}
                      {progress && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progression</span>
                            <span>{completedSteps}/{totalSteps}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full bg-gradient-to-r ${getLevelColor(tutorial.level)} transition-all duration-500`}
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Prérequis */}
                      {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
                        <div className="mb-4">
                          <div className="text-xs text-gray-500 mb-1">Prérequis:</div>
                          <div className="flex flex-wrap gap-1">
                            {tutorial.prerequisites.map((prereq) => {
                              const isPrereqCompleted = completedTutorials.includes(prereq);
                              return (
                                <span
                                  key={prereq}
                                  className={`px-2 py-1 rounded text-xs ${
                                    isPrereqCompleted
                                      ? 'bg-green-500/20 text-green-400'
                                      : 'bg-red-500/20 text-red-400'
                                  }`}
                                >
                                  {isPrereqCompleted ? '✓' : '✗'} {prereq}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Bouton d'action */}
                      <button
                        onClick={() => handleStartTutorial(tutorial)}
                        disabled={tutorial.prerequisites?.some(prereq => !completedTutorials.includes(prereq))}
                        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                          tutorial.prerequisites?.some(prereq => !completedTutorials.includes(prereq))
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : isCompleted
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                              : progress
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
                                : `bg-gradient-to-r ${getLevelColor(tutorial.level)} hover:shadow-lg text-white`
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <Trophy className="w-4 h-4" />
                            Revoir
                          </>
                        ) : progress ? (
                          <>
                            <Play className="w-4 h-4" />
                            Continuer
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Commencer
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Statistiques globales */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Vos Statistiques
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {getTutorialsByLevel('beginner').filter(t => completedTutorials.includes(t.id)).length}
              </div>
              <div className="text-sm text-gray-400">Débutant complétés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">
                {getTutorialsByLevel('intermediate').filter(t => completedTutorials.includes(t.id)).length}
              </div>
              <div className="text-sm text-gray-400">Intermédiaire complétés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {getTutorialsByLevel('advanced').filter(t => completedTutorials.includes(t.id)).length}
              </div>
              <div className="text-sm text-gray-400">Avancé complétés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {Object.values(useTutorialStore.getState().tutorialProgress).reduce((total, progress) => total + progress.totalPoints, 0)}
              </div>
              <div className="text-sm text-gray-400">Points gagnés</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 