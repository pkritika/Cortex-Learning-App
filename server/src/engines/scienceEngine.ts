import { Question } from '../data';

// Helper to shuffle array
const shuffle = <T>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export class ScienceEngine {
    static questions: Question[] = [
        // Physics
        {
            id: 'sci-phy-1',
            text: 'In Quantum Mechanics, what is the Heisenberg Uncertainty Principle?',
            options: [
                'It is impossible to know both the position and momentum of a particle with perfect accuracy.',
                'Energy can neither be created nor destroyed, only transformed.',
                'The entropy of an isolated system always increases.',
                'Every action has an equal and opposite reaction.'
            ],
            correctAnswer: 0,
            category: 'Science: Physics'
        },
        {
            id: 'sci-phy-2',
            text: 'What is the speed of light in a vacuum (approximately)?',
            options: [
                '300,000 km/s',
                '150,000 km/s',
                '3,000 km/s',
                '30,000 km/s'
            ],
            correctAnswer: 0,
            category: 'Science: Physics'
        },
        {
            id: 'sci-phy-3',
            text: 'Which particle is responsible for mediating the strong nuclear force?',
            options: [
                'Gluon',
                'Photon',
                'Boson',
                'Electron'
            ],
            correctAnswer: 0,
            category: 'Science: Physics'
        },
        // Biology
        {
            id: 'sci-bio-1',
            text: 'Which organelle is known as the "powerhouse" of the cell?',
            options: [
                'Mitochondria',
                'Nucleus',
                'Ribosome',
                'Golgi Apparatus'
            ],
            correctAnswer: 0,
            category: 'Science: Biology'
        },
        {
            id: 'sci-bio-2',
            text: 'What is the primary function of Hemoglobin?',
            options: [
                'Transporting oxygen in the blood',
                'Fighting infection',
                'Clotting blood',
                'Digesting food'
            ],
            correctAnswer: 0,
            category: 'Science: Biology'
        },
        {
            id: 'sci-bio-3',
            text: 'What is the process by which plants convert light energy into chemical energy?',
            options: [
                'Photosynthesis',
                'Respiration',
                'Fermentation',
                'Transpiration'
            ],
            correctAnswer: 0,
            category: 'Science: Biology'
        },
        // Chemistry
        {
            id: 'sci-chem-1',
            text: 'What is the pH of a neutral solution at 25°C?',
            options: [
                '7',
                '0',
                '14',
                '1'
            ],
            correctAnswer: 0,
            category: 'Science: Chemistry'
        },
        {
            id: 'sci-chem-2',
            text: 'Which element has the atomic number 6?',
            options: [
                'Carbon',
                'Oxygen',
                'Nitrogen',
                'Hydrogen'
            ],
            correctAnswer: 0,
            category: 'Science: Chemistry'
        },
        {
            id: 'sci-chem-3',
            text: 'What kind of bond involves the sharing of electron pairs between atoms?',
            options: [
                'Covalent Bond',
                'Ionic Bond',
                'Hydrogen Bond',
                'Metallic Bond'
            ],
            correctAnswer: 0,
            category: 'Science: Chemistry'
        },
        // More Physics
        {
            id: 'sci-phy-4',
            text: 'Who proposed the Theory of General Relativity?',
            options: [
                'Albert Einstein',
                'Isaac Newton',
                'Niels Bohr',
                'Marie Curie'
            ],
            correctAnswer: 0,
            category: 'Science: Physics'
        }
    ];

    static generateQuestions(amount: number): Question[] {
        // Shuffle the curated list and return the requested amount
        // Also shuffle options for each question to ensure randomness
        const questions = shuffle([...this.questions]).slice(0, amount).map(q => ({
            ...q,
            options: shuffle([...q.options]),
            correctAnswer: -1 // temporary
        }));

        // Re-find correct indices after shuffle
        return questions.map(q => {
            // Find the correct answer string from original
            const original = this.questions.find(oq => oq.id === q.id);
            if (!original) return q;
            const correctString = original.options[original.correctAnswer];
            q.correctAnswer = q.options.indexOf(correctString);
            return q;
        });
    }
}
