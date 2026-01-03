import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Quiz } from '../types';
import { ChevronLeft, CheckCircle, XCircle, AlertCircle, Sparkles, Trophy, Zap, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { API_URL } from '../config/api';

export const PracticeTest: React.FC = () => {
    const { subject } = useParams<{ subject: string }>();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({}); // questionId -> selectedOptionIndex
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        fetch(`${API_URL}/api/practice/${subject}`)
            .then(res => {
                if (!res.ok) throw new Error('Test not found');
                return res.json();
            })
            .then(data => {
                setQuiz(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch practice test", err);
                setLoading(false);
            });
    }, [subject]);

    const handleOptionSelect = (optionIndex: number) => {
        if (!quiz || showFeedback) return;
        const currentQuestion = quiz.questions[currentQuestionIndex];
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionIndex }));

        // Show immediate feedback
        const isCorrect = optionIndex === currentQuestion.correctAnswer;
        setShowFeedback(isCorrect ? 'correct' : 'incorrect');

        if (isCorrect) {
            setStreak(s => s + 1);
            // Mini celebration for correct answer
            if (streak >= 2) {
                confetti({
                    particleCount: 30,
                    spread: 60,
                    origin: { y: 0.7 },
                    colors: ['#818cf8', '#a78bfa', '#c4b5fd']
                });
            }
        } else {
            setStreak(0);
        }

        // Auto-advance after feedback
        setTimeout(() => {
            setShowFeedback(null);
            if (currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setShowResults(true);
            }
        }, 1500);
    };

    const { user } = useAuth();

    useEffect(() => {
        if (showResults && quiz && user) {
            const results = calculateReport();
            if (results) {
                // Big celebration for completing the test
                const score = (results.totalScore / results.totalQuestions) * 100;
                if (score >= 80) {
                    // Fire confetti for great scores!
                    const duration = 3000;
                    const end = Date.now() + duration;
                    const colors = ['#818cf8', '#a78bfa', '#c4b5fd', '#fbbf24', '#34d399'];

                    (function frame() {
                        confetti({
                            particleCount: 5,
                            angle: 60,
                            spread: 55,
                            origin: { x: 0 },
                            colors: colors
                        });
                        confetti({
                            particleCount: 5,
                            angle: 120,
                            spread: 55,
                            origin: { x: 1 },
                            colors: colors
                        });

                        if (Date.now() < end) {
                            requestAnimationFrame(frame);
                        }
                    }());
                } else if (score >= 50) {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }

                fetch(`${API_URL}/api/results`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id || 'anonymous',
                        subject: subject,
                        score: results.totalScore,
                        totalQuestions: results.totalQuestions,
                        categoryBreakdown: results.categoryBreakdown
                    })
                }).catch(err => console.error("Failed to save result", err));
            }
        }
    }, [showResults]);

    const calculateReport = () => {
        if (!quiz) return null;

        const report: Record<string, { total: number, correct: number }> = {};
        let totalCorrect = 0;

        quiz.questions.forEach(q => {
            const category = q.category || 'General';
            if (!report[category]) {
                report[category] = { total: 0, correct: 0 };
            }
            report[category].total++;

            if (answers[q.id] === q.correctAnswer) {
                report[category].correct++;
                totalCorrect++;
            }
        });

        return { categoryBreakdown: report, totalScore: totalCorrect, totalQuestions: quiz.questions.length };
    };

    if (loading) return (
        <div className="p-12 text-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full"
            />
            <p className="mt-4 text-indigo-400">Loading test...</p>
        </div>
    );
    if (!quiz) return <div className="p-12 text-center text-gray-400">Practice test not found for {subject}.</div>;

    if (showResults) {
        const results = calculateReport();
        if (!results) return null;
        const percentage = Math.round((results.totalScore / results.totalQuestions) * 100);

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto py-8 px-4"
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="glass-card rounded-2xl p-8 text-center mb-8"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                        {percentage >= 80 ? (
                            <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-400" />
                        ) : percentage >= 50 ? (
                            <Target className="w-20 h-20 mx-auto mb-4 text-indigo-400" />
                        ) : (
                            <Zap className="w-20 h-20 mx-auto mb-4 text-purple-400" />
                        )}
                    </motion.div>

                    <h1 className="text-3xl font-bold text-white mb-2">
                        {percentage >= 80 ? "Excellent Work! 🎉" : percentage >= 50 ? "Good Job! 👍" : "Keep Practicing! 💪"}
                    </h1>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring" }}
                        className="text-7xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4"
                    >
                        {percentage}%
                    </motion.div>

                    <p className="text-gray-400">You got {results.totalScore} out of {results.totalQuestions} correct.</p>

                    <div className="mt-8 flex justify-center gap-4">
                        <Link to={`/subject/${subject}`} className="px-6 py-2 glass text-white rounded-full font-bold hover:bg-white/10 transition-colors">
                            Back to Subject
                        </Link>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-bold hover:opacity-90 transition-opacity"
                        >
                            Retake Test
                        </motion.button>
                    </div>
                </motion.div>

                <h2 className="text-xl font-bold text-white mb-4">Performance Report</h2>
                <div className="grid gap-4">
                    {Object.entries(results.categoryBreakdown).map(([category, stats], index) => {
                        const catPercentage = Math.round((stats.correct / stats.total) * 100);
                        let statusColor = 'text-green-400';
                        let statusBg = 'bg-green-500/20';
                        let statusMessage = 'Great Job!';
                        let Icon = CheckCircle;

                        if (catPercentage < 50) {
                            statusColor = 'text-red-400';
                            statusBg = 'bg-red-500/20';
                            statusMessage = 'Needs Practice';
                            Icon = XCircle;
                        } else if (catPercentage < 80) {
                            statusColor = 'text-yellow-400';
                            statusBg = 'bg-yellow-500/20';
                            statusMessage = 'Good, keep improving';
                            Icon = AlertCircle;
                        }

                        return (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card rounded-xl p-6 flex items-center justify-between"
                            >
                                <div>
                                    <h3 className="font-bold text-lg text-white mb-1">{category}</h3>
                                    <div className="text-sm text-gray-400">{stats.correct}/{stats.total} Correct</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`px-4 py-1 rounded-full text-sm font-bold ${statusBg} ${statusColor} flex items-center gap-2`}>
                                        <Icon size={16} />
                                        {statusMessage}
                                    </div>
                                    <div className="text-2xl font-bold text-white w-16 text-right">{catPercentage}%</div>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Incorrect Answers Section */}
                    <div className="mt-12">
                        <h2 className="text-xl font-bold text-white mb-4">Review Incorrect Answers</h2>
                        <div className="space-y-6">
                            {quiz.questions.map((q, index) => {
                                if (answers[q.id] === q.correctAnswer) return null;

                                return (
                                    <motion.div
                                        key={q.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="glass-card rounded-xl p-6 border border-red-500/30"
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs font-bold uppercase">
                                                {q.category || 'General'}
                                            </span>
                                            <span className="text-red-400 text-sm font-semibold flex items-center gap-1">
                                                <XCircle size={14} /> Incorrect
                                            </span>
                                            {q.explanation && (
                                                <span className="text-purple-400 text-sm font-semibold flex items-center gap-1 ml-auto">
                                                    <Sparkles size={14} /> Wolfram Alpha
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-lg text-white mb-4">{q.text}</h3>

                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                                                <div className="text-xs font-bold text-red-400 mb-1">Your Answer</div>
                                                <div className="font-medium text-white">
                                                    {q.options[answers[q.id]]}
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                                                <div className="text-xs font-bold text-green-400 mb-1">Correct Answer</div>
                                                <div className="font-medium text-white">
                                                    {q.options[q.correctAnswer]}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Solution/Explanation Section */}
                                        {q.explanation && (
                                            <div className="mt-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                                                <div className="text-xs font-bold text-purple-400 mb-2 flex items-center gap-1">
                                                    <Sparkles size={12} /> Solution
                                                </div>
                                                <div className="text-gray-300 text-sm whitespace-pre-line">
                                                    {q.explanation.split('**').map((part, i) =>
                                                        i % 2 === 1 ? <strong key={i} className="text-white">{part}</strong> : part
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                            {/* If perfect score */}
                            {results.totalScore === results.totalQuestions && (
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    className="text-center p-8 glass-card rounded-xl border border-green-500/30 text-green-400 font-medium"
                                >
                                    🎉 Perfect score! No incorrect answers to review.
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
    const isWolframQuestion = currentQuestion.id.startsWith('wolfram-');

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <Link to={`/subject/${subject}`} className="text-gray-400 hover:text-indigo-400 flex items-center gap-1 transition-colors">
                        <ChevronLeft size={20} /> Exit Test
                    </Link>
                    <div className="flex items-center gap-3">
                        {streak >= 2 && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center gap-1 px-3 py-1 bg-orange-500/20 rounded-full"
                            >
                                <Zap size={14} className="text-orange-400" />
                                <span className="text-orange-400 text-sm font-bold">{streak} streak!</span>
                            </motion.div>
                        )}
                        {isWolframQuestion && (
                            <span className="flex items-center gap-1 text-purple-400 text-sm">
                                <Sparkles size={16} /> Wolfram Alpha
                            </span>
                        )}
                        <div className="text-sm font-bold text-gray-400">
                            Question {currentQuestionIndex + 1} of {quiz.questions.length}
                        </div>
                    </div>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card rounded-2xl p-8 min-h-[400px] flex flex-col relative overflow-hidden"
                >
                    {/* Feedback Overlay */}
                    <AnimatePresence>
                        {showFeedback && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={`absolute inset-0 flex items-center justify-center z-10 ${showFeedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'
                                    }`}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-center"
                                >
                                    {showFeedback === 'correct' ? (
                                        <>
                                            <CheckCircle className="w-20 h-20 mx-auto text-green-400 mb-4" />
                                            <p className="text-2xl font-bold text-green-400">Correct! 🎉</p>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-20 h-20 mx-auto text-red-400 mb-4" />
                                            <p className="text-2xl font-bold text-red-400">Not quite...</p>
                                        </>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mb-8">
                        <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
                            {currentQuestion.category || 'General'}
                        </span>
                        <h2 className="text-2xl font-bold text-white leading-snug">
                            {currentQuestion.text}
                        </h2>
                    </div>

                    <div className="space-y-3 flex-1">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = answers[currentQuestion.id] === index;
                            const isCorrect = showFeedback && index === currentQuestion.correctAnswer;
                            const isWrong = showFeedback && isSelected && index !== currentQuestion.correctAnswer;

                            return (
                                <motion.button
                                    key={index}
                                    whileHover={!showFeedback ? { scale: 1.02 } : {}}
                                    whileTap={!showFeedback ? { scale: 0.98 } : {}}
                                    onClick={() => handleOptionSelect(index)}
                                    disabled={!!showFeedback}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isCorrect
                                        ? 'border-green-500 bg-green-500/20 text-green-300'
                                        : isWrong
                                            ? 'border-red-500 bg-red-500/20 text-red-300'
                                            : isSelected
                                                ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 font-semibold'
                                                : 'border-gray-700 hover:border-indigo-500/50 hover:bg-gray-800/50 text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isCorrect ? 'border-green-500 bg-green-500' :
                                            isWrong ? 'border-red-500 bg-red-500' :
                                                isSelected ? 'border-indigo-500' : 'border-gray-600'
                                            }`}>
                                            {isCorrect && <CheckCircle size={14} className="text-white" />}
                                            {isWrong && <XCircle size={14} className="text-white" />}
                                            {isSelected && !showFeedback && <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>}
                                        </div>
                                        {option}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
