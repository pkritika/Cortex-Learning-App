import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { TestResult } from '../types';
import { Clock, Award, AlertCircle } from 'lucide-react';
import { API_URL } from '../config/api';

export const History: React.FC = () => {
    const { user } = useAuth();
    const [results, setResults] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        fetch(`${API_URL}/api/results?userId=${user.id}`)
            .then(res => res.json())
            .then(data => {
                setResults(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch history", err);
                setLoading(false);
            });
    }, [user]);

    if (loading) return <div className="p-12 text-center text-primary">Loading history...</div>;

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4 text-center">
                <div className="glass-card rounded-xl p-8">
                    <h2 className="text-xl font-bold mb-4">Please Log In</h2>
                    <p className="text-text-light mb-6">You need to be logged in to view your test history.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-text-dark mb-8">Test History</h1>

            {results.length === 0 ? (
                <div className="glass-card rounded-xl p-8 text-center text-text-light">
                    No test history found. Go take a practice test!
                </div>
            ) : (
                <div className="grid gap-4">
                    {results.map((result, index) => {
                        const percentage = Math.round((result.score / result.totalQuestions) * 100);
                        const isGood = percentage >= 80;

                        return (
                            <div key={index} className="glass-card glass-hover rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isGood ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {isGood ? <Award size={24} /> : <AlertCircle size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-text-dark capitalize">{result.subject}</h3>
                                        <div className="text-sm text-text-light flex items-center gap-2">
                                            <Clock size={14} />
                                            {result.timestamp ? new Date(result.timestamp).toLocaleDateString() + ' ' + new Date(result.timestamp).toLocaleTimeString() : 'Unknown Date'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                    <div className="text-center">
                                        <div className="text-sm text-text-light uppercase font-bold text-xs tracking-wider">Score</div>
                                        <div className="font-bold text-xl text-text-dark">{result.score}/{result.totalQuestions}</div>
                                    </div>
                                    <div className={`px-4 py-2 rounded-lg font-bold text-lg ${isGood ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {percentage}%
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
