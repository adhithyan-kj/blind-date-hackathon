'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Mic,
  MicOff,
  Zap,
  Radio,
  Settings,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    listeningStatus,
    toggleListening,
    isAutomaticModeActive,
    toggleAutomaticMode,
    isFastModeActive,
    toggleFastMode,
    setIsSettingsOpen,
    isSpeaking,
    stopSpeaking,
  } = useApp();

  const getMicStatusBadge = () => {
    switch (listeningStatus) {
      case 'listening':
        return {
          icon: <Mic className="w-4 h-4 text-emerald-400 animate-pulse" />,
          label: 'Listening',
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
        };
      case 'processing':
        return {
          icon: <Radio className="w-4 h-4 text-amber-400 animate-spin" />,
          label: 'Processing',
          bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
        };
      case 'requesting':
        return {
          icon: <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />,
          label: 'Permission...',
          bg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
        };
      case 'denied':
        return {
          icon: <MicOff className="w-4 h-4 text-rose-400" />,
          label: 'Mic Denied',
          bg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
        };
      case 'unavailable':
        return {
          icon: <MicOff className="w-4 h-4 text-zinc-400" />,
          label: 'Mic Unsupported',
          bg: 'bg-zinc-700/20 border-zinc-600/30 text-zinc-400',
        };
      default:
        return {
          icon: <MicOff className="w-4 h-4 text-zinc-400" />,
          label: 'Mic Off',
          bg: 'bg-zinc-800/60 border-zinc-700/40 text-zinc-300',
        };
    }
  };

  const badge = getMicStatusBadge();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-calm-950/85 dark:bg-calm-950/90 border-b border-calm-800/60 px-4 py-3 sm:px-6 transition-colors">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen('main')}
            aria-label="UnMute Home"
            className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-xl p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-md shadow-brand-500/20 text-white font-bold text-lg">
              <span className="tracking-tight">U</span>
            </div>
            <div className="text-left hidden xs:block">
              <div className="text-lg font-bold tracking-tight text-calm-100 dark:text-white flex items-center gap-1.5">
                UnMute
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Assist
                </span>
              </div>
              <p className="text-[11px] text-calm-400 -mt-0.5 leading-tight">Everyday Companion</p>
            </div>
          </button>
        </div>

        {/* Center / Right Control Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Global Speaking Alert/Cancel Button */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs shadow-md animate-pulse focus:outline-none focus:ring-2 focus:ring-rose-400"
              title="Stop current speech synthesis"
              aria-label="Stop Speaking"
            >
              <VolumeX className="w-4 h-4" />
              <span className="hidden sm:inline">Stop Audio</span>
            </button>
          )}

          {/* Microphone Listening Status Pill */}
          <button
            onClick={toggleListening}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-medium transition-all ${badge.bg} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-400`}
            aria-label={`Microphone status: ${badge.label}. Click to toggle listening.`}
            title="Toggle Microphone Listening"
          >
            {badge.icon}
            <span className="hidden sm:inline">{badge.label}</span>
          </button>

          {/* Automatic Mode Toggle */}
          <button
            onClick={toggleAutomaticMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-medium transition-all ${
              isAutomaticModeActive
                ? 'bg-accent-teal/20 border-accent-teal/40 text-teal-300 shadow-sm'
                : 'bg-calm-900/60 border-calm-700/50 text-calm-400 hover:text-calm-200'
            }`}
            aria-label={`Toggle Automatic Suggestion Mode. Currently ${isAutomaticModeActive ? 'on' : 'off'}`}
            title="Auto-update suggestions when conversation is heard"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Auto Mode</span>
          </button>

          {/* Fast Mode Toggle */}
          <button
            onClick={toggleFastMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
              activeScreen === 'fast'
                ? 'bg-brand-500 text-white border-brand-400 shadow-md shadow-brand-500/25'
                : 'bg-calm-900/80 border-calm-700/60 text-calm-200 hover:border-brand-500/50'
            }`}
            aria-label="Toggle Fast Mode 2-Option View"
            title="Fast Mode: 2 large instant response cards"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Fast Mode</span>
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl text-calm-300 hover:text-white hover:bg-calm-800/60 border border-transparent hover:border-calm-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400"
            aria-label="Open Settings"
            title="Settings & Accessibility"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
