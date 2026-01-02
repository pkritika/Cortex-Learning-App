# Cortex - AI-Powered Learning Platform 🧠

An interactive learning platform with AI-powered practice tests, video courses, flashcards, and gamification features.

![Cortex](./logo.png)

## Features

- 📚 **Video Courses** - Watch educational videos on Math, Science, Computing, and Economics
- 🧪 **AI Practice Tests** - Wolfram Alpha-powered math problems with step-by-step solutions
- 🃏 **Flashcards** - Study with interactive flashcards
- 🎮 **Gamification** - Streaks, badges, points, and confetti celebrations
- 🔍 **Search** - Find courses and videos quickly
- 📊 **Progress Tracking** - Track your learning journey

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion (animations)
- Canvas Confetti (celebrations)
- Lucide React (icons)

**Backend:**
- Node.js + Express
- TypeScript
- Wolfram Alpha API

## Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/cortex.git
cd cortex
```

2. Install dependencies
```bash
# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

3. Configure environment variables
```bash
# In client folder, create .env
VITE_API_URL=http://localhost:3000

# In server folder, create .env
WOLFRAM_APP_ID=your_wolfram_app_id
```

4. Start development servers
```bash
# Terminal 1 - Start server
cd server && npm run dev

# Terminal 2 - Start client
cd client && npm run dev
```

5. Open http://localhost:5173 in your browser

## Project Structure

```
cortex/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── config/         # Configuration files
│   │   └── types.ts        # TypeScript types
│   └── public/             # Static assets
│
└── server/                 # Express backend
    └── src/
        ├── engines/        # Subject-specific question generators
        ├── data.ts         # Course & video data
        ├── mathEngine.ts   # Wolfram Alpha integration
        └── index.ts        # API routes
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/:id` | Get course by ID |
| GET | `/api/practice/:subject` | Get practice test for subject |
| POST | `/api/login` | User login |
| POST | `/api/register` | User registration |
| GET | `/api/stats/:userId` | Get user stats |
| POST | `/api/progress` | Save learning progress |
| GET | `/api/flashcards/:subject` | Get flashcards |

## License

MIT
