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
    correctAnswer: number;
    category?: string;
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

export const COURSES: Course[] = [
    {
        id: "math-calculus",
        title: "Calculus Fundamentals",
        description: "Master derivatives, integrals, and the fundamental theorem of calculus.",
        thumbnail: "https://i.ytimg.com/vi/WUvTyaaNkzM/maxresdefault.jpg",
        videos: [
            { id: "calc-1", title: "Introduction to Derivatives", url: "WUvTyaaNkzM", duration: "12:14" },
            { id: "calc-2", title: "Power Rule for Derivatives", url: "rAof9Ld5sOg", duration: "9:58" },
            { id: "calc-3", title: "Chain Rule Explained", url: "H-ybCx8gt-8", duration: "10:23" },
            { id: "calc-4", title: "Introduction to Integrals", url: "rfG8ce4nNh0", duration: "11:45" },
            { id: "calc-5", title: "U-Substitution", url: "sdYdnpYn-1o", duration: "8:32" }
        ],
        quizzes: []
    },
    {
        id: "math-algebra",
        title: "Algebra Mastery",
        description: "From basic equations to quadratics and complex numbers.",
        thumbnail: "https://i.ytimg.com/vi/NybHckSEQBI/maxresdefault.jpg",
        videos: [
            { id: "alg-1", title: "Variables and Expressions", url: "NybHckSEQBI", duration: "10:00" },
            { id: "alg-2", title: "Solving Linear Equations", url: "bAerID24QJ0", duration: "15:30" },
            { id: "alg-3", title: "Quadratic Equations", url: "i7idZfS8t8w", duration: "14:22" },
            { id: "alg-4", title: "The Quadratic Formula", url: "IlNAJl36-10", duration: "8:45" },
            { id: "alg-5", title: "Complex Numbers Intro", url: "SP-YJe7Vldo", duration: "11:15" }
        ],
        quizzes: [
            {
                id: "q1",
                title: "Variables Quiz",
                questions: [
                    { id: "q1-1", text: "What is x if x + 2 = 5?", options: ["2", "3", "4", "5"], correctAnswer: 1 },
                    { id: "q1-2", text: "Solve for y: 2y = 10", options: ["2", "5", "10", "20"], correctAnswer: 1 }
                ]
            }
        ]
    },
    {
        id: "math-trig",
        title: "Trigonometry",
        description: "Understand sine, cosine, tangent, and their applications.",
        thumbnail: "https://i.ytimg.com/vi/PUB0TaZ7bhA/maxresdefault.jpg",
        videos: [
            { id: "trig-1", title: "Intro to Trigonometry", url: "PUB0TaZ7bhA", duration: "12:00" },
            { id: "trig-2", title: "Sine, Cosine, Tangent", url: "28z6VSOvekI", duration: "10:45" },
            { id: "trig-3", title: "Unit Circle", url: "1m9p9iubMLU", duration: "15:20" },
            { id: "trig-4", title: "Trig Identities", url: "3TsT64OEvq0", duration: "13:30" }
        ],
        quizzes: []
    },
    {
        id: "science-101",
        title: "Physics: Motion",
        description: "Learn about Newton's laws of motion and kinematics.",
        thumbnail: "https://i.ytimg.com/vi/kKKM8Y-u7ds/maxresdefault.jpg",
        videos: [
            { id: "v4", title: "Newton's First Law", url: "kKKM8Y-u7ds", duration: "12:00" },
            { id: "v5", title: "Newton's Second Law", url: "Ee7M06jE1I4", duration: "14:20" },
            { id: "v6", title: "Newton's Third Law", url: "EgqeKLbo3MI", duration: "10:15" }
        ],
        quizzes: []
    },
    {
        id: "history-101",
        title: "World History",
        description: "A journey through the major events of world history.",
        thumbnail: "https://i.ytimg.com/vi/dHSQOWhaloI/maxresdefault.jpg",
        videos: [
            { id: "v7", title: "The Industrial Revolution", url: "dHSQOWhaloI", duration: "20:00" },
            { id: "v8", title: "French Revolution", url: "lTTvKwCylFY", duration: "18:30" }
        ],
        quizzes: []
    },
    {
        id: "economics-101",
        title: "Microeconomics",
        description: "Supply, demand, and market equilibrium.",
        thumbnail: "https://i.ytimg.com/vi/g9aDizJpd_s/maxresdefault.jpg",
        videos: [
            { id: "v9", title: "Supply and Demand", url: "g9aDizJpd_s", duration: "11:00" },
            { id: "v10", title: "Elasticity", url: "HHcblIxiAAk", duration: "13:45" }
        ],
        quizzes: []
    },
    {
        id: "computing-101",
        title: "Computer Science Basics",
        description: "Introduction to algorithms, data structures, and how computers work.",
        thumbnail: "https://i.ytimg.com/vi/zOjov-2OZ0E/maxresdefault.jpg",
        videos: [
            { id: "v11", title: "Intro into CS", url: "zOjov-2OZ0E", duration: "12:00" },
            { id: "v12", title: "Binary & Data", url: "USCBCtdM5uo", duration: "10:30" }
        ],
        quizzes: [
            {
                id: "q_comp_1",
                title: "Basics Quiz",
                questions: [
                    { id: "qc1", text: "What is a bit?", options: ["Binary Digit", "Byte", "Bug", "Bus"], correctAnswer: 0 },
                    { id: "qc2", text: "Which is 8 bits?", options: ["Byte", "Nibble", "Word", "Kilobyte"], correctAnswer: 0 }
                ]
            }
        ]
    }
];

export const PRACTICE_TESTS: Record<string, Quiz> = {
    "math": {
        id: "pt-math",
        title: "Math Practice Test",
        questions: [
            { id: "q1", text: "What is 2+2?", options: ["3", "4", "5", "6"], correctAnswer: 1 },
            { id: "q2", text: "What is 10/2?", options: ["5", "3", "2", "4"], correctAnswer: 0 }
        ]
    },
    "science": {
        id: "pt-science",
        title: "Science Practice Test",
        questions: [
            { id: "q1", text: "What is the chemical symbol for water?", options: ["H2O", "CO2", "O2", "NaCl"], correctAnswer: 0 },
            { id: "q2", text: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], correctAnswer: 1 }
        ]
    },
    "history": {
        id: "pt-history",
        title: "History Practice Test",
        questions: [
            { id: "q1", text: "Who was the first President of the USA?", options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"], correctAnswer: 1 },
            { id: "q2", text: "In which year did World War II end?", options: ["1918", "1939", "1945", "1955"], correctAnswer: 2 }
        ]
    },
    "economics": {
        id: "pt-economics",
        title: "Economics Practice Test",
        questions: [
            { id: "q1", text: "What is 'GDP'?", options: ["Gross Domestic Product", "Global Daily Production", "Gross Dollar Price", "General Domestic Product"], correctAnswer: 0 },
            { id: "q2", text: "Which of the following is a factor of production?", options: ["Money", "Labor", "Stocks", "Bonds"], correctAnswer: 1 }
        ]
    },
    "computing": {
        id: "pt-computing",
        title: "Computing Practice Test",
        questions: [
            { id: "q1", text: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Processing Unit", "Central Program Unit", "Computer Program Unit"], correctAnswer: 0 },
            { id: "q2", text: "Which language is used for web styling?", options: ["HTML", "CSS", "Python", "Java"], correctAnswer: 1 }
        ]
    }
};
