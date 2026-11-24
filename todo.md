# Todo

- [x] Floating chatbot button (with pulse active badge and responsive drawer)
- [x] Typing animation (multi-dot bouncing loader with twin thinking state)
- [x] Voice input & Voice chat (Web Audio MediaRecorder + Groq/OpenAI Whisper STT via `/chat/voice` and `/audio/stt`)
- [x] Text-to-Speech (TTS) (Edge Neural Voices, per-message audio player, and auto-speak toggle via `/audio/tts` and `/chat`)
- [x] Voice selection (Dynamic list of Edge Neural Voices via `/audio/voices` with local persistence)
- [x] Session memory persistence (Stored per `session_id`, synchronized via `/history/{session_id}` and `DELETE /history/{session_id}`)
- [x] Markdown & code formatting rendering (Safe parser for bold, inline code, code blocks, line breaks)
- [x] Suggested questions & starter chips
- [x] Resume download (linked to `/Resume.pdf`)
- [x] Contact capture & tool notifications (Telegram integration via FastAPI tools)
- [x] Tool calling to FastAPI (`/chat`, `/chat/voice`, `/audio/tts`, `/audio/voices`, `/history/{session_id}`)
- [x] Admin console token usage & cost analytics (Prompt, completion, total tokens, per-model breakdown & cost in Neon PostgreSQL & UI)
