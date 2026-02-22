# AI Learning Assistant - Frontend

A modern, responsive Next.js frontend for the AI Learning Assistant RAG application. Upload learning materials, chat with AI, and generate flashcards and quizzes.

## Features

- 🎨 **Modern UI/UX** - Beautiful dark theme with smooth animations
- 💬 **AI Chat** - Real-time streaming chat with context-aware responses
- 📤 **Content Upload** - Upload PDFs and process YouTube videos
- 📚 **Learning Tools** - Generate flashcards and quizzes from your content
- ⚡ **Fast & Responsive** - Optimized for performance and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running (see backend README)

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, set this to your backend API URL:
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/
│   ├── chat/          # Chat interface with streaming
│   ├── learn/         # Flashcards and quiz generation
│   ├── upload/        # PDF and video upload
│   ├── layout.tsx     # Root layout with navigation
│   ├── page.tsx       # Home page
│   └── globals.css    # Global styles
├── public/            # Static assets
└── package.json       # Dependencies
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variable `NEXT_PUBLIC_API_URL`
4. Deploy!

### Other Platforms

This Next.js app can be deployed on any platform that supports Node.js:
- **Netlify** - Connect your GitHub repo
- **Railway** - Deploy with one click
- **Docker** - Use the standalone output mode

## Features in Detail

### Chat Page
- Real-time streaming responses
- Chat and Study modes
- Message history with timestamps
- Error handling and loading states

### Upload Page
- PDF file upload with validation
- YouTube video URL processing
- File size and format validation
- Success/error notifications

### Learn Page
- Generate flashcards from topics
- Create quizzes with customizable question count
- Tabbed interface for easy navigation
- Beautiful card-based UI

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **React 19** - UI library

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
