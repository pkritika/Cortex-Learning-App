import { Question } from '../data';

const shuffle = <T>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export class ComputingEngine {
    static questions: Question[] = [
        {
            id: 'comp-1',
            text: 'What is the time complexity of binary search?',
            options: ['O(log n)', 'O(n)', 'O(n^2)', 'O(1)'],
            correctAnswer: 0,
            category: 'Computing: Algorithms'
        },
        {
            id: 'comp-2',
            text: 'Which data structure follows the LIFO (Last In First Out) principle?',
            options: ['Stack', 'Queue', 'Linked List', 'Tree'],
            correctAnswer: 0,
            category: 'Computing: Data Structures'
        },
        {
            id: 'comp-3',
            text: 'What does HTTP stand for?',
            options: ['HyperText Transfer Protocol', 'HighText Transfer Protocol', 'HyperText Transmission Protocol', 'HyperText Transfer Program'],
            correctAnswer: 0,
            category: 'Computing: Networking'
        },
        {
            id: 'comp-4',
            text: 'Which sort algorithm has the best average-case time complexity?',
            options: ['Merge Sort', 'Bubble Sort', 'Insertion Sort', 'Selection Sort'],
            correctAnswer: 0,
            category: 'Computing: Algorithms'
        },
        {
            id: 'comp-5',
            text: 'What is the primary function of an Operating System kernel?',
            options: ['Manage system resources', 'Run web browsers', 'Compile code', 'Design graphics'],
            correctAnswer: 0,
            category: 'Computing: OS'
        },
        {
            id: 'comp-6',
            text: 'In Object-Oriented Programming, what is Polymorphism?',
            options: [
                'The ability of different classes to be treated as instances of the same general class',
                'Hiding internal data from the outside',
                'Creating new classes from existing ones',
                'Organizing code into functions'
            ],
            correctAnswer: 0,
            category: 'Computing: OOP'
        },
        {
            id: 'comp-7',
            text: 'Which of these is a NoSQL database?',
            options: ['MongoDB', 'PostgreSQL', 'MySQL', 'SQLite'],
            correctAnswer: 0,
            category: 'Computing: Databases'
        },
        {
            id: 'comp-8',
            text: 'What does the "S" in HTTPS stand for?',
            options: ['Secure', 'Standard', 'Simple', 'System'],
            correctAnswer: 0,
            category: 'Computing: Networking'
        },
        {
            id: 'comp-9',
            text: 'Which component is considered the "brain" of the computer?',
            options: ['CPU', 'RAM', 'GPU', 'HDD'],
            correctAnswer: 0,
            category: 'Computing: Hardware'
        },
        {
            id: 'comp-10',
            text: 'What is a "Deadlock" in operating systems?',
            options: [
                'A situation where two processes are waiting for each other to release resources',
                'When the system crashes completely',
                'A security breach',
                'When the CPU overheats'
            ],
            correctAnswer: 0,
            category: 'Computing: OS'
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
