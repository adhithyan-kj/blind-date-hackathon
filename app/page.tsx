'use client';

import React from 'react';
import { useApp } from '../src/context/AppContext';
import { Header } from '../src/components/Header';
import { QuickAssistBar } from '../src/components/QuickAssistBar';
import { MainCommunicationScreen } from '../src/components/MainCommunicationScreen';
import { ConversationListener } from '../src/components/ConversationListener';
import { PhraseLibrary } from '../src/components/PhraseLibrary';
import { FastModeScreen } from '../src/components/FastModeScreen';
import { SettingsModal } from '../src/components/SettingsModal';
import { Toast } from '../src/components/Toast';
import { ShieldCheck, Sparkles, HeartHandshake } from 'lucide-react';

export default function Home() {
  const { activeScreen, isFastModeActive } = useApp();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-calm-950 text-calm-100 transition-colors">
      <div>
        {/* Top Header Navigation */}
        <Header />

        {/* Priority Quick Assist Bar */}
        <QuickAssistBar />

        {/* Main Content Area */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 w-full">
          {activeScreen === 'fast' ? (
            <FastModeScreen />
          ) : (
            <div className="space-y-6">
              {/* Primary Typing & Speech Area */}
              <section aria-label="Speech Output Controls">
                <MainCommunicationScreen />
              </section>

              {/* Conversation Listening & Intelligent Suggestions */}
              <section aria-label="Conversation Assistance and Smart Suggestions">
                <ConversationListener />
              </section>

              {/* Categorized Phrase Library */}
              <section aria-label="Quick Phrase Library">
                <PhraseLibrary />
              </section>
            </div>
          )}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal />

      {/* Accessible Action Toast */}
      <Toast />

      {/* Subtle Accessible Footer */}
      <footer className="w-full border-t border-calm-900 py-4 px-4 text-center text-xs text-calm-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-brand-400" />
            <span>UnMute • Assistive Communication Companion</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-calm-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> On-Device Speech
            </span>
            <span>•</span>
            <span>No Account Required</span>
            <span>•</span>
            <span>Zero Audio Uploads</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
