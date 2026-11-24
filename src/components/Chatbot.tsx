"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  X,
  Send,
  Mic,
  Square,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Settings,
  Sparkles,
  Loader2,
  User,
  Trash2,
  Cpu,
} from "lucide-react";

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  audioBase64?: string | null;
}

interface VoiceOption {
  id: string;
  name: string;
  gender: string;
  locale: string;
}

let messageCounter = 0;
function createMessageId(prefix: string): string {
  messageCounter += 1;
  return `${prefix}_${messageCounter}_${Math.random().toString(36).substring(2, 8)}`;
}

function getFormattedTime(): string {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const DEFAULT_VOICES: VoiceOption[] = [
  {
    id: "3db1a7b6-d51c-4ae4-ab4a-3501821b8285",
    name: "Makesh (My Cloned Voice - Cartesia)",
    gender: "Custom",
    locale: "en-US",
  },
  {
    id: "en-US-ChristopherNeural",
    name: "Christopher (US Male - Professional)",
    gender: "Male",
    locale: "en-US",
  },
  {
    id: "en-US-JennyNeural",
    name: "Jenny (US Female - Clear & Friendly)",
    gender: "Female",
    locale: "en-US",
  },
  {
    id: "en-US-GuyNeural",
    name: "Guy (US Male - Casual)",
    gender: "Male",
    locale: "en-US",
  },
  {
    id: "en-US-AriaNeural",
    name: "Aria (US Female - Professional)",
    gender: "Female",
    locale: "en-US",
  },
  {
    id: "en-GB-RyanNeural",
    name: "Ryan (UK Male)",
    gender: "Male",
    locale: "en-GB",
  },
  {
    id: "en-GB-SoniaNeural",
    name: "Sonia (UK Female)",
    gender: "Female",
    locale: "en-GB",
  },
  {
    id: "en-IN-PrabhatNeural",
    name: "Prabhat (Indian English Male)",
    gender: "Male",
    locale: "en-IN",
  },
  {
    id: "en-IN-NeerjaNeural",
    name: "Neerja (Indian English Female)",
    gender: "Female",
    locale: "en-IN",
  },
];

const SUGGESTED_QUESTIONS = [
  "👋 Who is Makeshkumar and what is his background?",
  "🤖 What AI & RAG projects have you built?",
  "🛠️ What is your core full-stack and AI tech stack?",
  "💼 What is your work experience?",
  "📬 How can I contact or hire Makeshkumar?",
];

interface PersonaMeta {
  title: string;
  badge: string;
  badgeClass: string;
  avatarBg: string;
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
  statusLabel: string;
  thinkingLabel: string;
  defaultGreeting: string;
  resetGreeting: string;
  resetConfirmText: string;
  suggestedQuestions: string[];
}

const PERSONA_CONFIG: Record<string, PersonaMeta> = {
  "digital-twin": {
    title: "Makeshkumar Twin",
    badge: "Digital Twin",
    badgeClass: "bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 border border-violet-500/30",
    avatarBg: "from-violet-600 to-pink-500 shadow-violet-500/20",
    icon: Bot,
    placeholder: "Ask or talk to Makesh's Twin...",
    statusLabel: "Digital Twin Active",
    thinkingLabel: "Twin is thinking",
    defaultGreeting:
      "Hello! 👋 I am **Makeshkumar's AI Digital Twin** with speech intelligence.\n\nAsk me anything about Makeshkumar's full-stack & AI engineering experience, projects, tech stack, or click the microphone to speak with me directly!",
    resetGreeting: "Memory cleared! 🧹 What would you like to explore next about Makeshkumar?",
    resetConfirmText: "Are you sure you want to reset your conversation history with Makeshkumar's Digital Twin?",
    suggestedQuestions: [
      "👋 Who is Makeshkumar and what is his background?",
      "🤖 What AI & RAG projects have you built?",
      "🛠️ What is your core full-stack and AI tech stack?",
      "💼 What is your work experience?",
      "📬 How can I contact or hire Makeshkumar?",
    ],
  },
  "founder": {
    title: "Founder",
    badge: "Founder",
    badgeClass: "bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 border border-pink-500/30",
    avatarBg: "from-pink-600 to-rose-500 shadow-pink-500/20",
    icon: Sparkles,
    placeholder: "Ask about startup roadmap, strategy, or partnerships...",
    statusLabel: "Founder Active",
    thinkingLabel: "Founder is thinking",
    defaultGreeting:
      "Hello! 👋 I am **Makeshkumar's Founder** persona.\n\nI represent Makeshkumar's strategic vision, startup execution, and commercial leadership. Ask me about our business roadmap, technical strategy, or partnership opportunities!",
    resetGreeting: "Memory cleared! 🧹 What would you like to explore about startup vision and roadmap?",
    resetConfirmText: "Are you sure you want to reset your conversation history with Founder Persona?",
    suggestedQuestions: [
      "🚀 What is your long-term startup vision and roadmap?",
      "📈 What commercial market opportunities are you targeting?",
      "💡 How do you approach architectural decisions and team leadership?",
      "🤝 How can we discuss partnerships, enterprise pilots, or investment?",
    ],
  },
  "ai-engineer": {
    title: "AI Engineer",
    badge: "AI Engineer",
    badgeClass: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30",
    avatarBg: "from-emerald-600 to-teal-500 shadow-emerald-500/20",
    icon: Cpu,
    placeholder: "Ask about system design, RAG pipelines, or code...",
    statusLabel: "AI Engineer Active",
    thinkingLabel: "AI Engineer is thinking",
    defaultGreeting:
      "Hello! 👋 I am **Makeshkumar's AI Engineer** persona.\n\nAsk me about production LLM architectures, RAG pipelines, model fine-tuning, autonomous agent systems, or engineering trade-offs!",
    resetGreeting: "Memory cleared! 🧹 What would you like to discuss with the AI Engineer?",
    resetConfirmText: "Are you sure you want to reset your conversation history with the AI Engineer?",
    suggestedQuestions: [
      "⚡ How do you design and optimize low-latency RAG pipelines?",
      "🤖 What is your architecture for multi-agent autonomous workflows?",
      "🎯 How do you benchmark and evaluate fine-tuned LLMs?",
      "🏗️ What are your core engineering patterns for production AI backends?",
    ],
  },
};

function getPersonaMeta(persona: string): PersonaMeta {
  const key = (persona || "digital-twin").toLowerCase().trim();
  if (PERSONA_CONFIG[key]) {
    return PERSONA_CONFIG[key];
  }
  const formatted = key
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: formatted,
    badge: formatted,
    badgeClass: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-500/30",
    avatarBg: "from-blue-600 to-indigo-500 shadow-blue-500/20",
    icon: Bot,
    placeholder: `Ask or talk to ${formatted}...`,
    statusLabel: `${formatted} Active`,
    thinkingLabel: `${formatted} is thinking`,
    defaultGreeting: `Hello! 👋 I am Makeshkumar's **${formatted}** persona. How can I assist you today?`,
    resetGreeting: `Memory cleared! 🧹 What would you like to discuss with ${formatted}?`,
    resetConfirmText: `Are you sure you want to reset your conversation history with ${formatted}?`,
    suggestedQuestions: [
      "👋 Who is Makeshkumar and what is his background?",
      "🤖 What AI & RAG projects have you built?",
      "🛠️ What is your core full-stack and AI tech stack?",
      "💼 What is your work experience?",
      "📬 How can I contact or hire Makeshkumar?",
    ],
  };
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Audio & Voice States
  const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(true);
  const [selectedVoice, setSelectedVoice] = useState<string>("en-US-ChristopherNeural");
  const [voices, setVoices] = useState<VoiceOption[]>(DEFAULT_VOICES);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [audioLoadingId, setAudioLoadingId] = useState<string | null>(null);

  // Recording State (STT / Voice-in)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Session & Backend States
  const [sessionId, setSessionId] = useState<string>("");
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [activePersona, setActivePersona] = useState<string>("digital-twin");

  // Hydrate client-only settings from localStorage safely after initial mount
  useEffect(() => {
    try {
      const savedAutoPlay = localStorage.getItem("digital_twin_auto_play");
      if (savedAutoPlay !== null) setAutoPlayAudio(savedAutoPlay === "true");

      const savedVoice = localStorage.getItem("digital_twin_voice");
      if (savedVoice) setSelectedVoice(savedVoice);

      const savedPersona = localStorage.getItem("twin_active_persona");
      if (savedPersona) setActivePersona(savedPersona);

      let sid = localStorage.getItem("digital_twin_session_id");
      if (!sid) {
        sid = `session_${Math.random().toString(36).substring(2, 10)}`;
        localStorage.setItem("digital_twin_session_id", sid);
      }
      setSessionId(sid);
    } catch {
      // ignore
    }
  }, []);

  const currentPersonaMeta = getPersonaMeta(activePersona);
  const PersonaIcon = currentPersonaMeta.icon;

  // Synchronize voice default according to active persona:
  // - digital-twin: Makesh (Cartesia cloned voice)
  // - otherwise (founder, ai-engineer, etc.): Christopher ("en-US-ChristopherNeural")
  useEffect(() => {
    if (activePersona === "digital-twin") {
      const makeshVoice = voices.find(
        (v) =>
          v.gender === "Custom" ||
          v.id === "3db1a7b6-d51c-4ae4-ab4a-3501821b8285" ||
          v.name.toLowerCase().includes("makesh")
      );
      setSelectedVoice(makeshVoice ? makeshVoice.id : "en-US-ChristopherNeural");
    } else {
      setSelectedVoice("en-US-ChristopherNeural");
    }
  }, [activePersona, voices]);

  // Real-time listener for persona changes from admin console or storage
  useEffect(() => {
    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        const nextP = customEvent.detail;
        setActivePersona(nextP);
        try {
          localStorage.setItem("twin_active_persona", nextP);
        } catch {}
        const meta = getPersonaMeta(nextP);
        setMessages((prev) => {
          if (
            prev.length <= 1 &&
            (prev.length === 0 || prev[0].id === "greeting" || prev[0].id === "reset_greeting")
          ) {
            return [
              {
                id: "greeting",
                role: "assistant",
                content: meta.defaultGreeting,
                timestamp: prev[0]?.timestamp || getFormattedTime(),
              },
            ];
          }
          return prev;
        });
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "twin_active_persona" && e.newValue) {
        const nextP = e.newValue;
        setActivePersona(nextP);
        const meta = getPersonaMeta(nextP);
        setMessages((prev) => {
          if (
            prev.length <= 1 &&
            (prev.length === 0 || prev[0].id === "greeting" || prev[0].id === "reset_greeting")
          ) {
            return [
              {
                id: "greeting",
                role: "assistant",
                content: meta.defaultGreeting,
                timestamp: prev[0]?.timestamp || getFormattedTime(),
              },
            ];
          }
          return prev;
        });
      }
    };

    window.addEventListener("twin_persona_change", handleCustomChange);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("twin_persona_change", handleCustomChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

  // Stop currently playing audio
  const stopCurrentAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = "";
      currentAudioRef.current = null;
    }
    setPlayingMessageId(null);
    setAudioLoadingId(null);
  }, []);

  // Check backend health & fetch available neural voices
  useEffect(() => {
    let isMounted = true;

    async function checkHealthAndVoices() {
      try {
        const res = await fetch(`${API_URL}/`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setBackendOnline(data.status === "running");
            if (data.active_persona) {
              setActivePersona(data.active_persona);
              try {
                localStorage.setItem("twin_active_persona", data.active_persona);
              } catch {}
            }
          }
        } else if (isMounted) {
          setBackendOnline(false);
        }
      } catch {
        if (isMounted) setBackendOnline(false);
      }

      try {
        const voiceRes = await fetch(`${API_URL}/audio/voices`);
        if (voiceRes.ok) {
          const voiceData = await voiceRes.json();
          if (isMounted && Array.isArray(voiceData) && voiceData.length > 0) {
            setVoices(voiceData);
          }
        }
      } catch {
        // Keep DEFAULT_VOICES fallback
      }
    }

    checkHealthAndVoices();

    return () => {
      isMounted = false;
    };
  }, [API_URL]);

  // Load chat history from backend memory when sessionId is ready
  useEffect(() => {
    if (!sessionId) return;
    let isMounted = true;

    async function fetchHistory() {
      try {
        const res = await fetch(`${API_URL}/history/${sessionId}`);
        if (res.ok) {
          const history = await res.json();
          if (isMounted && Array.isArray(history) && history.length > 0) {
            const loadedMessages: MessageItem[] = history.map((item, idx) => ({
              id: `hist_${idx}_${Math.random().toString(36).substring(2, 7)}`,
              role: item.role === "assistant" ? "assistant" : "user",
              content: item.content,
              timestamp: item.timestamp,
            }));
            setMessages(loadedMessages);
            return;
          }
        }
      } catch {
        // Fallback to default greeting if backend not reachable
      }

      if (isMounted) {
        setMessages((prev) => {
          if (prev.length > 0) return prev;
          const meta = getPersonaMeta(activePersona);
          return [
            {
              id: "greeting",
              role: "assistant",
              content: meta.defaultGreeting,
              timestamp: getFormattedTime(),
            },
          ];
        });
      }
    }

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, [sessionId, API_URL, activePersona]);

  // Keep persona in sync when opening the chatbot and through periodic polling
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    const syncPersona = async () => {
      try {
        const res = await fetch(`${API_URL}/persona`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.active_persona) {
            const nextP = data.active_persona;
            setActivePersona(nextP);
            try {
              localStorage.setItem("twin_active_persona", nextP);
            } catch {}
            const meta = getPersonaMeta(nextP);
            setMessages((prev) => {
              if (
                prev.length <= 1 &&
                (prev.length === 0 || prev[0].id === "greeting" || prev[0].id === "reset_greeting")
              ) {
                return [
                  {
                    id: "greeting",
                    role: "assistant",
                    content: meta.defaultGreeting,
                    timestamp: prev[0]?.timestamp || getFormattedTime(),
                  },
                ];
              }
              return prev;
            });
          }
        }
      } catch {
        // ignore
      }
    };

    syncPersona();
    const interval = setInterval(syncPersona, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isOpen, API_URL]);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isRecording, isOpen]);

  // Cleanup audio & streams when unmounting
  useEffect(() => {
    return () => {
      stopCurrentAudio();
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stopCurrentAudio]);

  // Play audio for a given message
  const playMessageAudio = async (msg: MessageItem) => {
    // If currently playing this message, toggle pause
    if (playingMessageId === msg.id) {
      stopCurrentAudio();
      return;
    }

    stopCurrentAudio();

    // 1. If base64 audio is already attached to the message
    if (msg.audioBase64) {
      try {
        const audio = new Audio(`data:audio/mp3;base64,${msg.audioBase64}`);
        currentAudioRef.current = audio;
        setPlayingMessageId(msg.id);

        audio.onended = () => {
          setPlayingMessageId(null);
          currentAudioRef.current = null;
        };

        audio.onerror = () => {
          setPlayingMessageId(null);
          currentAudioRef.current = null;
        };

        await audio.play();
        return;
      } catch {
        setPlayingMessageId(null);
      }
    }

    // 2. Fetch on-demand TTS audio from GET /audio/tts
    try {
      setAudioLoadingId(msg.id);
      const audioUrl = `${API_URL}/audio/tts?text=${encodeURIComponent(msg.content)}&voice=${encodeURIComponent(selectedVoice)}`;
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      audio.onloadeddata = () => {
        setAudioLoadingId(null);
        setPlayingMessageId(msg.id);
      };

      audio.onended = () => {
        setPlayingMessageId(null);
        currentAudioRef.current = null;
      };

      audio.onerror = () => {
        setAudioLoadingId(null);
        setPlayingMessageId(null);
        currentAudioRef.current = null;
      };

      await audio.play();
    } catch {
      setAudioLoadingId(null);
      setPlayingMessageId(null);
    }
  };

  // Send text message
  const handleSendMessage = async (textToSend?: string) => {
    const rawText = (textToSend || message).trim();
    if (!rawText || isLoading) return;

    setMessage("");
    setIsLoading(true);
    stopCurrentAudio();

    const userMsgId = createMessageId("user");
    const userMsg: MessageItem = {
      id: userMsgId,
      role: "user",
      content: rawText,
      timestamp: getFormattedTime(),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Real-Time SSE Token Streaming when autoPlayAudio is disabled (TTFT < 300ms)
    if (!autoPlayAudio) {
      const botMsgId = createMessageId("bot");
      let streamSuccess = false;

      try {
        const res = await fetch(`${API_URL}/chat/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: rawText,
            session_id: sessionId || "default",
          }),
        });

        if (res.ok && res.body) {
          streamSuccess = true;
          setMessages((prev) => [
            ...prev,
            {
              id: botMsgId,
              role: "assistant",
              content: "",
              timestamp: getFormattedTime(),
            },
          ]);

          const reader = res.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith("data: ")) {
                try {
                  const parsed = JSON.parse(trimmed.slice(6));
                  if (parsed.token) {
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === botMsgId ? { ...m, content: m.content + parsed.token } : m
                      )
                    );
                  }
                } catch {
                  // Incomplete JSON segment
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn("SSE Streaming failed, falling back to /chat:", err);
      }

      if (!streamSuccess) {
        // Fallback to standard /chat endpoint
        try {
          const res = await fetch(`${API_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: rawText,
              session_id: sessionId || "default",
              include_audio: false,
            }),
          });
          if (!res.ok) throw new Error(`Server returned ${res.status}`);
          const data = await res.json();
          setMessages((prev) => [
            ...prev,
            {
              id: botMsgId,
              role: "assistant",
              content: data.reply || "I am unable to answer right now.",
              timestamp: getFormattedTime(),
            },
          ]);
        } catch {
          setMessages((prev) => [
            ...prev,
            {
              id: createMessageId("err"),
              role: "assistant",
              content: `⚠️ Failed to connect to the Digital Twin backend. Please make sure the backend server is running on \`${API_URL}\`.`,
              timestamp: getFormattedTime(),
            },
          ]);
        }
      }
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: rawText,
          session_id: sessionId || "default",
          include_audio: autoPlayAudio,
          voice: selectedVoice,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const botMsgId = createMessageId("bot");
      const botMsg: MessageItem = {
        id: botMsgId,
        role: "assistant",
        content: data.reply || "I am unable to answer right now.",
        timestamp: getFormattedTime(),
        audioBase64: data.audio_base64 || null,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Automatically play response if autoPlayAudio is enabled
      if (autoPlayAudio && data.audio_base64) {
        try {
          const audio = new Audio(`data:audio/mp3;base64,${data.audio_base64}`);
          currentAudioRef.current = audio;
          setPlayingMessageId(botMsgId);

          audio.onended = () => {
            setPlayingMessageId(null);
            currentAudioRef.current = null;
          };

          audio.onerror = () => {
            setPlayingMessageId(null);
            currentAudioRef.current = null;
          };

          await audio.play();
        } catch {
          setPlayingMessageId(null);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId("err"),
          role: "assistant",
          content: `⚠️ Failed to connect to the Digital Twin backend. Please make sure the backend server is running on \`${API_URL}\`.`,
          timestamp: getFormattedTime(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Start voice recording
  const startRecording = async () => {
    stopCurrentAudio();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Audio recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";

      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      alert("Microphone permission was denied or is unavailable. Please check your browser microphone settings.");
    }
  };

  // Stop recording and send audio directly to /chat/voice
  const stopRecordingAndSend = () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    const recorder = mediaRecorderRef.current;

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: recorder.mimeType || "audio/webm",
      });

      // Stop mic tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      setIsRecording(false);

      if (audioBlob.size < 500) {
        // Ignore accidental empty clicks
        return;
      }

      setIsLoading(true);

      const tempUserMsgId = createMessageId("user_voice");
      setMessages((prev) => [
        ...prev,
        {
          id: tempUserMsgId,
          role: "user",
          content: "🎙️ Processing your voice message...",
          timestamp: getFormattedTime(),
        },
      ]);

      try {
        const formData = new FormData();
        formData.append("file", audioBlob, "voice_recording.webm");
        formData.append("session_id", sessionId || "default");
        formData.append("voice", selectedVoice);

        const res = await fetch(`${API_URL}/chat/voice`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Voice server error: ${res.status}`);
        }

        const data = await res.json();

        // Update the temporary message with the transcribed speech
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempUserMsgId
              ? {
                  ...m,
                  content: data.user_message || "🎙️ (Voice Message)",
                }
              : m
          )
        );

        // Add assistant response
        const botMsgId = createMessageId("bot");
        const botMsg: MessageItem = {
          id: botMsgId,
          role: "assistant",
          content: data.reply || "I received your voice message.",
          timestamp: getFormattedTime(),
          audioBase64: data.audio_base64 || null,
        };

        setMessages((prev) => [...prev, botMsg]);

        // Auto-play the synthesized response
        if (data.audio_base64) {
          try {
            const audio = new Audio(`data:audio/mp3;base64,${data.audio_base64}`);
            currentAudioRef.current = audio;
            setPlayingMessageId(botMsgId);

            audio.onended = () => {
              setPlayingMessageId(null);
              currentAudioRef.current = null;
            };

            audio.onerror = () => {
              setPlayingMessageId(null);
              currentAudioRef.current = null;
            };

            await audio.play();
          } catch {
            setPlayingMessageId(null);
          }
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: createMessageId("err"),
            role: "assistant",
            content: "⚠️ Failed to process audio. Ensure the backend speech transcription engine is available.",
            timestamp: getFormattedTime(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    recorder.stop();
  };

  // Cancel recording without sending
  const cancelRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    setRecordingSeconds(0);
    audioChunksRef.current = [];
  };

  // Reset conversation memory on backend
  const handleResetHistory = async () => {
    if (!confirm(currentPersonaMeta.resetConfirmText)) {
      return;
    }

    stopCurrentAudio();

    try {
      if (sessionId) {
        await fetch(`${API_URL}/history/${sessionId}`, { method: "DELETE" });
      }
    } catch {
      // ignore
    }

    const nextSid = `session_${Math.random().toString(36).substring(2, 10)}`;
    try {
      localStorage.setItem("digital_twin_session_id", nextSid);
    } catch {
      // ignore
    }
    setSessionId(nextSid);

    setMessages([
      {
        id: "reset_greeting",
        role: "assistant",
        content: currentPersonaMeta.resetGreeting,
        timestamp: getFormattedTime(),
      },
    ]);
  };

  // Handle voice selection change
  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId);
    try {
      localStorage.setItem("digital_twin_voice", voiceId);
    } catch {
      // ignore
    }
  };

  // Toggle auto-play audio
  const toggleAutoPlay = () => {
    const nextVal = !autoPlayAudio;
    setAutoPlayAudio(nextVal);
    try {
      localStorage.setItem("digital_twin_auto_play", String(nextVal));
    } catch {
      // ignore
    }
  };

  // Format recording seconds as MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Render markdown text safely
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\n\n|\n)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="font-semibold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={index} className="bg-gray-200/80 dark:bg-gray-700/80 text-violet-700 dark:text-violet-300 px-1 py-0.5 rounded text-xs font-mono">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part === "\n\n") {
        return <div key={index} className="h-2" />;
      }
      if (part === "\n") {
        return <br key={index} />;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="fixed bottom-20 right-3 sm:bottom-22 sm:right-8 z-50 flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-3 w-[calc(100vw-1.5rem)] sm:w-[420px] max-w-[440px] h-[min(580px,calc(100dvh-7.5rem))] max-h-[calc(100dvh-7.5rem)] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/80 dark:border-gray-800 flex flex-col overflow-hidden text-[#1e2235] dark:text-gray-100"
          >
            {/* Header */}
            <div className="p-3.5 sm:p-4 border-b border-gray-200/80 dark:border-gray-800 bg-gradient-to-r from-violet-600/10 via-pink-500/10 to-teal-500/10 dark:from-violet-950/40 dark:via-pink-950/30 dark:to-teal-950/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-tr ${currentPersonaMeta.avatarBg} flex items-center justify-center text-white shadow-md`}
                  >
                    <PersonaIcon className="w-5 h-5" />
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                      backendOnline === false ? "bg-red-500" : "bg-emerald-500 animate-pulse"
                    }`}
                    title={backendOnline === false ? "Backend Offline" : currentPersonaMeta.statusLabel}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white leading-tight">
                      {currentPersonaMeta.title}
                    </h3>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${currentPersonaMeta.badgeClass}`}
                    >
                      {currentPersonaMeta.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {backendOnline === false
                      ? "Offline (check 127.0.0.1:8000)"
                      : isRecording
                      ? "Listening to you..."
                      : playingMessageId
                      ? "Speaking..."
                      : "Online • Speech & Neural Voice"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {/* Auto-Speech Toggle */}
                <button
                  onClick={toggleAutoPlay}
                  className={`p-1.5 rounded-lg transition-colors ${
                    autoPlayAudio
                      ? "text-violet-600 bg-violet-100 dark:bg-violet-900/40 dark:text-violet-300"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  }`}
                  title={autoPlayAudio ? "Voice replies enabled (Click to mute)" : "Voice replies muted (Click to speak)"}
                  aria-label="Toggle voice output"
                >
                  {autoPlayAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Voice Settings Dropdown */}
                <button
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    showVoiceSettings
                      ? "text-violet-600 bg-violet-100 dark:bg-violet-900/40"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  }`}
                  title="Voice & Speech Settings"
                  aria-label="Voice settings"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {/* Reset Conversation */}
                <button
                  onClick={handleResetHistory}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/40 transition-colors"
                  title="Reset conversation memory"
                  aria-label="Reset conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Close Drawer */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Voice Settings Popover Drawer */}
            <AnimatePresence>
              {showVoiceSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/90 dark:bg-gray-800/90 p-3 text-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-violet-500" /> Neural Voice Model
                    </span>
                    <button
                      onClick={() => setShowVoiceSettings(false)}
                      className="text-gray-400 hover:text-gray-600 text-[11px]"
                    >
                      Done
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {voices.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => handleVoiceChange(v.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                          selectedVoice === v.id
                            ? "bg-violet-600 text-white font-medium"
                            : "bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        <span className="truncate">{v.name}</span>
                        <span className={`text-[10px] px-1 rounded ${selectedVoice === v.id ? "bg-violet-500 text-white" : "text-gray-400"}`}>
                          {v.locale}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div
                      className={`w-6 h-6 rounded-full bg-gradient-to-tr ${currentPersonaMeta.avatarBg} text-white flex items-center justify-center text-[10px] shrink-0 mb-1 shadow-sm`}
                    >
                      <PersonaIcon className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"} max-w-[85%]`}>
                    <div
                      className={`relative px-4 py-2.5 rounded-2xl ${
                        m.role === "user"
                          ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-br-none shadow-md shadow-violet-500/10"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-200/50 dark:border-gray-700/50"
                      }`}
                    >
                      <div className="leading-relaxed break-words whitespace-pre-wrap">
                        {renderFormattedText(m.content)}
                      </div>

                      {/* Assistant Audio Action Bar */}
                      {m.role === "assistant" && m.id !== "reset_greeting" && (
                        <div className="mt-2 pt-2 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                          <button
                            onClick={() => playMessageAudio(m)}
                            className="inline-flex items-center gap-1.5 font-medium hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                            aria-label={playingMessageId === m.id ? "Pause speech" : "Listen to speech"}
                          >
                            {audioLoadingId === m.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-500" />
                            ) : playingMessageId === m.id ? (
                              <>
                                <Square className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse" />
                                <span className="text-pink-600 dark:text-pink-400 font-semibold flex items-center gap-1">
                                  Playing...
                                  <span className="flex gap-0.5 items-end h-3">
                                    <span className="w-0.5 h-2 bg-pink-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-0.5 h-3 bg-pink-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-0.5 h-1.5 bg-pink-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                                  </span>
                                </span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 text-violet-600 fill-violet-600" />
                                <span>Speak</span>
                              </>
                            )}
                          </button>

                          {m.timestamp && <span className="text-[10px] opacity-70">{m.timestamp}</span>}
                        </div>
                      )}
                    </div>

                    {m.role === "user" && m.timestamp && (
                      <span className="text-[10px] text-gray-400 mt-1 mr-1">{m.timestamp}</span>
                    )}
                  </div>

                  {m.role === "user" && (
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center text-[10px] shrink-0 mb-1">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full bg-gradient-to-tr ${currentPersonaMeta.avatarBg} text-white flex items-center justify-center text-[10px] shrink-0 shadow-sm`}
                  >
                    <PersonaIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 px-4 py-2.5 rounded-2xl rounded-bl-none text-xs flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      {currentPersonaMeta.thinkingLabel}
                    </span>
                    <span className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </div>
              )}

              {/* Quick suggestion chips per persona */}
              {currentPersonaMeta.suggestedQuestions.length > 0 && messages.length <= 2 && !isLoading && !isRecording && (
                <div className="pt-2">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Suggested Topics:
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {currentPersonaMeta.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="text-left text-xs px-3 py-2 rounded-xl border border-violet-100 dark:border-violet-950/60 bg-violet-50/50 dark:bg-violet-950/20 hover:bg-violet-100/70 dark:hover:bg-violet-900/40 text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Controls / Recording Overlay or Input Bar */}
            <div className="p-3 sm:p-4 border-t border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900">
              {isRecording ? (
                /* Voice Recording Live Bar */
                <div className="flex items-center justify-between gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                    </span>
                    <span className="text-xs font-semibold text-red-700 dark:text-red-300">
                      Recording speech ({formatTime(recordingSeconds)})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={cancelRecording}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                      title="Cancel recording"
                      aria-label="Cancel recording"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={stopRecordingAndSend}
                      className="px-3 py-1.5 bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-90 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-pink-500/20 transition-all"
                    >
                      <span>Send Voice</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Standard Text and Mic Input Bar */
                <div className="flex items-center gap-2">
                  <button
                    onClick={startRecording}
                    disabled={isLoading}
                    className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-pink-500 dark:hover:border-pink-500 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors disabled:opacity-50"
                    title="Speak using microphone (Groq Whisper STT)"
                    aria-label="Record voice message"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={
                      backendOnline === false
                        ? "Backend unavailable..."
                        : currentPersonaMeta.placeholder
                    }
                    className="flex-1 px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 transition-all"
                    disabled={isLoading}
                  />

                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!message.trim() || isLoading}
                    className="p-2.5 bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-violet-500/20"
                    title="Send message"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          stopCurrentAudio();
        }}
        className={`relative group flex items-center gap-2 rounded-full bg-gradient-to-r ${currentPersonaMeta.avatarBg} p-1 shadow-xl shadow-violet-500/30 transition-all hover:shadow-2xl text-white`}
        aria-label={isOpen ? "Close chat" : `Talk with ${currentPersonaMeta.title}`}
      >
        <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r ${currentPersonaMeta.avatarBg} text-white`}>
          {isOpen ? <X className="w-6 h-6" /> : <PersonaIcon className="w-6 h-6" />}
        </div>

        {!isOpen && (
          <span className="hidden sm:inline-block pr-4 pl-1 text-xs font-bold tracking-wide">
            {activePersona === "digital-twin" ? "Talk to AI Twin" : `Talk to ${currentPersonaMeta.title}`}
          </span>
        )}

        {/* Pulse indicator */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-teal-400 border-2 border-white dark:border-gray-900" />
        </span>
      </motion.button>
    </div>
  );
}
