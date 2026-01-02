import 'dotenv/config';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const WolframAlphaAPI = require('@wolfram-alpha/wolfram-alpha-api');
import { Question } from './data';

// Initialize Wolfram Alpha API (will be null if no API key is configured)
const wolframAppId = process.env.WOLFRAM_APP_ID;
const waApi = wolframAppId && wolframAppId !== 'your_app_id_here'
    ? WolframAlphaAPI(wolframAppId)
    : null;


// Helper to get random integer between min and max (inclusive)
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to shuffle array
const shuffle = <T>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export class MathEngine {

    // --- Calculus Generators ---

    // Power Rule Derivative: d/dx [a*x^n]
    static generatePowerRuleDerivative(): Question {
        const a = randomInt(2, 9);
        const n = randomInt(2, 5);

        const questionText = `Find the derivative of f(x) = ${a}x^${n}`;
        const correct = `${a * n}x^${n - 1}`;

        // Distractors
        const distractors = [
            `${a}x^${n - 1}`, // Forgot to multiply by n
            `${a * n}x^${n}`, // Forgot to decrement power
            `${Math.floor(a / n)}x^${n + 1}`, // Integrated instead?
            `${a * n}x^${n - 2}`  // Decremented too much
        ];

        const options = shuffle([correct, ...distractors.slice(0, 3)]);

        return {
            id: `calc-power-${Date.now()}-${Math.random()}`,
            text: questionText,
            options: options,
            correctAnswer: options.indexOf(correct),
            category: "Math: Calculus"
        };
    }

    // Trig Derivative: d/dx [a*sin(bx)] or [a*cos(bx)]
    static generateTrigDerivative(): Question {
        const a = randomInt(2, 5);
        const b = randomInt(2, 4);
        const isSin = Math.random() > 0.5;

        const func = isSin ? 'sin' : 'cos';
        const derivFunc = isSin ? 'cos' : 'sin';
        const sign = isSin ? '' : '-'; // Derivative of cos is -sin

        const questionText = `Find the derivative of f(x) = ${a}${func}(${b}x)`;
        const correct = `${sign}${a * b}${derivFunc}(${b}x)`;

        const distractors = [
            `${a * b}${derivFunc}(${b}x)`.replace(sign, sign === '-' ? '' : '-'), // Wrong sign
            `${a}${derivFunc}(${b}x)`, // Forgot chain rule
            `${a * b}${func}(${b}x)`, // Wrong function
        ];

        const options = shuffle([correct, ...distractors]);

        return {
            id: `calc-trig-${Date.now()}-${Math.random()}`,
            text: questionText,
            options: options,
            correctAnswer: options.indexOf(correct),
            category: "Math: Calculus"
        };
    }

    // Power Rule Integral: Integral [a*x^n] dx
    static generatePowerRuleIntegral(): Question {
        // Choose n and a such that a/(n+1) is an integer for cleaner answers usually
        const n = randomInt(1, 4);
        const m = n + 1; // new power
        const coeff = randomInt(1, 5) * m; // ensuring divisibility

        const questionText = `Evaluate the integral: ∫ ${coeff}x^${n} dx`;
        const correct = `${coeff / m}x^${m} + C`;

        const distractors = [
            `${coeff * n}x^${n - 1} + C`, // Differentiated instead
            `${coeff}x^${m} + C`, // Forgot to divide
            `${coeff / m}x^${n} + C` // Forgot to increment power
        ];

        const options = shuffle([correct, ...distractors]);

        return {
            id: `calc-int-${Date.now()}-${Math.random()}`,
            text: questionText,
            options: options,
            correctAnswer: options.indexOf(correct),
            category: "Math: Calculus"
        };
    }

    // --- Algebra Generators ---

    // Quadratics: Find roots of x^2 + bx + c = 0 where roots are integers
    static generateQuadraticRoots(): Question {
        const r1 = randomInt(-5, 5);
        const r2 = randomInt(-5, 5);
        // (x - r1)(x - r2) = x^2 - (r1+r2)x + r1*r2

        const b = -(r1 + r2);
        const c = r1 * r2;

        const bStr = b === 0 ? '' : (b > 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`);
        const cStr = c === 0 ? '' : (c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`);

        const questionText = `Find the roots of: x^2 ${bStr} ${cStr} = 0`;
        const correct = `${r1}, ${r2}`;

        const distractors = [
            `${-r1}, ${-r2}`, // Wrong signs
            `${r1}, ${-r2}`, // One wrong sign
            `${r1 + 1}, ${r2 - 1}` // Random shift
        ];

        // Remove duplicate options if any (rare but possible with random ints)
        const uniqueDistractors = [...new Set(distractors)].filter(d => d !== correct);
        while (uniqueDistractors.length < 3) {
            uniqueDistractors.push(`${randomInt(-9, 9)}, ${randomInt(-9, 9)}`);
        }

        const options = shuffle([correct, ...uniqueDistractors.slice(0, 3)]);

        return {
            id: `alg-roots-${Date.now()}-${Math.random()}`,
            text: questionText,
            options: options,
            correctAnswer: options.indexOf(correct),
            category: "Math: Algebra"
        };
    }

    static generateComplexNumberMult(): Question {
        const a1 = randomInt(1, 5);
        const b1 = randomInt(1, 5);
        const a2 = randomInt(1, 5);
        const b2 = randomInt(1, 5);

        // (a1 + b1i)(a2 + b2i) = (a1a2 - b1b2) + (a1b2 + b1a2)i

        const real = (a1 * a2) - (b1 * b2);
        const imag = (a1 * b2) + (b1 * a2);

        const questionText = `Simplify: (${a1} + ${b1}i)(${a2} + ${b2}i)`;
        const correct = `${real} + ${imag}i`.replace('+ -', '- ');

        const distractors = [
            `${(a1 * a2) + (b1 * b2)} + ${imag}i`.replace('+ -', '- '), // Added b1b2 instead of subtracted (i^2 error)
            `${real} + ${(a1 * b2) - (b1 * a2)}i`.replace('+ -', '- '), // Wrong imag sign
            `${a1 * a2} + ${b1 * b2}i` // Just multiplied terms directly
        ];

        const options = shuffle([correct, ...distractors]);

        return {
            id: `alg-complex-${Date.now()}-${Math.random()}`,
            text: questionText,
            options: options,
            correctAnswer: options.indexOf(correct),
            category: "Math: Algebra"
        };
    }

    // Master generator function (synchronous, local only)
    static generateQuestions(amount: number): Question[] {
        const generators = [
            MathEngine.generatePowerRuleDerivative,
            MathEngine.generateTrigDerivative,
            MathEngine.generatePowerRuleIntegral,
            MathEngine.generateQuadraticRoots,
            MathEngine.generateComplexNumberMult
        ];

        const questions: Question[] = [];
        for (let i = 0; i < amount; i++) {
            const gen = generators[Math.floor(Math.random() * generators.length)];
            questions.push(gen());
        }
        return questions;
    }

    // --- Wolfram Alpha Integration ---

    // Wolfram Alpha problem templates for calculus and algebra
    private static wolframProblems = [
        // Calculus - Derivatives
        { query: 'derivative of x^{n}', category: 'Math: Calculus', template: 'Find the derivative of f(x) = x^{n}' },
        { query: 'derivative of sin({a}x)', category: 'Math: Calculus', template: 'Find the derivative of f(x) = sin({a}x)' },
        { query: 'derivative of cos({a}x)', category: 'Math: Calculus', template: 'Find the derivative of f(x) = cos({a}x)' },
        { query: 'derivative of e^({a}x)', category: 'Math: Calculus', template: 'Find the derivative of f(x) = e^({a}x)' },
        { query: 'derivative of ln({a}x)', category: 'Math: Calculus', template: 'Find the derivative of f(x) = ln({a}x)' },
        // Calculus - Integrals
        { query: 'integral of x^{n}', category: 'Math: Calculus', template: 'Evaluate the integral: ∫ x^{n} dx' },
        { query: 'integral of sin({a}x)', category: 'Math: Calculus', template: 'Evaluate the integral: ∫ sin({a}x) dx' },
        { query: 'integral of cos({a}x)', category: 'Math: Calculus', template: 'Evaluate the integral: ∫ cos({a}x) dx' },
        // Algebra
        { query: 'solve x^2 + {b}x + {c} = 0', category: 'Math: Algebra', template: 'Solve the equation: x² + {b}x + {c} = 0' },
        { query: 'factor x^2 + {b}x + {c}', category: 'Math: Algebra', template: 'Factor the expression: x² + {b}x + {c}' },
        { query: 'simplify ({a} + {b}i) * ({c} + {d}i)', category: 'Math: Algebra', template: 'Simplify: ({a} + {b}i) × ({c} + {d}i)' },
    ];

    // Generate a question using Wolfram Alpha API
    static async generateWolframQuestion(): Promise<Question | null> {
        if (!waApi) {
            console.log('Wolfram Alpha API not configured, using local generator');
            return null;
        }

        try {
            // Pick a random problem template
            const problem = this.wolframProblems[Math.floor(Math.random() * this.wolframProblems.length)];

            // Generate random values for placeholders
            const a = randomInt(2, 5);
            const b = randomInt(-5, 5);
            const c = randomInt(-10, 10);
            const d = randomInt(1, 5);
            const n = randomInt(2, 6);

            // Replace placeholders in query and template
            let query = problem.query
                .replace('{a}', a.toString())
                .replace('{b}', b.toString())
                .replace('{c}', c.toString())
                .replace('{d}', d.toString())
                .replace('{n}', n.toString());

            let questionText = problem.template
                .replace('{a}', a.toString())
                .replace('{b}', b >= 0 ? b.toString() : `(${b})`)
                .replace('{c}', c >= 0 ? c.toString() : `(${c})`)
                .replace('{d}', d.toString())
                .replace('{n}', n.toString());

            // Get the answer from Wolfram Alpha
            console.log(`Wolfram Alpha query: ${query}`);
            const answer = await waApi.getShort(query);
            console.log(`Wolfram Alpha answer: ${answer}`);

            if (!answer || answer.includes('Wolfram|Alpha did not understand')) {
                return null;
            }

            // Try to get step-by-step solution
            let solution = '';
            try {
                const fullResult = await waApi.getFull({
                    input: query,
                    podstate: 'Step-by-step solution',
                    format: 'plaintext'
                });

                // Parse the full result to extract step-by-step
                if (fullResult && fullResult.pods) {
                    for (const pod of fullResult.pods) {
                        if (pod.title && (pod.title.includes('Step') || pod.title.includes('Result') || pod.title.includes('Solution'))) {
                            if (pod.subpods && pod.subpods.length > 0) {
                                const text = pod.subpods.map((sp: any) => sp.plaintext).filter(Boolean).join('\n');
                                if (text) {
                                    solution += `**${pod.title}:**\n${text}\n\n`;
                                }
                            }
                        }
                    }
                }
            } catch (stepError) {
                console.log('Step-by-step not available for this query');
            }

            // Build explanation with solution steps
            let explanation = `**Answer:** ${answer}`;
            if (solution) {
                explanation += `\n\n${solution}`;
            } else {
                // Provide a basic explanation based on problem type
                explanation += this.getBasicExplanation(problem.category, query, answer);
            }

            // Generate distractors based on the correct answer
            const distractors = this.generateDistractors(answer, problem.category);
            const options = shuffle([answer, ...distractors.slice(0, 3)]);

            return {
                id: `wolfram-${Date.now()}-${Math.random()}`,
                text: questionText,
                options: options,
                correctAnswer: options.indexOf(answer),
                category: problem.category,
                explanation: explanation
            };
        } catch (error) {
            console.error('Wolfram Alpha API error:', error);
            return null;
        }
    }

    // Provide basic explanation based on problem type
    private static getBasicExplanation(category: string, query: string, answer: string): string {
        if (category.includes('Calculus')) {
            if (query.includes('derivative')) {
                return `\n\n**How to solve:**\n• Use the power rule: d/dx[x^n] = n·x^(n-1)\n• Use the chain rule for composite functions\n• For trig functions: d/dx[sin(x)] = cos(x), d/dx[cos(x)] = -sin(x)\n• For exponentials: d/dx[e^x] = e^x`;
            } else if (query.includes('integral')) {
                return `\n\n**How to solve:**\n• Use the power rule: ∫x^n dx = x^(n+1)/(n+1) + C\n• For trig functions: ∫sin(x)dx = -cos(x)+C, ∫cos(x)dx = sin(x)+C\n• Don't forget the constant of integration (+C)`;
            }
        } else if (category.includes('Algebra')) {
            if (query.includes('solve')) {
                return `\n\n**How to solve:**\n• For quadratics ax²+bx+c=0, use factoring or the quadratic formula\n• x = (-b ± √(b²-4ac)) / 2a`;
            } else if (query.includes('factor')) {
                return `\n\n**How to solve:**\n• Find two numbers that multiply to give c and add to give b\n• Factor as (x + p)(x + q) where p·q = c and p+q = b`;
            } else if (query.includes('simplify')) {
                return `\n\n**How to solve:**\n• Use FOIL: (a+bi)(c+di) = ac + adi + bci + bdi²\n• Remember that i² = -1\n• Combine real and imaginary parts`;
            }
        }
        return '';
    }

    // Generate plausible distractors based on the answer type
    private static generateDistractors(correctAnswer: string, category: string): string[] {
        const distractors: string[] = [];

        // Try to parse as a number and create numeric distractors
        const numMatch = correctAnswer.match(/-?\d+\.?\d*/);
        if (numMatch) {
            const num = parseFloat(numMatch[0]);
            const variations = [
                correctAnswer.replace(numMatch[0], (num * 2).toString()),
                correctAnswer.replace(numMatch[0], (num + randomInt(1, 5)).toString()),
                correctAnswer.replace(numMatch[0], (-num).toString()),
                correctAnswer.replace(numMatch[0], (num / 2).toString()),
            ];
            distractors.push(...variations);
        }

        // Add some generic math distractors if needed
        while (distractors.length < 3) {
            if (category.includes('Calculus')) {
                distractors.push(`${randomInt(1, 10)}x^${randomInt(1, 4)} + C`);
            } else {
                distractors.push(`x = ${randomInt(-10, 10)}`);
            }
        }

        return distractors.slice(0, 3);
    }

    // Master generator with Wolfram Alpha support (async)
    static async generateQuestionsWithWolfram(amount: number, useWolfram: boolean = true): Promise<Question[]> {
        const questions: Question[] = [];

        if (!useWolfram || !waApi) {
            // Fallback to local if Wolfram not configured
            return this.generateQuestions(amount);
        }

        // Generate ALL questions from Wolfram Alpha
        for (let i = 0; i < amount; i++) {
            try {
                const question = await this.generateWolframQuestion();
                if (question) {
                    questions.push(question);
                }
            } catch (error) {
                console.error('Failed to generate Wolfram question:', error);
            }
        }

        // Only use local as fallback if Wolfram failed completely
        if (questions.length === 0) {
            console.log('Wolfram Alpha failed, falling back to local generators');
            return this.generateQuestions(amount);
        }

        return shuffle(questions);
    }

    // Check if Wolfram Alpha is configured
    static isWolframConfigured(): boolean {
        return waApi !== null;
    }
}

