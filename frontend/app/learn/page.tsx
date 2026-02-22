"use client";

import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Flashcard = {
  question: string;
  answer: string;
  difficulty?: string;
};

type QuizQuestion = {
  question: string;
  options: string[];
  correct_answer?: string;
};

export default function LearnPage() {
  const [topic, setTopic] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [flashcardError, setFlashcardError] = useState<string | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [quizCount, setQuizCount] = useState(5);
  const [activeTab, setActiveTab] = useState<"flashcards" | "quiz">("flashcards");
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");

  // Check API connection on mount
  useEffect(() => {
    async function checkApiConnection() {
      try {
        const response = await fetch(`${API}/health`, {
          method: "GET",
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });
        setApiStatus(response.ok ? "online" : "offline");
      } catch (err) {
        setApiStatus("offline");
      }
    }
    checkApiConnection();
  }, []);

  async function generateFlashcards() {
    if (!topic.trim()) {
      setFlashcardError("Please enter a topic");
      return;
    }

    setIsGeneratingFlashcards(true);
    setFlashcardError(null);
    setFlashcards([]);

    try {
      console.log(`[Flashcards] Sending request to ${API}/generate-flashcards`);
      console.log(`[Flashcards] Topic: ${topic.trim()}`);

      const res = await fetch(`${API}/generate-flashcards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      console.log(`[Flashcards] Response status: ${res.status}`);

      if (!res.ok) {
        let errorMessage = `HTTP error! status: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
          console.error(`[Flashcards] Server error response:`, errorData);
        } catch (e) {
          // If response is not JSON, try to get text
          try {
            const errorText = await res.text();
            console.error(`[Flashcards] Server error text:`, errorText);
            errorMessage = errorText || errorMessage;
          } catch (e2) {
            console.error(`[Flashcards] Could not parse error response`);
          }
        }
        
        if (res.status === 500) {
          throw new Error(
            `Server Error (500): The backend encountered an internal error.\n` +
            `This might be due to:\n` +
            `1. Missing or invalid API keys (Pinecone, Gemini)\n` +
            `2. Database connection issues\n` +
            `3. No documents uploaded yet (upload content first)\n` +
            `4. Vector database not configured\n\n` +
            `Check backend logs for more details.`
          );
        }
        
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setFlashcards(data.flashcards || []);
      setActiveTab("flashcards");
    } catch (err) {
      console.error("Error generating flashcards:", err);
      
      // Better error messages for different error types
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        console.error(`[Flashcards] Network error - Failed to fetch`);
        console.error(`[Flashcards] API URL: ${API}`);
        console.error(`[Flashcards] Full error:`, err);
        
        setFlashcardError(
          `Cannot connect to backend API. Please check:\n` +
          `1. Backend server is running at ${API}\n` +
          `2. The /generate-flashcards endpoint exists and is accessible\n` +
          `3. CORS is properly configured\n` +
          `4. Network connection is active`
        );
      } else if (err instanceof Error) {
        setFlashcardError(err.message);
      } else {
        setFlashcardError("Failed to generate flashcards. Please try again.");
      }
    } finally {
      setIsGeneratingFlashcards(false);
    }
  }

  async function generateQuiz() {
    if (!topic.trim()) {
      setQuizError("Please enter a topic");
      return;
    }

    setIsGeneratingQuiz(true);
    setQuizError(null);
    setQuiz([]);

    try {
      console.log(`[Quiz] Sending request to ${API}/generate-quiz`);
      console.log(`[Quiz] Topic: ${topic.trim()}, Count: ${quizCount}`);

      const res = await fetch(`${API}/generate-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic: topic.trim(),
          quiz_count: quizCount 
        }),
      });

      console.log(`[Quiz] Response status: ${res.status}`);

      if (!res.ok) {
        let errorMessage = `HTTP error! status: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
          console.error(`[Quiz] Server error response:`, errorData);
        } catch (e) {
          // If response is not JSON, try to get text
          try {
            const errorText = await res.text();
            console.error(`[Quiz] Server error text:`, errorText);
            errorMessage = errorText || errorMessage;
          } catch (e2) {
            console.error(`[Quiz] Could not parse error response`);
          }
        }
        
        if (res.status === 500) {
          throw new Error(
            `Server Error (500): The backend encountered an internal error.\n` +
            `This might be due to:\n` +
            `1. Missing or invalid API keys (Pinecone, Gemini)\n` +
            `2. Database connection issues\n` +
            `3. No documents uploaded yet (upload content first)\n` +
            `4. Vector database not configured\n\n` +
            `Check backend logs for more details.`
          );
        }
        
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setQuiz(data.quiz || []);
      setActiveTab("quiz");
    } catch (err) {
      console.error("Error generating quiz:", err);
      
      // Better error messages for different error types
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        console.error(`[Quiz] Network error - Failed to fetch`);
        console.error(`[Quiz] API URL: ${API}`);
        console.error(`[Quiz] Full error:`, err);
        
        setQuizError(
          `Cannot connect to backend API. Please check:\n` +
          `1. Backend server is running at ${API}\n` +
          `2. The /generate-quiz endpoint exists and is accessible\n` +
          `3. CORS is properly configured\n` +
          `4. Network connection is active`
        );
      } else if (err instanceof Error) {
        setQuizError(err.message);
      } else {
        setQuizError("Failed to generate quiz. Please try again.");
      }
    } finally {
      setIsGeneratingQuiz(false);
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Learning Tools
          </h2>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              apiStatus === "online" ? "bg-green-500" : 
              apiStatus === "offline" ? "bg-red-500" : 
              "bg-yellow-500 animate-pulse"
            }`}></div>
            <span className="text-xs text-neutral-500">
              {apiStatus === "online" ? "API Connected" : 
               apiStatus === "offline" ? "API Offline" : 
               "Checking..."}
            </span>
          </div>
        </div>
        <p className="text-neutral-400">
          Generate flashcards and quizzes from your uploaded content
        </p>
        {apiStatus === "offline" && (
          <div className="mt-2 bg-yellow-900/20 border border-yellow-800 text-yellow-400 px-4 py-2 rounded-lg text-sm">
            ⚠️ Backend API appears to be offline. Please ensure the server is running at <code className="bg-neutral-800 px-1 rounded">{API}</code>
          </div>
        )}
        {apiStatus === "online" && (
          <div className="mt-2 bg-blue-900/20 border border-blue-800 text-blue-400 px-4 py-2 rounded-lg text-sm">
            💡 <strong>Tip:</strong> Make sure you've uploaded some content (PDFs or videos) before generating flashcards or quizzes. The AI needs content to learn from!
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Topic or Subject
          </label>
          <input
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setFlashcardError(null);
              setQuizError(null);
            }}
            placeholder="e.g., Machine Learning, Python Basics, History of AI..."
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">
              Number of Quiz Questions
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={quizCount}
              onChange={(e) => setQuizCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 5)))}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={generateFlashcards}
            disabled={!topic.trim() || isGeneratingFlashcards}
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all px-6 py-3 rounded-xl font-medium shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2"
          >
            {isGeneratingFlashcards ? (
              <>
                <span className="animate-spin">⏳</span>
                Generating...
              </>
            ) : (
              <>
                <span>📇</span>
                Generate Flashcards
              </>
            )}
          </button>

          <button
            onClick={generateQuiz}
            disabled={!topic.trim() || isGeneratingQuiz}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all px-6 py-3 rounded-xl font-medium shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
          >
            {isGeneratingQuiz ? (
              <>
                <span className="animate-spin">⏳</span>
                Generating...
              </>
            ) : (
              <>
                <span>❓</span>
                Generate Quiz
              </>
            )}
          </button>
        </div>

        {flashcardError && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm whitespace-pre-line">
            ⚠️ {flashcardError}
            <div className="mt-2 text-xs text-red-500/80">
              API: {API}
            </div>
          </div>
        )}

        {quizError && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm whitespace-pre-line">
            ⚠️ {quizError}
            <div className="mt-2 text-xs text-red-500/80">
              API: {API}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {(flashcards.length > 0 || quiz.length > 0) && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-neutral-800">
            <button
              onClick={() => setActiveTab("flashcards")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "flashcards"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              📇 Flashcards ({flashcards.length})
            </button>
            <button
              onClick={() => setActiveTab("quiz")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "quiz"
                  ? "text-green-400 border-b-2 border-green-400"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              ❓ Quiz ({quiz.length})
            </button>
          </div>

          {/* Flashcards */}
          {activeTab === "flashcards" && flashcards.length > 0 && (
            <div className="grid md:grid-cols-2 gap-4">
              {flashcards.map((c, i) => (
                <div
                  key={i}
                  className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 hover:border-blue-500 transition-colors animate-fadeIn"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold px-2 py-1 bg-blue-900/30 text-blue-400 rounded">
                      {c.difficulty || "Medium"}
                    </span>
                    <span className="text-xs text-neutral-500">#{i + 1}</span>
                  </div>
                  <p className="font-semibold text-lg mb-3 text-neutral-100">
                    {c.question}
                  </p>
                  <div className="pt-3 border-t border-neutral-700">
                    <p className="text-sm text-neutral-400">Answer:</p>
                    <p className="text-neutral-200 mt-1">{c.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quiz */}
          {activeTab === "quiz" && quiz.length > 0 && (
            <div className="space-y-6">
              {quiz.map((q, i) => (
                <div
                  key={i}
                  className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 hover:border-green-500 transition-colors animate-fadeIn"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-lg text-neutral-100">
                      Question {i + 1}
                    </h3>
                    {q.correct_answer && (
                      <span className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded">
                        ✓ Answer: {q.correct_answer}
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-200 mb-4">{q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((option, j) => (
                      <div
                        key={j}
                        className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 hover:border-green-500/50 transition-colors"
                      >
                        <span className="text-blue-400 font-medium mr-2">
                          {String.fromCharCode(65 + j)}.
                        </span>
                        <span className="text-neutral-300">{option}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {flashcards.length === 0 && quiz.length === 0 && !isGeneratingFlashcards && !isGeneratingQuiz && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No content generated yet</h3>
          <p className="text-neutral-500">
            Enter a topic and click "Generate Flashcards" or "Generate Quiz" to get started
          </p>
        </div>
      )}
    </div>
  );
}