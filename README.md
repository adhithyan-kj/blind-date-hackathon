# UnMute - Assistive Communication Companion

> An assistive communication web application designed for people who stammer or experience difficulty speaking. Built to make daily communication faster, more comfortable, and independent.

UnMute is designed with an **assistive** ethos: it never treats stammering as a failure or attempts to "cure" natural speech patterns. Instead, it provides a fast, dependable companion tool to communicate smoothly in everyday moments—from restaurants and public transit to classrooms and phone calls.

---

## 🌟 Key Features

### 1. Main Communication Screen
- **Editable Large Text Area**: High-contrast, easy-to-read text box for typing custom messages.
- **Immediate Text-to-Speech (TTS)**: Speaks text using browser `SpeechSynthesis`.
- **Persistent Stop Speaking Control**: Instant audio cancellation (`VolumeX`) to halt output whenever needed.
- **Repeat & Clear**: One-tap replay of the last spoken utterance and instant clear buttons.
- **Save to Library**: Turn any typed sentence into a permanent custom phrase with one tap.

### 2. Priority Assist Bar
- **"Please give me a moment"**: Instant one-tap button to politely request patience during conversations.
- **Emergency Alert Shortcut**: Rapid one-tap emergency statement for urgent medical or safety situations.
- **Global Audio Mute**: Always accessible when speech output is active.

### 3. Categorized Phrase Library (11 Realistic Categories)
- **Everyday Conversation**: General remarks, polite delays, and device notices.
- **Greetings & Introductions**: Small talk and polite greetings.
- **College & Education**: Classroom questions, assignments, and presentation delays.
- **Shops & Shopping**: Prices, payment methods, receipts, sizing.
- **Restaurants & Food**: Ordering meals, asking for bills, dietary restrictions.
- **Public Transport**: Bus/train stops, ticketing, destinations.
- **Hospitals & Healthcare**: Medical appointments, pain description, communication notices.
- **Phone Calls**: Opening statements, asking callers to speak slowly or hold.
- **Asking for Help**: Directions, assistance, guidance.
- **Emergencies**: Urgent medical assistance and emergency contact notices.
- **Custom Phrases**: Fully personal user-created phrases.
- *Full CRUD support*: Pin frequently used phrases, edit text, delete custom phrases, and choose between tap-to-speak or stage-to-edit.

### 4. Conversation Listening & Smart Suggestions
- **Web Speech API Recognition**: Listens for partner speech with clear status indicators (*Off*, *Listening*, *Processing*, *Denied*, *Unavailable*).
- **Privacy First**: Local on-device recognition—no raw audio recorded or sent to remote servers.
- **Rule-Based Suggestion Matcher**: Extracts conversational intent for common queries:
  - *"Would you like tea or coffee?"* ➔ Option A: *"Tea, please."*, Option B: *"Coffee, please."*
  - *"Can you come tomorrow?"* ➔ Option A: *"Yes, I can make it."*, Option B: *"Sorry, I am busy then."*
  - *"Cash or card?"* ➔ Option A: *"Card, please."*, Option B: *"Cash, please."*
- **Offline / Zero-Mic Simulator**: Built-in interactive simulator to test suggestions with standard prompts or custom partner phrases without needing a microphone.

### 5. Fast Mode
- **Dedicated 2-Choice Interface**: Large, high-visibility tactile cards displaying Option A and Option B.
- **Physical Keyboard Support**: `ArrowUp` or `1` for Option A, `ArrowDown` or `2` for Option B, `Escape` to cancel.
- **Hardware Button Decoupling**: Decoupled `InputController` ready for native mobile hardware bindings.

### 6. Automatic Mode & Stability Freeze
- Continuously updates suggestions as new partner utterances are detected.
- **Freeze Control**: Lets users lock the current options to prevent accidental taps.
- **Configurable Stability Window**: Ensures suggestions do not swap at the exact instant a user touches the screen.

### 7. Accessibility & Personalization
- **High-Contrast Mode**: Enhanced borders and high-visibility typography.
- **Large-Text Mode**: Scaled card fonts for easy readability.
- **Theme Selection**: Dark, Light, and System modes.
- **Voice Tuning**: Custom speech rate (speed), pitch, and browser voice selection.
- **Reduced Motion**: Respects `prefers-reduced-motion`.
- **Zero Account Creation**: Fully functional offline via `localStorage`.

---

## 📁 Project Architecture

```
unmute/
├── app/
│   ├── globals.css              # Tailwind base, dark/light theme tokens & accessibility CSS
│   ├── layout.tsx               # Root Next.js layout, PWA meta, AppProvider wrap
│   └── page.tsx                 # Core app page (Main screen / Fast mode / Modals)
├── public/
│   ├── icon.svg                 # Accessible SVG app icon
│   └── manifest.json            # PWA manifest
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Listening status badge, mode toggles & settings
│   │   ├── QuickAssistBar.tsx   # Priority "Please give me a moment" & emergency triggers
│   │   ├── MainCommunicationScreen.tsx # Text entry, speak, repeat, clear & speed indicator
│   │   ├── ConversationListener.tsx    # Speech transcript, suggestions & simulator
│   │   ├── FastModeScreen.tsx   # Dedicated 2-choice rapid tactile view
│   │   ├── PhraseLibrary.tsx    # 11 Category pills, search bar & phrase collection
│   │   ├── PhraseCard.tsx       # Individual card with edit, pin, and tap-to-speak
│   │   ├── SettingsModal.tsx    # Voice selection, rate slider, themes, accessibility
│   │   └── Toast.tsx            # Accessible polite screen-reader/visual feedback
│   ├── constants/
│   │   └── defaultPhrases.ts    # Initial 11-category phrase database and defaults
│   ├── context/
│   │   └── AppContext.tsx       # Central state management & orchestration
│   ├── services/
│   │   ├── inputController.ts   # Hardware/keyboard abstraction layer & bridge
│   │   ├── speechRecognition.ts # Web Speech API recognition service
│   │   ├── speechSynthesis.ts   # SpeechSynthesis text-to-speech service
│   │   ├── storageService.ts    # LocalStorage persistence service
│   │   └── suggestionEngine.ts  # Rule-based intent matcher (modular for future AI)
│   └── types/
│       └── index.ts             # TypeScript definitions
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🚀 Installation & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.17+ or 20+)
- npm, pnpm, or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser (Chrome or Edge recommended for speech synthesis & Web Speech API).

---

## 🌐 Browser-Dependent Features & Capabilities

| Feature | Browser Support | Graceful Fallback Behavior |
| :--- | :--- | :--- |
| **SpeechSynthesis (TTS)** | Supported in Chrome, Edge, Safari, Firefox, Android Chrome, iOS Safari | If unsupported, user receives a toast notification and text remains visible on screen. |
| **Web Speech API (Recognition)** | Chrome, Edge, Safari (iOS 14.5+), Chromium mobile browsers | If unsupported or permission denied, status changes to *Mic Unsupported* / *Mic Denied*. The interactive **Simulation Bar** allows testing suggestions without a microphone. |
| **Local Storage** | Universal (all modern browsers) | In-memory fallback if cookies/storage are disabled. |
| **Keyboard Shortcuts** | Desktop browsers | Touch screen tap controls on mobile viewports. |

---

## 📱 Native Android Volume-Button Integration Roadmap

Web browsers enforce strict security sandboxes that intercept and prevent web pages from capturing physical volume keys (`KEYCODE_VOLUME_UP` and `KEYCODE_VOLUME_DOWN`) across all application states.

To enable **physical volume button selection** for Fast Mode, UnMute includes a decoupled architecture through `InputController`:

```
                       ┌─────────────────────────┐
                       │  Physical Volume Keys   │
                       └────────────┬────────────┘
                                    │
                        [Native Android Activity]
                        onKeyDown(KEYCODE_VOLUME_UP)
                        onKeyDown(KEYCODE_VOLUME_DOWN)
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │ window.UnMuteInputBridge     │
                     │  .onNativeVolumeUp()         │
                     │  .onNativeVolumeDown()       │
                     └──────────────┬───────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │ src/services/inputController │
                     │  dispatch({ action: 'A' })   │
                     └──────────────┬───────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │ FastModeScreen / AppContext  │
                     │  Speaks Option A aloud       │
                     └──────────────────────────────┘
```

### Android Native Wrapper Steps (Capacitor or Native WebView):
1. **Wrap using Capacitor / WebView**:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init UnMute com.unmute.assistive
   npx cap add android
   ```
2. **Override `onKeyDown` in `MainActivity.java`**:
   ```java
   @Override
   public boolean onKeyDown(int keyCode, KeyEvent event) {
       if (keyCode == KeyEvent.KEYCODE_VOLUME_UP) {
           bridge.getWebView().evaluateJavascript(
               "window.UnMuteInputBridge && window.UnMuteInputBridge.onNativeVolumeUp();", null);
           return true; // Consume event to prevent system volume change
       } else if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) {
           bridge.getWebView().evaluateJavascript(
               "window.UnMuteInputBridge && window.UnMuteInputBridge.onNativeVolumeDown();", null);
           return true;
       }
       return super.onKeyDown(keyCode, event);
   }
   ```
3. The web app's `InputController` already registers `window.UnMuteInputBridge`, meaning **no web frontend code changes are needed** to ship to Android!

---

## 🔒 Privacy & Safety Notice

- **No Remote Audio Streaming**: Speech recognition operates through standard device speech APIs. No audio recordings are saved or uploaded to third-party tracking servers.
- **Local Persistence**: Custom phrases, speech rates, and accessibility preferences remain stored strictly inside the user's browser `localStorage`.
- **User Agency**: UnMute **never** speaks a suggested response automatically without explicit user selection.
