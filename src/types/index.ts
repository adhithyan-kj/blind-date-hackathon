export type ListeningStatus =
  | 'off'
  | 'requesting'
  | 'listening'
  | 'processing'
  | 'paused'
  | 'unavailable'
  | 'denied'
  | 'error';

export interface Phrase {
  id: string;
  text: string;
  categoryId: string;
  isPinned?: boolean;
  isCustom?: boolean;
  order?: number;
  createdAt: number;
}

export interface PhraseCategory {
  id: string;
  name: string;
  icon: string;
  description?: string;
  colorTheme?: string;
  isCustom?: boolean;
}

export interface Suggestion {
  id: string;
  text: string;
  sourceIntent?: string;
  relevanceScore?: number;
}

export interface SuggestionGroup {
  optionA: Suggestion;
  optionB: Suggestion;
  optionC: Suggestion;
  optionD: Suggestion;
  timestamp: number;
}

// Backwards compatibility alias
export type FastModePair = SuggestionGroup;

export interface AppSettings {
  language: string;
  voiceURI: string;
  rate: number;
  pitch: number;
  theme: 'light' | 'dark' | 'system';
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  tapToSpeak: boolean; // true = tap speaks directly, false = tap populates edit area
  confirmBeforeSpeak: boolean;
  autoModeStabilityDelayMs: number;
  quickMomentPhrase: string;
  emergencyPhrase: string;
  saveTranscriptsLocally: boolean;
  hasSeenTutorial: boolean;
}

export interface TranscriptItem {
  id: string;
  speaker: 'partner' | 'user' | 'system';
  text: string;
  timestamp: number;
  isFinal: boolean;
  isSimulated?: boolean;
}

export interface VoiceOption {
  name: string;
  lang: string;
  voiceURI: string;
  default: boolean;
}

export interface InputSelectionEvent {
  action: 'SELECT_A' | 'SELECT_B' | 'SELECT_C' | 'SELECT_D' | 'CANCEL' | 'SPEAK_CURRENT';
  source: 'screen_tap' | 'keyboard' | 'hardware_volume' | 'switch_access';
}
