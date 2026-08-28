"use client";

import { useState } from "react";
import { Bot, X, Send } from "lucide-react";

export default function Chatbot() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const sendMessage = async () => {
        if (!message.trim() || isLoading) return;

        const userMessage = message;
        setMessage("");
        setIsLoading(true);

        setMessages((prev) => [...prev, { role: "user", text: userMessage }]);

        try {
            const res = await fetch(`${API_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await res.json();
            setMessages((prev) => [...prev, { role: "bot", text: data.reply || "Error: No reply" }]);
        } catch (error) {
            setMessages((prev) => [...prev, { role: "bot", text: "Error: Failed to connect to server" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {isOpen && (
                <div className="w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-slide-up">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Digital Twin Chatbot</h3>
                        <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                        {messages.length === 0 && (
                            <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                                Start a conversation...
                            </p>
                        )}
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${m.role === "user"
                                        ? "bg-blue-600 text-white rounded-br-none"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
                                        }`}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-none text-sm">
                                    <span className="animate-pulse">Typing...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Ask me anything..."
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isLoading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!message.trim() || isLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-md transition hover:bg-gray-100 hover:text-black dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
            </button>
        </div>
    );
}