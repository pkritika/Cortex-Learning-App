import React, { useEffect, useState } from 'react';
import { Shuffle, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { API_URL } from '../config/api';

interface Flashcard {
    id: string;
    subject: string;
    question: string;
    answer: string;
    category?: string;
}

export const Flashcards: React.FC = () => {
    const [subject, setSubject] = useState<string>('all');
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [knownCount, setKnownCount] = useState(0);

    useEffect(() => {
        setLoading(true);
        const endpoint = subject === 'all'
            ? `${API_URL}/api/flashcards/all`
            : `${API_URL}/api/flashcards/${subject}`;

        fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                setFlashcards(data);
                setCurrentIndex(0);
                setIsFlipped(false);
                setKnownCount(0);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch flashcards:', err);
                setLoading(false);
            });
    }, [subject]);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    const handleKnown = () => {
        setKnownCount(knownCount + 1);
        handleNext();
    };

    const handleUnknown = () => {
        handleNext();
    };

    const shuffleCards = () => {
        const shuffled = [...flashcards];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setFlashcards(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-primary">Loading...</div>;
    }

    const currentCard = flashcards[currentIndex];
    const progress = flashcards.length > 0 ? ((currentIndex + 1) / flashcards.length) * 100 : 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-dark">Flashcards</h1>
                    <p className="text-text-light mt-1">Master concepts through active recall</p>
                </div>
                <button
                    onClick={shuffleCards}
                    className="flex items-center gap-2 px-4 py-2 glass glass-hover rounded-lg transition-all"
                >
                    <Shuffle size={18} />
                    <span className="font-medium">Shuffle</span>
                </button>
            </div>

            {/* Subject Selector */}
            <div className="flex flex-wrap gap-2">
                {['all', 'math', 'science', 'computing', 'history', 'economics'].map(sub => (
                    <button
                        key={sub}
                        onClick={() => setSubject(sub)}
                        className={`px-4 py-2 rounded-full font-medium transition-all ${subject === sub
                            ? 'bg-primary text-white shadow-lg shadow-primary/50'
                            : 'glass glass-hover text-text-dark'
                            }`}
                    >
                        {sub.charAt(0).toUpperCase() + sub.slice(1)}
                    </button>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="glass-card rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-text-dark">
                        Card {currentIndex + 1} of {flashcards.length}
                    </span>
                    <span className="text-sm font-medium text-green-400">
                        Known: {knownCount}
                    </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Flashcard */}
            {currentCard ? (
                <div className="perspective-1000">
                    <div
                        onClick={handleFlip}
                        className={`relative w-full h-96 cursor-pointer transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''
                            }`}
                        style={{
                            transformStyle: 'preserve-3d',
                            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                        }}
                    >
                        {/* Front */}
                        <div
                            className="absolute inset-0 glass-card rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden"
                            style={{ backfaceVisibility: 'hidden' }}
                        >
                            <div className="text-xs uppercase font-bold text-primary mb-4">
                                {currentCard.category || currentCard.subject}
                            </div>
                            <div className="text-2xl font-bold text-text-dark text-center mb-6">
                                {currentCard.question}
                            </div>
                            <div className="text-sm text-text-light">Click to reveal answer</div>
                        </div>

                        {/* Back */}
                        <div
                            className="absolute inset-0 glass-card rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden relative overflow-hidden"
                            style={{
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30"></div>
                            <div className="relative z-10">
                                <div className="text-xs uppercase font-bold text-primary mb-4">
                                    Answer
                                </div>
                                <div className="text-3xl font-bold text-center text-text-dark">
                                    {currentCard.answer}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="glass-card rounded-2xl p-12 text-center">
                    <p className="text-text-light">No flashcards available for this subject.</p>
                </div>
            )}

            {/* Controls */}
            {currentCard && (
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Navigation */}
                    <div className="flex gap-2 flex-1">
                        <button
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 glass glass-hover rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={20} />
                            <span className="font-medium">Previous</span>
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentIndex === flashcards.length - 1}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 glass glass-hover rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <span className="font-medium">Next</span>
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Know/Don't Know */}
                    <div className="flex gap-2 flex-1">
                        <button
                            onClick={handleUnknown}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 glass rounded-lg hover:bg-red-500/20 border-red-500/30 transition-all font-medium text-red-400"
                        >
                            <X size={20} />
                            <span>Don't Know</span>
                        </button>
                        <button
                            onClick={handleKnown}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 glass rounded-lg hover:bg-green-500/20 border-green-500/30 transition-all font-medium text-green-400"
                        >
                            <Check size={20} />
                            <span>Know It</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
