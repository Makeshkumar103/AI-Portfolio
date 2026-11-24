"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, Sparkles, Cpu, Check, ChevronDown, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type PersonaType = "digital-twin" | "founder" | "ai-engineer";

export interface PersonaOption {
  id: PersonaType;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  selectedBg: string;
  selectedBorder: string;
  checkColor: string;
}

export const PERSONA_OPTIONS: PersonaOption[] = [
  {
    id: "digital-twin",
    name: "digital-twin",
    icon: Bot,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
    iconBorder: "border-violet-500/30",
    selectedBg: "bg-violet-950/40",
    selectedBorder: "border-violet-500/50",
    checkColor: "text-violet-400",
  },
  {
    id: "founder",
    name: "founder",
    icon: Sparkles,
    iconColor: "text-pink-400",
    iconBg: "bg-pink-500/10",
    iconBorder: "border-pink-500/30",
    selectedBg: "bg-pink-950/40",
    selectedBorder: "border-pink-500/50",
    checkColor: "text-pink-400",
  },
  {
    id: "ai-engineer",
    name: "ai-engineer",
    icon: Cpu,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    iconBorder: "border-emerald-500/30",
    selectedBg: "bg-emerald-950/40",
    selectedBorder: "border-emerald-500/50",
    checkColor: "text-emerald-400",
  },
];

interface PersonaDropdownProps {
  activePersona: PersonaType;
  onSelect: (persona: PersonaType) => void;
  isUpdating?: boolean;
  variant?: "navbar" | "inline";
  className?: string;
}

export default function PersonaDropdown({
  activePersona,
  onSelect,
  isUpdating = false,
  variant = "navbar",
  className = "",
}: PersonaDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeOption =
    PERSONA_OPTIONS.find((item) => item.id === activePersona) || PERSONA_OPTIONS[0];
  const ActiveIcon = activeOption.icon;

  // Handle outside click & Escape key dismissal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (id: PersonaType) => {
    if (id !== activePersona) {
      onSelect(id);
    }
    setIsOpen(false);
  };

  if (variant === "inline") {
    return (
      <div ref={containerRef} className={`relative inline-block ${className}`}>
        <button
          type="button"
          onClick={() => !isUpdating && setIsOpen(!isOpen)}
          disabled={isUpdating}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label="Select active persona mode"
          className={`flex items-center justify-between gap-3 bg-[#0d1224]/90 hover:bg-[#121933] border border-gray-700 hover:border-violet-500/60 rounded-xl px-3.5 py-2 text-xs transition-all cursor-pointer shadow-sm group ${
            isOpen ? "border-violet-500 ring-2 ring-violet-500/20 bg-[#121933]" : ""
          } ${isUpdating ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${activeOption.iconBg} ${activeOption.iconBorder} border`}
            >
              <ActiveIcon className={`w-3 h-3 ${activeOption.iconColor}`} />
            </div>
            <span className="text-gray-400 font-medium">Dropdown:</span>
            <span className="font-bold text-white tracking-tight">{activeOption.name}</span>
          </div>

          <div className="flex items-center gap-1.5 ml-2">
            {isUpdating ? (
              <RefreshCw className="w-3.5 h-3.5 text-violet-400 animate-spin" />
            ) : (
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 group-hover:text-violet-300 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-violet-300" : ""
                }`}
              />
            )}
          </div>
        </button>

        {/* Minimal Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              role="listbox"
              aria-label="Persona Selection"
              className="absolute left-0 top-full mt-1.5 w-48 rounded-xl bg-[#0c1024]/95 backdrop-blur-xl border border-gray-800 shadow-2xl shadow-black/80 ring-1 ring-white/10 p-1.5 z-50 space-y-1"
            >
              {PERSONA_OPTIONS.map((item) => {
                const isSelected = activePersona === item.id;
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? `${item.selectedBg} text-white ${item.selectedBorder} border`
                        : "text-gray-300 hover:text-white hover:bg-gray-800/60 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconBorder} border`}
                      >
                        <ItemIcon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                      </div>
                      <span>{item.name}</span>
                    </div>

                    {isSelected && (
                      <Check className={`w-3.5 h-3.5 ${item.checkColor} shrink-0`} />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default: Navbar variant
  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !isUpdating && setIsOpen(!isOpen)}
        disabled={isUpdating}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Switch active chatbot persona"
        className={`flex items-center gap-2 bg-[#0e1326]/90 hover:bg-[#141b36] border border-violet-500/40 hover:border-violet-400/80 rounded-xl px-2.5 sm:px-3 py-1.5 shadow-md shadow-violet-950/40 text-xs font-medium text-gray-200 transition-all cursor-pointer group ${
          isOpen ? "ring-2 ring-violet-500/40 border-violet-400 bg-[#141b36]" : ""
        } ${isUpdating ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        <div
          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${activeOption.iconBg} ${activeOption.iconBorder} border`}
        >
          <ActiveIcon className={`w-3 h-3 ${activeOption.iconColor}`} />
        </div>
        <span className="text-[11px] font-semibold text-gray-400 hidden sm:inline">Persona:</span>
        <span className="font-bold text-xs text-white">{activeOption.name}</span>
        {isUpdating ? (
          <RefreshCw className="w-3 h-3 text-violet-400 animate-spin ml-0.5" />
        ) : (
          <ChevronDown
            className={`w-3.5 h-3.5 text-gray-400 group-hover:text-violet-300 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-violet-300" : ""
            }`}
          />
        )}
      </button>

      {/* Minimal Floating Dropdown Menu: Logo + Option Item */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            role="listbox"
            aria-label="Chatbot Persona Options"
            className="absolute right-0 top-full mt-1.5 w-44 sm:w-48 rounded-xl bg-[#0c1024]/95 backdrop-blur-xl border border-gray-800 shadow-2xl shadow-black/90 ring-1 ring-white/10 p-1.5 z-50 space-y-1"
          >
            {PERSONA_OPTIONS.map((item) => {
              const isSelected = activePersona === item.id;
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? `${item.selectedBg} text-white ${item.selectedBorder} border`
                      : "text-gray-300 hover:text-white hover:bg-gray-800/60 border border-transparent"
                  }`}
                >
                  {/* Logo + Option Name */}
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconBorder} border`}
                    >
                      <ItemIcon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                    </div>
                    <span>{item.name}</span>
                  </div>

                  {/* Checkmark when active */}
                  {isSelected && (
                    <Check className={`w-3.5 h-3.5 ${item.checkColor} shrink-0`} />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
