"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import PersonaDropdown from "@/components/PersonaDropdown";
import {
  Unlock,
  Shield,
  Bot,
  User,
  Trash2,
  RefreshCw,
  Search,
  Cpu,
  Database,
  Check,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Clock,
  MessageSquare,
  Key,
  Eye,
  EyeOff,
  Play,
  Sliders,
  LogOut,
  Layers,
  Coins,
  Zap,
  BarChart3,
  Mic,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  UserCheck,
  Mail,
  Calendar,
} from "lucide-react";

interface VoiceOption {
  id: string;
  name: string;
  gender: string;
  locale: string;
}

interface VoiceMetric {
  provider: string;
  action_type: string;
  count: number;
  characters: number;
  audio_bytes: number;
}

interface VoiceLog {
  id: number;
  session_id: string;
  voice_id: string;
  provider: string;
  action_type: "tts" | "stt";
  characters: number;
  audio_bytes: number;
  created_at: string;
}

interface VoiceStats {
  total_requests: number;
  tts_requests: number;
  stt_requests: number;
  total_characters: number;
  total_audio_bytes: number;
  by_voice: Record<string, VoiceMetric>;
  recent_logs: VoiceLog[];
}

interface TokenLog {
  id: number;
  session_id: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  created_at: string;
}

interface ModelTokenMetric {
  total: number;
  prompt: number;
  completion: number;
  count: number;
  cost_usd: number;
}

interface TokenStats {
  total_tokens: number;
  prompt_tokens: number;
  completion_tokens: number;
  total_requests: number;
  estimated_cost_usd: number;
  by_model: Record<string, ModelTokenMetric>;
  recent_logs: TokenLog[];
}

interface SessionSummary {
  session_id: string;
  message_count: number;
  last_timestamp: string;
  first_prompt: string;
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
  persona?: string;
}

interface MessageDetail {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  created_at?: string | null;
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
  char_count?: number;
  word_count?: number;
  persona?: string;
}

interface ModelPreset {
  id: string;
  name: string;
  provider: string;
  badge: string;
}

interface StorageStats {
  storage_type: string;
  table_name?: string | null;
  total_sessions: number;
  total_messages: number;
}

interface LeadItem {
  id: number;
  session_id: string;
  name: string;
  email: string;
  notes: string;
  persona: string;
  created_at: string;
}

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    try {
      const token = sessionStorage.getItem("twin_admin_token");
      if (token) {
        setIsAuthenticated(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Active Tab: "sessions" | "models" | "tokens" | "voice" | "database" | "leads"
  const [activeTab, setActiveTab] = useState<"sessions" | "models" | "tokens" | "voice" | "database" | "leads">("sessions");
  const [mobileHistoryView, setMobileHistoryView] = useState<"sessions" | "messages">("sessions");

  // Leads State
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [leadSearchQuery, setLeadSearchQuery] = useState("");

  // Sessions State
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sessionMessages, setSessionMessages] = useState<MessageDetail[]>([]);
  const [selectedSessionTokens, setSelectedSessionTokens] = useState<{
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Storage Stats State
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);

  // Token Usage Stats State
  const [tokenStats, setTokenStats] = useState<TokenStats | null>(null);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);

  // Voice State
  const [defaultVoice, setDefaultVoice] = useState("en-US-ChristopherNeural");
  const [voiceList, setVoiceList] = useState<VoiceOption[]>([]);
  const [voiceStats, setVoiceStats] = useState<VoiceStats | null>(null);
  const [isUpdatingVoice, setIsUpdatingVoice] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [testVoiceText, setTestVoiceText] = useState("Hello! I am Makesh's AI Digital Twin. I can answer questions about his career and projects.");
  const [selectedVoiceForTest, setSelectedVoiceForTest] = useState<string>("");
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [audioPlayerRef, setAudioPlayerRef] = useState<HTMLAudioElement | null>(null);

  // Model & Provider State
  const [primaryModel, setPrimaryModel] = useState("qwen/qwen3.7-flash");
  const [fallbackModel, setFallbackModel] = useState("google/gemini-2.5-flash");
  const [presets, setPresets] = useState<ModelPreset[]>([]);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Persona State: "digital-twin" | "founder" | "ai-engineer"
  const [activePersona, setActivePersona] = useState<"digital-twin" | "founder" | "ai-engineer">("digital-twin");
  const [isUpdatingPersona, setIsUpdatingPersona] = useState(false);

  // Test Model State
  const [testPrompt, setTestPrompt] = useState("Introduce yourself as Makesh's Digital Twin in 10 words.");
  const [testResult, setTestResult] = useState<{
    status: "success" | "error";
    latency_ms: number;
    response?: string;
    error?: string;
  } | null>(null);
  const [isTestingModel, setIsTestingModel] = useState(false);

  const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

  // Helper for admin headers
  const getAuthHeaders = useCallback(() => {
    const token = typeof window !== "undefined" ? sessionStorage.getItem("twin_admin_token") || "" : "";
    return {
      "Content-Type": "application/json",
      "X-Admin-Password": token,
    };
  }, []);

  // Fetch full messages for a specific session
  const fetchSessionDetail = useCallback(async (sid: string) => {
    setSelectedSessionId(sid);
    setMobileHistoryView("messages");
    setIsLoadingMessages(true);
    try {
      const res = await fetch(`${API_URL}/admin/sessions/${encodeURIComponent(sid)}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setSessionMessages(data.messages || []);
        setSelectedSessionTokens({
          prompt_tokens: data.total_prompt_tokens ?? 0,
          completion_tokens: data.total_completion_tokens ?? 0,
          total_tokens: data.total_tokens ?? 0,
        });
      }
    } catch (err) {
      console.error("Failed to load session detail:", err);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [API_URL, getAuthHeaders]);

  // Fetch captured leads
  const fetchLeads = useCallback(async () => {
    setIsLoadingLeads(true);
    try {
      const res = await fetch(`${API_URL}/admin/leads`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error("Failed to load leads:", err);
    } finally {
      setIsLoadingLeads(false);
    }
  }, [API_URL, getAuthHeaders]);

  const handleDeleteLead = async (leadId: number) => {
    if (!confirm(`Are you sure you want to delete lead #${leadId}?`)) return;
    try {
      const res = await fetch(`${API_URL}/admin/leads/${leadId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== leadId));
        setActionSuccess(`Lead #${leadId} deleted successfully.`);
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  };

  const filteredLeads = useMemo(() => {
    if (!leadSearchQuery.trim()) return leads;
    const q = leadSearchQuery.toLowerCase();
    return leads.filter(
      (l) =>
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.notes && l.notes.toLowerCase().includes(q)) ||
        (l.persona && l.persona.toLowerCase().includes(q)) ||
        (l.session_id && l.session_id.toLowerCase().includes(q))
    );
  }, [leads, leadSearchQuery]);

  // Load initial sessions and configuration via effect
  const refreshAllData = useCallback(async () => {
    setIsLoadingSessions(true);
    try {
      const [sessRes, cfgRes, tokRes, voiceRes, leadsRes] = await Promise.all([
        fetch(`${API_URL}/admin/sessions`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/admin/config`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/admin/tokens`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/admin/voices`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/admin/leads`, { headers: getAuthHeaders() }),
      ]);

      if (sessRes.ok) {
        const sessData = await sessRes.json();
        setSessions(sessData.sessions || []);
        if (sessData.stats) setStorageStats(sessData.stats);
      } else if (sessRes.status === 401) {
        sessionStorage.removeItem("twin_admin_token");
        setIsAuthenticated(false);
      }

      if (cfgRes.ok) {
        const cfgData = await cfgRes.json();
        if (cfgData.active_models) {
          setPrimaryModel(cfgData.active_models.primary_model || "qwen/qwen3.7-flash");
          setFallbackModel(cfgData.active_models.fallback_model || "google/gemini-2.5-flash");
        }
        if (cfgData.active_persona) {
          const p = cfgData.active_persona;
          if (p === "founder" || p === "ai-engineer" || p === "digital-twin") {
            setActivePersona(p);
          }
        }
        if (cfgData.presets) setPresets(cfgData.presets);
        if (cfgData.storage) setStorageStats(cfgData.storage);
        if (cfgData.tokens) setTokenStats(cfgData.tokens);
        if (cfgData.default_voice) setDefaultVoice(cfgData.default_voice);
      }

      if (tokRes.ok) {
        const tokData = await tokRes.json();
        setTokenStats(tokData);
      }

      if (voiceRes.ok) {
        const voiceData = await voiceRes.json();
        if (voiceData.default_voice) setDefaultVoice(voiceData.default_voice);
        if (voiceData.voices) setVoiceList(voiceData.voices);
        if (voiceData.stats) setVoiceStats(voiceData.stats);
      }

      if (leadsRes && leadsRes.ok) {
        const leadsData = await leadsRes.json();
        setLeads(leadsData.leads || []);
      }
    } catch (err) {
      console.error("Failed to refresh admin data:", err);
    } finally {
      setIsLoadingSessions(false);
    }
  }, [API_URL, getAuthHeaders]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;

    async function initialLoad() {
      try {
        const [sessRes, cfgRes, tokRes, voiceRes, leadsRes] = await Promise.all([
          fetch(`${API_URL}/admin/sessions`, { headers: getAuthHeaders() }),
          fetch(`${API_URL}/admin/config`, { headers: getAuthHeaders() }),
          fetch(`${API_URL}/admin/tokens`, { headers: getAuthHeaders() }),
          fetch(`${API_URL}/admin/voices`, { headers: getAuthHeaders() }),
          fetch(`${API_URL}/admin/leads`, { headers: getAuthHeaders() }),
        ]);

        if (sessRes.ok && isMounted) {
          const sessData = await sessRes.json();
          setSessions(sessData.sessions || []);
          if (sessData.stats) setStorageStats(sessData.stats);
        } else if (sessRes.status === 401 && isMounted) {
          sessionStorage.removeItem("twin_admin_token");
          setIsAuthenticated(false);
        }

        if (cfgRes.ok && isMounted) {
          const cfgData = await cfgRes.json();
          if (cfgData.active_models) {
            setPrimaryModel(cfgData.active_models.primary_model || "qwen/qwen3.7-flash");
            setFallbackModel(cfgData.active_models.fallback_model || "google/gemini-2.5-flash");
          }
          if (cfgData.active_persona) {
            const p = cfgData.active_persona;
            if (p === "founder" || p === "ai-engineer" || p === "digital-twin") {
              setActivePersona(p);
            }
          }
          if (cfgData.presets) setPresets(cfgData.presets);
          if (cfgData.storage) setStorageStats(cfgData.storage);
          if (cfgData.tokens) setTokenStats(cfgData.tokens);
          if (cfgData.default_voice) setDefaultVoice(cfgData.default_voice);
        }

        if (tokRes.ok && isMounted) {
          const tokData = await tokRes.json();
          setTokenStats(tokData);
        }

        if (voiceRes.ok && isMounted) {
          const voiceData = await voiceRes.json();
          if (voiceData.default_voice) setDefaultVoice(voiceData.default_voice);
          if (voiceData.voices) setVoiceList(voiceData.voices);
          if (voiceData.stats) setVoiceStats(voiceData.stats);
        }

        if (leadsRes && leadsRes.ok && isMounted) {
          const leadsData = await leadsRes.json();
          setLeads(leadsData.leads || []);
        }
      } catch (err) {
        console.error("Failed to load initial admin data:", err);
      }
    }

    initialLoad();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, API_URL, getAuthHeaders]);

  // Set active default voice
  const handleSelectDefaultVoice = async (voiceId: string) => {
    setIsUpdatingVoice(true);
    try {
      const res = await fetch(`${API_URL}/admin/voices/default`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ voice_id: voiceId }),
      });
      if (res.ok) {
        setDefaultVoice(voiceId);
        setActionSuccess(`Active default voice switched to ${voiceId}`);
        refreshAllData();
      }
    } catch (err) {
      console.error("Failed to update default voice:", err);
    } finally {
      setIsUpdatingVoice(false);
    }
  };

  // Preview / play voice sample
  const handlePreviewVoice = async (voiceId: string, customText?: string) => {
    if (playingVoiceId === voiceId && audioPlayerRef) {
      audioPlayerRef.pause();
      setPlayingVoiceId(null);
      return;
    }

    setPlayingVoiceId(voiceId);
    setIsTestingVoice(true);
    try {
      const res = await fetch(`${API_URL}/admin/voices/test`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          voice_id: voiceId,
          text: customText || testVoiceText,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.audio_base64) {
          const audio = new Audio(`data:audio/mp3;base64,${data.audio_base64}`);
          setAudioPlayerRef(audio);
          audio.onended = () => {
            setPlayingVoiceId(null);
          };
          audio.onerror = () => {
            setPlayingVoiceId(null);
          };
          await audio.play();
        }
      } else {
        setPlayingVoiceId(null);
      }
    } catch (err) {
      console.error("Failed to preview voice:", err);
      setPlayingVoiceId(null);
    } finally {
      setIsTestingVoice(false);
    }
  };

  // Reset voice usage ledger
  const handleResetVoiceUsage = async () => {
    if (!confirm("Are you sure you want to reset all voice and audio usage records? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API_URL}/admin/voices/usage`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setActionSuccess("Voice & Audio usage metrics successfully reset.");
        refreshAllData();
      }
    } catch (err) {
      console.error("Failed to reset voice usage:", err);
    }
  };

  // Reset all token metrics
  const handleResetTokens = async () => {
    if (!confirm("Are you sure you want to reset all token usage records? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API_URL}/admin/tokens`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setActionSuccess("Token usage metrics successfully reset.");
        refreshAllData();
      }
    } catch (err) {
      console.error("Failed to reset tokens:", err);
    }
  };

  // Handle Login Submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsAuthenticating(true);
    setAuthError("");

    try {
      const res = await fetch(`${API_URL}/admin/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      if (res.ok) {
        sessionStorage.setItem("twin_admin_token", password.trim());
        setIsAuthenticated(true);
        setPassword("");
      } else {
        setAuthError("Invalid administrator password. Access denied.");
      }
    } catch {
      setAuthError("Failed to connect to backend server. Ensure backend is running on 127.0.0.1:8000.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem("twin_admin_token");
    setIsAuthenticated(false);
    setSelectedSessionId(null);
    setSessionMessages([]);
    setSelectedSessionTokens(null);
  };

  // Delete a specific session
  const handleDeleteSession = async (sid: string) => {
    if (!confirm(`Are you sure you want to delete session "${sid}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/sessions/${encodeURIComponent(sid)}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.session_id !== sid));
        if (selectedSessionId === sid) {
          setSelectedSessionId(null);
          setSessionMessages([]);
          setSelectedSessionTokens(null);
        }
        setActionSuccess(`Session "${sid}" successfully deleted.`);
        setTimeout(() => setActionSuccess(null), 3500);
      }
    } catch {
      alert("Failed to delete session.");
    }
  };

  // Delete an individual message
  const handleDeleteMessage = async (msgId: number) => {
    if (!confirm("Delete this single message?")) return;

    try {
      const res = await fetch(`${API_URL}/admin/messages/${msgId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        setSessionMessages((prev) => prev.filter((m) => m.id !== msgId));
        setActionSuccess("Message deleted.");
        setTimeout(() => setActionSuccess(null), 2500);
      }
    } catch {
      alert("Failed to delete message.");
    }
  };

  // Clear all sessions across database
  const handleClearAllHistory = async () => {
    const confirmation = prompt('Type "DELETE ALL" to permanently wipe all stored chat history across all sessions:');
    if (confirmation !== "DELETE ALL") {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/sessions`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        setSessions([]);
        setSelectedSessionId(null);
        setSessionMessages([]);
        setSelectedSessionTokens(null);
        setActionSuccess("All chat histories have been wiped clean.");
        setTimeout(() => setActionSuccess(null), 4000);
        refreshAllData();
      }
    } catch {
      alert("Failed to clear chat history.");
    }
  };

  // Switch active persona (digital-twin vs founder vs ai-engineer)
  const handlePersonaChange = async (newPersona: "digital-twin" | "founder" | "ai-engineer") => {
    setIsUpdatingPersona(true);
    try {
      const res = await fetch(`${API_URL}/admin/persona`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ persona: newPersona }),
      });
      if (res.ok) {
        const data = await res.json();
        const updated = (data.active_persona || newPersona) as "digital-twin" | "founder" | "ai-engineer";
        setActivePersona(updated);
        try {
          localStorage.setItem("twin_active_persona", updated);
          window.dispatchEvent(new CustomEvent("twin_persona_change", { detail: updated }));
        } catch {
          // ignore
        }
        const personaLabels: Record<string, string> = {
          "ai-engineer": "AI Engineer (Technical specifications loaded from data/AI-Engineer)",
          "founder": "Founder (Strategic roadmap loaded from data/founder)",
          "digital-twin": "Digital Twin (Career profile loaded from data/digital-twin)",
        };
        setActionSuccess(`Persona switched to ${personaLabels[updated] || updated}`);
        setTimeout(() => setActionSuccess(null), 4000);
      } else {
        alert("Failed to update active persona.");
      }
    } catch {
      alert("Connection error while updating persona.");
    } finally {
      setIsUpdatingPersona(false);
    }
  };

  // Save Model Configuration
  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    try {
      const res = await fetch(`${API_URL}/admin/config`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          primary_model: primaryModel.trim(),
          fallback_model: fallbackModel.trim(),
          active_persona: activePersona,
        }),
      });

      if (res.ok) {
        try {
          localStorage.setItem("twin_active_persona", activePersona);
          window.dispatchEvent(new CustomEvent("twin_persona_change", { detail: activePersona }));
        } catch {
          // ignore
        }
        setActionSuccess(`Model & persona configuration saved! Persona: ${activePersona}`);
        setTimeout(() => setActionSuccess(null), 4000);
      } else {
        alert("Failed to save model configuration.");
      }
    } catch {
      alert("Connection error while saving configuration.");
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Test Model in Real-Time
  const handleTestModel = async (modelToTest: string) => {
    setIsTestingModel(true);
    setTestResult(null);

    try {
      const res = await fetch(`${API_URL}/admin/test-model`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          model: modelToTest,
          prompt: testPrompt,
        }),
      });

      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({
        status: "error",
        latency_ms: 0,
        error: String(err),
      });
    } finally {
      setIsTestingModel(false);
    }
  };

  // Filtered session list based on search query
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter(
      (s) =>
        s.session_id.toLowerCase().includes(q) ||
        (s.first_prompt && s.first_prompt.toLowerCase().includes(q))
    );
  }, [sessions, searchQuery]);

  // =========================================================================
  // Screen 0: Hydration Gate (Guarantees identical SSR and initial client DOM)
  // =========================================================================
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1224] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 animate-pulse">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-xs text-gray-400 font-mono tracking-wide">Loading Twin Console...</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Screen 1: Password Login Protection Gate
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#0d1224] text-white">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md p-8 rounded-3xl border border-gray-800 bg-gray-900/80 backdrop-blur-2xl shadow-2xl relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/30 mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Console</h1>
            <p className="text-sm text-gray-400 mt-1">
              Makeshkumar&apos;s Digital Twin Architecture
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-password-input" className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                Administrator Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  id="admin-password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password..."
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-700 bg-gray-800/80 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating || !password.trim()}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 to-pink-500 text-white hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20 cursor-pointer"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" /> Unlock Console
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
            </Link>
            <span className="text-[11px] text-gray-400">Protected Endpoint</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Screen 2: Authenticated Full Admin Dashboard
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#0d1224] text-gray-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-gray-800/90 bg-[#0d1224]/90 backdrop-blur-xl px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-violet-500/30 shrink-0">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-bold text-xs sm:text-base text-white tracking-tight truncate">
                Twin Admin Console
              </h1>
              <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Control
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-gray-400 truncate hidden md:block">
              Storage: {storageStats?.storage_type || "PostgreSQL (Neon)"} • Primary: {primaryModel} • Persona: <span className="text-violet-400 font-semibold uppercase">{activePersona}</span> • Tokens: {tokenStats?.total_tokens ? tokenStats.total_tokens.toLocaleString() : "0"}
            </p>
            <p className="text-[10px] text-gray-400 truncate md:hidden">
              <span className="text-violet-400 font-semibold uppercase">{activePersona}</span> • <span className="text-pink-400">{primaryModel.split("/")[1] || primaryModel}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Persona Switcher Dropdown (Design System Custom Dropdown) */}
          <PersonaDropdown
            activePersona={activePersona}
            onSelect={handlePersonaChange}
            isUpdating={isUpdatingPersona}
            variant="navbar"
          />

          <Link
            href="/"
            target="_blank"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-xs font-medium text-gray-300 hover:text-white transition-colors"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-red-900/40 bg-red-950/20 hover:bg-red-900/40 text-xs font-medium text-red-400 transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[96rem] w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col gap-5 sm:gap-6">
        {/* Success Alert Banner */}
        {actionSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-300 text-xs sm:text-sm flex items-center justify-between animate-slide-up">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              {actionSuccess}
            </span>
            <button
              onClick={() => setActionSuccess(null)}
              className="text-emerald-400 hover:text-emerald-200 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Navigation Tabs (Responsive swipeable track on mobile/tablet) */}
        <div className="overflow-x-auto pb-1.5 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-none border-b border-gray-800/80">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
            <button
              onClick={() => setActiveTab("sessions")}
              className={`shrink-0 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${activeTab === "sessions"
                ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-md shadow-violet-500/20"
                : "bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white"
                }`}
            >
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>
                <span className="hidden sm:inline">Chat Histories</span>
                <span className="sm:hidden">History</span> ({sessions.length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab("models")}
              className={`shrink-0 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${activeTab === "models"
                ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-md shadow-violet-500/20"
                : "bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white"
                }`}
            >
              <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>
                <span className="hidden md:inline">Model & Provider Switcher</span>
                <span className="md:hidden">Models</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab("tokens")}
              className={`shrink-0 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${activeTab === "tokens"
                ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-md shadow-violet-500/20"
                : "bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white"
                }`}
            >
              <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>
                <span className="hidden md:inline">Token Usage & Costs</span>
                <span className="md:hidden">Tokens</span>
              </span>
              {tokenStats && tokenStats.total_tokens > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-950/80 border border-violet-800/80 text-violet-300 font-mono">
                  {tokenStats.total_tokens > 1000 ? `${(tokenStats.total_tokens / 1000).toFixed(1)}k` : tokenStats.total_tokens}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("voice")}
              className={`shrink-0 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${activeTab === "voice"
                ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-md shadow-violet-500/20"
                : "bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white"
                }`}
            >
              <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>
                <span className="hidden md:inline">Voice Models & Audio</span>
                <span className="md:hidden">Voice</span>
              </span>
              {voiceStats && voiceStats.total_requests > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-950/80 border border-violet-800/80 text-violet-300 font-mono">
                  {voiceStats.total_requests}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("database")}
              className={`shrink-0 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${activeTab === "database"
                ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-md shadow-violet-500/20"
                : "bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white"
                }`}
            >
              <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>
                <span className="hidden md:inline">Database & Health</span>
                <span className="md:hidden">Database</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab("leads")}
              className={`shrink-0 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${activeTab === "leads"
                ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-md shadow-violet-500/20"
                : "bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white"
                }`}
            >
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>
                <span className="hidden sm:inline">Captured Leads</span>
                <span className="sm:hidden">Leads</span>
              </span>
              {leads.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 font-mono">
                  {leads.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: Chat Histories (Watch & Delete) */}
        {/* =================================================================== */}
        {activeTab === "sessions" && (
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Top Stat Cards (2x2 on mobile, 4 on desktop) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md">
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase font-semibold">Total Sessions</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-0.5 sm:mt-1">{storageStats?.total_sessions ?? sessions.length}</p>
                <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5 sm:mt-1">Unique visitor threads</p>
              </div>

              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md">
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase font-semibold">Total Messages</p>
                <p className="text-xl sm:text-2xl font-bold text-violet-400 mt-0.5 sm:mt-1">{storageStats?.total_messages ?? 0}</p>
                <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5 sm:mt-1">User & AI turns logged</p>
              </div>

              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md">
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase font-semibold">Storage Engine</p>
                <p className="text-sm sm:text-lg font-bold text-emerald-400 mt-0.5 sm:mt-1 truncate">
                  {storageStats?.storage_type || "PostgreSQL (Neon)"}
                </p>
                <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5 sm:mt-1 truncate">
                  Table: <code className="text-gray-300">twin_chat_history</code>
                </p>
              </div>

              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md">
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase font-semibold">Primary Model</p>
                <p className="text-xs sm:text-base font-bold text-pink-400 mt-0.5 sm:mt-1 truncate">{primaryModel}</p>
                <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5 sm:mt-1 truncate">Fallback: {fallbackModel}</p>
              </div>
            </div>

            {/* Mobile / Tablet View Switcher (Visible on < lg) */}
            <div className="flex lg:hidden items-center justify-between bg-gray-900/80 p-1 rounded-xl border border-gray-800 text-xs">
              <button
                type="button"
                onClick={() => setMobileHistoryView("sessions")}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all cursor-pointer ${mobileHistoryView === "sessions"
                  ? "bg-violet-600 text-white shadow-sm font-semibold"
                  : "text-gray-400 hover:text-white"
                  }`}
              >
                Sessions ({filteredSessions.length})
              </button>
              <button
                type="button"
                onClick={() => setMobileHistoryView("messages")}
                disabled={!selectedSessionId}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${mobileHistoryView === "messages"
                  ? "bg-violet-600 text-white shadow-sm font-semibold"
                  : "text-gray-400 hover:text-white"
                  }`}
              >
                Dialogue {selectedSessionId ? `(${sessionMessages.length})` : "(None)"}
              </button>
            </div>

            {/* Split Screen: Sessions on Left, Messages on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 min-h-[500px] lg:min-h-[600px]">
              {/* Left Column: Session List */}
              <div className={`lg:col-span-5 flex-col rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md overflow-hidden ${mobileHistoryView === "sessions" ? "flex" : "hidden lg:flex"
                }`}>
                {/* Search & Actions Bar */}
                <div className="p-3 sm:p-3.5 border-b border-gray-800 flex items-center justify-between gap-2 bg-gray-900/80">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search session ID or question..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </div>

                  <button
                    onClick={refreshAllData}
                    className="p-2 rounded-lg border border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors cursor-pointer"
                    title="Refresh Sessions"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSessions ? "animate-spin" : ""}`} />
                  </button>

                  <button
                    onClick={handleClearAllHistory}
                    disabled={sessions.length === 0}
                    className="p-2 rounded-lg border border-red-900/50 bg-red-950/20 hover:bg-red-900/40 text-red-400 transition-colors disabled:opacity-40 cursor-pointer"
                    title="Wipe All History"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Session Card List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[420px] sm:max-h-[520px] lg:max-h-[650px]">
                  {filteredSessions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-xs">
                      {sessions.length === 0 ? "No chat history stored yet." : "No sessions match your search."}
                    </div>
                  ) : (
                    filteredSessions.map((s) => {
                      const isSelected = selectedSessionId === s.session_id;
                      return (
                        <div
                          key={s.session_id}
                          onClick={() => fetchSessionDetail(s.session_id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${isSelected
                            ? "border-violet-500/80 bg-violet-950/30 shadow-md shadow-violet-500/10"
                            : "border-gray-800/80 bg-gray-800/30 hover:bg-gray-800/60 hover:border-gray-700"
                            }`}
                        >
                          <div className="flex items-center justify-between gap-1.5 flex-wrap">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="font-mono text-xs font-semibold text-gray-200 truncate max-w-[130px] sm:max-w-[180px]" title={s.session_id}>
                                {s.session_id}
                              </span>
                              {/* Persona Badge */}
                              {(() => {
                                const p = s.persona || "digital-twin";
                                if (p === "ai-engineer") {
                                  return (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 flex items-center gap-1 tracking-wider uppercase shrink-0">
                                      <Cpu className="w-2.5 h-2.5 text-emerald-400" /> AI-ENGINEER
                                    </span>
                                  );
                                }
                                if (p === "founder") {
                                  return (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-950/80 text-pink-400 border border-pink-800/80 flex items-center gap-1 tracking-wider uppercase shrink-0">
                                      <Sparkles className="w-2.5 h-2.5 text-pink-400" /> FOUNDER
                                    </span>
                                  );
                                }
                                return (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-950/80 text-violet-300 border border-violet-800/80 flex items-center gap-1 tracking-wider uppercase shrink-0">
                                    <Bot className="w-2.5 h-2.5 text-violet-400" /> TWIN
                                  </span>
                                );
                              })()}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-800 text-violet-300 border border-violet-900/40">
                                {s.message_count} msgs
                              </span>
                              {((s.total_tokens ?? 0) > 0) && (
                                <span
                                  className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/40 text-amber-300 border border-amber-900/40 flex items-center gap-1"
                                  title={`Input/Prompt: ${(s.prompt_tokens ?? 0).toLocaleString()} tokens • Output/Completion: ${(s.completion_tokens ?? 0).toLocaleString()} tokens`}
                                >
                                  <Zap className="w-2.5 h-2.5 text-amber-400" />
                                  {(s.total_tokens ?? 0).toLocaleString()} tok
                                </span>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSession(s.session_id);
                                }}
                                className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                                title="Delete this session"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                            {s.first_prompt || "(No prompt preview available)"}
                          </p>

                          <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-800/50">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {s.last_timestamp || "Recently"}
                            </span>
                            {((s.prompt_tokens ?? 0) > 0 || (s.completion_tokens ?? 0) > 0) && (
                              <span className="font-mono text-[9px] text-gray-400 flex items-center gap-1">
                                <span>📥 {(s.prompt_tokens ?? 0).toLocaleString()} in</span>
                                <span>•</span>
                                <span>📤 {(s.completion_tokens ?? 0).toLocaleString()} out</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Full Dialogue Thread */}
              <div className={`lg:col-span-7 flex-col rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md overflow-hidden ${mobileHistoryView === "messages" ? "flex" : "hidden lg:flex"
                }`}>
                {selectedSessionId ? (
                  <>
                    {/* Header */}
                    <div className="p-3.5 sm:p-4 border-b border-gray-800 bg-gray-900/90 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setMobileHistoryView("sessions")}
                          className="lg:hidden p-1.5 rounded-lg border border-gray-700 bg-gray-800/80 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors cursor-pointer shrink-0"
                          title="Back to Session Threads"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xs sm:text-sm font-bold text-white font-mono truncate max-w-[130px] sm:max-w-none">{selectedSessionId}</h3>
                            {/* Selected Session Persona Badge */}
                            {(() => {
                              const activeSessionObj = sessions.find((s) => s.session_id === selectedSessionId);
                              const p = activeSessionObj?.persona || sessionMessages.find((m) => m.role === "assistant" && m.persona)?.persona || "digital-twin";
                              if (p === "ai-engineer") {
                                return (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 flex items-center gap-1 tracking-wider uppercase shadow-sm">
                                    <Cpu className="w-3 h-3 text-emerald-400" /> AI-ENGINEER
                                  </span>
                                );
                              }
                              if (p === "founder") {
                                return (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-950/80 text-pink-400 border border-pink-800/80 flex items-center gap-1 tracking-wider uppercase shadow-sm">
                                    <Sparkles className="w-3 h-3 text-pink-400" /> FOUNDER
                                  </span>
                                );
                              }
                              return (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-950/80 text-violet-300 border border-violet-800/80 flex items-center gap-1 tracking-wider uppercase shadow-sm">
                                  <Bot className="w-3 h-3 text-violet-400" /> TWIN
                                </span>
                              );
                            })()}
                            <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-medium">
                              {sessionMessages.length} msgs
                            </span>
                            {selectedSessionTokens && selectedSessionTokens.total_tokens > 0 && (
                              <span className="text-[10px] sm:text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-violet-950/70 border border-violet-800/60 text-violet-300 flex items-center gap-1.5 shadow-sm">
                                <Zap className="w-3 h-3 text-amber-400" />
                                <span className="font-semibold">{selectedSessionTokens.total_tokens.toLocaleString()} tok</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5">Inspect dialogue and real-time token consumption</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteSession(selectedSessionId)}
                        className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-red-900/50 bg-red-950/30 hover:bg-red-900/50 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Delete Session</span>
                        <span className="sm:hidden">Delete</span>
                      </button>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 max-h-[420px] sm:max-h-[520px] lg:max-h-[650px]">
                      {isLoadingMessages ? (
                        <div className="p-12 text-center text-gray-400 text-xs flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin text-violet-400" /> Loading dialogue thread...
                        </div>
                      ) : sessionMessages.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 text-xs">
                          No messages found in this session.
                        </div>
                      ) : (
                        sessionMessages.map((msg) => {
                          const textChars = msg.content?.length || 0;
                          // Token estimation according to text length (~3.8 characters per token)
                          const estimatedTokens = Math.max(1, Math.round(textChars / 3.8));
                          const isUser = msg.role === "user";

                          // Input (prompt) tokens:
                          const inputTokens = isUser
                            ? (msg.prompt_tokens && msg.prompt_tokens > 0 ? msg.prompt_tokens : estimatedTokens)
                            : (msg.prompt_tokens || 0);

                          // Output (completion) tokens:
                          const outputTokens = isUser
                            ? 0
                            : (msg.completion_tokens && msg.completion_tokens > 0 ? msg.completion_tokens : estimatedTokens);

                          // Total tokens:
                          const totalTokens = msg.total_tokens && msg.total_tokens > 0
                            ? msg.total_tokens
                            : (isUser ? inputTokens : (inputTokens > 0 ? inputTokens + outputTokens : outputTokens));

                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"
                                }`}
                            >
                              <div className="flex items-center gap-2 text-[10px] text-gray-400 px-1 flex-wrap">
                                <span className="font-semibold uppercase flex items-center gap-1">
                                  {isUser ? (
                                    <>
                                      <User className="w-3 h-3 text-pink-400" /> VISITOR
                                    </>
                                  ) : (
                                    (() => {
                                      const p = msg.persona || sessions.find((s) => s.session_id === selectedSessionId)?.persona || "digital-twin";
                                      if (p === "ai-engineer") {
                                        return (
                                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                                            <Cpu className="w-3 h-3 text-emerald-400" /> AI-ENGINEER
                                          </span>
                                        );
                                      }
                                      if (p === "founder") {
                                        return (
                                          <span className="inline-flex items-center gap-1 text-pink-400 font-bold">
                                            <Sparkles className="w-3 h-3 text-pink-400" /> FOUNDER
                                          </span>
                                        );
                                      }
                                      return (
                                        <span className="inline-flex items-center gap-1 text-violet-400 font-bold">
                                          <Bot className="w-3 h-3 text-violet-400" /> TWIN
                                        </span>
                                      );
                                    })()
                                  )}
                                </span>
                                <span>•</span>
                                <span>{msg.timestamp}</span>
                                <span>•</span>
                                {isUser ? (
                                  <span
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-950/60 text-pink-300 border border-pink-800/50 font-mono text-[10px]"
                                    title={`Input tokens calculated according to text (${textChars} characters, ~3.8 chars/tok)`}
                                  >
                                    📥 ~{inputTokens.toLocaleString()} input tokens
                                  </span>
                                ) : (
                                  <span
                                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-violet-950/70 text-violet-300 border border-violet-800/60 font-mono text-[10px]"
                                    title={`Output tokens: ${outputTokens.toLocaleString()} • Input context: ${inputTokens.toLocaleString()} • Total: ${totalTokens.toLocaleString()}`}
                                  >
                                    <Zap className="w-2.5 h-2.5 text-amber-400" />
                                    {inputTokens > 0 ? (
                                      <span>
                                        📥 {inputTokens.toLocaleString()} in • 📤 {outputTokens.toLocaleString()} out ({totalTokens.toLocaleString()} tok)
                                      </span>
                                    ) : (
                                      <span>
                                        📤 ~{outputTokens.toLocaleString()} output tokens ({textChars} chars)
                                      </span>
                                    )}
                                  </span>
                                )}
                              </div>

                              <div
                                className={`group relative max-w-[85%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${isUser
                                  ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-br-none shadow-md shadow-violet-500/10"
                                  : "bg-gray-800/90 text-gray-200 rounded-bl-none border border-gray-700/60"
                                  }`}
                              >
                                <p className="whitespace-pre-wrap break-words">{msg.content}</p>

                                {/* Token consumption breakdown according to text */}
                                <div
                                  className={`mt-2 pt-1.5 border-t text-[10px] font-mono flex items-center justify-between ${isUser ? "border-white/20 text-white/80" : "border-gray-700/60 text-gray-400"
                                    }`}
                                >
                                  <span className="flex items-center gap-1">
                                    {isUser ? (
                                      <span>Input: ~{inputTokens.toLocaleString()} tokens</span>
                                    ) : inputTokens > 0 ? (
                                      <span>Prompt: {inputTokens.toLocaleString()} in • Response: {outputTokens.toLocaleString()} out</span>
                                    ) : (
                                      <span>Output: ~{outputTokens.toLocaleString()} tokens</span>
                                    )}
                                  </span>
                                  <span className="opacity-75">
                                    {textChars.toLocaleString()} characters ({Math.max(1, Math.round(textChars / 3.8))} text-tokens)
                                  </span>
                                </div>

                                {/* Delete single message button */}
                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded bg-black/40 hover:bg-red-600 text-gray-300 hover:text-white transition-all cursor-pointer"
                                  title="Delete this message"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 text-gray-700 mb-3" />
                    <p className="text-sm font-semibold text-gray-400">No session selected</p>
                    <p className="text-xs text-gray-600 mt-1 max-w-sm">
                      Select a conversation session from the left list to inspect visitor questions, answers, and timestamps.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: Model & Provider Switcher */}
        {/* =================================================================== */}
        {activeTab === "models" && (
          <div className="flex flex-col gap-6 max-w-5xl">
            {/* Active Persona Mode Selector Card */}
            <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/30 via-gray-900/60 to-pink-950/20 backdrop-blur-md p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-violet-400" />
                    <h3 className="text-base font-bold text-white">Active Chatbot Persona Mode</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-600 text-white uppercase tracking-wider">
                      {activePersona}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Select the active persona. The chatbot dynamically grounds its responses using the files in the corresponding data directory.
                  </p>
                </div>

                {/* Dropdown Control with Design System */}
                <PersonaDropdown
                  activePersona={activePersona}
                  onSelect={handlePersonaChange}
                  isUpdating={isUpdatingPersona}
                  variant="inline"
                />
              </div>

              {/* Persona Cards Visual Indicator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-5">
                {/* Card 1: Digital Twin */}
                <div
                  onClick={() => handlePersonaChange("digital-twin")}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${activePersona === "digital-twin"
                    ? "border-violet-500 bg-violet-950/40 shadow-lg shadow-violet-500/20 ring-1 ring-violet-500/40"
                    : "border-gray-800 bg-gray-800/40 hover:bg-gray-800/80 hover:border-gray-700"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">digital-twin</span>
                      <span className="text-[10px] text-gray-400 px-1.5 py-0.5 rounded bg-gray-800">Default</span>
                    </div>
                    {activePersona === "digital-twin" ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-600 text-white flex items-center gap-1">
                        <Check className="w-3 h-3" /> ACTIVE
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-500 hover:text-gray-300">Click to select</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 mt-2">
                    Answers career, experience, skills, education, and portfolio inquiries as Makeshkumar&apos;s AI twin.
                  </p>
                  <div className="mt-3 pt-2 border-t border-gray-800/70 font-mono text-[11px] text-violet-400 flex items-center gap-1.5">
                    <span>📁 Data folder:</span>
                    <span className="bg-violet-950/60 px-1.5 py-0.5 rounded text-violet-300">data/digital-twin</span>
                  </div>
                </div>

                {/* Card 2: Founder */}
                <div
                  onClick={() => handlePersonaChange("founder")}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${activePersona === "founder"
                    ? "border-pink-500 bg-pink-950/40 shadow-lg shadow-pink-500/20 ring-1 ring-pink-500/40"
                    : "border-gray-800 bg-gray-800/40 hover:bg-gray-800/80 hover:border-gray-700"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">founder</span>
                      <span className="text-[10px] text-pink-400 px-1.5 py-0.5 rounded bg-pink-950/60 border border-pink-800/50">Strategic</span>
                    </div>
                    {activePersona === "founder" ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-600 text-white flex items-center gap-1">
                        <Check className="w-3 h-3" /> ACTIVE
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-500 hover:text-gray-300">Click to select</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 mt-2">
                    Operates as the executive Founder agent: communicates startup vision, architectural strategy, market opportunities, and captures partner/investor leads.
                  </p>
                  <div className="mt-3 pt-2 border-t border-gray-800/70 font-mono text-[11px] text-pink-400 flex items-center gap-1.5">
                    <span>📁 Data folder:</span>
                    <span className="bg-pink-950/60 px-1.5 py-0.5 rounded text-pink-300">data/founder</span>
                  </div>
                </div>

                {/* Card 3: AI Engineer */}
                <div
                  onClick={() => handlePersonaChange("ai-engineer")}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${activePersona === "ai-engineer"
                    ? "border-emerald-500 bg-emerald-950/40 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-500/40"
                    : "border-gray-800 bg-gray-800/40 hover:bg-gray-800/80 hover:border-gray-700"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">ai-engineer</span>
                      <span className="text-[10px] text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/50">Technical</span>
                    </div>
                    {activePersona === "ai-engineer" ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white flex items-center gap-1">
                        <Check className="w-3 h-3" /> ACTIVE
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-500 hover:text-gray-300">Click to select</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 mt-2">
                    Operates as a senior AI Engineer: communicates RAG pipelines, multi-agent architectures (LangGraph/CrewAI), MCP integrations, FastAPI backends, and MLOps evaluation.
                  </p>
                  <div className="mt-3 pt-2 border-t border-gray-800/70 font-mono text-[11px] text-emerald-400 flex items-center gap-1.5">
                    <span>📁 Data folder:</span>
                    <span className="bg-emerald-950/60 px-1.5 py-0.5 rounded text-emerald-300">data/AI-Engineer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Presets Grid */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-violet-400" /> One-Click Model Presets
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Click any model below to instantly select it as your primary engine.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {presets.map((preset) => {
                  const isCurrent = primaryModel === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setPrimaryModel(preset.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${isCurrent
                        ? "border-violet-500 bg-violet-950/40 shadow-lg shadow-violet-500/20"
                        : "border-gray-800 bg-gray-800/40 hover:bg-gray-800/80 hover:border-gray-700"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-white">{preset.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-600 text-white">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[11px] text-gray-400 truncate">{preset.id}</p>
                      <div className="flex items-center justify-between text-[10px] text-gray-500 pt-2 border-t border-gray-800/50">
                        <span>{preset.provider}</span>
                        <span className="text-pink-400 font-medium">{preset.badge}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Input & Failover Setup */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md p-6 space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-pink-400" /> Active Model & Failover Architecture
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="primary-model-input" className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                    Primary Model ID
                  </label>
                  <input
                    id="primary-model-input"
                    type="text"
                    value={primaryModel}
                    onChange={(e) => setPrimaryModel(e.target.value)}
                    placeholder="e.g. qwen/qwen3.7-flash"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    First choice used for answering all digital twin inquiries.
                  </p>
                </div>

                <div>
                  <label htmlFor="fallback-model-input" className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                    Fallback Gemini Model ID
                  </label>
                  <input
                    id="fallback-model-input"
                    type="text"
                    value={fallbackModel}
                    onChange={(e) => setFallbackModel(e.target.value)}
                    placeholder="e.g. google/gemini-2.5-flash"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Automatically triggered if primary model exceeds tokens, rate limits, or quota.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  onClick={handleSaveConfig}
                  disabled={isSavingConfig}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold text-xs sm:text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-violet-500/20 cursor-pointer"
                >
                  {isSavingConfig ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Save Model Configuration
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Live Model Testing Sandbox */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-400" /> Live Model Testing Sandbox
              </h3>
              <p className="text-xs text-gray-400">
                Send a live prompt to test the latency and output of the currently selected primary model.
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  placeholder="Enter test prompt..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <button
                  onClick={() => handleTestModel(primaryModel)}
                  disabled={isTestingModel || !testPrompt.trim()}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isTestingModel ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Testing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" /> Ping {primaryModel.split("/").pop()}
                    </>
                  )}
                </button>
              </div>

              {testResult && (
                <div
                  className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 animate-slide-up ${testResult.status === "success"
                    ? "bg-emerald-950/30 border-emerald-800 text-emerald-200"
                    : "bg-red-950/30 border-red-800 text-red-200"
                    }`}
                >
                  <div className="flex items-center justify-between font-semibold text-xs">
                    <span>
                      {testResult.status === "success" ? "✓ Successful Response" : "✗ Error"}
                    </span>
                    <span>Latency: {testResult.latency_ms} ms</span>
                  </div>
                  <p className="text-gray-300 font-mono text-xs leading-relaxed">
                    {testResult.response || testResult.error}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: Token Usage & Cost Analytics */}
        {/* =================================================================== */}
        {activeTab === "tokens" && (
          <div className="flex flex-col gap-6">
            {/* Top Overview & Action Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-400" /> Token Usage & Cost Analytics
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Track real-time prompt, completion, and total tokens consumed across all sessions and models.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={refreshAllData}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-700 bg-gray-800/60 hover:bg-gray-800 text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={handleResetTokens}
                  className="px-3.5 py-1.5 rounded-xl border border-red-900/40 bg-red-950/20 hover:bg-red-900/40 text-xs font-semibold text-red-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Ledger</span>
                </button>
              </div>
            </div>

            {/* 4 KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {/* Total Tokens */}
              <div className="p-3.5 sm:p-5 rounded-2xl border border-gray-800 bg-gray-900/50 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between text-gray-400 text-xs font-medium mb-2 sm:mb-3">
                  <span className="truncate">Total Tokens</span>
                  <Zap className="w-4 h-4 text-violet-400 shrink-0" />
                </div>
                <div className="text-xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                  {tokenStats?.total_tokens ? tokenStats.total_tokens.toLocaleString() : "0"}
                </div>
                <div className="text-[10px] sm:text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                  <span>Across</span>
                  <span className="text-violet-400 font-semibold">{tokenStats?.total_requests || 0}</span>
                  <span>requests</span>
                </div>
              </div>

              {/* Prompt Tokens */}
              <div className="p-3.5 sm:p-5 rounded-2xl border border-gray-800 bg-gray-900/50 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between text-gray-400 text-xs font-medium mb-2 sm:mb-3">
                  <span className="truncate">Input Tokens</span>
                  <BarChart3 className="w-4 h-4 text-blue-400 shrink-0" />
                </div>
                <div className="text-xl sm:text-3xl font-extrabold text-blue-400 font-mono tracking-tight">
                  {tokenStats?.prompt_tokens ? tokenStats.prompt_tokens.toLocaleString() : "0"}
                </div>
                <div className="text-[10px] sm:text-[11px] text-gray-400 mt-2 truncate">
                  Prompt & context history
                </div>
              </div>

              {/* Completion Tokens */}
              <div className="p-3.5 sm:p-5 rounded-2xl border border-gray-800 bg-gray-900/50 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between text-gray-400 text-xs font-medium mb-2 sm:mb-3">
                  <span className="truncate">Output Tokens</span>
                  <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <div className="text-xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
                  {tokenStats?.completion_tokens ? tokenStats.completion_tokens.toLocaleString() : "0"}
                </div>
                <div className="text-[10px] sm:text-[11px] text-gray-400 mt-2 truncate">
                  AI responses generated
                </div>
              </div>

              {/* Estimated Cost */}
              <div className="p-3.5 sm:p-5 rounded-2xl border border-gray-800 bg-gray-900/50 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between text-gray-400 text-xs font-medium mb-2 sm:mb-3">
                  <span className="truncate">Estimated Cost</span>
                  <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                </div>
                <div className="text-xl sm:text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
                  ${tokenStats?.estimated_cost_usd !== undefined ? tokenStats.estimated_cost_usd.toFixed(4) : "0.0000"}
                </div>
                <div className="text-[10px] sm:text-[11px] text-gray-400 mt-2 truncate">
                  API provider pricing model
                </div>
              </div>
            </div>

            {/* Model Breakdown Section */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md p-4 sm:p-6">
              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-violet-400" /> Consumption by Model
              </h4>

              {tokenStats && Object.keys(tokenStats.by_model || {}).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {Object.entries(tokenStats.by_model).map(([modelName, metric]) => {
                    const percentage = tokenStats.total_tokens > 0
                      ? Math.round((metric.total / tokenStats.total_tokens) * 100)
                      : 0;

                    return (
                      <div
                        key={modelName}
                        className="p-4 rounded-xl border border-gray-800/90 bg-gray-800/30 flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-xs font-bold text-white truncate" title={modelName}>
                              {modelName}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-950/80 border border-violet-800/60 text-violet-300">
                              {percentage}%
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {metric.count} {metric.count === 1 ? "call" : "calls"} • Est. ${metric.cost_usd.toFixed(5)}
                          </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-violet-500 to-pink-500 h-1.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-1 pt-2 border-t border-gray-800/60 text-[10px] font-mono text-gray-400">
                          <div>
                            <span className="text-gray-400 block">Prompt</span>
                            <span className="text-blue-400 font-semibold">{metric.prompt.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Compl.</span>
                            <span className="text-emerald-400 font-semibold">{metric.completion.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Total</span>
                            <span className="text-white font-semibold">{metric.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-xs">
                  No token usage recorded yet. Start a conversation in the chat to see model metrics populate.
                </div>
              )}
            </div>

            {/* Recent Request Ledger Table */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" /> Recent Request Ledger
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Detailed per-call audit of the 30 most recent model invocations.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-gray-400">
                  {tokenStats?.recent_logs?.length || 0} entries
                </span>
              </div>

              {tokenStats && tokenStats.recent_logs && tokenStats.recent_logs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left text-xs">
                    <thead className="bg-gray-800/50 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Time</th>
                        <th className="py-3 px-4">Session</th>
                        <th className="py-3 px-4">Model</th>
                        <th className="py-3 px-4 text-right">Prompt</th>
                        <th className="py-3 px-4 text-right">Completion</th>
                        <th className="py-3 px-4 text-right">Total Tokens</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60 font-mono text-gray-300">
                      {tokenStats.recent_logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="py-3 px-4 text-[11px] text-gray-400 whitespace-nowrap">
                            {log.created_at || "—"}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-[10px]">
                              {log.session_id}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-violet-300 font-semibold truncate max-w-[200px]" title={log.model}>
                            {log.model}
                          </td>
                          <td className="py-3 px-4 text-right text-blue-400 font-medium">
                            {log.prompt_tokens.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right text-emerald-400 font-medium">
                            {log.completion_tokens.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right text-white font-bold">
                            {log.total_tokens.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-gray-400 text-xs">
                  No request ledger records found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: Voice Models & Audio Usage */}
        {/* =================================================================== */}
        {activeTab === "voice" && (
          <div className="flex flex-col gap-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Mic className="w-5 h-5 text-violet-400" /> Voice Models & Audio Analytics
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Manage active TTS voice synthesis, preview neural voices, and monitor speech & transcription consumption.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={refreshAllData}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700/60 flex items-center gap-2 transition-all cursor-pointer"
                  title="Refresh Voice Metrics"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleResetVoiceUsage}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-2 transition-all cursor-pointer"
                  title="Reset voice metrics ledger"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Ledger</span>
                </button>
              </div>
            </div>

            {/* Top KPI Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {/* Card 1: Active Voice */}
              <div className="p-3.5 sm:p-5 rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-xs text-gray-400 uppercase font-semibold truncate">Active Voice</span>
                  <Radio className="w-4 h-4 text-pink-400 animate-pulse shrink-0" />
                </div>
                <div className="text-sm sm:text-lg font-bold text-white truncate" title={defaultVoice}>
                  {voiceList.find((v) => v.id === defaultVoice)?.name || defaultVoice}
                </div>
                <div className="text-[10px] sm:text-[11px] text-pink-400/90 font-mono mt-1 truncate">
                  {defaultVoice.startsWith("cartesia") ? "Cartesia Cloned Voice" : "Edge Neural Voice"}
                </div>
              </div>

              {/* Card 2: Total Audio Invocations */}
              <div className="p-3.5 sm:p-5 rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-xs text-gray-400 uppercase font-semibold truncate">Invocations</span>
                  <Mic className="w-4 h-4 text-violet-400 shrink-0" />
                </div>
                <div className="text-xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                  {(voiceStats?.total_requests || 0).toLocaleString()}
                </div>
                <div className="text-[10px] sm:text-[11px] text-gray-400 mt-1 truncate">
                  {voiceStats?.tts_requests || 0} TTS · {voiceStats?.stt_requests || 0} STT
                </div>
              </div>

              {/* Card 3: Synthesized Characters */}
              <div className="p-3.5 sm:p-5 rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-xs text-gray-400 uppercase font-semibold truncate">Characters</span>
                  <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <div className="text-xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
                  {(voiceStats?.total_characters || 0).toLocaleString()}
                </div>
                <div className="text-[10px] sm:text-[11px] text-gray-400 mt-1 truncate">
                  Edge-TTS quota: Unlimited
                </div>
              </div>

              {/* Card 4: Audio Payload Size */}
              <div className="p-3.5 sm:p-5 rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-xs text-gray-400 uppercase font-semibold truncate">Payload Size</span>
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                </div>
                <div className="text-xl sm:text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
                  {(() => {
                    const bytes = voiceStats?.total_audio_bytes || 0;
                    if (bytes === 0) return "0 KB";
                    if (bytes < 1024) return `${bytes} B`;
                    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
                    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
                  })()}
                </div>
                <div className="text-[10px] sm:text-[11px] text-gray-400 mt-1 truncate">
                  MP3 base64 generated
                </div>
              </div>
            </div>

            {/* Interactive Voice Tester Card */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-violet-400" /> Interactive Voice Synthesis Tester
                </h4>
                <span className="text-[11px] text-gray-400">
                  Preview any voice instantly with real-time speech generation
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 flex flex-col gap-2">
                  <label className="text-xs text-gray-400 font-medium">Test Prompt / Speech Text</label>
                  <textarea
                    rows={3}
                    value={testVoiceText}
                    onChange={(e) => setTestVoiceText(e.target.value)}
                    placeholder="Enter custom speech text to synthesize..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500 font-sans resize-none"
                  />
                </div>

                <div className="flex flex-col justify-between gap-3">
                  <div>
                    <label className="text-xs text-gray-400 font-medium">Select Voice to Test</label>
                    <select
                      value={selectedVoiceForTest || defaultVoice}
                      onChange={(e) => setSelectedVoiceForTest(e.target.value)}
                      className="w-full mt-1.5 bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-violet-500 font-mono"
                    >
                      {voiceList.map((voice) => (
                        <option key={voice.id} value={voice.id} className="bg-gray-900 text-gray-200">
                          {voice.name} ({voice.gender}, {voice.locale})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => handlePreviewVoice(selectedVoiceForTest || defaultVoice)}
                    disabled={isTestingVoice || !testVoiceText.trim()}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-500 hover:to-pink-400 text-white flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-violet-500/20"
                  >
                    {isTestingVoice && playingVoiceId === (selectedVoiceForTest || defaultVoice) ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Synthesizing Audio...</span>
                      </>
                    ) : playingVoiceId === (selectedVoiceForTest || defaultVoice) ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-pink-200" />
                        <span>Stop Playback</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Generate & Play Audio</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Available Voices Grid */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-pink-400" /> Available Neural Voice Models
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Click &quot;Set as Active Default&quot; to switch the primary voice across your entire Digital Twin application.
                  </p>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-violet-950/80 border border-violet-800/60 text-violet-300 font-mono">
                  {voiceList.length} Models Configured
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {voiceList.map((voice) => {
                  const isCurrentDefault = defaultVoice === voice.id;
                  const isPlaying = playingVoiceId === voice.id;
                  const isCartesia = voice.id.startsWith("cartesia");

                  return (
                    <div
                      key={voice.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${isCurrentDefault
                        ? "border-pink-500/60 bg-pink-950/15 ring-1 ring-pink-500/30"
                        : "border-gray-800 bg-gray-800/30 hover:border-gray-700"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-white">{voice.name}</h5>
                            {isCurrentDefault && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-pink-500 text-white">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-gray-400 mt-1 truncate" title={voice.id}>
                            {voice.id}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${isCartesia
                            ? "bg-violet-950/80 border-violet-800/60 text-violet-300"
                            : "bg-blue-950/80 border-blue-800/60 text-blue-300"
                            }`}
                        >
                          {isCartesia ? "Cartesia Clone" : "Edge Neural (Free)"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800">
                          {voice.gender}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 font-mono">
                          {voice.locale}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-gray-800/70">
                        <button
                          onClick={() => handlePreviewVoice(voice.id)}
                          disabled={isTestingVoice && playingVoiceId !== voice.id}
                          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${isPlaying
                            ? "bg-pink-500/20 text-pink-300 border border-pink-500/40"
                            : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700/60"
                            }`}
                        >
                          {isPlaying ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-pink-400" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-gray-400" />
                              <span>Preview</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleSelectDefaultVoice(voice.id)}
                          disabled={isCurrentDefault || isUpdatingVoice}
                          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${isCurrentDefault
                            ? "bg-gray-800 text-gray-500 cursor-default"
                            : "bg-violet-600 hover:bg-violet-500 text-white shadow-sm shadow-violet-500/20"
                            }`}
                        >
                          {isCurrentDefault ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <span>Set Default</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Voice Usage Breakdown */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md p-6">
              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" /> Usage Breakdown by Voice & Operation
              </h4>

              {voiceStats && Object.keys(voiceStats.by_voice || {}).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(voiceStats.by_voice).map(([voiceKey, metric]) => {
                    const reqCount = metric.count || 0;
                    const charCount = metric.characters || 0;
                    const byteCount = metric.audio_bytes || 0;

                    return (
                      <div
                        key={voiceKey}
                        className="p-4 rounded-xl border border-gray-800/90 bg-gray-800/30 flex flex-col justify-between gap-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold text-white truncate" title={voiceKey}>
                            {voiceKey}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 uppercase">
                            {metric.action_type || "tts"}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-1 pt-2 border-t border-gray-800/60 text-[10px] font-mono text-gray-400">
                          <div>
                            <span className="text-gray-400 block">Calls</span>
                            <span className="text-white font-semibold">{reqCount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Chars</span>
                            <span className="text-emerald-400 font-semibold">{charCount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Payload</span>
                            <span className="text-amber-400 font-semibold">
                              {byteCount > 1024 * 1024
                                ? `${(byteCount / (1024 * 1024)).toFixed(1)} MB`
                                : `${(byteCount / 1024).toFixed(0)} KB`}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-xs">
                  No voice synthesis or transcription operations logged yet.
                </div>
              )}
            </div>

            {/* Recent Voice Activity Ledger Table */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-violet-400" /> Recent Voice & Audio Activity Ledger
                </h4>
                <span className="text-xs text-gray-400">
                  Showing last {voiceStats?.recent_logs?.length || 0} operations
                </span>
              </div>

              {voiceStats && voiceStats.recent_logs && voiceStats.recent_logs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 px-4">Time</th>
                        <th className="py-2.5 px-4">Session ID</th>
                        <th className="py-2.5 px-4">Type</th>
                        <th className="py-2.5 px-4">Voice / Provider</th>
                        <th className="py-2.5 px-4 text-right">Characters</th>
                        <th className="py-2.5 px-4 text-right">Audio Bytes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {voiceStats.recent_logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-800/40 transition-colors">
                          <td className="py-3 px-4 text-gray-400 text-[11px] whitespace-nowrap">
                            {new Date(log.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-[10px]">
                              {log.session_id}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${log.action_type === "tts"
                                ? "bg-violet-950/80 border border-violet-800/60 text-violet-300"
                                : "bg-blue-950/80 border border-blue-800/60 text-blue-300"
                                }`}
                            >
                              {log.action_type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-pink-300 font-semibold truncate max-w-[200px]" title={log.voice_id}>
                            {log.voice_id}
                          </td>
                          <td className="py-3 px-4 text-right text-emerald-400 font-medium">
                            {log.characters.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right text-amber-400 font-medium">
                            {log.audio_bytes > 1024
                              ? `${(log.audio_bytes / 1024).toFixed(1)} KB`
                              : `${log.audio_bytes} B`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-gray-400 text-xs">
                  No voice activity ledger records found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 5: Database & Health */}
        {/* =================================================================== */}
        {activeTab === "database" && (
          <div className="flex flex-col gap-6 max-w-4xl">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" /> PostgreSQL Infrastructure (Neon)
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Your Digital Twin is connected to the same Neon PostgreSQL instance used by your <code className="text-pink-400">tracker</code> service, storing all chat turns in the dedicated table <code className="text-emerald-400">twin_chat_history</code>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl border border-gray-800 bg-gray-800/40">
                  <span className="text-[11px] text-gray-500 uppercase font-semibold">Database Host</span>
                  <p className="text-xs font-mono text-gray-200 mt-1 break-all">ep-holy-mud-b4p2lqwy-pooler.c-6.us-east-2.aws.neon.tech</p>
                </div>

                <div className="p-3.5 rounded-xl border border-gray-800 bg-gray-800/40">
                  <span className="text-[11px] text-gray-500 uppercase font-semibold">Table & Index</span>
                  <p className="text-xs font-mono text-gray-200 mt-1">twin_chat_history (idx_twin_chat_history_session_id)</p>
                </div>

                <div className="p-3.5 rounded-xl border border-gray-800 bg-gray-800/40">
                  <span className="text-[11px] text-gray-500 uppercase font-semibold">Schema Columns</span>
                  <p className="text-xs font-mono text-gray-200 mt-1">id, session_id, role, content, timestamp, created_at</p>
                </div>

                <div className="p-3.5 rounded-xl border border-gray-800 bg-gray-800/40">
                  <span className="text-[11px] text-gray-500 uppercase font-semibold">Connection Pooling</span>
                  <p className="text-xs font-mono text-emerald-400 mt-1">Enabled (Neon PgBouncer Pooler)</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md p-6 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-400" /> Production Environment Configuration
              </h3>
              <p className="text-xs text-gray-400">
                To manage this in Render or your hosting provider, the following environment variables are active:
              </p>
              <div className="p-4 rounded-xl bg-gray-950 font-mono text-xs text-gray-300 space-y-1.5 overflow-x-auto">
                <p><span className="text-pink-400">ADMIN_PASSWORD</span>=admin2026</p>
                <p><span className="text-violet-400">MODEL</span>={primaryModel}</p>
                <p><span className="text-emerald-400">FALLBACK_MODEL</span>={fallbackModel}</p>
                <p><span className="text-blue-400">DATABASE_URL</span>=postgresql://neondb_owner:***@...neon.tech/neondb?sslmode=require</p>
                <p><span className="text-amber-400">CHAT_HISTORY_TABLE</span>=twin_chat_history</p>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 6: Captured Leads & Recruiters */}
        {/* =================================================================== */}
        {activeTab === "leads" && (
          <div className="flex flex-col gap-6 max-w-6xl">
            {/* Header Card */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      Inbound Leads & Recruiters
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 font-mono">
                        {leads.length} captured
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Recruiters, founders, and potential clients who shared contact details through the chat widget.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchLeads}
                  disabled={isLoadingLeads}
                  className="px-3.5 py-2 rounded-xl bg-gray-800/80 hover:bg-gray-800 text-gray-300 hover:text-white text-xs font-medium flex items-center gap-2 transition-all cursor-pointer border border-gray-700/60 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLeads ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search leads by name, email, notes, or persona..."
                value={leadSearchQuery}
                onChange={(e) => setLeadSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-gray-800 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-all"
              />
            </div>

            {/* Leads Table / Grid */}
            {filteredLeads.length === 0 ? (
              <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-8 sm:p-12 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-gray-800/60 border border-gray-700/50 flex items-center justify-center text-gray-500 mb-3">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-gray-300">
                  {leadSearchQuery ? "No matching leads found" : "No inbound leads captured yet"}
                </h4>
                <p className="text-xs text-gray-500 max-w-md mt-1">
                  {leadSearchQuery
                    ? `No leads matched "${leadSearchQuery}". Try clearing your filter.`
                    : "When a recruiter or hiring manager expresses interest in hiring or connecting with you, the Digital Twin prompts them for their contact details and automatically records them here while triggering a Telegram alert."}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md overflow-hidden">
                {/* Mobile Card Layout (<md) */}
                <div className="block md:hidden divide-y divide-gray-800/70">
                  {filteredLeads.map((lead) => (
                    <div key={lead.id} className="p-3.5 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-semibold text-white text-xs flex items-center gap-1.5 truncate">
                            <User className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                            <span className="truncate">{lead.name}</span>
                          </div>
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-[11px] text-pink-400 hover:text-pink-300 hover:underline flex items-center gap-1 mt-0.5 truncate"
                          >
                            <Mail className="w-3 h-3 inline shrink-0" />
                            <span className="truncate">{lead.email}</span>
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${lead.persona === "founder"
                              ? "bg-amber-950/80 border border-amber-800 text-amber-300"
                              : "bg-violet-950/80 border border-violet-800 text-violet-300"
                              }`}
                          >
                            {lead.persona || "digital-twin"}
                          </span>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {lead.notes && (
                        <div className="bg-gray-950/50 rounded-xl p-2.5 border border-gray-800/80">
                          <p className="text-[11px] text-gray-300 leading-relaxed">
                            {lead.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-500 shrink-0" />
                          <span>
                            {lead.created_at
                              ? new Date(lead.created_at).toLocaleString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                              : "N/A"}
                          </span>
                        </div>
                        {lead.session_id && (
                          <button
                            onClick={() => {
                              setActiveTab("sessions");
                              setSelectedSessionId(lead.session_id);
                              fetchSessionDetail(lead.session_id);
                            }}
                            className="font-mono text-gray-400 hover:text-violet-400 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Session {lead.session_id.substring(0, 8)}...</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop / Tablet Table View (>=md) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-xs text-gray-300">
                    <thead className="bg-gray-950/60 border-b border-gray-800 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Inquiry / Notes</th>
                        <th className="py-3 px-4">Mode / Persona</th>
                        <th className="py-3 px-4">Date Captured</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                      {filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                              <span>{lead.name}</span>
                            </div>
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-[11px] text-pink-400 hover:text-pink-300 hover:underline flex items-center gap-1 mt-0.5 inline-block"
                            >
                              <Mail className="w-3 h-3 inline mr-0.5" />
                              {lead.email}
                            </a>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="text-gray-300 line-clamp-2 text-xs">
                              {lead.notes || <span className="text-gray-500 italic">No notes provided</span>}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${lead.persona === "founder"
                                ? "bg-amber-950/80 border border-amber-800 text-amber-300"
                                : "bg-violet-950/80 border border-violet-800 text-violet-300"
                                }`}
                            >
                              {lead.persona || "digital-twin"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-gray-400">
                            <div className="flex items-center gap-1 text-[11px]">
                              <Calendar className="w-3 h-3 text-gray-500" />
                              <span>
                                {lead.created_at
                                  ? new Date(lead.created_at).toLocaleString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                  : "N/A"}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setActiveTab("sessions");
                                if (lead.session_id) {
                                  setSelectedSessionId(lead.session_id);
                                  fetchSessionDetail(lead.session_id);
                                }
                              }}
                              className="text-[10px] font-mono text-gray-500 hover:text-violet-400 flex items-center gap-0.5 mt-0.5 cursor-pointer"
                              title="Jump to chat session"
                            >
                              <span>{lead.session_id ? lead.session_id.substring(0, 16) : ""}...</span>
                              <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
