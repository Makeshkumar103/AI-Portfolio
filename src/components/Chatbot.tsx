"use client";

import { useState } from "react";

export default function Chatbot() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
        const res = await fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });

        const data = await res.json();

        setMessages([
            ...messages,
            { role: "user", text: message },
            { role: "bot", text: data.reply },
        ]);
        setMessage("");
    };

    return (
        <div className="container py-4">
            <h2>Digital Twin Chatbot</h2>

            <div className="border p-3 mb-3" style={{ minHeight: "250px" }}>
                {messages.map((m, i) => (
                    <p key={i}>
                        <strong>{m.role}:</strong> {m.text}
                    </p>
                ))}
            </div>

            <input
                className="form-control mb-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
            />
            <button className="btn btn-primary" onClick={sendMessage}>
                Send
            </button>
        </div>
    );
}