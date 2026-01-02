import express from 'express';
import cors from 'cors';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from 'axios';
import path from 'path';
import { COURSES, PRACTICE_TESTS, Question, Quiz } from './data';

const app = express();
const port = process.env.PORT || 3000;

// Allow all origins for Vercel deployment
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

import { MathEngine } from './mathEngine';
import { ScienceEngine } from './engines/scienceEngine';
import { HistoryEngine } from './engines/historyEngine';
import { ComputingEngine } from './engines/computingEngine';
import { EconomicsEngine } from './engines/economicsEngine';

async function fetchQuestions(subject: string, amount: number = 20): Promise<Question[]> {
    subject = subject.toLowerCase();

    switch (subject) {
        case 'math':
            // Use Wolfram Alpha if configured, otherwise fall back to local generation
            if (MathEngine.isWolframConfigured()) {
                return MathEngine.generateQuestionsWithWolfram(amount);
            }
            return MathEngine.generateQuestions(amount);
        case 'science':
            return ScienceEngine.generateQuestions(amount);
        case 'history':
            return HistoryEngine.generateQuestions(amount);
        case 'computing':
            return ComputingEngine.generateQuestions(amount);
        case 'economics':
            return EconomicsEngine.generateQuestions(amount);
        default:
            console.warn(`No engine found for subject: ${subject}`);
            return [];
    }
}



app.get('/', (req, res) => {
    res.send('Server is running. Please visit <a href="http://localhost:5173">http://localhost:5173</a> to view the app.');
});

app.get('/api/courses', (req, res) => {
    res.json(COURSES);
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    // Mock authentication - accept any valid email/password
    if (email && password) {
        res.json({
            id: 'u1',
            name: 'Test Student',
            email: email,
            avatar: 'https://ui-avatars.com/api/?name=Test+Student&background=0D8ABC&color=fff'
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
});

app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    if (name && email && password) {
        res.json({
            id: 'u' + Date.now(),
            name: name,
            email: email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`
        });
    } else {
        res.status(400).json({ message: 'Missing required fields' });
    }
});

app.get('/api/courses/:id', (req, res) => {
    const course = COURSES.find(c => c.id === req.params.id);
    if (course) {
        res.json(course);
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
});

app.get('/api/practice/:subject', async (req, res) => {
    const subject = req.params.subject.toLowerCase();

    // Try to fetch from API first (limit to 5 questions)
    const questions = await fetchQuestions(subject, 5);

    if (questions.length > 0) {
        const quiz: Quiz = {
            id: `pt-${subject}-${Date.now()}`,
            title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Practice Test`,
            questions: questions
        };
        res.json(quiz);
    } else {
        // Fallback to static data
        const test = PRACTICE_TESTS[subject];
        if (test) {
            res.json(test);
        } else {
            res.status(404).json({ message: 'Practice test not found for this subject' });
        }
    }
});

// --- Results Endpoints ---

// --- Results Endpoints ---

// In-memory storage for Vercel (since filesystem is read-only)
const resultsStore: any[] = [];

// Helper to read results
async function readResults(): Promise<any[]> {
    return resultsStore;
}

// Helper to write results
async function writeResults(results: any[]): Promise<void> {
    // No-op for in-memory
    return;
}

app.get('/api/results', async (req, res) => {
    const { userId } = req.query;
    const results = await readResults();

    if (userId) {
        // Filter by user if provided
        const userResults = results.filter((r: any) => r.userId === userId);
        // Sort by date descending
        userResults.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        res.json(userResults);
    } else {
        res.json(results);
    }
});

app.post('/api/results', async (req, res) => {
    const newResult = req.body;

    if (!newResult.userId || !newResult.subject || newResult.score === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Add server-side timestamp if not present
    if (!newResult.timestamp) {
        newResult.timestamp = new Date().toISOString();
    }

    const results = await readResults();
    results.push(newResult);
    await writeResults(results);

    res.status(201).json(newResult);
});

import { calculateStats } from './gamification';

app.get('/api/stats/:userId', async (req, res) => {
    const { userId } = req.params;
    const allResults = await readResults();
    const userResults = allResults.filter((r: any) => r.userId === userId);

    const stats = calculateStats(userResults);
    res.json(stats);
});

// --- Progress Tracking ---
// --- Progress Tracking ---
// In-memory storage for Vercel
const progressStore: any[] = [];

async function readProgress(): Promise<any[]> {
    return progressStore;
}

async function writeProgress(progress: any[]): Promise<void> {
    // No-op for in-memory
    return;
}

app.post('/api/progress', async (req, res) => {
    const { userId, courseId, videoId } = req.body;

    if (!userId || !courseId || !videoId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const allProgress = await readProgress();
    const existingIndex = allProgress.findIndex((p: any) => p.userId === userId);

    const newProgress = {
        userId,
        courseId,
        videoId,
        timestamp: new Date().toISOString()
    };

    if (existingIndex >= 0) {
        allProgress[existingIndex] = newProgress;
    } else {
        allProgress.push(newProgress);
    }

    await writeProgress(allProgress);
    res.json(newProgress);
});

app.get('/api/progress/:userId', async (req, res) => {
    const { userId } = req.params;
    const allProgress = await readProgress();
    const userProgress = allProgress.find((p: any) => p.userId === userId);

    if (userProgress) {
        res.json(userProgress);
    } else {
        res.json(null);
    }
});

// --- Flashcards ---
import { FlashcardEngine } from './flashcardEngine';

app.get('/api/flashcards/all', (req, res) => {
    const amount = parseInt(req.query.amount as string) || 10;
    const flashcards = FlashcardEngine.getAllFlashcards(amount);
    res.json(flashcards);
});

app.get('/api/flashcards/:subject', (req, res) => {
    const { subject } = req.params;
    const amount = parseInt(req.query.amount as string) || 20;
    const flashcards = FlashcardEngine.getFlashcards(subject, amount);
    res.json(flashcards);
});


// Only start the server if running locally (not on Vercel)
if (process.env.VERCEL !== '1') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

// Export for Vercel serverless
export default app;
