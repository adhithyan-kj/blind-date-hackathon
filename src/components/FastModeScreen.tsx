'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { inputController } from '../services/inputController';
import {
  Volume2,
  VolumeX,
  X,
  Lock,
  Unlock,
  Radio,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Smartphone,
  Eye,
  Sliders,
} from 'lucide-react';

export const FastModeScreen: React.FC = () => {
  const {
    fastModeGroup,
    speakText,
    stopSpeaking,
    isSpeaking,
    setActiveScreen,
    isFrozen,
    toggleFreezeSuggestions,
    isUpdatingSuggestions,
    isAutomaticModeActive,
    toggleAutomaticMode,
    settings,
    updateSettings,
    showToast,
  } = useApp();

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    switch (key) {
      case 'A': inputController.triggerOptionA('screen_tap'); break;
      case 'B': inputController.triggerOptionB('screen_tap'); break;
      case 'C': inputController.triggerOptionC('screen_tap'); break;
      case 'D': inputController.triggerOptionD('screen_tap'); break;
    }
  };

  const cardList = [
    {
      key: 'A' as const,
      name: 'Option 1 (A)',
      shortcut: '↑ / [1]',
      text: fastModeGroup.optionA.text,
      gradient: 'from-brand-900/60 via-calm-900/95 to-calm-900/95',
      borderColor: 'border-brand-500/50 hover:border-brand-400 focus:ring-brand-500/30',
      badgeBg: 'bg-brand-500 text-white',
      accentColor: 'text-brand-300',
    },
    {
      key: 'B' as const,
      name: 'Option 2 (B)',
      shortcut: '→ / [2]',
      text: fastModeGroup.optionB.text,
      gradient: 'from-teal-950/60 via-calm-900/95 to-calm-900/95',
      borderColor: 'border-teal-500/50 hover:border-teal-400 focus:ring-teal-500/30',
      badgeBg: 'bg-teal-600 text-white',
      accentColor: 'text-teal-300',
    },
    {
      key: 'C' as const,
      name: 'Option 3 (C)',
      shortcut: '↓ / [3]',
      text: fastModeGroup.optionC.text,
      gradient: 'from-amber-950/60 via-calm-900/95 to-calm-900/95',
      borderColor: 'border-amber-500/50 hover:border-amber-400 focus:ring-amber-500/30',
      badgeBg: 'bg-amber-600 text-white',
      accentColor: 'text-amber-300',
    },
    {
      key: 'D' as const,
      name: 'Option 4 (D)',
      shortcut: '← / [4]',
      text: fastModeGroup.optionD.text,
      gradient: 'from-purple-950/60 via-calm-900/95 to-calm-900/95',
      borderColor: 'border-purple-500/50 hover:border-purple-400 focus:ring-purple-500/30',
      badgeBg: 'bg-purple-600 text-white',
      accentColor: 'text-purple-300',
    },
  ];

  return (
    <div className="min-h-[85vh] flex flex-col justify-between py-2 sm:py-4 px-2 sm:px-4 max-w-5xl mx-auto w-full">
      {/* Fast Mode Header Controls */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-2 border-b border-calm-800/60">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-300 font-bold">
            ⚡
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Fast Mode (4 Quick Choices)
              {isUpdatingSuggestions && (
                <span className="text-xs text-amber-400 font-normal animate-pulse">
                  (updating...)
                </span>
              )}
            </h2>
            <p className="text-xs text-calm-400">
              Instant tactile communicator • Tap or press numbers 1-4
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Automatic Mode Toggle */}
          <button
            onClick={toggleAutomaticMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isAutomaticModeActive
                ? 'bg-accent-teal/20 border-accent-teal/40 text-teal-300'
                : 'bg-calm-900 border-calm-700 text-calm-400 hover:text-calm-200'
            }`}
            title="Update suggestions automatically from listening"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auto Updates:</span>
            <span>{isAutomaticModeActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Freeze / Live Toggle */}
          <button
            onClick={toggleFreezeSuggestions}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isFrozen
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-calm-900 border-calm-700 text-calm-300 hover:text-white'
            }`}
            title="Freeze to lock current choices"
          >
            {isFrozen ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{isFrozen ? 'Frozen' : 'Live'}</span>
          </button>

          {/* Exit Fast Mode */}
          <button
            onClick={() => setActiveScreen('main')}
            className="p-2 rounded-xl bg-calm-900 hover:bg-calm-800 border border-calm-700 text-calm-300 hover:text-white transition-colors"
            title="Return to Main Communication Screen"
            aria-label="Close Fast Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 4-Option Grid */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-2 sm:my-3">
        {cardList.map((card) => (
          <button
            key={card.key}
            onClick={() => handleSelectOption(card.key)}
            className={`relative group w-full rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col justify-between items-start text-left bg-gradient-to-br ${card.gradient} border-2 ${card.borderColor} active:scale-[0.985] shadow-card hover:shadow-elevated transition-all cursor-pointer focus:outline-none focus:ring-4`}
            aria-label={`${card.name}: ${card.text}. Tap or press key ${card.shortcut}.`}
          >
            {/* Header row */}
            <div className="w-full flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-lg font-extrabold text-xs sm:text-sm uppercase tracking-wider ${card.badgeBg}`}>
                  {card.name}
                </span>
                <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-calm-800/90 text-calm-300 text-xs font-mono border border-calm-700/60">
                  Key {card.shortcut}
                </span>
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${card.accentColor}`}>
                <Volume2 className="w-4 h-4" />
                <span>Tap to Speak</span>
              </div>
            </div>

            {/* Main Text */}
            <div className="my-auto py-2">
              <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
                "{card.text}"
              </p>
            </div>

            {/* Footer cue */}
            <div className="w-full flex items-center justify-between text-xs text-calm-400 pt-2 border-t border-calm-800/40">
              <span>Instant audio feedback</span>
              <span className={`${card.accentColor} font-semibold group-hover:underline`}>
                Select & Speak →
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Bottom Hardware Simulation & Safety Bar */}
      <div className="pt-2 border-t border-calm-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-calm-400">
        {/* Hardware Keys Test Simulator */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="flex items-center gap-1 text-calm-300 font-medium">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Simulate Hardware / Switch Controls:</span>
          </span>
          <button
            onClick={() => {
              inputController.dispatch({ action: 'SELECT_A', source: 'hardware_volume' });
              showToast('Hardware 1 triggered Option A', 'success');
            }}
            className="px-2 py-1 rounded bg-calm-800 hover:bg-calm-700 text-calm-200 border border-calm-700 font-mono active:scale-95 text-[11px]"
          >
            [1] Opt A
          </button>
          <button
            onClick={() => {
              inputController.dispatch({ action: 'SELECT_B', source: 'hardware_volume' });
              showToast('Hardware 2 triggered Option B', 'success');
            }}
            className="px-2 py-1 rounded bg-calm-800 hover:bg-calm-700 text-calm-200 border border-calm-700 font-mono active:scale-95 text-[11px]"
          >
            [2] Opt B
          </button>
          <button
            onClick={() => {
              inputController.dispatch({ action: 'SELECT_C', source: 'hardware_volume' });
              showToast('Hardware 3 triggered Option C', 'success');
            }}
            className="px-2 py-1 rounded bg-calm-800 hover:bg-calm-700 text-calm-200 border border-calm-700 font-mono active:scale-95 text-[11px]"
          >
            [3] Opt C
          </button>
          <button
            onClick={() => {
              inputController.dispatch({ action: 'SELECT_D', source: 'hardware_volume' });
              showToast('Hardware 4 triggered Option D', 'success');
            }}
            className="px-2 py-1 rounded bg-calm-800 hover:bg-calm-700 text-calm-200 border border-calm-700 font-mono active:scale-95 text-[11px]"
          >
            [4] Opt D
          </button>
        </div>

        {/* Speech cancellation or speaking status */}
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold animate-pulse"
              aria-label="Cancel speech output"
            >
              <VolumeX className="w-4 h-4" />
              <span>Cancel Speech</span>
            </button>
          )}

          <button
            onClick={() => setActiveScreen('main')}
            className="px-3 py-1.5 rounded-xl bg-calm-800 hover:bg-calm-700 text-calm-300 hover:text-white border border-calm-700 font-medium"
          >
            Back to Keyboard
          </button>
        </div>
      </div>
    </div>
  );
};
