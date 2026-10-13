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
    fastModePair,
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

  const [previewMode, setPreviewMode] = useState<boolean>(false);

  const handleSelectOptionA = () => {
    inputController.triggerOptionA('screen_tap');
  };

  const handleSelectOptionB = () => {
    inputController.triggerOptionB('screen_tap');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between py-2 sm:py-4 px-2 sm:px-4 max-w-4xl mx-auto w-full">
      {/* Fast Mode Header Controls */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-2 border-b border-calm-800/60">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-300 font-bold">
            ⚡
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Fast Mode
              {isUpdatingSuggestions && (
                <span className="text-xs text-amber-400 font-normal animate-pulse">
                  (updating...)
                </span>
              )}
            </h2>
            <p className="text-xs text-calm-400">
              Instant 2-choice tactile communicator
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

      {/* Primary 2-Option Huge Tap Targets */}
      <div className="flex-1 grid grid-rows-2 gap-4 sm:gap-6 my-2 sm:my-4">
        {/* OPTION A */}
        <button
          onClick={handleSelectOptionA}
          className="relative group w-full rounded-3xl p-6 sm:p-10 flex flex-col justify-between items-start text-left bg-gradient-to-br from-brand-900/60 via-calm-900/90 to-calm-900/90 border-2 border-brand-500/50 hover:border-brand-400 active:scale-[0.985] shadow-card hover:shadow-elevated transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-brand-500/30"
          aria-label={`Option A: ${fastModePair.optionA.text}. Tap or press Up Arrow.`}
        >
          {/* Card Badges */}
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-brand-500 text-white font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-sm">
                Option A
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-calm-800 text-calm-300 text-xs font-mono border border-calm-700">
                <ArrowUp className="w-3.5 h-3.5 text-brand-400" /> Up Arrow / [1]
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-brand-300 font-medium">
              <Volume2 className="w-4 h-4 text-brand-400" />
              <span>Tap to Speak</span>
            </div>
          </div>

          {/* Big Text */}
          <div className="my-auto py-2">
            <p className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight sm:leading-snug">
              {fastModePair.optionA.text}
            </p>
          </div>

          {/* Footer cue */}
          <div className="w-full flex items-center justify-between text-xs sm:text-sm text-calm-400 pt-2 border-t border-brand-500/20">
            <span>Primary confirmation</span>
            <span className="text-brand-400 font-semibold group-hover:underline">Select & Speak →</span>
          </div>
        </button>

        {/* OPTION B */}
        <button
          onClick={handleSelectOptionB}
          className="relative group w-full rounded-3xl p-6 sm:p-10 flex flex-col justify-between items-start text-left bg-gradient-to-br from-indigo-950/60 via-calm-900/90 to-calm-900/90 border-2 border-indigo-500/50 hover:border-indigo-400 active:scale-[0.985] shadow-card hover:shadow-elevated transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
          aria-label={`Option B: ${fastModePair.optionB.text}. Tap or press Down Arrow.`}
        >
          {/* Card Badges */}
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-sm">
                Option B
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-calm-800 text-calm-300 text-xs font-mono border border-calm-700">
                <ArrowDown className="w-3.5 h-3.5 text-indigo-400" /> Down Arrow / [2]
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium">
              <Volume2 className="w-4 h-4 text-indigo-400" />
              <span>Tap to Speak</span>
            </div>
          </div>

          {/* Big Text */}
          <div className="my-auto py-2">
            <p className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight sm:leading-snug">
              {fastModePair.optionB.text}
            </p>
          </div>

          {/* Footer cue */}
          <div className="w-full flex items-center justify-between text-xs sm:text-sm text-calm-400 pt-2 border-t border-indigo-500/20">
            <span>Alternative confirmation</span>
            <span className="text-indigo-400 font-semibold group-hover:underline">Select & Speak →</span>
          </div>
        </button>
      </div>

      {/* Bottom Hardware Simulation & Safety Bar */}
      <div className="pt-2 border-t border-calm-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-calm-400">
        {/* Android Volume Key Test Simulator */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-calm-300 font-medium">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Simulate Hardware Volume Keys:</span>
          </span>
          <button
            onClick={() => {
              inputController.dispatch({ action: 'SELECT_A', source: 'hardware_volume' });
              showToast('Hardware Volume UP triggered Option A', 'success');
            }}
            className="px-2.5 py-1.5 rounded-lg bg-calm-800 hover:bg-calm-700 text-calm-200 border border-calm-700 font-mono active:scale-95"
            title="Simulates hardware Volume-Up button press"
          >
            Vol ▲ (Opt A)
          </button>
          <button
            onClick={() => {
              inputController.dispatch({ action: 'SELECT_B', source: 'hardware_volume' });
              showToast('Hardware Volume DOWN triggered Option B', 'success');
            }}
            className="px-2.5 py-1.5 rounded-lg bg-calm-800 hover:bg-calm-700 text-calm-200 border border-calm-700 font-mono active:scale-95"
            title="Simulates hardware Volume-Down button press"
          >
            Vol ▼ (Opt B)
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
            className="px-3 py-1.5 rounded-xl bg-calm-800 hover:bg-calm-700 text-calm-300 hover:text-white border border-calm-700"
          >
            Back to Keyboard
          </button>
        </div>
      </div>
    </div>
  );
};
