'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Terminal, 
  Lightbulb, 
  TrendingUp,
  Users,
  Target,
  Award
} from 'lucide-react';
import { glossaryEntries, GlossaryEntry } from '../lib/glossary';

export const GlossaryStats: React.FC = () => {
  // Calculer les statistiques
  const totalTerms = glossaryEntries.length;
  const commandTerms = glossaryEntries.filter((term: GlossaryEntry) => term.category === 'command').length;
  const conceptTerms = glossaryEntries.filter((term: GlossaryEntry) => term.category === 'concept').length;
  
  const beginnerTerms = glossaryEntries.filter((term: GlossaryEntry) => term.difficulty === 'beginner').length;
  const intermediateTerms = glossaryEntries.filter((term: GlossaryEntry) => term.difficulty === 'intermediate').length;
  const advancedTerms = glossaryEntries.filter((term: GlossaryEntry) => term.difficulty === 'advanced').length;

  // Calculer les tags les plus populaires
  const allTags = glossaryEntries.flatMap((term: GlossaryEntry) => term.tags);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6);

  const stats = [
    {
      icon: BookOpen,
      label: 'Total des termes',
      value: totalTerms,
      color: 'from-blue-500 to-cyan-500',
      description: 'Commandes et concepts'
    },
    {
      icon: Terminal,
      label: 'Commandes CLI',
      value: commandTerms,
      color: 'from-green-500 to-emerald-500',
      description: 'Commandes pratiques'
    },
    {
      icon: Lightbulb,
      label: 'Concepts',
      value: conceptTerms,
      color: 'from-purple-500 to-pink-500',
      description: 'Théorie et principes'
    },
    {
      icon: Users,
      label: 'Débutant',
      value: beginnerTerms,
      color: 'from-green-400 to-green-600',
      description: 'Niveau facile'
    },
    {
      icon: TrendingUp,
      label: 'Intermédiaire',
      value: intermediateTerms,
      color: 'from-blue-400 to-blue-600',
      description: 'Niveau moyen'
    },
    {
      icon: Award,
      label: 'Avancé',
      value: advancedTerms,
      color: 'from-purple-400 to-purple-600',
      description: 'Niveau expert'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50 hover:border-gray-600/60 transition-all duration-300"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-gray-300 mb-1">{stat.label}</div>
            <div className="text-xs text-gray-500">{stat.description}</div>
          </motion.div>
        ))}
      </div>

      {/* Tags populaires */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white">Tags Populaires</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {topTags.map(([tag, count], index) => (
            <motion.div
              key={tag}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-lg p-3 text-center hover:from-gray-600/50 hover:to-gray-700/50 transition-all duration-200"
            >
              <div className="text-lg font-bold text-white">{count}</div>
              <div className="text-xs text-gray-400 capitalize">{tag}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Répartition par difficulté */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white">Répartition par Niveau</h3>
        </div>
        
        <div className="space-y-3">
          {[
            { level: 'Débutant', count: beginnerTerms, color: 'from-green-500 to-emerald-500', percentage: (beginnerTerms / totalTerms) * 100 },
            { level: 'Intermédiaire', count: intermediateTerms, color: 'from-blue-500 to-cyan-500', percentage: (intermediateTerms / totalTerms) * 100 },
            { level: 'Avancé', count: advancedTerms, color: 'from-purple-500 to-pink-500', percentage: (advancedTerms / totalTerms) * 100 }
          ].map((item, index) => (
            <div key={item.level} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300 font-medium">{item.level}</span>
                <span className="text-gray-400">{item.count} termes ({Math.round(item.percentage)}%)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ delay: 1 + index * 0.2, duration: 0.8 }}
                  className={`h-2 rounded-full bg-gradient-to-r ${item.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Conseils d'utilisation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/30"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0 mt-1">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-yellow-200 mb-2">💡 Conseils d&apos;Utilisation</h3>
            <ul className="text-yellow-100 text-sm space-y-1">
              <li>• Utilisez la barre de recherche pour trouver rapidement un terme</li>
              <li>• Filtrez par catégorie (commandes/concepts) ou niveau de difficulté</li>
              <li>• Cliquez sur les termes liés pour explorer les connexions</li>
              <li>• Pratiquez les exemples dans le mode d&apos;entraînement</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 