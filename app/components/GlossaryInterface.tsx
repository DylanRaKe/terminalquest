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
  Copy,
  Filter,
  X,
  Tag,
  AlertTriangle,
  CheckCircle,
  Zap,
  Target,
  Info
} from 'lucide-react';
import { 
  getAutocompleteSuggestions,
  getRelatedEntries,
  getAllTags,
  getGlossaryStats,
  getAdvancedSearch,
  GlossaryEntry 
} from '../lib/glossary';

interface GlossaryInterfaceProps {
  onBack?: () => void;
}

export const GlossaryInterface: React.FC<GlossaryInterfaceProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<GlossaryEntry | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const stats = getGlossaryStats();
  const allTags = getAllTags();

  // Recherche et filtrage avancés
  const filteredEntries = useMemo(() => {
    return getAdvancedSearch(searchQuery, {
      category: selectedCategory,
      difficulty: selectedDifficulty,
      tags: selectedTags
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedTags]);

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

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSelectedTags([]);
    setSearchQuery('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'command': return <Command className="w-4 h-4" />;
      case 'concept': return <Lightbulb className="w-4 h-4" />;
      case 'option': return <Settings className="w-4 h-4" />;
      case 'file-type': return <FileText className="w-4 h-4" />;
      case 'shortcut': return <Zap className="w-4 h-4" />;
      case 'pattern': return <Target className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'command': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'concept': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'option': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'file-type': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'shortcut': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'pattern': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
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
              <div className={`text-sm font-semibold ${getDifficultyColor(selectedEntry.difficulty)}`}>
                {selectedEntry.difficulty}
              </div>
            </div>
          </motion.div>

          {/* Contenu principal */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Description */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Description
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">{selectedEntry.shortDescription}</p>
              <p className="text-gray-400 leading-relaxed">{selectedEntry.fullDescription}</p>
            </div>

            {/* Syntaxe */}
            {selectedEntry.syntax && (
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
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
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-6">Exemples d&apos;usage</h2>
              <div className="space-y-6">
                {selectedEntry.examples.map((example, index) => (
                  <div key={index} className="bg-black/20 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        {example.interactive && <Zap className="w-4 h-4 text-yellow-400" />}
                        {example.description}
                      </h3>
                      <button
                        onClick={() => copyToClipboard(example.command)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        <Copy className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                    <div className="bg-black/40 rounded p-4 font-mono text-sm mb-3">
                      <div className="text-green-400 mb-1">$ {example.command}</div>
                      {example.output && (
                        <div className="text-gray-300">{example.output}</div>
                      )}
                    </div>
                    {example.explanation && (
                      <div className="text-gray-400 text-sm italic">
                        💡 {example.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Cheat Sheet */}
            {selectedEntry.cheatSheet && (
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
                <h2 className="text-xl font-semibold text-white mb-6">{selectedEntry.cheatSheet.title}</h2>
                <div className="grid gap-3">
                  {selectedEntry.cheatSheet.commands.map((cmd, index) => (
                    <div key={index} className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                      <div className="flex items-center gap-4">
                        <code className="text-green-400 font-mono">{cmd.cmd}</code>
                        <span className="text-gray-300">{cmd.desc}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(cmd.cmd)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        <Copy className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips et Warnings */}
            {(selectedEntry.tips || selectedEntry.warnings) && (
              <div className="grid gap-6 md:grid-cols-2">
                {selectedEntry.tips && (
                  <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 backdrop-blur-xl rounded-3xl p-6 border border-green-500/30">
                    <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Conseils
                    </h3>
                    <ul className="space-y-2">
                      {selectedEntry.tips.map((tip, index) => (
                        <li key={index} className="text-green-300 text-sm flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedEntry.warnings && (
                  <div className="bg-gradient-to-br from-orange-900/20 to-red-800/20 backdrop-blur-xl rounded-3xl p-6 border border-orange-500/30">
                    <h3 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Attention
                    </h3>
                    <ul className="space-y-2">
                      {selectedEntry.warnings.map((warning, index) => (
                        <li key={index} className="text-orange-300 text-sm flex items-start gap-2">
                          <span className="text-orange-400 mt-1">⚠</span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Cas d'usage */}
            {selectedEntry.useCases && selectedEntry.useCases.length > 0 && (
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
                <h2 className="text-xl font-semibold text-white mb-4">Cas d&apos;usage</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {selectedEntry.useCases.map((useCase, index) => (
                    <div key={index} className="bg-black/20 rounded-lg p-4 flex items-center gap-3">
                      <Target className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-gray-300">{useCase}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Termes liés */}
            {relatedEntries.length > 0 && (
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
                <h2 className="text-xl font-semibold text-white mb-6">Termes liés</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {relatedEntries.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      className="bg-black/20 rounded-lg p-4 text-left hover:bg-black/30 transition-colors group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(entry.category)}
                        <span className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {entry.term}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{entry.shortDescription}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header avec statistiques */}
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
                Glossaire CLI Interactif
              </h1>
              <p className="text-gray-300 mt-2">
                {stats.total} termes • {stats.totalTags} tags • Recherche intelligente
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{stats.byDifficulty.beginner || 0}</div>
              <div className="text-xs text-gray-400">Débutant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.byDifficulty.intermediate || 0}</div>
              <div className="text-xs text-gray-400">Intermédiaire</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{stats.byDifficulty.advanced || 0}</div>
              <div className="text-xs text-gray-400">Avancé</div>
            </div>
          </div>
        </motion.div>

        {/* Barre de recherche et filtres */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50">
            {/* Recherche principale */}
            <div className="relative mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Rechercher une commande, concept ou tag..."
                  className="w-full pl-12 pr-4 py-4 bg-black/20 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
                    showFilters ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              {/* Suggestions d'autocomplétion */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-xl rounded-xl border border-gray-600/50 shadow-2xl z-50"
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filtres avancés */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Filtres avancés</h3>
                    <button
                      onClick={clearFilters}
                      className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Effacer
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Catégorie */}
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Catégorie</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-black/20 border border-gray-600/50 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="all">Toutes</option>
                        <option value="command">Commandes</option>
                        <option value="concept">Concepts</option>
                        <option value="option">Options</option>
                        <option value="file-type">Types de fichier</option>
                        <option value="shortcut">Raccourcis</option>
                        <option value="pattern">Motifs</option>
                      </select>
                    </div>

                    {/* Difficulté */}
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Difficulté</label>
                      <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="w-full bg-black/20 border border-gray-600/50 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="all">Toutes</option>
                        <option value="beginner">Débutant</option>
                        <option value="intermediate">Intermédiaire</option>
                        <option value="advanced">Avancé</option>
                      </select>
                    </div>

                    {/* Mode d'affichage */}
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Affichage</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                            viewMode === 'grid' 
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                              : 'bg-black/20 text-gray-400 hover:text-white'
                          }`}
                        >
                          Grille
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                            viewMode === 'list' 
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                              : 'bg-black/20 text-gray-400 hover:text-white'
                          }`}
                        >
                          Liste
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Tags populaires</label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.slice(0, 12).map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            selectedTags.includes(tag)
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-black/20 text-gray-400 hover:text-white border border-gray-600/30'
                          }`}
                        >
                          <Tag className="w-3 h-3 inline mr-1" />
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Résultats */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {filteredEntries.length} résultat{filteredEntries.length > 1 ? 's' : ''}
              {searchQuery && ` pour "${searchQuery}"`}
            </h2>
          </div>

          <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
            <AnimatePresence mode="wait">
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative cursor-pointer"
                  onClick={() => handleEntryClick(entry)}
                >
                  <div className={`relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 hover:border-gray-600/60 transition-all duration-500 h-full overflow-hidden ${
                    viewMode === 'list' ? 'flex items-center gap-6' : ''
                  }`}>
                    {/* Effet de brillance */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    <div className={`relative z-10 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      {/* Header avec badges */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(entry.category)}
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(entry.category)}`}>
                            {entry.category.toUpperCase()}
                          </div>
                        </div>
                        <div className={`text-xs font-semibold ${getDifficultyColor(entry.difficulty)}`}>
                          {entry.difficulty}
                        </div>
                      </div>

                      {/* Titre et description */}
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {entry.term}
                        {entry.aliases && entry.aliases.length > 0 && (
                          <span className="text-gray-400 text-sm font-normal ml-2">
                            ({entry.aliases.join(', ')})
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        {entry.shortDescription}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {entry.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-black/20 text-gray-400 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {entry.tags.length > 3 && (
                          <span className="px-2 py-1 bg-black/20 text-gray-400 text-xs rounded-full">
                            +{entry.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Métadonnées */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{entry.examples.length} exemple{entry.examples.length > 1 ? 's' : ''}</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Aucun résultat trouvé</h3>
              <p className="text-gray-500">
                Essayez de modifier vos critères de recherche ou effacez les filtres
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}; 