import { InputSelectionEvent } from '../types';

export type InputEventListener = (event: InputSelectionEvent) => void;

class InputControllerManager {
  private listeners: Set<InputEventListener> = new Set();
  private isListeningKeyboard: boolean = false;

  public subscribe(listener: InputEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public dispatch(event: InputSelectionEvent): void {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in input event listener', err);
      }
    });
  }

  // --- Keyboard Adapter for Web Prototype ---
  public enableKeyboardNavigation(): () => void {
    if (typeof window === 'undefined' || this.isListeningKeyboard) {
      return () => {};
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === 'ArrowUp' || e.key === '1') {
        e.preventDefault();
        this.dispatch({ action: 'SELECT_A', source: 'keyboard' });
      } else if (e.key === 'ArrowRight' || e.key === '2') {
        e.preventDefault();
        this.dispatch({ action: 'SELECT_B', source: 'keyboard' });
      } else if (e.key === 'ArrowDown' || e.key === '3') {
        e.preventDefault();
        this.dispatch({ action: 'SELECT_C', source: 'keyboard' });
      } else if (e.key === 'ArrowLeft' || e.key === '4') {
        e.preventDefault();
        this.dispatch({ action: 'SELECT_D', source: 'keyboard' });
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.dispatch({ action: 'CANCEL', source: 'keyboard' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    this.isListeningKeyboard = true;

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      this.isListeningKeyboard = false;
    };
  }

  // --- Screen Tap Adapter ---
  public triggerOptionA(source: InputSelectionEvent['source'] = 'screen_tap'): void {
    this.dispatch({ action: 'SELECT_A', source });
  }

  public triggerOptionB(source: InputSelectionEvent['source'] = 'screen_tap'): void {
    this.dispatch({ action: 'SELECT_B', source });
  }

  public triggerOptionC(source: InputSelectionEvent['source'] = 'screen_tap'): void {
    this.dispatch({ action: 'SELECT_C', source });
  }

  public triggerOptionD(source: InputSelectionEvent['source'] = 'screen_tap'): void {
    this.dispatch({ action: 'SELECT_D', source });
  }

  public triggerCancel(): void {
    this.dispatch({ action: 'CANCEL', source: 'screen_tap' });
  }

  // --- Native Android Bridge Interface ---
  public registerAndroidBridge(): void {
    if (typeof window !== 'undefined') {
      const bridge = {
        onNativeVolumeUp: () => {
          this.dispatch({ action: 'SELECT_A', source: 'hardware_volume' });
        },
        onNativeVolumeDown: () => {
          this.dispatch({ action: 'SELECT_B', source: 'hardware_volume' });
        },
        onNativeButton3: () => {
          this.dispatch({ action: 'SELECT_C', source: 'hardware_volume' });
        },
        onNativeButton4: () => {
          this.dispatch({ action: 'SELECT_D', source: 'hardware_volume' });
        },
      };
      (window as any).UnMuteInputBridge = bridge;
      (window as any).FluentInputBridge = bridge;
    }
  }
}

export const inputController = new InputControllerManager();
