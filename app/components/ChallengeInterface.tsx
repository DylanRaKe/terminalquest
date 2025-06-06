'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Clock, 
  Target, 
  Zap, 
  Users, 
  Star,
  ArrowLeft,
  Play,
  CheckCircle,
  Medal,
  Timer,
  Award,
  Flame,
  Crown
} from 'lucide-react';
import { 
  challenges, 
  getChallengesByCategory, 
  getDailyChallenge, 
  getWeeklyChallenge,
  Challenge 
} from '../lib/challenges';
import { useChallengeStore } from '../stores/challengeStore';
import { ChallengePlayer } from './ChallengePlayer';

interface ChallengeInterfaceProps {
  onBack?: () => void;
}

export const ChallengeInterface: React.FC<ChallengeInterfaceProps> = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<'daily' | 'weekly' | 'special' | 'community' | 'all'>('all');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  
  const {
    currentChallenge,
    completedChallenges,
    totalScore,
    totalXP,
    badges,
    isCompleted,
    getBestScore,
    getBestTime,
    getStats
  } = useChallengeStore();

  const stats = getStats();
  const dailyChallenge = getDailyChallenge();
  const weeklyChallenge = getWeeklyChallenge();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'daily': return <Clock className="w-5 h-5" />;
      case 'weekly': return <Trophy className="w-5 h-5" />;
      case 'special': return <Star className="w-5 h-5" />;
      case 'community': return <Users className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'daily': return 'from-blue-500 to-cyan-500';
      case 'weekly': return 'from-purple-500 to-pink-500';
      case 'special': return 'from-yellow-500 to-orange-500';
      case 'community': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'advanced': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'expert': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getFilteredChallenges = () => {
    if (selectedCategory === 'all') return challenges;
    return getChallengesByCategory(selectedCategory);
  };

  // Si un défi est en cours ou sélectionné, afficher le player
  if (currentChallenge || selectedChallenge) {
    return (
      <ChallengePlayer 
        challenge={currentChallenge || selectedChallenge!}
        onBack={() => setSelectedChallenge(null)}
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
                <Trophy className="w-10 h-10 text-yellow-400" />
                Défis & Challenges
              </h1>
              <p className="text-gray-300 mt-2">
                Testez vos compétences CLI avec des défis chronométrés et compétitifs
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              <Medal className="w-6 h-6 text-yellow-400" />
              {totalScore.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Points totaux</div>
          </div>
        </motion.div>

        {/* Stats rapides */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-xl rounded-2xl p-4 border border-blue-500/30">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalCompleted}</div>
                <div className="text-sm text-gray-400">Complétés</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">{stats.averageScore}</div>
                <div className="text-sm text-gray-400">Score moyen</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-xl rounded-2xl p-4 border border-green-500/30">
            <div className="flex items-center gap-3">
              <Timer className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">{formatTime(stats.totalTime)}</div>
                <div className="text-sm text-gray-400">Temps total</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 backdrop-blur-xl rounded-2xl p-4 border border-yellow-500/30">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">{badges.length}</div>
                <div className="text-sm text-gray-400">Badges</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Défis du jour et de la semaine */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          {/* Défi quotidien */}
          <div className="bg-gradient-to-br from-blue-900/80 to-cyan-900/80 backdrop-blur-xl rounded-3xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-400" />
                Défi du Jour
              </h3>
              {isCompleted(dailyChallenge.id) && (
                <CheckCircle className="w-6 h-6 text-green-400" />
              )}
            </div>
            
            <h4 className="text-lg font-semibold text-blue-200 mb-2">{dailyChallenge.title}</h4>
            <p className="text-gray-300 text-sm mb-4">{dailyChallenge.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`px-2 py-1 rounded text-xs font-semibold border ${getDifficultyColor(dailyChallenge.difficulty)}`}>
                  {getDifficultyIcon(dailyChallenge.difficulty)} {dailyChallenge.difficulty.toUpperCase()}
                </div>
                <div className="text-sm text-gray-400">
                  <Timer className="w-4 h-4 inline mr-1" />
                  {formatTime(dailyChallenge.timeLimit)}
                </div>
              </div>
              <div className="text-sm text-yellow-400 font-semibold">
                +{dailyChallenge.points} pts
              </div>
            </div>
            
            {isCompleted(dailyChallenge.id) ? (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-center">
                <div className="text-green-400 font-semibold">✅ Complété !</div>
                <div className="text-sm text-gray-400">
                  Meilleur score: {getBestScore(dailyChallenge.id)} | Meilleur temps: {formatTime(getBestTime(dailyChallenge.id))}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setSelectedChallenge(dailyChallenge)}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Relever le Défi
              </button>
            )}
          </div>

          {/* Défi hebdomadaire */}
          <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-purple-400" />
                Défi de la Semaine
              </h3>
              {isCompleted(weeklyChallenge.id) && (
                <CheckCircle className="w-6 h-6 text-green-400" />
              )}
            </div>
            
            <h4 className="text-lg font-semibold text-purple-200 mb-2">{weeklyChallenge.title}</h4>
            <p className="text-gray-300 text-sm mb-4">{weeklyChallenge.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`px-2 py-1 rounded text-xs font-semibold border ${getDifficultyColor(weeklyChallenge.difficulty)}`}>
                  {getDifficultyIcon(weeklyChallenge.difficulty)} {weeklyChallenge.difficulty.toUpperCase()}
                </div>
                <div className="text-sm text-gray-400">
                  <Timer className="w-4 h-4 inline mr-1" />
                  {formatTime(weeklyChallenge.timeLimit)}
                </div>
              </div>
              <div className="text-sm text-yellow-400 font-semibold">
                +{weeklyChallenge.points} pts
                {weeklyChallenge.badge && <Crown className="w-4 h-4 inline ml-1" />}
              </div>
            </div>
            
            {isCompleted(weeklyChallenge.id) ? (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-center">
                <div className="text-green-400 font-semibold">🏆 Complété !</div>
                <div className="text-sm text-gray-400">
                  Meilleur score: {getBestScore(weeklyChallenge.id)} | Meilleur temps: {formatTime(getBestTime(weeklyChallenge.id))}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setSelectedChallenge(weeklyChallenge)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Relever le Défi
              </button>
            )}
          </div>
        </motion.div>

        {/* Filtres par catégorie */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex gap-4 justify-center flex-wrap">
            {(['all', 'daily', 'weekly', 'special', 'community'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category
                    ? `bg-gradient-to-r ${getCategoryColor(category)} text-white shadow-lg`
                    : 'bg-black/20 text-gray-400 hover:bg-black/30 hover:text-white'
                }`}
              >
                {getCategoryIcon(category)}
                {category === 'all' && 'Tous les Défis'}
                {category === 'daily' && 'Quotidiens'}
                {category === 'weekly' && 'Hebdomadaires'}
                {category === 'special' && 'Spéciaux'}
                {category === 'community' && 'Communauté'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Liste des défis */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="wait">
            {getFilteredChallenges().map((challenge, index) => {
              const completed = isCompleted(challenge.id);
              const bestScore = getBestScore(challenge.id);
              const bestTime = getBestTime(challenge.id);

              return (
                <motion.div
                  key={challenge.id}
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
                      {/* Header avec badges */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded text-xs font-semibold border ${getDifficultyColor(challenge.difficulty)}`}>
                            {getDifficultyIcon(challenge.difficulty)} {challenge.difficulty.toUpperCase()}
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-semibold bg-gradient-to-r ${getCategoryColor(challenge.category)} text-white`}>
                            {challenge.category.toUpperCase()}
                          </div>
                        </div>
                        {completed && (
                          <div className="bg-green-500/20 p-2 rounded-full">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          </div>
                        )}
                      </div>

                      {/* Titre et description */}
                      <h3 className="text-xl font-bold text-white mb-2">{challenge.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        {challenge.description}
                      </p>

                      {/* Métadonnées */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Timer className="w-4 h-4" />
                          <span>{formatTime(challenge.timeLimit)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Zap className="w-4 h-4" />
                          <span>+{challenge.points} pts</span>
                        </div>
                      </div>

                      {/* Statistiques personnelles */}
                      {completed && (
                        <div className="mb-4 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                          <div className="text-xs text-green-400 mb-1">Vos records:</div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Score: <span className="font-semibold text-white">{bestScore}</span></div>
                            <div>Temps: <span className="font-semibold text-white">{formatTime(bestTime)}</span></div>
                          </div>
                        </div>
                      )}

                      {/* Badge spécial */}
                      {challenge.badge && (
                        <div className="mb-4 flex items-center gap-2 text-xs text-yellow-400">
                          <Crown className="w-4 h-4" />
                          <span>Badge: {challenge.badge}</span>
                        </div>
                      )}

                      {/* Bouton d'action */}
                      <button
                        onClick={() => setSelectedChallenge(challenge)}
                        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                          completed
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                            : `bg-gradient-to-r ${getCategoryColor(challenge.category)} hover:shadow-lg text-white`
                        }`}
                      >
                        <Play className="w-4 h-4" />
                        {completed ? 'Rejouer' : 'Commencer'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}; 