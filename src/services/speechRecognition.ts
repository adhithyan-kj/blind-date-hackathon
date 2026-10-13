import { ListeningStatus } from '../types';

export interface RecognitionCallbacks {
  onStatusChange: (status: ListeningStatus, message?: string) => void;
  onTranscript: (text: string, isFinal: boolean) => void;
  onError: (error: string) => void;
}

// Extend window for webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

class SpeechRecognitionService {
  private recognition: any = null;
  private isAvailable: boolean = false;
  private isListening: boolean = false;
  private isManuallyStopped: boolean = true;
  private callbacks: RecognitionCallbacks | null = null;
  private language: string = 'en-US';

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        this.isAvailable = true;
      }
    }
  }

  public checkAvailability(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public setLanguage(lang: string) {
    this.language = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public async startListening(callbacks: RecognitionCallbacks): Promise<boolean> {
    this.callbacks = callbacks;
    this.isManuallyStopped = false;

    if (!this.checkAvailability()) {
      callbacks.onStatusChange('unavailable', 'Speech recognition is not supported in this browser. You can still use the simulation tool to test suggestions.');
      return false;
    }

    callbacks.onStatusChange('requesting', 'Requesting microphone permission...');

    try {
      // Test audio permission explicitly first
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Immediately release media tracks to ensure privacy - WebSpeech handles its own stream
          stream.getTracks().forEach(track => track.stop());
        } catch (permError: any) {
          if (permError.name === 'NotAllowedError' || permError.name === 'PermissionDeniedError') {
            callbacks.onStatusChange('denied', 'Microphone permission was denied. Please allow microphone access in your browser bar.');
            return false;
          }
        }
      }

      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.language;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.callbacks?.onStatusChange('listening', 'Listening for speech...');
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript.trim()) {
          this.callbacks?.onStatusChange('processing', 'Processing conversation...');
          this.callbacks?.onTranscript(finalTranscript.trim(), true);
          // Return to listening
          setTimeout(() => {
            if (this.isListening) {
              this.callbacks?.onStatusChange('listening', 'Listening for speech...');
            }
          }, 600);
        } else if (interimTranscript.trim()) {
          this.callbacks?.onTranscript(interimTranscript.trim(), false);
        }
      };

      this.recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          this.isListening = false;
          this.callbacks?.onStatusChange('denied', 'Microphone access denied by browser settings.');
        } else if (event.error === 'no-speech') {
          // Normal silence, keep listening
        } else {
          this.callbacks?.onError(event.error || 'Recognition error encountered.');
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        // Auto restart if user didn't manually stop
        if (!this.isManuallyStopped) {
          try {
            this.recognition.start();
          } catch {
            this.callbacks?.onStatusChange('off', 'Listening stopped.');
          }
        } else {
          this.callbacks?.onStatusChange('off', 'Listening stopped.');
        }
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      this.isListening = false;
      callbacks.onStatusChange('error', err?.message || 'Failed to start microphone recognition.');
      return false;
    }
  }

  public stopListening(): void {
    this.isManuallyStopped = true;
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore stop error
      }
    }
    this.callbacks?.onStatusChange('off', 'Listening is off');
  }

  public pauseListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore
      }
    }
    this.callbacks?.onStatusChange('paused', 'Listening paused');
  }

  public getListeningState(): boolean {
    return this.isListening;
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
