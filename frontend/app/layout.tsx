import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Learning Assistant - RAG Powered",
  description: "Upload learning materials and interact with AI-powered chat, flashcards, and quizzes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body className="bg-neutral-950 text-neutral-100 min-h-screen">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col">
            <div className="mb-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Learning
              </h1>
              <p className="text-xs text-neutral-500 mt-1">RAG Powered Assistant</p>
            </div>

            <nav className="flex flex-col gap-2 flex-1">
              <NavLink href="/" icon="🏠">Dashboard</NavLink>
              <NavLink href="/upload" icon="📤">Upload</NavLink>
              <NavLink href="/chat" icon="💬">Chat</NavLink>
              <NavLink href="/learn" icon="📚">Learning</NavLink>
            </nav>

            <div className="mt-auto pt-4 border-t border-neutral-800">
              <p className="text-xs text-neutral-500">Powered by RAG</p>
            </div>
          </aside>

          {/* Main Workspace */}
          <main className="flex-1 overflow-y-auto bg-neutral-950">
            <div className="w-full max-w-5xl mx-auto px-6 py-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all hover:bg-neutral-800 hover:text-blue-400 group"
    >
      <span className="text-lg">{icon}</span>
      <span>{children}</span>
    </Link>
  );
}