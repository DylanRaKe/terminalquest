'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  XCircle,
  Timer,
  Target,
  Lightbulb,
  Trophy,
  Zap,
  AlertTriangle,
  Crown
} from 'lucide-react';
import { Challenge } from '../lib/challenges';
import { useChallengeStore } from '../stores/challengeStore';
import { SandboxTerminal } from './SandboxTerminal';

interface ChallengePlayerProps {
  challenge: Challenge;
  onBack: () => void;
}

export const ChallengePlayer: React.FC<ChallengePlayerProps> = ({ challenge, onBack }) => {
  const {
    currentChallenge,
    isActive,
    timeElapsed,
    attempts,
    startChallenge,
    submitChallenge,
    abandonChallenge,
    updateTimer
  } = useChallengeStore();

  const [showHints, setShowHints] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [lastResult, setLastResult] = useState<{
    completed: boolean;
    score: number;
    feedback: string;
    timeElapsed: number;
  } | null>(null);
  const [isStarted, setIsStarted] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        updateTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, updateTimer]);

  // Auto-start si c'est le défi actuel
  useEffect(() => {
    if (currentChallenge?.id === challenge.id && isActive) {
      setIsStarted(true);
    }
  }, [currentChallenge, challenge.id, isActive]);

  const handleStart = () => {
    startChallenge(challenge);
    setIsStarted(true);
    setLastResult(null);
    setShowHints(false);
    setCurrentHintIndex(0);
  };

  const handleAbandon = () => {
    if (confirm('Êtes-vous sûr de vouloir abandonner ce défi ?')) {
      abandonChallenge();
      setIsStarted(false);
      onBack();
    }
  };

  const handleCommandValidation = useCallback((isValid: boolean, command: string, output: string) => {
    if (!isActive || !currentChallenge) return;

    try {
      const result = submitChallenge(command, output);
      setLastResult(result);
      
      if (result.completed) {
        // Défi complété avec succès
        setTimeout(() => {
          setIsStarted(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  }, [isActive, currentChallenge, submitChallenge]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const remaining = challenge.timeLimit - timeElapsed;
    const percentage = remaining / challenge.timeLimit;
    
    if (percentage > 0.5) return 'text-green-400';
    if (percentage > 0.25) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'from-green-500 to-emerald-500';
      case 'intermediate': return 'from-blue-500 to-cyan-500';
      case 'advanced': return 'from-purple-500 to-pink-500';
      case 'expert': return 'from-red-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '🌱';
      case 'intermediate': return '🚀';
      case 'advanced': return '⚡';
      case 'expert': return '🔥';
      default: return '🎯';
    }
  };

  const isTimeUp = timeElapsed >= challenge.timeLimit;
  const remainingTime = Math.max(0, challenge.timeLimit - timeElapsed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-black/20 hover:bg-black/30 transition-colors"
              title="Retour aux défis"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                {challenge.title}
              </h1>
              <p className="text-gray-300">{challenge.description}</p>
            </div>
          </div>
          
          <div className="text-right flex items-center gap-4">
            <button
              onClick={handleAbandon}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors text-sm"
              title="Abandonner le défi"
            >
              🏃‍♂️ Abandonner
            </button>
            <div>
              <div className={`text-2xl font-bold ${getTimeColor()}`}>
                {formatTime(remainingTime)}
              </div>
              <div className="text-sm text-gray-400">
                Temps restant
              </div>
            </div>
          </div>
        </motion.div>

        {/* Barre de progression temporelle */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progression temporelle</span>
            <span>{Math.round((timeElapsed / challenge.timeLimit) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                isTimeUp 
                  ? 'bg-gradient-to-r from-red-500 to-red-600' 
                  : remainingTime < challenge.timeLimit * 0.25
                    ? 'bg-gradient-to-r from-yellow-500 to-red-500'
                    : 'bg-gradient-to-r from-green-500 to-blue-500'
              }`}
              style={{ width: `${Math.min((timeElapsed / challenge.timeLimit) * 100, 100)}%` }}
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Panneau latéral - Instructions */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 h-fit">
              {/* Informations du défi */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)}`}>
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">
                        {getDifficultyIcon(challenge.difficulty)} {challenge.difficulty.toUpperCase()}
                      </span>
                      {challenge.badge && <Crown className="w-5 h-5 text-yellow-400" />}
                    </div>
                    <div className="text-sm text-gray-400">
                      +{challenge.points} points • +{challenge.xpReward} XP
                    </div>
                  </div>
                </div>

                {/* Tâche à accomplir */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                  <div className="text-sm text-blue-400 mb-2 font-semibold">🎯 Objectif :</div>
                  <p className="text-blue-200 text-sm leading-relaxed">{challenge.task}</p>
                </div>

                {/* Statistiques de la session */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-black/20 rounded-lg p-3 text-center">
                    <Timer className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                    <div className="text-xs text-gray-400">Tentatives</div>
                    <div className="text-lg font-bold text-white">{attempts}</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 text-center">
                    <Zap className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
                    <div className="text-xs text-gray-400">Score max</div>
                    <div className="text-lg font-bold text-white">{challenge.points}</div>
                  </div>
                </div>

                {/* Boutons d'indices */}
                {challenge.hints.length > 0 && (
                  <div className="mb-4">
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors mb-2"
                    >
                      <Lightbulb className="w-4 h-4" />
                      {showHints ? 'Masquer les indices' : `Afficher les indices (${challenge.hints.length})`}
                    </button>

                    <AnimatePresence>
                      {showHints && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          {challenge.hints.map((hint, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 ${
                                index <= currentHintIndex ? 'opacity-100' : 'opacity-50'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-xs text-yellow-400 mb-1">Indice {index + 1}:</div>
                                  <p className="text-yellow-200 text-sm">{hint}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          
                          {currentHintIndex < challenge.hints.length - 1 && (
                            <button
                              onClick={() => setCurrentHintIndex(prev => Math.min(prev + 1, challenge.hints.length - 1))}
                              className="w-full py-2 px-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors text-sm"
                            >
                              Indice suivant
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Résultat de la dernière tentative */}
                {lastResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`border rounded-lg p-4 mb-4 ${
                      lastResult.completed 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {lastResult.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <span className={`font-semibold ${
                        lastResult.completed ? 'text-green-200' : 'text-red-200'
                      }`}>
                        {lastResult.completed ? '🎉 Défi Réussi !' : '❌ Tentative échouée'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300 mb-2">{lastResult.feedback}</div>
                    {lastResult.completed && (
                      <div className="text-xs text-gray-400">
                        Score: {lastResult.score} | Temps: {Math.floor(lastResult.timeElapsed / 60)}m {lastResult.timeElapsed % 60}s
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Alerte temps écoulé */}
                {isTimeUp && !lastResult?.completed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span className="text-red-200 font-semibold">⏰ Temps écoulé !</span>
                    </div>
                    <p className="text-red-300 text-sm mt-1">
                      Vous pouvez continuer à pratiquer, mais le score ne sera plus comptabilisé.
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Boutons d'action */}
              <div className="space-y-2">
                {!isStarted ? (
                  <button
                    onClick={handleStart}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg`}
                  >
                    <Play className="w-4 h-4" />
                    Commencer le Défi
                  </button>
                ) : (
                  <button
                    onClick={handleStart}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Recommencer
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Terminal */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Terminal de Défi</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Timer className="w-4 h-4" />
                  <span>{isActive ? 'En cours' : 'En attente'}</span>
                </div>
              </div>
              
              <SandboxTerminal 
                onCommandValidated={handleCommandValidation}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 