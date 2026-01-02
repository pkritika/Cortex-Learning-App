import { MathEngine } from './mathEngine';
import { ScienceEngine } from './engines/scienceEngine';
import { HistoryEngine } from './engines/historyEngine';
import { ComputingEngine } from './engines/computingEngine';
import { EconomicsEngine } from './engines/economicsEngine';
import { Question } from './data';

export interface Flashcard {
    id: string;
    subject: string;
    question: string;
    answer: string;
    category?: string;
}

function questionToFlashcard(q: Question, subject: string): Flashcard {
    return {
        id: q.id,
        subject,
        question: q.text,
        answer: q.options[q.correctAnswer],
        category: q.category
    };
}

export const FlashcardEngine = {
    getFlashcards(subject: string, amount: number = 20): Flashcard[] {
        let questions: Question[] = [];

        switch (subject.toLowerCase()) {
            case 'math':
                questions = MathEngine.generateQuestions(amount);
                break;
            case 'science':
                questions = ScienceEngine.generateQuestions(amount);
                break;
            case 'history':
                questions = HistoryEngine.generateQuestions(amount);
                break;
            case 'computing':
                questions = ComputingEngine.generateQuestions(amount);
                break;
            case 'economics':
                questions = EconomicsEngine.generateQuestions(amount);
                break;
            default:
                return [];
        }

        return questions.map(q => questionToFlashcard(q, subject));
    },

    getAllFlashcards(amountPerSubject: number = 10): Flashcard[] {
        const subjects = ['math', 'science', 'history', 'computing', 'economics'];
        const allCards: Flashcard[] = [];

        subjects.forEach(subject => {
            const cards = this.getFlashcards(subject, amountPerSubject);
            allCards.push(...cards);
        });

        // Shuffle all cards
        for (let i = allCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
        }

        return allCards;
    }
};
