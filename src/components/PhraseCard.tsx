'use client';

import React, { useState } from 'react';
import { Phrase } from '../types';
import { useApp } from '../context/AppContext';
import {
  Volume2,
  Pin,
  Edit2,
  Trash2,
  Check,
  X,
  Edit3,
} from 'lucide-react';

interface PhraseCardProps {
  phrase: Phrase;
}

export const PhraseCard: React.FC<PhraseCardProps> = ({ phrase }) => {
  const {
    speakText,
    setActiveInputText,
    togglePinPhrase,
    deletePhrase,
    updatePhrase,
    settings,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(phrase.text);

  const handleCardClick = () => {
    if (isEditing) return;

    if (settings.tapToSpeak) {
      speakText(phrase.text);
    } else {
      setActiveInputText(phrase.text);
    }
  };

  const handleSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editText.trim()) {
      updatePhrase({ ...phrase, text: editText.trim() });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditText(phrase.text);
    setIsEditing(false);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative rounded-2xl p-4 transition-all border text-left cursor-pointer select-none active:scale-[0.98] ${
        phrase.isPinned
          ? 'bg-calm-900/90 border-brand-500/40 shadow-soft'
          : 'bg-calm-900/60 border-calm-800/80 hover:border-calm-700/90'
      } hover:shadow-card focus-within:ring-2 focus-within:ring-brand-500/30`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`Phrase: ${phrase.text}. Tap to ${settings.tapToSpeak ? 'speak' : 'edit'}.`}
    >
      {/* Top action row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          {phrase.isPinned && (
            <span className="flex items-center gap-1 text-[10px] font-semibold tracking-wider text-brand-300 bg-brand-500/15 border border-brand-500/30 px-2 py-0.5 rounded-full uppercase">
              <Pin className="w-2.5 h-2.5 fill-current" /> Pinned
            </span>
          )}
          {phrase.isCustom && (
            <span className="text-[10px] font-semibold text-accent-teal bg-teal-500/15 border border-teal-500/30 px-2 py-0.5 rounded-full uppercase">
              Custom
            </span>
          )}
        </div>

        {/* Action icons (pin, edit, delete, speak) */}
        <div
          className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => togglePinPhrase(phrase.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              phrase.isPinned
                ? 'text-brand-400 hover:text-brand-300 bg-brand-500/10'
                : 'text-calm-500 hover:text-calm-300 hover:bg-calm-800'
            }`}
            title={phrase.isPinned ? 'Unpin phrase' : 'Pin to top of list'}
            aria-label={phrase.isPinned ? 'Unpin phrase' : 'Pin phrase'}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 rounded-lg text-calm-500 hover:text-calm-300 hover:bg-calm-800 transition-colors"
            title="Edit phrase text"
            aria-label="Edit phrase text"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {phrase.isCustom && (
            <button
              onClick={() => deletePhrase(phrase.id)}
              className="p-1.5 rounded-lg text-calm-500 hover:text-rose-400 hover:bg-calm-800 transition-colors"
              title="Delete custom phrase"
              aria-label="Delete custom phrase"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => speakText(phrase.text)}
            className="p-1.5 rounded-lg text-brand-400 hover:text-brand-300 hover:bg-brand-500/20 transition-colors ml-1"
            title="Speak this phrase immediately"
            aria-label="Speak phrase immediately"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main phrase body */}
      {isEditing ? (
        <div className="space-y-2 mt-2" onClick={(e) => e.stopPropagation()}>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={2}
            className="w-full bg-calm-950 border border-brand-500 rounded-xl p-2.5 text-sm text-calm-100 focus:outline-none"
            autoFocus
          />
          <div className="flex justify-end gap-1.5">
            <button
              onClick={handleCancelEdit}
              className="px-2.5 py-1 rounded-lg bg-calm-800 text-xs text-calm-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-base sm:text-lg font-medium text-calm-100 group-hover:text-white leading-snug">
          {phrase.text}
        </p>
      )}

      {/* Action cue footer */}
      {!isEditing && (
        <div className="mt-2.5 pt-2 border-t border-calm-800/40 flex items-center justify-between text-[11px] text-calm-500">
          <span>{settings.tapToSpeak ? 'Tap to Speak' : 'Tap to Stage into Input'}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveInputText(phrase.text);
            }}
            className="hover:text-brand-300 transition-colors"
          >
            Stage to Input →
          </button>
        </div>
      )}
    </div>
  );
};
