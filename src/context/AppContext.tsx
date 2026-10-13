'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import {
  AppSettings,
  FastModePair,
  SuggestionGroup,
  ListeningStatus,
  Phrase,
  PhraseCategory,
  TranscriptItem,
  VoiceOption,
} from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_SETTINGS } from '../constants/defaultPhrases';
import { StorageService } from '../services/storageService';
import { speechService } from '../services/speechSynthesis';
import { speechRecognitionService } from '../services/speechRecognition';
import { activeSuggestionEngine } from '../services/suggestionEngine';
import { inputController } from '../services/inputController';

interface AppContextType {
  // State
  activeScreen: 'main' | 'fast';
  activeInputText: string;
  lastSpokenText: string;
  isSpeaking: boolean;
  listeningStatus: ListeningStatus;
  listeningMessage: string;
  transcriptItems: TranscriptItem[];
  interimTranscript: string;
  fastModeGroup: SuggestionGroup;
  fastModePair: SuggestionGroup; // Alias
  isAutomaticModeActive: boolean;
  isFastModeActive: boolean;
  isFrozen: boolean;
  isUpdatingSuggestions: boolean;
  phrases: Phrase[];
  categories: PhraseCategory[];
  selectedCategoryId: string;
  settings: AppSettings;
  availableVoices: VoiceOption[];
  isSettingsOpen: boolean;
  isTutorialOpen: boolean;
  speechError: string | null;
  toastMessage: { text: string; type: 'info' | 'success' | 'warn' | 'error' } | null;

  // Actions
  setActiveScreen: (screen: 'main' | 'fast') => void;
  setActiveInputText: (text: string) => void;
  speakText: (text: string, options?: { previewOnly?: boolean }) => void;
  stopSpeaking: () => void;
  repeatLastSpoken: () => void;
  clearInputText: () => void;
  startListening: () => Promise<void>;
  stopListening: () => void;
  pauseListening: () => void;
  toggleListening: () => void;
  toggleFastMode: () => void;
  toggleAutomaticMode: () => void;
  toggleFreezeSuggestions: () => void;
  setSelectedCategoryId: (catId: string) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  addCustomPhrase: (text: string, categoryId?: string) => void;
  updatePhrase: (updated: Phrase) => void;
  deletePhrase: (id: string) => void;
  togglePinPhrase: (id: string) => void;
  simulateIncomingUtterance: (text: string) => Promise<void>;
  clearTranscripts: () => void;
  resetAllData: () => void;
  setIsSettingsOpen: (open: boolean) => void;
  setIsTutorialOpen: (open: boolean) => void;
  completeTutorial: () => void;
  showToast: (text: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<'main' | 'fast'>('main');
  const [activeInputText, setActiveInputText] = useState<string>('');
  const [lastSpokenText, setLastSpokenText] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const [listeningStatus, setListeningStatus] = useState<ListeningStatus>('off');
  const [listeningMessage, setListeningMessage] = useState<string>('Microphone off');
  const [transcriptItems, setTranscriptItems] = useState<TranscriptItem[]>([]);
  const [interimTranscript, setInterimTranscript] = useState<string>('');

  const [isAutomaticModeActive, setIsAutomaticModeActive] = useState<boolean>(false);
  const [isFastModeActive, setIsFastModeActive] = useState<boolean>(false);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [isUpdatingSuggestions, setIsUpdatingSuggestions] = useState<boolean>(false);

  const [fastModeGroup, setFastModeGroup] = useState<SuggestionGroup>({
    optionA: { id: 'opt_a_init', text: 'Yes, that sounds great.' },
    optionB: { id: 'opt_b_init', text: 'No, thank you.' },
    optionC: { id: 'opt_c_init', text: 'Please give me a moment.' },
    optionD: { id: 'opt_d_init', text: 'Could you please repeat that?' },
    timestamp: Date.now(),
  });

  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [categories] = useState<PhraseCategory[]>(DEFAULT_CATEGORIES);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('everyday');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'info' | 'success' | 'warn' | 'error' } | null>(null);

  const lastUpdateRef = useRef<number>(Date.now());
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((text: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage({ text, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // Initialize storage & voices
  useEffect(() => {
    const savedSettings = StorageService.getSettings();
    setSettings(savedSettings);

    // Show tutorial if first visit
    if (!savedSettings.hasSeenTutorial) {
      setIsTutorialOpen(true);
    }

    const savedPhrases = StorageService.getPhrases();
    setPhrases(savedPhrases);

    if (savedSettings.saveTranscriptsLocally) {
      setTranscriptItems(StorageService.getSavedTranscripts());
    }

    const unsubVoices = speechService.onVoicesLoaded((voices) => {
      setAvailableVoices(voices);
    });

    inputController.registerAndroidBridge();
    const unsubKeyboard = inputController.enableKeyboardNavigation();

    return () => {
      unsubVoices();
      unsubKeyboard();
    };
  }, []);

  // Settings
  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...partial };
      StorageService.saveSettings(updated);
      return updated;
    });
  }, []);

  // Complete tutorial handler
  const completeTutorial = useCallback(() => {
    setIsTutorialOpen(false);
    updateSettings({ hasSeenTutorial: true });
    showToast('Tutorial completed! You can reopen it anytime from Header.', 'success');
  }, [showToast, updateSettings]);

  // Apply theme and accessibility classes to html element
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // Theme
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }

    // High Contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large Text
    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
  }, [settings.theme, settings.highContrast, settings.largeText]);

  // Handle hardware & keyboard input events
  useEffect(() => {
    const unsubInput = inputController.subscribe((event) => {
      if (event.action === 'CANCEL') {
        stopSpeaking();
        return;
      }

      if (event.action === 'SELECT_A') {
        const textToSpeak = fastModeGroup.optionA.text;
        speakText(textToSpeak);
        showToast(`Selected Option A: "${textToSpeak}"`, 'success');
      } else if (event.action === 'SELECT_B') {
        const textToSpeak = fastModeGroup.optionB.text;
        speakText(textToSpeak);
        showToast(`Selected Option B: "${textToSpeak}"`, 'success');
      } else if (event.action === 'SELECT_C') {
        const textToSpeak = fastModeGroup.optionC.text;
        speakText(textToSpeak);
        showToast(`Selected Option C: "${textToSpeak}"`, 'success');
      } else if (event.action === 'SELECT_D') {
        const textToSpeak = fastModeGroup.optionD.text;
        speakText(textToSpeak);
        showToast(`Selected Option D: "${textToSpeak}"`, 'success');
      }
    });

    return () => {
      unsubInput();
    };
  }, [fastModeGroup]);

  // Text-To-Speech Execution
  const speakText = useCallback((text: string, options?: { previewOnly?: boolean }) => {
    if (!text || !text.trim()) return;

    if (options?.previewOnly) {
      setActiveInputText(text);
      showToast(`Loaded into message box`, 'info');
      return;
    }

    if (settings.confirmBeforeSpeak) {
      setActiveInputText(text);
      showToast('Tap "Speak" to confirm output', 'info');
      return;
    }

    setSpeechError(null);
    setLastSpokenText(text);
    StorageService.addRecentHistory(text);

    speechService.speak(
      text,
      {
        voiceURI: settings.voiceURI,
        rate: settings.rate,
        pitch: settings.pitch,
        language: settings.language,
      },
      {
        onStart: () => {
          setIsSpeaking(true);
        },
        onEnd: () => {
          setIsSpeaking(false);
        },
        onError: (err) => {
          setIsSpeaking(false);
          setSpeechError(err);
          showToast(err, 'error');
        },
      }
    );
  }, [settings, showToast]);

  const stopSpeaking = useCallback(() => {
    speechService.stop();
    setIsSpeaking(false);
    showToast('Speech stopped', 'info');
  }, [showToast]);

  const repeatLastSpoken = useCallback(() => {
    if (lastSpokenText) {
      speakText(lastSpokenText);
    } else {
      showToast('No previous sentence to repeat', 'warn');
    }
  }, [lastSpokenText, speakText, showToast]);

  const clearInputText = useCallback(() => {
    setActiveInputText('');
  }, []);

  // Conversation Utterance Processing
  const processIncomingUtterance = useCallback(
    async (utteranceText: string, isSimulated = false) => {
      const newItem: TranscriptItem = {
        id: `trans_${Date.now()}`,
        speaker: 'partner',
        text: utteranceText,
        timestamp: Date.now(),
        isFinal: true,
        isSimulated,
      };

      setTranscriptItems((prev) => {
        const updated = [newItem, ...prev].slice(0, 50);
        if (settings.saveTranscriptsLocally) {
          StorageService.saveTranscripts(updated);
        }
        return updated;
      });

      // If user froze suggestions, do not alter current suggestions
      if (isFrozen) {
        return;
      }

      // Stability delay handling: prevent options from swapping right under the user's fingers
      const now = Date.now();
      const elapsed = now - lastUpdateRef.current;
      const delay = Math.max(0, settings.autoModeStabilityDelayMs - elapsed);

      setIsUpdatingSuggestions(true);

      setTimeout(async () => {
        try {
          const newGroup = await activeSuggestionEngine.generateFastModeGroup(utteranceText);
          setFastModeGroup(newGroup);
          lastUpdateRef.current = Date.now();
        } finally {
          setIsUpdatingSuggestions(false);
        }
      }, delay > 0 ? 300 : 0);
    },
    [isFrozen, settings.autoModeStabilityDelayMs, settings.saveTranscriptsLocally]
  );

  // Speech Recognition Controls
  const startListening = useCallback(async () => {
    speechRecognitionService.setLanguage(settings.language);
    const success = await speechRecognitionService.startListening({
      onStatusChange: (status, message) => {
        setListeningStatus(status);
        if (message) setListeningMessage(message);
      },
      onTranscript: (text, isFinal) => {
        if (isFinal) {
          setInterimTranscript('');
          processIncomingUtterance(text);
        } else {
          setInterimTranscript(text);
        }
      },
      onError: (err) => {
        setListeningMessage(`Microphone: ${err}`);
      },
    });

    if (!success && !speechRecognitionService.checkAvailability()) {
      showToast('Speech recognition unavailable. Try simulation mode below!', 'warn');
    }
  }, [settings.language, processIncomingUtterance, showToast]);

  const stopListening = useCallback(() => {
    speechRecognitionService.stopListening();
    setListeningStatus('off');
    setListeningMessage('Microphone off');
    setInterimTranscript('');
  }, []);

  const pauseListening = useCallback(() => {
    speechRecognitionService.pauseListening();
    setListeningStatus('paused');
    setListeningMessage('Microphone paused');
  }, []);

  const toggleListening = useCallback(() => {
    if (listeningStatus === 'listening') {
      stopListening();
    } else {
      startListening();
    }
  }, [listeningStatus, startListening, stopListening]);

  // Mode Toggles
  const toggleFastMode = useCallback(() => {
    setIsFastModeActive((prev) => {
      const next = !prev;
      setActiveScreen(next ? 'fast' : 'main');
      return next;
    });
  }, []);

  const toggleAutomaticMode = useCallback(() => {
    setIsAutomaticModeActive((prev) => {
      const next = !prev;
      if (next && listeningStatus === 'off') {
        startListening();
      }
      showToast(next ? 'Automatic Mode Active' : 'Automatic Mode Paused', 'info');
      return next;
    });
  }, [listeningStatus, startListening, showToast]);

  const toggleFreezeSuggestions = useCallback(() => {
    setIsFrozen((prev) => {
      const next = !prev;
      showToast(next ? 'Suggestions Frozen' : 'Suggestions Live', 'info');
      return next;
    });
  }, [showToast]);

  // Simulation
  const simulateIncomingUtterance = useCallback(
    async (text: string) => {
      showToast(`Simulated: "${text}"`, 'info');
      await processIncomingUtterance(text, true);
    },
    [processIncomingUtterance, showToast]
  );



  // Phrase Management
  const addCustomPhrase = useCallback(
    (text: string, categoryId: string = 'custom') => {
      if (!text.trim()) return;
      const newPhrase: Phrase = {
        id: `custom_${Date.now()}`,
        text: text.trim(),
        categoryId,
        isCustom: true,
        createdAt: Date.now(),
      };
      setPhrases((prev) => {
        const updated = [newPhrase, ...prev];
        StorageService.savePhrases(updated);
        return updated;
      });
      showToast('Phrase saved to library', 'success');
    },
    [showToast]
  );

  const updatePhrase = useCallback(
    (updatedPhrase: Phrase) => {
      setPhrases((prev) => {
        const updated = prev.map((p) => (p.id === updatedPhrase.id ? updatedPhrase : p));
        StorageService.savePhrases(updated);
        return updated;
      });
      showToast('Phrase updated', 'success');
    },
    [showToast]
  );

  const deletePhrase = useCallback(
    (id: string) => {
      setPhrases((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        StorageService.savePhrases(updated);
        return updated;
      });
      showToast('Phrase deleted', 'info');
    },
    [showToast]
  );

  const togglePinPhrase = useCallback(
    (id: string) => {
      setPhrases((prev) => {
        const updated = prev.map((p) => (p.id === id ? { ...p, isPinned: !p.isPinned } : p));
        StorageService.savePhrases(updated);
        return updated;
      });
    },
    []
  );

  const clearTranscripts = useCallback(() => {
    setTranscriptItems([]);
    StorageService.saveTranscripts([]);
    showToast('Conversation transcripts cleared', 'info');
  }, [showToast]);

  const resetAllData = useCallback(() => {
    StorageService.clearAllData();
    setSettings(DEFAULT_SETTINGS);
    const defaults = StorageService.getPhrases();
    setPhrases(defaults);
    setTranscriptItems([]);
    showToast('Settings and phrases reset to defaults', 'info');
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        activeScreen,
        activeInputText,
        lastSpokenText,
        isSpeaking,
        listeningStatus,
        listeningMessage,
        transcriptItems,
        interimTranscript,
        fastModeGroup,
        fastModePair: fastModeGroup,
        isAutomaticModeActive,
        isFastModeActive,
        isFrozen,
        isUpdatingSuggestions,
        phrases,
        categories,
        selectedCategoryId,
        settings,
        availableVoices,
        isSettingsOpen,
        isTutorialOpen,
        speechError,
        toastMessage,

        setActiveScreen,
        setActiveInputText,
        speakText,
        stopSpeaking,
        repeatLastSpoken,
        clearInputText,
        startListening,
        stopListening,
        pauseListening,
        toggleListening,
        toggleFastMode,
        toggleAutomaticMode,
        toggleFreezeSuggestions,
        setSelectedCategoryId,
        updateSettings,
        addCustomPhrase,
        updatePhrase,
        deletePhrase,
        togglePinPhrase,
        simulateIncomingUtterance,
        clearTranscripts,
        resetAllData,
        setIsSettingsOpen,
        setIsTutorialOpen,
        completeTutorial,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
