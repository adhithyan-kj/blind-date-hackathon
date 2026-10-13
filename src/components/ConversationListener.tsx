'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mic,
  MicOff,
  Sparkles,
  MessageSquare,
  Lock,
  Unlock,
  Play,
  RotateCcw,
  Send,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

const SAMPLE_CONVERSATION_PROMPTS = [
  'Would you like tea or coffee?',
  'Can you come tomorrow?',
  'Are you paying by cash or card?',
  'How are you doing today?',
  'Can I help you with anything?',
  'What time works best for you?',
];

export const ConversationListener: React.FC = () => {
  const {
    listeningStatus,
    listeningMessage,
    toggleListening,
    transcriptItems,
    interimTranscript,
    fastModeGroup,
    isFrozen,
    toggleFreezeSuggestions,
    isUpdatingSuggestions,
    simulateIncomingUtterance,
    speakText,
    setActiveInputText,
    clearTranscripts,
    settings,
  } = useApp();

  const [simulatedText, setSimulatedText] = useState('');
  const [showSimSection, setShowSimSection] = useState(false);

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (simulatedText.trim()) {
      simulateIncomingUtterance(simulatedText.trim());
      setSimulatedText('');
    }
  };

  const latestTranscript = transcriptItems[0]?.text || null;

  const suggestionsList = [
    { key: 'Option 1', text: fastModeGroup.optionA.text, color: 'border-brand-500/40 hover:border-brand-400 bg-brand-950/20 text-brand-300' },
    { key: 'Option 2', text: fastModeGroup.optionB.text, color: 'border-teal-500/40 hover:border-teal-400 bg-teal-950/20 text-teal-300' },
    { key: 'Option 3', text: fastModeGroup.optionC.text, color: 'border-amber-500/40 hover:border-amber-400 bg-amber-950/20 text-amber-300' },
    { key: 'Option 4', text: fastModeGroup.optionD.text, color: 'border-purple-500/40 hover:border-purple-400 bg-purple-950/20 text-purple-300' },
  ];

  return (
    <div className="bg-calm-900/60 border border-calm-800/80 rounded-2xl p-4 sm:p-5 shadow-card space-y-4">
      {/* Top Banner: Listening State & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-calm-800/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-calm-100 flex items-center gap-1.5">
              Live Conversation Listener
              {isUpdatingSuggestions && (
                <span className="text-[10px] text-amber-400 animate-pulse font-normal">
                  (updating 4 choices...)
                </span>
              )}
            </h3>
            <p className="text-xs text-calm-400">{listeningMessage}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Freeze / Unfreeze toggle for stability */}
          <button
            onClick={toggleFreezeSuggestions}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              isFrozen
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-calm-800/60 border-calm-700/60 text-calm-300 hover:text-white'
            }`}
            title="Freeze suggestions so incoming words do not change options"
            aria-label={isFrozen ? 'Unfreeze suggestions' : 'Freeze suggestions'}
          >
            {isFrozen ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{isFrozen ? 'Frozen' : 'Live'}</span>
          </button>

          {/* Mic Toggle Button */}
          <button
            onClick={toggleListening}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-400 ${
              listeningStatus === 'listening'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-calm-800 hover:bg-calm-700 text-calm-200 border border-calm-700'
            }`}
            aria-label="Toggle Conversation Listening"
          >
            {listeningStatus === 'listening' ? (
              <>
                <Mic className="w-3.5 h-3.5 animate-pulse" />
                <span>Stop Listening</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span>Start Listening</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Latest Recognized Utterance or Interim preview */}
      <div className="bg-calm-950/60 rounded-xl p-3 border border-calm-800/60 text-sm">
        <div className="text-[11px] font-semibold text-calm-400 uppercase tracking-wider mb-1 flex items-center justify-between">
          <span>Recognized Partner Speech:</span>
          {transcriptItems.length > 0 && (
            <button
              onClick={clearTranscripts}
              className="text-[10px] text-calm-500 hover:text-calm-300 underline"
            >
              Clear History
            </button>
          )}
        </div>

        {latestTranscript ? (
          <p className="text-calm-100 font-medium italic">
            "{latestTranscript}"
          </p>
        ) : interimTranscript ? (
          <p className="text-brand-300 font-medium italic animate-pulse">
            "{interimTranscript}..."
          </p>
        ) : (
          <p className="text-calm-500 italic text-xs">
            {listeningStatus === 'listening'
              ? 'Listening for speech nearby... The 4 suggested replies below will update dynamically!'
              : 'Turn on listening or pick a simulated question below to generate 4 live suggestions.'}
          </p>
        )}
      </div>

      {/* 4 Contextual Suggested Replies Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-calm-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            4 Dynamic Suggested Replies:
          </span>
          <span className="text-[11px] text-calm-500">Tap to speak or edit any choice</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {suggestionsList.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl bg-calm-800/70 hover:bg-calm-800 border transition-all flex flex-col justify-between group ${item.color}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-calm-900/60 border border-calm-700/50">
                  {item.key}
                </span>
                <button
                  onClick={() => setActiveInputText(item.text)}
                  className="text-[11px] text-calm-400 hover:text-white transition-colors"
                  title="Edit this response before speaking"
                >
                  Edit
                </button>
              </div>
              <p className="text-sm sm:text-base font-semibold text-white mb-3 leading-snug">
                "{item.text}"
              </p>
              <button
                onClick={() => speakText(item.text)}
                className="w-full py-2 px-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Speak This</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Simulator Section for Testing Without Mic */}
      <div className="pt-2 border-t border-calm-800/60">
        <button
          onClick={() => setShowSimSection(!showSimSection)}
          className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1.5 transition-colors focus:outline-none"
        >
          <span>{showSimSection ? 'Hide Conversation Simulator' : 'Test with Simulation (No mic required)'}</span>
          <span className="text-[10px] bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20">
            Interactive Test
          </span>
        </button>

        {showSimSection && (
          <div className="mt-3 p-3 bg-calm-950/70 rounded-xl border border-calm-800/70 space-y-3">
            <p className="text-xs text-calm-400">
              Pick a realistic question below or type your own partner sentence to test response suggestions:
            </p>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_CONVERSATION_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => simulateIncomingUtterance(prompt)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-calm-800/80 hover:bg-calm-700 text-calm-200 border border-calm-700/60 transition-all text-left"
                >
                  "{prompt}"
                </button>
              ))}
            </div>

            {/* Custom simulation input */}
            <form onSubmit={handleSimulateSubmit} className="flex gap-2">
              <input
                type="text"
                value={simulatedText}
                onChange={(e) => setSimulatedText(e.target.value)}
                placeholder="Type partner speech (e.g., 'What would you like to drink?')..."
                className="flex-1 bg-calm-900 border border-calm-700/80 rounded-xl px-3 py-2 text-xs text-calm-100 placeholder:text-calm-500 focus:outline-none focus:ring-1 focus:ring-brand-400"
              />
              <button
                type="submit"
                disabled={!simulatedText.trim()}
                className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simulate</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
