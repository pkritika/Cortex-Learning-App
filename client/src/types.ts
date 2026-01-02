export interface Video {
    id: string;
    title: string;
    url: string;
    duration: string;
}

export interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number; // index
    category?: string; // e.g., "Algebra", "Geometry"
    explanation?: string; // Optional explanation (e.g., from Wolfram Alpha)
}

export interface Quiz {
    id: string;
    title: string;
    questions: Question[];
}

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    videos: Video[];
    quizzes: Quiz[];
}

export interface TestResult {
    userId: string;
    subject: string;
    score: number;
    totalQuestions: number;
    timestamp?: string;
    categoryBreakdown?: Record<string, { total: number, correct: number }>;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    dateUnlocked?: string;
}

export interface UserStats {
    totalPoints: number;
    streakDays: number;
    badges: Badge[];
    testsCompleted: number;
    correctAnswers: number;
}
