"use client";

import { useState, useRef, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Message = {
  role: "user" | "ai";
  text: string;
  timestamp?: Date;
};

// Generate or retrieve session ID from localStorage
function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  
  let sessionId = localStorage.getItem("chat_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("chat_session_id", sessionId);
  }
  return sessionId;
}

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState("chat");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session ID on mount
  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function sendMessage() {
    if (!message.trim() || isTyping) return;

    const userMsg: Message = { role: "user", text: message.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    const currentMessage = message.trim();
    setMessage("");
    setIsTyping(true);
    setError(null);

    try {
      const currentSessionId = sessionId || getOrCreateSessionId();
      const response = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentMessage,
          mode,
          session_id: currentSessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let aiText = "";
      setMessages(prev => [...prev, { role: "ai", text: "", timestamp: new Date() }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiText += chunk;

        setMessages(prev => {
          const copy = [...prev];
          const lastMsg = copy[copy.length - 1];
          if (lastMsg && lastMsg.role === "ai") {
            copy[copy.length - 1] = { ...lastMsg, text: aiText };
          }
          return copy;
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
      
      // Better error messages for different error types
      if (err instanceof TypeError && (err.message === "Failed to fetch" || err.message.includes("network"))) {
        setError(
          `Network error: Cannot connect to backend API.\n` +
          `Please check:\n` +
          `1. Backend server is running at ${API}\n` +
          `2. Network connection is active\n` +
          `3. CORS is properly configured`
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to send message. Please try again.");
      }
      
      setMessages(prev => prev.slice(0, -1)); // Remove the empty AI message
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    setMessages([]);
    setError(null);
    // Create a new session when clearing chat
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    if (typeof window !== "undefined") {
      localStorage.setItem("chat_session_id", newSessionId);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-neutral-900 rounded-2xl border border-neutral-800 shadow-xl animate-fadeIn">

      {/* Header */}
      <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Learning Assistant
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {mode === "chat" ? "💬 Chat Mode" : "📚 Study Mode"}
            {sessionId && (
              <span className="ml-2">• Session: {sessionId.substring(0, 8)}...</span>
            )}
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="text-xs px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
            title="Clear chat and start new session"
          >
            New Session
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">Start a conversation</h3>
            <p className="text-neutral-500 text-sm max-w-md">
              Ask questions about your uploaded learning materials. I can help explain concepts, answer questions, and assist with your studies.
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            } animate-fadeIn`}
          >
            <div
              className={`flex flex-col max-w-[80%] ${
                m.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-2xl whitespace-pre-wrap break-words ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm"
                    : "bg-neutral-800 border border-neutral-700 text-neutral-100 rounded-bl-sm"
                }`}
              >
                {m.text || (isTyping && i === messages.length - 1 ? (
                  <span className="inline-flex items-center gap-1">
                    <span className="animate-pulse-slow">●</span>
                  </span>
                ) : null)}
              </div>
              {m.timestamp && (
                <span className="text-xs text-neutral-500 mt-1 px-2">
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        ))}

        {isTyping && messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-neutral-800 border border-neutral-700 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></span>
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
            ⚠️ {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t border-neutral-800 p-4 bg-neutral-900 rounded-b-2xl">
        <div className="flex gap-3 items-center">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            disabled={isTyping}
            className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
          >
            <option value="chat">💬 Chat</option>
            <option value="study">📚 Study</option>
          </select>

          <input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your learning material..."
            disabled={isTyping}
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />

          <button
            onClick={sendMessage}
            disabled={!message.trim() || isTyping}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-900/20"
          >
            {isTyping ? "..." : "Send"}
          </button>
        </div>
        <p className="text-xs text-neutral-500 mt-2 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}