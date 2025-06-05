'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Circle, 
  Lightbulb, 
  Target,
  Clock,
  Trophy,
  RotateCcw,
  Play,
  BookOpen
} from 'lucide-react';
import { Tutorial, TutorialStep } from '../stores/tutorialStore';
import { useTutorialStore } from '../stores/tutorialStore';
import { SandboxTerminal } from './SandboxTerminal';

interface TutorialPlayerProps {
  tutorial: Tutorial;
  onBack: () => void;
}

export const TutorialPlayer: React.FC<TutorialPlayerProps> = ({ tutorial, onBack }) => {
  const {
    currentStepIndex,
    getCurrentStep,
    isStepCompleted,
    nextStep,
    previousStep,
    getTutorialProgress
  } = useTutorialStore();

  const [showHint, setShowHint] = useState(false);

  const currentStep = getCurrentStep();
  const progress = getTutorialProgress(tutorial.id);
  const totalSteps = tutorial.steps.length;
  const completedStepsCount = progress?.completedSteps.length || 0;
  const progressPercentage = (completedStepsCount / totalSteps) * 100;

  useEffect(() => {
    setShowHint(false);
  }, [currentStepIndex]);

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      previousStep();
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      nextStep();
    }
  };

  const handleResetStep = () => {
    // Réinitialiser l'étape
    setShowHint(false);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'from-green-500 to-emerald-500';
      case 'intermediate': return 'from-blue-500 to-cyan-500';
      case 'advanced': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStepIcon = (step: TutorialStep, index: number) => {
    if (isStepCompleted(step.id)) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    } else if (index === currentStepIndex) {
      return <Play className="w-5 h-5 text-blue-400" />;
    } else {
      return <Circle className="w-5 h-5 text-gray-500" />;
    }
  };

  if (!currentStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6 flex items-center justify-center">
        <div className="text-center text-white">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h2 className="text-3xl font-bold mb-4">🎉 Tutoriel Terminé !</h2>
          <p className="text-gray-300 mb-6">
                         Félicitations ! Vous avez terminé le tutoriel &quot;{tutorial.title}&quot;
          </p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200"
          >
            Retour aux Tutoriels
          </button>
        </div>
      </div>
    );
  }

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
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-400" />
                {tutorial.title}
              </h1>
              <p className="text-gray-300">{tutorial.description}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xl font-bold text-white">
              Étape {currentStepIndex + 1}/{totalSteps}
            </div>
            <div className="text-sm text-gray-400">
              {completedStepsCount} complétées
            </div>
          </div>
        </motion.div>

        {/* Barre de progression globale */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progression du tutoriel</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full bg-gradient-to-r ${getLevelColor(tutorial.level)} transition-all duration-500`}
              style={{ width: `${progressPercentage}%` }}
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
              {/* Étape actuelle */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getLevelColor(tutorial.level)}`}>
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{currentStep.title}</h3>
                    <div className="text-sm text-gray-400">
                      {currentStep.points} points
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-4">
                  {currentStep.description}
                </p>

                {/* Commande attendue */}
                <div className="bg-black/40 rounded-lg p-4 mb-4">
                  <div className="text-sm text-gray-400 mb-2">Commande à exécuter :</div>
                  <code className="text-green-400 font-mono">{currentStep.command}</code>
                </div>

                {/* Bouton d'indice */}
                {currentStep.hint && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors mb-4"
                  >
                    <Lightbulb className="w-4 h-4" />
                    {showHint ? 'Masquer l\'indice' : 'Afficher un indice'}
                  </button>
                )}

                {/* Indice */}
                <AnimatePresence>
                  {showHint && currentStep.hint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4"
                    >
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <p className="text-yellow-200 text-sm">{currentStep.hint}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Validation de l'étape */}
                {isStepCompleted(currentStep.id) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-200 font-semibold">Étape complétée !</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex gap-2">
                <button
                  onClick={handlePreviousStep}
                  disabled={currentStepIndex === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Précédent
                </button>
                
                <button
                  onClick={handleResetStep}
                  className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  title="Réinitialiser l'étape"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleNextStep}
                  disabled={currentStepIndex === totalSteps - 1}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
                >
                  Suivant
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Liste des étapes */}
            <div className="mt-6 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50">
              <h4 className="text-lg font-bold text-white mb-4">Progression</h4>
              <div className="space-y-2">
                {tutorial.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      index === currentStepIndex
                        ? 'bg-blue-500/20 border border-blue-500/30'
                        : isStepCompleted(step.id)
                          ? 'bg-green-500/10'
                          : 'bg-gray-700/30'
                    }`}
                  >
                    {getStepIcon(step, index)}
                    <div className="flex-1">
                      <div className={`font-medium ${
                        index === currentStepIndex
                          ? 'text-blue-200'
                          : isStepCompleted(step.id)
                            ? 'text-green-200'
                            : 'text-gray-400'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {step.points} pts
                      </div>
                    </div>
                  </div>
                ))}
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
                <h3 className="text-lg font-bold text-white">Terminal de Pratique</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Temps libre</span>
                </div>
              </div>
              
                             <SandboxTerminal />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 