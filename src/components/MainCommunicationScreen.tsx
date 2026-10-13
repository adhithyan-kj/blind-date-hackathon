'use client';

import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Trash2,
  Keyboard,
  PlusCircle,
  BookmarkCheck,
  Sparkles,
} from 'lucide-react';

export const MainCommunicationScreen: React.FC = () => {
  const {
    activeInputText,
    setActiveInputText,
    speakText,
    stopSpeaking,
    isSpeaking,
    repeatLastSpoken,
    lastSpokenText,
    clearInputText,
    addCustomPhrase,
    settings,
  } = useApp();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSpeak = () => {
    if (activeInputText.trim()) {
      speakText(activeInputText);
    }
  };

  const handleSaveToPhrases = () => {
    if (activeInputText.trim()) {
      addCustomPhrase(activeInputText, 'custom');
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Main editable text card */}
      <div className="bg-calm-900/70 border border-calm-800/80 rounded-2xl p-4 sm:p-5 shadow-card relative overflow-hidden transition-all focus-within:border-brand-500/60 focus-within:ring-2 focus-within:ring-brand-500/20">
        <div className="flex items-center justify-between pb-2 mb-1 border-b border-calm-800/60 text-xs text-calm-400">
          <label htmlFor="communication-input" className="flex items-center gap-1.5 font-medium text-calm-300">
            <Keyboard className="w-4 h-4 text-brand-400" />
            <span>Type or Select Text to Speak</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] text-amber-400/90 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              💡 Hint: Tap Speak or select phrases below
            </span>
            {settings.rate && (
              <span className="bg-calm-800 px-2 py-0.5 rounded text-[11px] text-calm-400">
                Speed: {settings.rate}x
              </span>
            )}
            <span className="text-[11px] text-calm-500">{activeInputText.length} chars</span>
          </div>
        </div>

        {/* Big accessible textarea */}
        <textarea
          id="communication-input"
          ref={textareaRef}
          value={activeInputText}
          onChange={(e) => setActiveInputText(e.target.value)}
          placeholder="Type whatever you'd like to say, or tap any phrase card below..."
          rows={3}
          className="w-full bg-transparent text-lg sm:text-2xl font-medium text-calm-50 placeholder:text-calm-500/70 focus:outline-none resize-none leading-relaxed transition-all"
          aria-label="Text to speak"
        />

        {/* Action button cluster below textarea */}
        <div className="pt-3 mt-2 border-t border-calm-800/40 flex flex-wrap items-center justify-between gap-2">
          {/* Left tools: clear, repeat, save */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={clearInputText}
              disabled={!activeInputText}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-calm-800/60 hover:bg-calm-800 disabled:opacity-30 disabled:hover:bg-calm-800/60 text-calm-300 hover:text-white border border-calm-700/50 text-xs font-medium flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400"
              title="Clear input text"
              aria-label="Clear typed text"
            >
              <Trash2 className="w-4 h-4 text-calm-400" />
              <span className="hidden sm:inline">Clear</span>
            </button>

            <button
              onClick={repeatLastSpoken}
              disabled={!lastSpokenText}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-calm-800/60 hover:bg-calm-800 disabled:opacity-30 disabled:hover:bg-calm-800/60 text-calm-300 hover:text-white border border-calm-700/50 text-xs font-medium flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400"
              title={lastSpokenText ? `Repeat: "${lastSpokenText}"` : 'Repeat last spoken sentence'}
              aria-label="Repeat previous sentence"
            >
              <RotateCcw className="w-4 h-4 text-brand-400" />
              <span className="hidden sm:inline">Repeat</span>
            </button>

            {activeInputText.trim() && (
              <button
                onClick={handleSaveToPhrases}
                className="px-2.5 py-2 rounded-xl bg-calm-800/60 hover:bg-calm-800 text-calm-300 hover:text-brand-300 border border-calm-700/50 text-xs font-medium flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400"
                title="Save current text to custom phrases library"
                aria-label="Save current text as a custom phrase"
              >
                <PlusCircle className="w-4 h-4 text-accent-teal" />
                <span className="hidden sm:inline">Save as Phrase</span>
              </button>
            )}
          </div>

          {/* Right Primary Action: Speak & Stop buttons */}
          <div className="flex items-center gap-2">
            {isSpeaking ? (
              <button
                onClick={stopSpeaking}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm sm:text-base shadow-elevated animate-pulse focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all active:scale-95"
                aria-label="Stop Speaking Now"
              >
                <VolumeX className="w-5 h-5" />
                <span>Stop Speaking</span>
              </button>
            ) : (
              <button
                onClick={handleSpeak}
                disabled={!activeInputText.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:hover:bg-brand-600 text-white font-bold text-sm sm:text-base shadow-elevated focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all active:scale-95 cursor-pointer"
                aria-label="Speak text aloud"
              >
                <Volume2 className="w-5 h-5 text-white" />
                <span>Speak Aloud</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
