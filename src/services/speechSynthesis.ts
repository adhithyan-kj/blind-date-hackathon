import { VoiceOption } from '../types';

export interface SpeechCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (errorMsg: string) => void;
}

class SpeechSynthesisService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isAvailable: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voiceListeners: Array<(voices: VoiceOption[]) => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isAvailable = true;
      this.initVoices();
    }
  }

  private initVoices(): void {
    if (!this.synth) return;

    const populate = () => {
      this.voices = this.synth?.getVoices() || [];
      const voiceOptions = this.getVoiceOptions();
      this.voiceListeners.forEach(listener => listener(voiceOptions));
    };

    populate();
    if (typeof window !== 'undefined' && 'onvoiceschanged' in this.synth) {
      this.synth.onvoiceschanged = populate;
    }
  }

  public onVoicesLoaded(callback: (voices: VoiceOption[]) => void): () => void {
    this.voiceListeners.push(callback);
    if (this.voices.length > 0) {
      callback(this.getVoiceOptions());
    }
    return () => {
      this.voiceListeners = this.voiceListeners.filter(cb => cb !== callback);
    };
  }

  public getVoiceOptions(): VoiceOption[] {
    return this.voices.map(v => ({
      name: v.name,
      lang: v.lang,
      voiceURI: v.voiceURI,
      default: v.default,
    }));
  }

  public checkAvailability(): boolean {
    return this.isAvailable && typeof window !== 'undefined' && 'SpeechSynthesisUtterance' in window;
  }

  public speak(
    text: string,
    options: {
      voiceURI?: string;
      rate?: number;
      pitch?: number;
      language?: string;
    } = {},
    callbacks?: SpeechCallbacks
  ): void {
    if (!this.checkAvailability() || !this.synth) {
      callbacks?.onError?.('Speech synthesis is not supported in this browser.');
      return;
    }

    if (!text || text.trim() === '') {
      return;
    }

    // Cancel any ongoing speech immediately before speaking new utterance
    this.stop();

    try {
      const utterance = new SpeechSynthesisUtterance(text.trim());
      this.currentUtterance = utterance;

      if (options.rate !== undefined) utterance.rate = Math.max(0.5, Math.min(2.0, options.rate));
      if (options.pitch !== undefined) utterance.pitch = Math.max(0.5, Math.min(2.0, options.pitch));
      if (options.language) utterance.lang = options.language;

      if (options.voiceURI && this.voices.length > 0) {
        const found = this.voices.find(v => v.voiceURI === options.voiceURI);
        if (found) {
          utterance.voice = found;
        }
      } else if (options.language && this.voices.length > 0) {
        const langMatch = this.voices.find(v => v.lang.startsWith(options.language!));
        if (langMatch) {
          utterance.voice = langMatch;
        }
      }

      utterance.onstart = () => {
        callbacks?.onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        callbacks?.onEnd?.();
      };

      utterance.onerror = (e) => {
        this.currentUtterance = null;
        // 'canceled' or 'interrupted' is expected when user manually cancels
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          callbacks?.onError?.(`Speech playback issue: ${e.error || 'unknown error'}`);
        } else {
          callbacks?.onEnd?.();
        }
      };

      this.synth.speak(utterance);
    } catch (err: any) {
      this.currentUtterance = null;
      callbacks?.onError?.(err?.message || 'Could not start speech synthesis.');
    }
  }

  public stop(): void {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.warn('Error cancelling speech synthesis', e);
      }
    }
    this.currentUtterance = null;
  }

  public isSpeaking(): boolean {
    return !!(this.synth && this.synth.speaking);
  }
}

export const speechService = new SpeechSynthesisService();
