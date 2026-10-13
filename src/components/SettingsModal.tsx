'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Volume2,
  Sliders,
  Moon,
  Sun,
  Eye,
  Type,
  Shield,
  Trash2,
  RefreshCw,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    settings,
    updateSettings,
    availableVoices,
    speakText,
    resetAllData,
  } = useApp();

  if (!isSettingsOpen) return null;

  const handleTestVoice = () => {
    speakText('Hello! This is a test of your configured voice on UnMute.');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-calm-950 border border-calm-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-calm-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 id="settings-dialog-title" className="text-base sm:text-lg font-bold text-white">
                Settings & Personalization
              </h2>
              <p className="text-xs text-calm-400">Customize voice, accessibility, and behavior</p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-2 rounded-xl text-calm-400 hover:text-white hover:bg-calm-800 transition-colors"
            aria-label="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm text-calm-200">
          {/* SECTION: Voice & Speech Engine */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4" /> Voice & Speech Output
            </h3>

            {/* Voice Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="voice-select" className="text-xs font-medium text-calm-300">
                Text-to-Speech Voice
              </label>
              {availableVoices.length > 0 ? (
                <select
                  id="voice-select"
                  value={settings.voiceURI}
                  onChange={(e) => updateSettings({ voiceURI: e.target.value })}
                  className="w-full bg-calm-900 border border-calm-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-400"
                >
                  <option value="">Browser Default Voice</option>
                  {availableVoices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-xs text-calm-400 italic">
                  Using default browser speech synthesizer.
                </p>
              )}
            </div>

            {/* Speech Rate Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-calm-300">Speech Rate (Speed)</span>
                <span className="font-mono text-brand-400">{settings.rate}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.5"
                step="0.05"
                value={settings.rate}
                onChange={(e) => updateSettings({ rate: parseFloat(e.target.value) })}
                className="w-full accent-brand-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-calm-500">
                <span>0.6x (Slower)</span>
                <span>1.0x (Normal)</span>
                <span>1.5x (Faster)</span>
              </div>
            </div>

            {/* Test Voice Action */}
            <button
              onClick={handleTestVoice}
              className="px-3.5 py-1.5 rounded-xl bg-calm-800 hover:bg-calm-700 text-calm-200 text-xs font-medium border border-calm-700 flex items-center gap-1.5 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-brand-400" />
              <span>Test Voice Output</span>
            </button>
          </section>

          <hr className="border-calm-800" />

          {/* SECTION: Accessibility & Display */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> Accessibility & Theme
            </h3>

            {/* Theme Selection */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => updateSettings({ theme: 'dark' })}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 ${
                  settings.theme === 'dark'
                    ? 'bg-brand-600 text-white border-brand-500'
                    : 'bg-calm-900 text-calm-300 border-calm-800'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
              <button
                type="button"
                onClick={() => updateSettings({ theme: 'light' })}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 ${
                  settings.theme === 'light'
                    ? 'bg-brand-600 text-white border-brand-500'
                    : 'bg-calm-900 text-calm-300 border-calm-800'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
              <button
                type="button"
                onClick={() => updateSettings({ theme: 'system' })}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 ${
                  settings.theme === 'system'
                    ? 'bg-brand-600 text-white border-brand-500'
                    : 'bg-calm-900 text-calm-300 border-calm-800'
                }`}
              >
                System
              </button>
            </div>

            {/* High Contrast Mode */}
            <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl bg-calm-900/60 border border-calm-800">
              <div className="pr-2">
                <p className="text-xs font-semibold text-calm-100">High Contrast Mode</p>
                <p className="text-[11px] text-calm-400">Boosts border contrast and text clarity</p>
              </div>
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => updateSettings({ highContrast: e.target.checked })}
                className="w-4 h-4 rounded accent-brand-500"
              />
            </label>

            {/* Large Text Mode */}
            <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl bg-calm-900/60 border border-calm-800">
              <div className="pr-2">
                <p className="text-xs font-semibold text-calm-100">Large Typography Mode</p>
                <p className="text-[11px] text-calm-400">Enlarges primary card text and controls</p>
              </div>
              <input
                type="checkbox"
                checked={settings.largeText}
                onChange={(e) => updateSettings({ largeText: e.target.checked })}
                className="w-4 h-4 rounded accent-brand-500"
              />
            </label>
          </section>

          <hr className="border-calm-800" />

          {/* SECTION: Interaction Behaviors */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" /> Interaction Behavior
            </h3>

            {/* Tap to speak vs tap to stage */}
            <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl bg-calm-900/60 border border-calm-800">
              <div className="pr-2">
                <p className="text-xs font-semibold text-calm-100">Tap-to-Speak Immediately</p>
                <p className="text-[11px] text-calm-400">
                  When enabled, tapping a phrase speaks it right away. When off, loads into the edit box.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.tapToSpeak}
                onChange={(e) => updateSettings({ tapToSpeak: e.target.checked })}
                className="w-4 h-4 rounded accent-brand-500"
              />
            </label>

            {/* Confirmation before speaking */}
            <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl bg-calm-900/60 border border-calm-800">
              <div className="pr-2">
                <p className="text-xs font-semibold text-calm-100">Confirmation Before Speaking</p>
                <p className="text-[11px] text-calm-400">
                  Requires tapping Speak after choosing any phrase to prevent accidental audio
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.confirmBeforeSpeak}
                onChange={(e) => updateSettings({ confirmBeforeSpeak: e.target.checked })}
                className="w-4 h-4 rounded accent-brand-500"
              />
            </label>

            {/* Automatic Mode Stability Delay */}
            <div className="p-2.5 rounded-xl bg-calm-900/60 border border-calm-800 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-calm-100">Auto Mode Freeze Window</p>
                  <p className="text-[11px] text-calm-400">
                    Minimum stability delay to prevent options shifting while you tap
                  </p>
                </div>
                <span className="font-mono text-xs text-brand-400">
                  {(settings.autoModeStabilityDelayMs / 1000).toFixed(1)}s
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="5000"
                step="500"
                value={settings.autoModeStabilityDelayMs}
                onChange={(e) =>
                  updateSettings({ autoModeStabilityDelayMs: parseInt(e.target.value) })
                }
                className="w-full accent-brand-500 cursor-pointer"
              />
            </div>
          </section>

          <hr className="border-calm-800" />

          {/* SECTION: Quick Priority Phrases */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Quick Priority Phrases
            </h3>

            <div className="space-y-1">
              <label htmlFor="moment-phrase" className="text-xs text-calm-300">
                Patience Phrase (One-tap assist)
              </label>
              <input
                id="moment-phrase"
                type="text"
                value={settings.quickMomentPhrase}
                onChange={(e) => updateSettings({ quickMomentPhrase: e.target.value })}
                className="w-full bg-calm-900 border border-calm-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-400"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="emergency-phrase" className="text-xs text-calm-300">
                Emergency Alert Phrase
              </label>
              <input
                id="emergency-phrase"
                type="text"
                value={settings.emergencyPhrase}
                onChange={(e) => updateSettings({ emergencyPhrase: e.target.value })}
                className="w-full bg-calm-900 border border-calm-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-400"
              />
            </div>
          </section>

          <hr className="border-calm-800" />

          {/* SECTION: Privacy & Reset */}
          <section className="space-y-3">
            <div className="p-3 rounded-xl bg-calm-900/40 border border-calm-800 text-xs text-calm-400 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-calm-200">Local & Private: </strong>
                All phrase storage and speech synthesis happen entirely within your local browser.
                No raw audio recordings are collected, saved, or uploaded.
              </div>
            </div>

            <button
              onClick={resetAllData}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset All Custom Phrases & Preferences</span>
            </button>
          </section>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-calm-800 flex justify-end">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 font-semibold text-xs text-white shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
