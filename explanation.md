# Component Explanations

## `src/components/BackToTop.tsx`

A client-side floating button that appears after the user scrolls down and smoothly scrolls the page back to the top.

### How it works
- **`"use client"`**: Marks the component as a React client component (required by Next.js since it uses hooks and browser APIs).
- **State** — `showButton` (boolean) controls whether the button is rendered.
- **Scroll listener** (`useEffect`, lines 8–20):
  - Attaches a `scroll` event listener to `window`.
  - Sets `showButton` to `true` when `window.scrollY > 300` (i.e., the user has scrolled past 300px), otherwise `false`.
  - The returned cleanup function removes the listener when the component unmounts, preventing memory leaks.
  - The empty dependency array `[]` ensures the effect runs only once on mount.
- **`scrollTop()`** (lines 22–27) — calls `window.scrollTo({ top: 0, behavior: "smooth" })` for an animated scroll back to the top.
- **Render** (lines 29–40) — conditionally renders a fixed-position button (`fixed bottom-8 right-8 z-50`) containing a lucide `ArrowUp` icon. Styling includes light/dark mode variants and hover transitions.

### Key points
- The button only exists in the DOM when scrolled past the threshold (conditional rendering), so there is no hidden-but-mounted element.
- Uses the `lucide-react` `ArrowUp` icon.

---

## `src/components/Chatbot.tsx`

An interactive AI Digital Twin voice and text chat widget connected to the FastAPI backend at `Twin-backend`. Supports full speech-to-text (STT), text-to-speech (TTS), Edge Neural Voices, session memory persistence, audio waveform animations, and Markdown rendering.

### Key Capabilities & Backend Integration
1. **End-to-End Voice Chat (`POST /chat/voice`)**:
   - Uses browser `MediaRecorder` API to record voice from the microphone.
   - Streams audio file chunks to `/chat/voice` with `session_id` and selected voice.
   - Backend transcribes via Groq Whisper (`whisper-large-v3-turbo`) or OpenAI Whisper, queries the digital twin, and returns both transcribed text, bot reply, and synthesized MP3 audio.
2. **Text-to-Speech (TTS) & Neural Voices (`POST /chat` & `GET /audio/tts`)**:
   - `include_audio: true` flag automatically receives high-quality neural voice audio.
   - Per-message audio player with play/stop controls and bouncing equalizer animation.
   - Auto-speak toggle (volume button) with localStorage preference persistence.
   - Voice selection drawer fetching neural voice models from `GET /audio/voices` (e.g. Christopher, Jenny, Guy, Aria, Prabhat, etc.).
3. **Session Memory (`GET /history/{session_id}` & `DELETE /history/{session_id}`)**:
   - Session ID stored in `localStorage` persists user conversations across page reloads.
   - Loads chat history on initialization.
   - Reset conversation button clears memory on the backend and issues a clean session ID.
4. **Markdown & Code Rendering**:
   - Formats bold text, inline code blocks, and line breaks cleanly.
5. **Quick Starter Chips**:
   - Quick questions for instant one-click interaction.

---

## `src/components/Navbar.tsx`

A sticky, animated top navigation bar with scroll-aware styling and a responsive mobile menu.

### State (lines 9–10)
- `isOpen` — toggles the mobile menu.
- `scrolled` — becomes `true` when `window.scrollY > 20`.

### Scroll effect (lines 12–18)
Same pattern as `BackToTop`: a `window` scroll listener updates `scrolled`, with cleanup on unmount and `[]` deps.

### Navigation links (lines 20–28)
An array of section anchors (`#about`, `#ai`, `#experience`, `#skills`, `#projects`, `#education`, `#certificate`) rendered in both the desktop list and the mobile menu.

### Render
- **`motion.nav`** (framer-motion) — fades in and slides down on mount (`initial: { opacity: 0, y: -80 }` → `animate: { opacity: 1, y: 0 }`, 0.5s).
- **Scroll-based styling** (line 35): when `scrolled`, the bar gets `bg-white/70 backdrop-blur-md shadow-sm py-4` (frosted glass effect); otherwise it's transparent with `py-5`. Negative margins (`-mx-6 px-6`) let the bar span the full width of the padded page container.
- **Logo** (lines 39–43) — a `Link` to `/` using `gradient-text`, brand text, and a teal period.
- **Desktop links** (lines 44–55) — `hidden lg:flex`; each link has an animated gradient underline that grows from 0 to `w-2/3` on hover (`group-hover:w-2/3`).
- **Hamburger button** (lines 56–58) — visible only below `lg`, toggling between `Menu` and `X` icons.
- **Mobile menu** (lines 61–77) — an absolutely positioned dropdown (`absolute top-full`) listing the links; clicking a link closes the menu via `onClick={() => setIsOpen(false)}`.

---

## Shared patterns
- All three are `"use client"` components (hooks, `window`, and event listeners).
- All use the scroll-listener + cleanup pattern inside `useEffect`.
- All use `lucide-react` icons and Tailwind CSS with `dark:` variants for dark mode.
