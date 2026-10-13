import { AppSettings, Phrase, TranscriptItem } from '../types';
import { DEFAULT_PHRASES, DEFAULT_SETTINGS } from '../constants/defaultPhrases';

const STORAGE_KEYS = {
  SETTINGS: 'fluent_app_settings_v1',
  PHRASES: 'fluent_app_phrases_v1',
  HISTORY: 'fluent_spoken_history_v1',
  TRANSCRIPTS: 'fluent_saved_transcripts_v1',
};

export const StorageService = {
  getSettings(): AppSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (e) {
      console.warn('Failed to load settings from storage', e);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to storage', e);
    }
  },

  getPhrases(): Phrase[] {
    if (typeof window === 'undefined') return DEFAULT_PHRASES;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PHRASES);
      if (!data) return DEFAULT_PHRASES;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PHRASES;
    } catch (e) {
      console.warn('Failed to load phrases from storage', e);
      return DEFAULT_PHRASES;
    }
  },

  savePhrases(phrases: Phrase[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.PHRASES, JSON.stringify(phrases));
    } catch (e) {
      console.error('Failed to save phrases to storage', e);
    }
  },

  getRecentHistory(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addRecentHistory(text: string): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const current = this.getRecentHistory();
      const filtered = current.filter(item => item !== text);
      const updated = [text, ...filtered].slice(0, 20); // keep last 20
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  clearRecentHistory(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  },

  getSavedTranscripts(): TranscriptItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSCRIPTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveTranscripts(items: TranscriptItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSCRIPTS, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save transcripts', e);
    }
  },

  clearAllData(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.PHRASES);
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      localStorage.removeItem(STORAGE_KEYS.TRANSCRIPTS);
    } catch (e) {
      console.error('Failed to reset local storage', e);
    }
  },
};
