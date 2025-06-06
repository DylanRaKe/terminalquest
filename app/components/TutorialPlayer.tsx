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
    getTutorialProgress,
    completeTutorial,
    exitCurrentTutorial
  } = useTutorialStore();

  const [showHint, setShowHint] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string>('');

  const currentStep = getCurrentStep();
  const progress = getTutorialProgress(tutorial.id);
  const totalSteps = tutorial.steps.length;
  const completedStepsCount = progress?.completedSteps.length || 0;
  const progressPercentage = ((currentStepIndex + (currentStep && isStepCompleted(currentStep.id) ? 1 : 0)) / totalSteps) * 100;

  const handleCommandValidation = (isValid: boolean, command: string) => {
    if (isValid) {
      setValidationMessage('✅ Commande validée !');
      setTimeout(() => setValidationMessage(''), 3000);
    } else if (currentStep && command.trim() !== '') {
      setValidationMessage('❌ Commande incorrecte. Essayez encore !');
      setTimeout(() => setValidationMessage(''), 3000);
    }
  };

  useEffect(() => {
    setShowHint(false);
    setValidationMessage('');
  }, [currentStepIndex]);

  useEffect(() => {
    // Vérifier si le tutoriel est terminé
    if (currentStepIndex >= totalSteps) {
      console.log('Tutoriel terminé, appel de completeTutorial()');
      completeTutorial();
    }
  }, [currentStepIndex, totalSteps, completeTutorial]);

  // Debug: afficher l'état actuel
  useEffect(() => {
    console.log('TutorialPlayer - État actuel:', {
      tutorialId: tutorial.id,
      currentStepIndex,
      totalSteps,
      currentStep: currentStep?.id,
      isCompleted: currentStep ? isStepCompleted(currentStep.id) : false
    });
  }, [tutorial.id, currentStepIndex, totalSteps, currentStep, isStepCompleted]);

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      previousStep();
    } else {
      // Si on est à la première étape, retourner à la liste des tutoriels
      exitCurrentTutorial();
      onBack();
    }
  };

  const handleNextStep = () => {
    // Vérifier que l'étape actuelle est complétée avant de passer à la suivante
    if (currentStep && !isStepCompleted(currentStep.id)) {
      setValidationMessage('⚠️ Vous devez d\'abord compléter cette étape !');
      setTimeout(() => setValidationMessage(''), 3000);
      return;
    }
    
    if (currentStepIndex < totalSteps - 1) {
      nextStep();
    }
  };

  const handleResetStep = () => {
    // Réinitialiser l'étape
    setShowHint(false);
    setValidationMessage('');
  };

  const handleResetTutorial = () => {
    if (confirm('Êtes-vous sûr de vouloir recommencer ce tutoriel depuis le début ?')) {
      exitCurrentTutorial();
      // Redémarrer le tutoriel
      setTimeout(() => {
        window.location.reload(); // Solution simple pour redémarrer proprement
      }, 100);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'from-green-500 to-emerald-500';
      case 'intermediate': return 'from-blue-500 to-cyan-500';
      case 'advanced': return 'from-purple-500 to-pink-500';
      case 'expert': return 'from-red-500 to-orange-500';
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
              onClick={() => {
                exitCurrentTutorial();
                onBack();
              }}
              className="p-2 rounded-xl bg-black/20 hover:bg-black/30 transition-colors"
              title="Retour à la liste des tutoriels"
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
          
          <div className="text-right flex items-center gap-4">
            <button
              onClick={handleResetTutorial}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors text-sm"
              title="Recommencer ce tutoriel"
            >
              🔄 Recommencer
            </button>
            <div>
              <div className="text-xl font-bold text-white">
                Étape {currentStepIndex + 1}/{totalSteps}
              </div>
              <div className="text-sm text-gray-400">
                {completedStepsCount} complétées
              </div>
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

                {/* Message de validation */}
                {validationMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`border rounded-lg p-4 mb-4 ${
                      validationMessage.includes('✅') 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {validationMessage.includes('✅') ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-red-400" />
                      )}
                      <span className={`font-semibold ${
                        validationMessage.includes('✅') ? 'text-green-200' : 'text-red-200'
                      }`}>
                        {validationMessage}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Validation de l'étape */}
                {isStepCompleted(currentStep.id) && !validationMessage && (
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
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {currentStepIndex === 0 ? 'Retour' : 'Précédent'}
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
                  disabled={currentStepIndex === totalSteps - 1 || (currentStep && !isStepCompleted(currentStep.id))}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
                >
                  {currentStep && !isStepCompleted(currentStep.id) ? 'Complétez l\'étape' : 'Suivant'}
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
              
                             <SandboxTerminal onCommandValidated={handleCommandValidation} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 