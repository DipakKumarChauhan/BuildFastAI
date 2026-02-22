import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          AI Learning Assistant
        </h1>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
          Transform your learning materials into an interactive AI-powered study companion
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <FeatureCard
          icon="📤"
          title="Upload Content"
          description="Upload PDF documents or YouTube videos to build your knowledge base"
          link="/upload"
          linkText="Start Uploading"
          gradient="from-blue-600 to-blue-700"
        />
        <FeatureCard
          icon="💬"
          title="AI Chat"
          description="Ask questions and get instant answers about your uploaded materials"
          link="/chat"
          linkText="Start Chatting"
          gradient="from-purple-600 to-purple-700"
        />
        <FeatureCard
          icon="📚"
          title="Learning Tools"
          description="Generate flashcards and quizzes to enhance your study sessions"
          link="/learn"
          linkText="Explore Tools"
          gradient="from-green-600 to-green-700"
        />
      </div>

      {/* How It Works */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <Step
            number="1"
            title="Upload"
            description="Upload your PDFs or YouTube videos"
          />
          <Step
            number="2"
            title="Process"
            description="AI extracts and indexes your content"
          />
          <Step
            number="3"
            title="Chat"
            description="Ask questions and get answers"
          />
          <Step
            number="4"
            title="Learn"
            description="Generate flashcards and quizzes"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <StatCard
          icon="🚀"
          value="RAG Powered"
          label="Advanced Retrieval"
        />
        <StatCard
          icon="⚡"
          value="Real-time"
          label="Streaming Responses"
        />
        <StatCard
          icon="🎯"
          value="Smart"
          label="Context-Aware AI"
        />
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  link,
  linkText,
  gradient,
}: {
  icon: string;
  title: string;
  description: string;
  link: string;
  linkText: string;
  gradient: string;
}) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-blue-500 transition-all shadow-xl">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-neutral-400 text-sm mb-4">{description}</p>
      <Link
        href={link}
        className={`inline-block bg-gradient-to-r ${gradient} hover:opacity-90 transition-all px-4 py-2 rounded-lg text-sm font-medium`}
      >
        {linkText} →
      </Link>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
        {number}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-neutral-400">{description}</p>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="font-bold text-lg">{value}</div>
      <div className="text-sm text-neutral-500">{label}</div>
    </div>
  );
}
