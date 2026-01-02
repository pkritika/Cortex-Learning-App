export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string; // identifier for icon
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

const BADGE_DEFINITIONS = [
    { id: 'scholar', name: 'Scholar', description: 'Complete your first practice test', icon: 'award-blue' },
    { id: 'math-whiz', name: 'Math Whiz', description: 'Get 20 correct answers in Math', icon: 'sigma' },
    { id: 'science-pro', name: 'Science Pro', description: 'Get 20 correct answers in Science', icon: 'atom' },
    { id: 'dedication', name: 'Dedication', description: 'Maintain a 3-day streak', icon: 'flame' },
    { id: 'perfectionist', name: 'Perfectionist', description: 'Achieve a 100% score on a test', icon: 'star' }
];

export const calculateStats = (results: any[]): UserStats => {
    let totalPoints = 0;
    let correctAnswers = 0;
    let testsCompleted = results.length;

    // Category counters
    const categoryCorrect: Record<string, number> = {};
    let hasPerfectScore = false;

    // --- Points Calculation ---
    results.forEach(result => {
        const correct = result.score || 0;
        correctAnswers += correct;

        // 100 points per correct answer
        totalPoints += (correct * 100);

        // 500 bonus for completing a test
        totalPoints += 500;

        // Track category stats
        if (result.categoryBreakdown) {
            Object.keys(result.categoryBreakdown).forEach(cat => {
                // cat looks like "Math: Calculus"
                const subject = cat.split(':')[0].trim().toLowerCase();
                if (!categoryCorrect[subject]) categoryCorrect[subject] = 0;
                categoryCorrect[subject] += result.categoryBreakdown[cat].correct;
            });
            // Fallback if breakdown missing (legacy) or just use Subject field
        }

        // Also simpler check using subject field directly
        const subject = (result.subject || '').toLowerCase();
        if (!categoryCorrect[subject]) categoryCorrect[subject] = 0;
        // Note: result.score is total correct for that test
        categoryCorrect[subject] += correct;


        if (result.totalQuestions > 0 && result.score === result.totalQuestions) {
            hasPerfectScore = true;
        }
    });

    // --- Streak Calculation ---
    // Sort unique dates descending
    const dates = [...new Set(results.map(r => r.timestamp ? new Date(r.timestamp).toDateString() : null).filter(d => d))];
    dates.sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime());

    let streak = 0;
    if (dates.length > 0) {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        // Check if user practiced today or yesterday to keep streak alive
        if (dates[0] === today || dates[0] === yesterday) {
            streak = 1;
            let currentDate = new Date(dates[0]!);

            // Iterate backwards to find consecutive days
            for (let i = 1; i < dates.length; i++) {
                const prevDate = new Date(dates[i]!);
                const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    streak++;
                    currentDate = prevDate;
                } else {
                    break;
                }
            }
        }
    }

    // --- Badge Unlocking ---
    const badges: Badge[] = BADGE_DEFINITIONS.map(def => {
        let unlocked = false;

        if (def.id === 'scholar' && testsCompleted >= 1) unlocked = true;
        if (def.id === 'math-whiz' && (categoryCorrect['math'] || 0) >= 20) unlocked = true;
        // Check "science" or "science: physics" etc
        const scienceTotal = (categoryCorrect['science'] || 0);
        if (def.id === 'science-pro' && scienceTotal >= 20) unlocked = true;

        if (def.id === 'dedication' && streak >= 3) unlocked = true;
        if (def.id === 'perfectionist' && hasPerfectScore) unlocked = true;

        return {
            ...def,
            unlocked
        };
    });

    return {
        totalPoints,
        streakDays: streak,
        badges,
        testsCompleted,
        correctAnswers
    };
};
