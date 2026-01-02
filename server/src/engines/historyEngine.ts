import { Question } from '../data';

const shuffle = <T>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export class HistoryEngine {
    static questions: Question[] = [
        {
            id: 'hist-1',
            text: 'Which year did World War I begin?',
            options: ['1914', '1918', '1939', '1905'],
            correctAnswer: 0,
            category: 'History: Modern'
        },
        {
            id: 'hist-2',
            text: 'Who was the first Emperor of Rome?',
            options: ['Augustus', 'Julius Caesar', 'Nero', 'Caligula'],
            correctAnswer: 0,
            category: 'History: Ancient Rome'
        },
        {
            id: 'hist-3',
            text: 'The Magna Carta was signed in which year?',
            options: ['1215', '1492', '1066', '1776'],
            correctAnswer: 0,
            category: 'History: Medieval'
        },
        {
            id: 'hist-4',
            text: 'Which empire built Machu Picchu?',
            options: ['Inca', 'Aztec', 'Maya', 'Olmec'],
            correctAnswer: 0,
            category: 'History: Pre-Columbian'
        },
        {
            id: 'hist-5',
            text: 'Who wrote "The Communist Manifesto"?',
            options: ['Karl Marx & Friedrich Engels', 'Vladimir Lenin', 'Joseph Stalin', 'Adam Smith'],
            correctAnswer: 0,
            category: 'History: Modern'
        },
        {
            id: 'hist-6',
            text: 'The fall of the Berlin Wall occurred in which year?',
            options: ['1989', '1991', '1985', '1961'],
            correctAnswer: 0,
            category: 'History: Modern'
        },
        {
            id: 'hist-7',
            text: 'Which civilization developed the first known writing system (Cuneiform)?',
            options: ['Sumerians', 'Egyptians', 'Phoenicians', 'Greeks'],
            correctAnswer: 0,
            category: 'History: Ancient'
        },
        {
            id: 'hist-8',
            text: 'Who was the British Prime Minister during most of World War II?',
            options: ['Winston Churchill', 'Neville Chamberlain', 'Clement Attlee', 'Tony Blair'],
            correctAnswer: 0,
            category: 'History: Modern'
        },
        {
            id: 'hist-9',
            text: 'The French Revolution began in:',
            options: ['1789', '1776', '1812', '1848'],
            correctAnswer: 0,
            category: 'History: Modern'
        },
        {
            id: 'hist-10',
            text: 'Who conquered the Aztec Empire?',
            options: ['Hernán Cortés', 'Francisco Pizarro', 'Christopher Columbus', 'Ferdinand Magellan'],
            correctAnswer: 0,
            category: 'History: Exploration'
        }
    ];

    static generateQuestions(amount: number): Question[] {
        const questions = shuffle([...this.questions]).slice(0, amount).map(q => ({
            ...q,
            options: shuffle([...q.options]),
            correctAnswer: -1
        }));

        return questions.map(q => {
            const original = this.questions.find(oq => oq.id === q.id);
            if (!original) return q;
            const correctString = original.options[original.correctAnswer];
            q.correctAnswer = q.options.indexOf(correctString);
            return q;
        });
    }
}
