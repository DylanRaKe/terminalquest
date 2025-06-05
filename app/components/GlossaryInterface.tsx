'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  BookOpen, 
  ArrowLeft,
  Command,
  Lightbulb,
  FileText,
  Settings,
  ChevronRight,
  Copy
} from 'lucide-react';
import { 
  searchGlossary, 
  getAutocompleteSuggestions,
  getRelatedEntries,
  GlossaryEntry 
} from '../lib/glossary';

interface GlossaryInterfaceProps {
  onBack?: () => void;
}

export const GlossaryInterface: React.FC<GlossaryInterfaceProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<GlossaryEntry | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);


  // Recherche et filtrage
  const filteredEntries = useMemo(() => {
    let entries = searchGlossary(searchQuery);
    
    if (selectedCategory !== 'all') {
      entries = entries.filter(entry => entry.category === selectedCategory);
    }
    
    if (selectedDifficulty !== 'all') {
      entries = entries.filter(entry => entry.difficulty === selectedDifficulty);
    }
    
    return entries;
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  // Auto-complétion
  useEffect(() => {
    if (searchQuery.length > 0) {
      const newSuggestions = getAutocompleteSuggestions(searchQuery);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleEntryClick = (entry: GlossaryEntry) => {
    setSelectedEntry(entry);
  };

  const handleBackToList = () => {
    setSelectedEntry(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'command': return <Command className="w-4 h-4" />;
      case 'concept': return <Lightbulb className="w-4 h-4" />;
      case 'option': return <Settings className="w-4 h-4" />;
      case 'file-type': return <FileText className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'command': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'concept': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'option': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'file-type': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Vue détaillée d'une entrée
  if (selectedEntry) {
    const relatedEntries = getRelatedEntries(selectedEntry.id);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-4 mb-8"
          >
            <button
              onClick={handleBackToList}
              className="p-2 rounded-xl bg-black/20 hover:bg-black/30 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex items-center gap-3">
              {getCategoryIcon(selectedEntry.category)}
              <h1 className="text-4xl font-bold text-white">{selectedEntry.term}</h1>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(selectedEntry.category)}`}>
                {selectedEntry.category.toUpperCase()}
              </div>
            </div>
          </motion.div>

          {/* Contenu principal */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 mb-8"
          >
            {/* Description courte */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">Description</h2>
              <p className="text-gray-300 text-lg leading-relaxed">{selectedEntry.shortDescription}</p>
            </div>

            {/* Description complète */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">Explication détaillée</h2>
              <p className="text-gray-400 leading-relaxed">{selectedEntry.fullDescription}</p>
            </div>

            {/* Syntaxe */}
            {selectedEntry.syntax && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-3">Syntaxe</h2>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-green-400 flex items-center justify-between">
                  <code>{selectedEntry.syntax}</code>
                  <button
                    onClick={() => copyToClipboard(selectedEntry.syntax!)}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Exemples */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">Exemples d&apos;usage</h2>
              <div className="space-y-4">
                {selectedEntry.examples.map((example, index) => (
                  <div key={index} className="bg-black/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">{example.description}</h3>
                      <button
                        onClick={() => copyToClipboard(example.command)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        <Copy className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                    <div className="bg-black/40 rounded p-3 font-mono text-sm">
                      <div className="text-green-400 mb-1">$ {example.command}</div>
                      {example.output && (
                        <div className="text-gray-300">{example.output}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Métadonnées */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Difficulté</h3>
                <div className={`font-semibold ${getDifficultyColor(selectedEntry.difficulty)}`}>
                  {selectedEntry.difficulty.charAt(0).toUpperCase() + selectedEntry.difficulty.slice(1)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {selectedEntry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Alias */}
            {selectedEntry.aliases && selectedEntry.aliases.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Alias</h3>
                <div className="flex gap-2">
                  {selectedEntry.aliases.map((alias) => (
                    <span
                      key={alias}
                      className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full"
                    >
                      {alias}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Entrées liées */}
          {relatedEntries.length > 0 && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Voir aussi</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {relatedEntries.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className="flex items-center justify-between p-3 bg-black/20 hover:bg-black/30 rounded-lg transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(entry.category)}
                      <div>
                        <div className="font-semibold text-white">{entry.term}</div>
                        <div className="text-sm text-gray-400">{entry.shortDescription}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Vue principale avec liste et recherche
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
                Glossaire CLI
              </h1>
              <p className="text-gray-300 mt-2">
                Dictionnaire interactif des commandes et concepts CLI
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{filteredEntries.length}</div>
            <div className="text-sm text-gray-400">Entrées trouvées</div>
          </div>
        </motion.div>

        {/* Barre de recherche */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Rechercher une commande, concept ou tag..."
              className="w-full pl-12 pr-4 py-4 bg-black/20 backdrop-blur-lg border border-gray-700/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          
          {/* Suggestions d'auto-complétion */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-black/80 backdrop-blur-lg border border-gray-700/50 rounded-xl overflow-hidden z-10"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 mb-8 flex-wrap"
        >
          {/* Filtre par catégorie */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
          >
            <option value="all">Toutes les catégories</option>
            <option value="command">Commandes</option>
            <option value="concept">Concepts</option>
            <option value="option">Options</option>
            <option value="file-type">Types de fichiers</option>
          </select>

          {/* Filtre par difficulté */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
          >
            <option value="all">Tous les niveaux</option>
            <option value="beginner">Débutant</option>
            <option value="intermediate">Intermédiaire</option>
            <option value="advanced">Avancé</option>
          </select>
        </motion.div>

        {/* Liste des entrées */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => handleEntryClick(entry)}
              >
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/60 transition-all duration-300 h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(entry.category)}
                      <h3 className="font-bold text-white text-lg">{entry.term}</h3>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-semibold border ${getCategoryColor(entry.category)}`}>
                      {entry.category}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {entry.shortDescription}
                  </p>

                  {/* Métadonnées */}
                  <div className="flex items-center justify-between">
                    <div className={`text-sm font-semibold ${getDifficultyColor(entry.difficulty)}`}>
                      {entry.difficulty}
                    </div>
                    <div className="text-xs text-gray-500">
                      {entry.examples.length} exemple{entry.examples.length > 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {entry.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {entry.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded">
                        +{entry.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Message si aucun résultat */}
        {filteredEntries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-500">
              Essayez de modifier vos critères de recherche ou vos filtres
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}; 