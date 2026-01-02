import React, { useState } from 'react';
import type { Quiz } from '../types';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface QuizProps {
    quiz: Quiz;
}

export const QuizComponent: React.FC<QuizProps> = ({ quiz }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);

    const handleOptionClick = (index: number) => {
        if (selectedOption !== null) return; // Prevent changing answer
        setSelectedOption(index);

        const correct = index === quiz.questions[currentQuestion].correctAnswer;
        setIsCorrect(correct);
        if (correct) setScore(score + 1);
    };

    const handleNext = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
            setIsCorrect(null);
        } else {
            setCompleted(true);
        }
    };

    const handleRetry = () => {
        setCurrentQuestion(0);
        setSelectedOption(null);
        setIsCorrect(null);
        setScore(0);
        setCompleted(false);
    };

    if (completed) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quiz Completed!</h3>
                <p className="text-lg mb-6">You scored {score} out of {quiz.questions.length}</p>
                <button
                    onClick={handleRetry}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                    <RefreshCw className="mr-2 h-4 w-4" /> Retry Quiz
                </button>
            </div>
        );
    }

    const question = quiz.questions[currentQuestion];

    if (!question) {
        return <div className="p-4 text-red-500">Error: Question not found</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">{quiz.title}</h3>
                <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {quiz.questions.length}</span>
            </div>

            <p className="text-lg mb-6">{question.text}</p>

            <div className="space-y-3">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionClick(index)}
                        disabled={selectedOption !== null}
                        className={`w-full text-left p-3 rounded-md border transition-all ${selectedOption === index
                            ? isCorrect
                                ? 'bg-green-50 border-green-500 text-green-700'
                                : 'bg-red-50 border-red-500 text-red-700'
                            : selectedOption !== null && index === question.correctAnswer
                                ? 'bg-green-50 border-green-500 text-green-700'
                                : 'hover:bg-gray-50 border-gray-200'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {selectedOption === index && (
                                isCorrect ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {selectedOption !== null && (
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleNext}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        {currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </button>
                </div>
            )}
        </div>
    );
};
