"use client";

import { useState, useRef, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [isUploadingPDF, setIsUploadingPDF] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [videoSuccess, setVideoSuccess] = useState(false);
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check API connection on mount
  useEffect(() => {
    checkApiConnection();
  }, []);

  async function checkApiConnection() {
    setApiStatus("checking");
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

  async function testVideoEndpoint() {
    setIsTestingConnection(true);
    try {
      console.log(`[Test] Testing ${API}/process-video endpoint...`);
      
      // Test with a dummy URL to see if endpoint is reachable
      const response = await fetch(`${API}/process-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "https://www.youtube.com/watch?v=test" }),
        signal: AbortSignal.timeout(10000), // 10 second timeout for test
      });
      
      console.log(`[Test] Response status: ${response.status}`);
      
      if (response.status === 422 || response.status === 400) {
        // These status codes mean the endpoint exists but validation failed - that's good!
        alert(`✅ Endpoint is reachable! (Validation error is expected with test URL)`);
      } else if (response.ok) {
        alert(`✅ Endpoint is working!`);
      } else {
        alert(`⚠️ Endpoint responded with status: ${response.status}`);
      }
    } catch (err) {
      console.error(`[Test] Endpoint test failed:`, err);
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        alert(`❌ Cannot reach endpoint. Backend might not be running or CORS issue.`);
      } else if (err instanceof DOMException && err.name === "AbortError") {
        alert(`⏱️ Request timed out. Endpoint might be slow or hanging.`);
      } else {
        alert(`❌ Error: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    } finally {
      setIsTestingConnection(false);
      checkApiConnection(); // Refresh status
    }
  }

  function validatePDF(file: File): string | null {
    if (file.type !== "application/pdf") {
      return "Please upload a PDF file";
    }
    if (file.size > 50 * 1024 * 1024) {
      return "File size must be less than 50MB";
    }
    return null;
  }

  function validateYouTubeURL(url: string): boolean {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
  }

  async function uploadPDF() {
    if (!file) {
      setPdfError("Please select a file");
      return;
    }

    const validationError = validatePDF(file);
    if (validationError) {
      setPdfError(validationError);
      return;
    }

    setIsUploadingPDF(true);
    setPdfError(null);
    setPdfSuccess(false);

    try {
      const form = new FormData();
      form.append("file", file);

      const response = await fetch(`${API}/process-pdf`, {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPdfSuccess(true);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error("Error uploading PDF:", err);
      
      // Better error messages for different error types
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setPdfError(
          `Cannot connect to backend API. Please check:\n` +
          `1. Backend server is running at ${API}\n` +
          `2. CORS is properly configured\n` +
          `3. Network connection is active`
        );
      } else if (err instanceof Error) {
        setPdfError(err.message);
      } else {
        setPdfError("Failed to upload PDF. Please try again.");
      }
    } finally {
      setIsUploadingPDF(false);
    }
  }

  async function uploadVideo() {
    if (!url.trim()) {
      setVideoError("Please enter a YouTube URL");
      return;
    }

    if (!validateYouTubeURL(url)) {
      setVideoError("Please enter a valid YouTube URL");
      return;
    }

    setIsUploadingVideo(true);
    setVideoError(null);
    setVideoSuccess(false);

    try {
      // Create an AbortController with a 5-minute timeout for video processing
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000); // 5 minutes

      console.log(`[Video Upload] Sending request to ${API}/process-video`);
      console.log(`[Video Upload] URL: ${url.trim()}`);

      const response = await fetch(`${API}/process-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log(`[Video Upload] Response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setVideoSuccess(true);
      setUrl("");
      setTimeout(() => setVideoSuccess(false), 3000);
    } catch (err) {
      console.error("Error processing video:", err);
      
      // Better error messages for different error types
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        console.error(`[Video Upload] Network error - Failed to fetch`);
        console.error(`[Video Upload] API URL: ${API}`);
        console.error(`[Video Upload] Full error:`, err);
        
        setVideoError(
          `Cannot connect to backend API. Please check:\n` +
          `1. Backend server is running at ${API}\n` +
          `2. The /process-video endpoint exists and is accessible\n` +
          `3. CORS is properly configured\n` +
          `4. Network connection is active\n\n` +
          `Note: PDF upload works, so the API is reachable. This might be an issue with the /process-video endpoint specifically.`
        );
      } else if (err instanceof DOMException && err.name === "AbortError") {
        setVideoError(
          `Request timed out. Video processing is taking longer than expected.\n` +
          `This might happen with long videos. Please try:\n` +
          `1. Check if the video has captions/transcripts available\n` +
          `2. Try a shorter video\n` +
          `3. Check backend logs for errors`
        );
      } else if (err instanceof Error) {
        setVideoError(err.message);
      } else {
        setVideoError("Failed to process video. Please try again.");
      }
    } finally {
      setIsUploadingVideo(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPdfError(null);
    }
  }

  // Test if the video endpoint is reachable
  async function testVideoEndpoint() {
    try {
      console.log(`[Test] Testing ${API}/process-video endpoint...`);
      const response = await fetch(`${API}/process-video`, {
        method: "OPTIONS", // Use OPTIONS to test CORS without sending data
      });
      console.log(`[Test] OPTIONS response:`, response.status);
      return true;
    } catch (err) {
      console.error(`[Test] Endpoint test failed:`, err);
      return false;
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Upload Learning Content
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
          Upload PDF documents or YouTube videos to build your knowledge base
        </p>
        {apiStatus === "offline" && (
          <div className="mt-2 bg-yellow-900/20 border border-yellow-800 text-yellow-400 px-4 py-2 rounded-lg text-sm space-y-2">
            <div>
              ⚠️ Backend API appears to be offline. Please ensure the server is running at <code className="bg-neutral-800 px-1 rounded">{API}</code>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={testVideoEndpoint}
                disabled={isTestingConnection}
                className="text-xs bg-yellow-800 hover:bg-yellow-700 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
              >
                {isTestingConnection ? "Testing..." : "🔍 Test Video Endpoint"}
              </button>
              <button
                onClick={checkApiConnection}
                className="text-xs bg-blue-800 hover:bg-blue-700 px-3 py-1.5 rounded transition-colors"
              >
                🔄 Refresh Status
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* PDF Upload Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">📄</div>
            <div>
              <h3 className="text-xl font-semibold">PDF Document</h3>
              <p className="text-sm text-neutral-500">Upload study materials, notes, or textbooks</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select PDF File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                disabled={isUploadingPDF}
                className="block w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 file:cursor-pointer disabled:opacity-50"
              />
              {file && (
                <div className="mt-2 p-3 bg-neutral-800 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-neutral-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-neutral-400 hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {pdfError && (
              <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm whitespace-pre-line">
                ⚠️ {pdfError}
                <div className="mt-2 text-xs text-red-500/80">
                  API: {API}
                </div>
              </div>
            )}

            {pdfSuccess && (
              <div className="bg-green-900/20 border border-green-800 text-green-400 px-4 py-3 rounded-lg text-sm">
                ✅ PDF processed successfully!
              </div>
            )}

            <button
              onClick={uploadPDF}
              disabled={!file || isUploadingPDF}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
            >
              {isUploadingPDF ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Processing...
                </>
              ) : (
                <>
                  <span>📤</span>
                  Upload PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Video Upload Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">🎥</div>
            <div>
              <h3 className="text-xl font-semibold">YouTube Video</h3>
              <p className="text-sm text-neutral-500">Extract transcripts from educational videos</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setVideoError(null);
                }}
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={isUploadingVideo}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            {videoError && (
              <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm whitespace-pre-line">
                ⚠️ {videoError}
                <div className="mt-2 text-xs text-red-500/80">
                  API: {API}
                </div>
              </div>
            )}

            {videoSuccess && (
              <div className="bg-green-900/20 border border-green-800 text-green-400 px-4 py-3 rounded-lg text-sm">
                ✅ Video processed successfully!
              </div>
            )}

            <button
              onClick={uploadVideo}
              disabled={!url.trim() || isUploadingVideo}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all px-6 py-3 rounded-xl font-medium shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
            >
              {isUploadingVideo ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Processing... (This may take a few minutes)
                </>
              ) : (
                <>
                  <span>🎥</span>
                  Process Video
                </>
              )}
            </button>
            <p className="text-xs text-neutral-500 text-center mt-2">
              ⏱️ Video processing can take 2-5 minutes depending on video length
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4">
        <p className="text-sm text-blue-300">
          💡 <strong>Tip:</strong> After uploading content, you can chat with the AI about the material or generate flashcards and quizzes in the Learning section.
        </p>
      </div>
    </div>
  );
}