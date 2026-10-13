'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Hourglass, AlertCircle, VolumeX } from 'lucide-react';

export const QuickAssistBar: React.FC = () => {
  const {
    speakText,
    isSpeaking,
    stopSpeaking,
    settings,
  } = useApp();

  return (
    <section
      aria-label="Quick Assist Shortcuts"
      className="w-full bg-calm-900/40 border-b border-calm-800/40 py-2 px-4 transition-colors"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {/* "Please give me a moment" priority button */}
        <button
          onClick={() => speakText(settings.quickMomentPhrase)}
          className="flex-1 min-w-[170px] flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl bg-calm-800/90 hover:bg-calm-700/90 border border-calm-700/60 text-calm-100 font-medium text-xs sm:text-sm shadow-sm transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brand-400"
          aria-label={`Speak phrase: ${settings.quickMomentPhrase}`}
        >
          <Hourglass className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate">"Please give me a moment"</span>
        </button>

        {/* Emergency Shortcut */}
        <button
          onClick={() => speakText(settings.emergencyPhrase)}
          className="flex-shrink-0 flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-200 font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-rose-400"
          aria-label={`Speak emergency phrase: ${settings.emergencyPhrase}`}
        >
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Emergency Alert</span>
        </button>

        {/* Instant Stop Button if speaking */}
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="flex-shrink-0 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md animate-pulse focus:outline-none focus:ring-2 focus:ring-rose-300"
            aria-label="Stop Speaking immediately"
          >
            <VolumeX className="w-4 h-4 shrink-0" />
            <span>Stop Speech</span>
          </button>
        )}
      </div>
    </section>
  );
};
