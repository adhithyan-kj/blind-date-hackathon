'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PhraseCard } from './PhraseCard';
import {
  MessageCircle,
  Hand,
  GraduationCap,
  ShoppingBag,
  UtensilsCrossed,
  Bus,
  HeartPulse,
  Phone,
  HelpCircle,
  AlertTriangle,
  Bookmark,
  Plus,
  Search,
  Filter,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  MessageCircle: <MessageCircle className="w-4 h-4" />,
  Hand: <Hand className="w-4 h-4" />,
  GraduationCap: <GraduationCap className="w-4 h-4" />,
  ShoppingBag: <ShoppingBag className="w-4 h-4" />,
  UtensilsCrossed: <UtensilsCrossed className="w-4 h-4" />,
  Bus: <Bus className="w-4 h-4" />,
  HeartPulse: <HeartPulse className="w-4 h-4" />,
  Phone: <Phone className="w-4 h-4" />,
  HelpCircle: <HelpCircle className="w-4 h-4" />,
  AlertTriangle: <AlertTriangle className="w-4 h-4" />,
  Bookmark: <Bookmark className="w-4 h-4" />,
};

export const PhraseLibrary: React.FC = () => {
  const {
    phrases,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    addCustomPhrase,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPhraseText, setNewPhraseText] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPhraseText.trim()) {
      addCustomPhrase(newPhraseText.trim(), selectedCategoryId);
      setNewPhraseText('');
      setShowAddForm(false);
    }
  };

  // Filter phrases by category and search
  const filteredPhrases = useMemo(() => {
    return phrases
      .filter((p) => {
        // If searching across all
        if (searchQuery.trim()) {
          return p.text.toLowerCase().includes(searchQuery.toLowerCase());
        }
        // Match selected category
        if (selectedCategoryId === 'custom') {
          return p.isCustom || p.categoryId === 'custom';
        }
        return p.categoryId === selectedCategoryId;
      })
      .sort((a, b) => {
        // Pinned phrases first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  }, [phrases, selectedCategoryId, searchQuery]);

  return (
    <div className="w-full space-y-4">
      {/* Category Pills Scrolling Row */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-calm-200 uppercase tracking-wider">
            Quick Phrases Library
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors focus:outline-none"
          >
            <Plus className="w-4 h-4" />
            <span>Add Phrase</span>
          </button>
        </div>

        {/* Categories Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-1 px-1">
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id && !searchQuery.trim();
            const icon = ICON_MAP[cat.icon] || <MessageCircle className="w-4 h-4" />;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategoryId(cat.id);
                }}
                className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border select-none ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-500/20'
                    : 'bg-calm-900/80 hover:bg-calm-800 text-calm-300 border-calm-800 hover:border-calm-700'
                }`}
                aria-label={`Category: ${cat.name}`}
              >
                {icon}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar & Optional Add Phrase Expandable */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-calm-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all phrases..."
            className="w-full bg-calm-900/80 border border-calm-800/80 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-calm-100 placeholder:text-calm-500 focus:outline-none focus:ring-1 focus:ring-brand-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-calm-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Add Phrase Form Modal/Box */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="bg-calm-900 border border-brand-500/50 rounded-2xl p-4 shadow-card space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Create New Custom Phrase</h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-calm-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
          <input
            type="text"
            value={newPhraseText}
            onChange={(e) => setNewPhraseText(e.target.value)}
            placeholder="e.g. 'I am picking up an order under the name Alex.'"
            className="w-full bg-calm-950 border border-calm-700 rounded-xl p-3 text-sm text-white placeholder:text-calm-500 focus:outline-none focus:ring-1 focus:ring-brand-400"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-xl bg-calm-800 text-xs text-calm-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newPhraseText.trim()}
              className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-xs font-semibold text-white shadow-sm"
            >
              Save Phrase
            </button>
          </div>
        </form>
      )}

      {/* Phrase Cards Grid */}
      {filteredPhrases.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPhrases.map((phrase) => (
            <PhraseCard key={phrase.id} phrase={phrase} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-calm-900/30 rounded-2xl border border-dashed border-calm-800 text-calm-400">
          <p className="text-sm">No phrases found for this category or search.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-2 text-xs font-semibold text-brand-400 hover:text-brand-300 underline"
          >
            + Add your own phrase now
          </button>
        </div>
      )}
    </div>
  );
};
