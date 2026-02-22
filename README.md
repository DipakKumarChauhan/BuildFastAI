# AI Learning Assistant - RAG-Powered Educational Platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)

A production-ready, full-stack RAG (Retrieval-Augmented Generation) application that transforms learning materials into an interactive AI-powered study companion. Upload PDFs and YouTube videos, chat with AI about your content, and generate flashcards and quizzes.

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation) • [Deployment](#-deployment) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

AI Learning Assistant is a comprehensive educational platform that leverages RAG technology to provide intelligent, context-aware assistance for learning. The system allows users to:

- **Upload Learning Materials**: Process PDF documents and YouTube video transcripts
- **Interactive Chat**: Engage in natural language conversations with AI about uploaded content
- **Generate Study Tools**: Create flashcards and quizzes from learning materials
- **Maintain Context**: Chat history and conversation context for seamless learning experiences

The application uses vector embeddings (Pinecone) for semantic search, Google Gemini for LLM capabilities, and a modern Next.js frontend with FastAPI backend.

---

## ✨ Features

### Core Functionality

- **📤 Document Upload**
  - PDF document processing with text extraction
  - YouTube video transcript extraction
  - Automatic chunking and vectorization
  - Support for multiple document formats

- **💬 AI-Powered Chat**
  - Real-time streaming responses
  - Context-aware conversations using RAG
  - Chat and Study modes
  - Conversation history and session management
  - Context window management (last 5 messages)

- **📚 Learning Tools**
  - Generate flashcards from topics
  - Create multiple-choice quizzes
  - Customizable quiz question count
  - Difficulty-based categorization

- **🎨 Modern UI/UX**
  - Dark theme with gradient accents
  - Responsive design (mobile-friendly)
  - Real-time connection status indicators
  - Smooth animations and transitions
  - Comprehensive error handling

### Technical Features

- **Vector Search**: Semantic search using Pinecone vector database
- **Streaming Responses**: Real-time token streaming for chat
- **Session Management**: Persistent chat sessions with history
- **Error Handling**: Comprehensive error messages and recovery
- **API Health Monitoring**: Connection status and health checks
- **CORS Support**: Configured for cross-origin requests

---

## 🛠 Tech Stack

### Backend

- **Framework**: FastAPI 0.100+
- **Language**: Python 3.10+
- **Database**: SQLAlchemy (PostgreSQL/SQLite compatible)
- **Vector Database**: Pinecone
- **LLM**: Google Gemini 2.5 Flash
- **Embeddings**: Gemini Embedding Model (768 dimensions)
- **ASGI Server**: Uvicorn

### Frontend

- **Framework**: Next.js 16.1.6
- **Language**: TypeScript 5+
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4
- **Fonts**: Geist Sans & Geist Mono

### Infrastructure

- **Vector DB**: Pinecone
- **LLM Provider**: Google Gemini API
- **Database**: PostgreSQL (production) / SQLite (development)

---

## 🏗 Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Next.js App   │────────▶│   FastAPI       │
│   (Frontend)    │  HTTP   │   (Backend)     │
└─────────────────┘         └────────┬────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
            ┌───────▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐
            │  PostgreSQL  │  │  Pinecone   │  │  Gemini    │
            │  (Database)  │  │  (Vectors)  │  │  (LLM)     │
            └──────────────┘  └─────────────┘  └────────────┘
```

### Data Flow

1. **Upload Flow**: PDF/Video → Text Extraction → Chunking → Embedding → Pinecone Storage
2. **Chat Flow**: User Query → Embedding → Vector Search → Context Retrieval → LLM → Response
3. **Generation Flow**: Topic → Vector Search → Context Retrieval → LLM Prompt → Flashcards/Quiz

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.10+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** and npm ([Download](https://nodejs.org/))
- **PostgreSQL** (optional, SQLite works for development)
- **Git** ([Download](https://git-scm.com/downloads))

### API Keys Required

- **Google Gemini API Key** ([Get it here](https://makersuite.google.com/app/apikey))
- **Pinecone API Key** ([Get it here](https://www.pinecone.io/))

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/DipakKumarChauhan/BuildFastAI.git
cd BuildFastAI
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

---

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend/` directory:

```env
# Application
APP_NAME=AI Learning Assistant
ENVIRONMENT=development
LOG_LEVEL=INFO

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/learning_assistant
# For SQLite (development):
# DATABASE_URL=sqlite:///./learning_assistant.db

# Pinecone
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX=your_index_name

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend Configuration

Create a `.env.local` file in the `frontend/` directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# For production:
# NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Pinecone Setup

1. Create a Pinecone account at [pinecone.io](https://www.pinecone.io/)
2. Create a new index with:
   - **Dimensions**: 768
   - **Metric**: cosine
   - **Name**: Your index name
3. Copy your API key and index name to the `.env` file

---

## 🎮 Usage

### Starting the Backend

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Start the server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Or use the start script
chmod +x start.sh
./start.sh
```

The backend will be available at `http://localhost:8000`

- API Documentation: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### Starting the Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Using the Application

1. **Upload Content**
   - Navigate to the Upload page
   - Upload a PDF file or enter a YouTube URL
   - Wait for processing to complete

2. **Chat with AI**
   - Go to the Chat page
   - Select Chat or Study mode
   - Ask questions about your uploaded content
   - The AI will use context from your documents

3. **Generate Study Tools**
   - Visit the Learning page
   - Enter a topic related to your content
   - Generate flashcards or quizzes
   - Review and study the generated content

---

## 📚 API Documentation

### Base URL

```
http://localhost:8000
```

### Endpoints

#### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok"
}
```

#### Upload PDF

```http
POST /process-pdf
Content-Type: multipart/form-data
```

**Request:**
- `file`: PDF file (multipart/form-data)

**Response:**
```json
{
  "document_id": "uuid-string"
}
```

#### Process YouTube Video

```http
POST /process-video
Content-Type: application/json
```

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=..."
}
```

**Response:**
```json
{
  "document_id": "uuid-string"
}
```

#### Chat (Streaming)

```http
POST /chat
Content-Type: application/json
```

**Request:**
```json
{
  "message": "What is machine learning?",
  "mode": "chat",
  "session_id": "optional-session-id"
}
```

**Response:** Streaming text/event-stream

#### Generate Flashcards

```http
POST /generate-flashcards
Content-Type: application/json
```

**Request:**
```json
{
  "topic": "Machine Learning Basics"
}
```

**Response:**
```json
{
  "flashcards": [
    {
      "question": "What is supervised learning?",
      "answer": "Supervised learning is...",
      "difficulty": "medium"
    }
  ]
}
```

#### Generate Quiz

```http
POST /generate-quiz
Content-Type: application/json
```

**Request:**
```json
{
  "topic": "Neural Networks",
  "quiz_count": 5
}
```

**Response:**
```json
{
  "quiz": [
    {
      "question": "What is a neural network?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Option A",
      "explanation": "...",
      "difficulty": "medium"
    }
  ]
}
```

#### Get Chat History

```http
POST /chat/history
Content-Type: application/json
```

**Request:**
```json
{
  "session_id": "session-uuid"
}
```

**Response:**
```json
{
  "history": [
    {
      "user": "What is AI?",
      "assistant": "AI is..."
    }
  ],
  "session_id": "session-uuid"
}
```

### Interactive API Documentation

Visit `http://localhost:8000/docs` for interactive Swagger UI documentation.

---

## 📁 Project Structure

```
BuildFastAI/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py          # Configuration settings
│   │   │   ├── llm_client.py     # Gemini LLM client
│   │   │   ├── logger.py         # Logging configuration
│   │   │   └── pinecone_client.py # Pinecone client
│   │   ├── db/
│   │   │   ├── database.py       # Database connection
│   │   │   ├── models.py         # SQLAlchemy models
│   │   │   └── session.py        # Database session
│   │   ├── routers/
│   │   │   ├── chat.py           # Chat endpoints
│   │   │   ├── generate_flashcard.py # Flashcard/Quiz endpoints
│   │   │   ├── health.py         # Health check
│   │   │   └── process.py        # Upload endpoints
│   │   ├── services/
│   │   │   ├── chat_history_service.py # Chat history management
│   │   │   ├── flashcard_service.py     # Flashcard generation
│   │   │   ├── ingestion_service.py     # Document processing
│   │   │   ├── quiz_service.py         # Quiz generation
│   │   │   └── rag_service.py          # RAG operations
│   │   ├── utils/
│   │   │   ├── chunker.py        # Text chunking
│   │   │   ├── loader.py         # PDF loader
│   │   │   └── loaders.py        # YouTube loader
│   │   └── main.py               # FastAPI application
│   ├── requirements.txt
│   ├── start.sh
│   └── .env                       # Environment variables (create this)
│
├── frontend/
│   ├── app/
│   │   ├── chat/
│   │   │   └── page.tsx          # Chat interface
│   │   ├── learn/
│   │   │   └── page.tsx          # Learning tools
│   │   ├── upload/
│   │   │   └── page.tsx          # Upload interface
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Global styles
│   ├── public/                   # Static assets
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── .env.local                # Environment variables (create this)
│
├── .gitignore
└── README.md
```

---

## 🚢 Deployment

### Backend Deployment

#### Option 1: Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Railway will auto-deploy on push

#### Option 2: Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables

#### Option 3: Docker

```dockerfile
# Dockerfile example
FROM python:3.10-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Deployment

#### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Import repository on [Vercel](https://vercel.com)
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

#### Option 2: Netlify

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables

#### Option 3: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build
CMD ["npm", "start"]
```

### Production Checklist

- [ ] Set `ENVIRONMENT=production` in backend `.env`
- [ ] Use PostgreSQL for production database
- [ ] Configure CORS with specific origins
- [ ] Set up SSL/TLS certificates
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for database
- [ ] Set up CI/CD pipeline
- [ ] Configure environment variables securely
- [ ] Test all endpoints in production

---

## 🔧 Troubleshooting

### Common Issues

#### Backend won't start

```bash
# Check Python version
python --version  # Should be 3.10+

# Check if virtual environment is activated
which python  # Should point to venv

# Reinstall dependencies
pip install -r requirements.txt --upgrade
```

#### Frontend can't connect to backend

1. Verify backend is running: `curl http://localhost:8000/health`
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Verify CORS configuration in backend
4. Check browser console for specific errors

#### Vector search returns no results

1. Ensure documents have been uploaded
2. Verify Pinecone index is created with 768 dimensions
3. Check Pinecone API key and index name
4. Verify embeddings are being generated correctly

#### Chat history not working

1. Verify database connection
2. Check if `Chat` table exists in database
3. Verify session IDs are being sent from frontend
4. Check backend logs for database errors

### Getting Help

- Check the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) file for detailed solutions
- Review backend logs for error messages
- Check browser console for frontend errors
- Verify all environment variables are set correctly

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Follow PEP 8 for Python code
- Use TypeScript for frontend code
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features
- Test your changes before submitting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern web framework
- [Next.js](https://nextjs.org/) - React framework
- [Pinecone](https://www.pinecone.io/) - Vector database
- [Google Gemini](https://deepmind.google/technologies/gemini/) - LLM provider
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

## 📞 Contact & Support

- **Repository**: [GitHub](https://github.com/DipakKumarChauhan/BuildFastAI)
- **Issues**: [GitHub Issues](https://github.com/DipakKumarChauhan/BuildFastAI/issues)

---

<div align="center">

**Made with ❤️ for learners everywhere**

⭐ Star this repo if you find it helpful!

</div>
