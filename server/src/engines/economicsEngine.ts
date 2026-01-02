import { Question } from '../data';

const shuffle = <T>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export class EconomicsEngine {
    static questions: Question[] = [
        {
            id: 'econ-1',
            text: 'What happens to the equilibrium price when demand increases and supply remains constant?',
            options: ['Price Increases', 'Price Decreases', 'Price Stays Same', 'Price becomes zero'],
            correctAnswer: 0,
            category: 'Economics: Microeconomics'
        },
        {
            id: 'econ-2',
            text: 'Which term describes a market structure with a single seller?',
            options: ['Monopoly', 'Oligopoly', 'Perfect Competition', 'Monopsony'],
            correctAnswer: 0,
            category: 'Economics: Market Structures'
        },
        {
            id: 'econ-3',
            text: 'What is GDP?',
            options: ['Gross Domestic Product', 'General Domestic Price', 'Global Development Plan', 'Gross Demand Product'],
            correctAnswer: 0,
            category: 'Economics: Macroeconomics'
        },
        {
            id: 'econ-4',
            text: 'The "Law of Diminishing Returns" applies to:',
            options: ['The short run', 'The long run', 'Both short and long run', 'Neither'],
            correctAnswer: 0,
            category: 'Economics: Production'
        },
        {
            id: 'econ-5',
            text: 'What is "inflation"?',
            options: ['A general increase in prices', 'A decrease in prices', 'An increase in employment', 'A decrease in money supply'],
            correctAnswer: 0,
            category: 'Economics: Macroeconomics'
        },
        {
            id: 'econ-6',
            text: 'Opportunity Cost is defined as:',
            options: [
                'The value of the next best alternative foregone',
                'The total cost of production',
                'The price of a product',
                'The cost of raw materials'
            ],
            correctAnswer: 0,
            category: 'Economics: Microeconomics'
        },
        {
            id: 'econ-7',
            text: 'Who is considered the "Father of Modern Economics"?',
            options: ['Adam Smith', 'John Maynard Keynes', 'Karl Marx', 'Milton Friedman'],
            correctAnswer: 0,
            category: 'Economics: History'
        },
        {
            id: 'econ-8',
            text: 'Which policy is controlled by the Central Bank?',
            options: ['Monetary Policy', 'Fiscal Policy', 'Trade Policy', 'Labor Policy'],
            correctAnswer: 0,
            category: 'Economics: Policy'
        },
        {
            id: 'econ-9',
            text: 'A "Bear Market" suggests that stock prices are:',
            options: ['Falling', 'Rising', 'Stable', 'Volatile'],
            correctAnswer: 0,
            category: 'Economics: Finance'
        },
        {
            id: 'econ-10',
            text: 'What does the "Invisible Hand" refer to?',
            options: [
                'The self-regulating nature of the marketplace',
                'Government intervention',
                'Corporate monopolies',
                'Under-the-table deals'
            ],
            correctAnswer: 0,
            category: 'Economics: Theory'
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
