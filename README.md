# UnMute 🎙️

> **An assistive voice companion for people who stammer.**  
> It listens to the other person in a conversation and instantly gives you **4 quick responses** to speak aloud with one tap.

---

## 🎯 How It Meets Hackathon Judging Criteria

### 01. 💡 Innovation & Creativity
* **Listens to conversations in real time:** Instead of forcing users to slowly type while people wait, UnMute listens to the other person and suggests **4 smart, ready-to-speak replies**.
* **Fast Mode:** A distraction-free screen with 4 giant touch cards and keyboard shortcuts (`1`, `2`, `3`, `4`).
* **Freeze Protection:** Keeps options stable so words don't jump right when you're about to tap.

### 02. ⚙️ Technical Implementation
* **Fully functional prototype:** Real text-to-speech (`SpeechSynthesis`) and voice recognition (`Web Speech API`).
* **100% Private & On-Device:** No external servers, no cloud recordings, no logins, no API fees.
* **Smart Intent Engine:** Understands common questions (*"Tea or coffee?"*, *"Cash or card?"*, *"Can you meet tomorrow?"*) and generates 4 tailored choices instantly.
* **Simulator Included:** Includes a built-in testing tool so judges can test voice features without a mic.

### 03. 🌍 Impact & Usefulness
* **Over 70 million people worldwide stammer.** High-pressure situations (coffee shops, buses, classrooms, doctor appointments) can cause severe speech blocks.
* **Dignity & Speed:** UnMute doesn't try to "cure" natural speech. It provides a fast, polite bridge when speed matters.
* **Priority Delay Button:** Includes a 1-tap **"Please give me a moment"** button to immediately take the pressure off.

### 04. 🎨 UI/UX & Accessibility
* **Giant touch targets:** Built for mobile screens so anyone can tap quickly.
* **5-Step Interactive Tour:** Welcomes first-time users with a skippable onboarding guide.
* **High-Contrast & Large-Text Modes:** One-click accessibility toggles in settings.
* **Immediate Audio Cancel:** Persistent red button to stop speech instantly if needed.

---

## ⚡ How It Works (3 Steps)

```
1. Partner Speaks           2. UnMute Suggests (4 Options)        3. One Tap to Speak
"Would you like tea      ➔   [A] "Tea, please."              ➔   Phone speaks chosen
 or coffee?"                 [B] "Coffee, please."                sentence clearly aloud!
                             [C] "Water is fine, thanks."
                             [D] "Neither right now."
```

---

## Demo Walkthrough

1. **Open the App:** You will see the friendly 5-step guided tour (click **Skip Tour** or **Next**).
2. **Test Speech Output:** Type anything into the main box and tap **Speak Aloud**. Tap **Stop Speaking** to cancel.
3. **Try Live Suggestions (No mic needed!):**
   - Scroll to **Conversation Listener** and click **Test with Simulation**.
   - Click `"Would you like tea or coffee?"`.
   - Watch the **4 quick replies** instantly update! Tap **Speak This** on any option.
4. **Try Fast Mode:**
   - Tap the **Fast Mode** button in the header.
   - Press <kbd>1</kbd>, <kbd>2</kbd>, <kbd>3</kbd>, or <kbd>4</kbd> on your keyboard to speak immediately!
5. **Try the Priority Button:**
   - Tap **"Please give me a moment"** at the top bar for instant polite delay speech.

---

## 🚀 Run It Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open **`http://localhost:3000`** in Chrome or Edge.

---

## 📱 Mobile & Hardware Roadmap

UnMute's code is decoupled from the screen. In an Android wrapper (Capacitor/WebView), physical volume keys can map directly to the 4 choices without changing any frontend code.

---

**Team:** UnMute • **Event:** Blind Date Hackathon • **License:** MIT

Team 2
Adhithyan K J - S5CSEA
Aysha Misna - S! CSEA

`Blind date hackathon 2026
