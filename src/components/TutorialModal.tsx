'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Volume2,
  Mic,
  Zap,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  HelpCircle,
  Hourglass,
  Sparkles,
} from 'lucide-react';

export const TutorialModal: React.FC = () => {
  const { isTutorialOpen, completeTutorial, setIsTutorialOpen } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isTutorialOpen) return null;

  const steps = [
    {
      title: 'Welcome to UnMute 👋',
      subtitle: 'Your everyday assistive voice companion',
      icon: <Sparkles className="w-8 h-8 text-brand-400" />,
      content: (
        <div className="space-y-3 text-calm-200 text-sm leading-relaxed">
          <p>
            <strong>UnMute</strong> helps you express yourself comfortably in everyday situations—whether ordering coffee, speaking in class, or talking to doctors.
          </p>
          <div className="p-3 rounded-xl bg-calm-900 border border-calm-800 text-xs text-calm-300">
            💡 <strong>Our Philosophy:</strong> UnMute is built for genuine communication independence. It never treats stammering as a failure or attempts to alter your natural speech.
          </div>
        </div>
      ),
    },
    {
      title: '1. Instant Speech & Quick Phrases 🗣️',
      subtitle: 'Type custom thoughts or tap ready-made phrases',
      icon: <Volume2 className="w-8 h-8 text-brand-400" />,
      content: (
        <div className="space-y-3 text-calm-200 text-sm leading-relaxed">
          <p>
            • <strong>Type & Speak:</strong> Enter any sentence and tap <span className="text-white font-semibold">"Speak Aloud"</span> to have your browser speak it clearly.
          </p>
          <p>
            • <strong>11 Categories:</strong> Tap any category (Everyday, Shopping, Dining, Transit, Healthcare) to speak commonly used phrases in one tap.
          </p>
          <p>
            • <strong>Add Your Own:</strong> Save any sentence to your personal phrase library with the <span className="text-teal-300 font-semibold">+ Add Phrase</span> button.
          </p>
        </div>
      ),
    },
    {
      title: '2. Live Mode (4 Smart Choices) 🎙️',
      subtitle: 'Listens to partner speech and suggests answers',
      icon: <Mic className="w-8 h-8 text-emerald-400" />,
      content: (
        <div className="space-y-3 text-calm-200 text-sm leading-relaxed">
          <p>
            • When talking with someone, tap <span className="text-emerald-400 font-semibold">Start Listening</span> in the header or listener panel.
          </p>
          <p>
            • UnMute detects what your conversation partner asks (e.g. <em>"Would you like tea or coffee?"</em> or <em>"Can you meet tomorrow?"</em>).
          </p>
          <p>
            • <strong>4 Dynamic Choices:</strong> Instantly displays 4 tailored responses (Options A, B, C, and D) ready to speak with a single tap!
          </p>
        </div>
      ),
    },
    {
      title: '3. Fast Mode (Tactile Cards) ⚡',
      subtitle: 'Giant cards & physical keyboard shortcuts',
      icon: <Zap className="w-8 h-8 text-amber-400" />,
      content: (
        <div className="space-y-3 text-calm-200 text-sm leading-relaxed">
          <p>
            • Tap the <span className="text-brand-300 font-semibold">Fast Mode</span> button in the top bar for a high-speed, uncluttered response screen.
          </p>
          <p>
            • <strong>Shortcuts:</strong> Press <kbd className="px-1.5 py-0.5 rounded bg-calm-800 text-xs font-mono">1</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-calm-800 text-xs font-mono">2</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-calm-800 text-xs font-mono">3</kbd>, or <kbd className="px-1.5 py-0.5 rounded bg-calm-800 text-xs font-mono">4</kbd> on a keyboard to speak options instantly without touching the screen.
          </p>
          <p>
            • <strong>Freeze Button:</strong> Lock current options so they do not shift while you are reaching to select one.
          </p>
        </div>
      ),
    },
    {
      title: '4. Privacy & Patience Shortcuts 🔒',
      subtitle: '100% on-device speech with zero audio uploads',
      icon: <ShieldCheck className="w-8 h-8 text-teal-400" />,
      content: (
        <div className="space-y-3 text-calm-200 text-sm leading-relaxed">
          <p>
            • <strong>"Please give me a moment":</strong> Tap this button at the top whenever you need an extra second. It politely asks the other person to wait.
          </p>
          <p>
            • <strong>Total Privacy:</strong> All speech synthesis and recognition happens on your local device. We never record, store, or transmit your voice.
          </p>
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>You are all set to use UnMute! Tap "Get Started" below.</span>
          </div>
        </div>
      ),
    },
  ];

  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      completeTutorial();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-calm-950 border border-calm-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="px-5 py-3 border-b border-calm-800/70 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-calm-400 font-medium">
            <HelpCircle className="w-4 h-4 text-brand-400" />
            <span>Quick Start Tour • Step {currentStep + 1} of {steps.length}</span>
          </div>
          <button
            onClick={completeTutorial}
            className="text-xs text-calm-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-calm-800"
            title="Skip onboarding tour"
          >
            Skip Tour ✕
          </button>
        </div>

        {/* Step Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-calm-900 border border-calm-800 shadow-sm">
              {steps[currentStep].icon}
            </div>
            <div>
              <h2 id="tutorial-modal-title" className="text-lg font-bold text-white tracking-tight">
                {steps[currentStep].title}
              </h2>
              <p className="text-xs text-calm-400">
                {steps[currentStep].subtitle}
              </p>
            </div>
          </div>

          <div className="py-1">
            {steps[currentStep].content}
          </div>
        </div>

        {/* Step Progress Dots & Navigation Footer */}
        <div className="px-6 py-4 border-t border-calm-800/70 bg-calm-900/30 flex items-center justify-between">
          {/* Progress Dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                aria-label={`Jump to step ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === currentStep
                    ? 'w-6 bg-brand-500'
                    : 'w-2 bg-calm-700 hover:bg-calm-600'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-2 rounded-xl bg-calm-900 hover:bg-calm-800 border border-calm-700 text-calm-300 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all active:scale-95"
            >
              <span>{isLast ? 'Get Started' : 'Next'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
