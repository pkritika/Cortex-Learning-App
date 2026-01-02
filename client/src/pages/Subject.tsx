import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Course } from '../types';
import { PlayCircle, ChevronLeft, Sparkles } from 'lucide-react';
import { API_URL } from '../config/api';

export const Subject: React.FC = () => {
    const { name } = useParams<{ name: string }>();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/courses`)
            .then(res => res.json())
            .then(data => {
                // Filter courses based on the subject name in the URL
                const filtered = data.filter((c: Course) =>
                    c.id.toLowerCase().startsWith(name?.toLowerCase() || '')
                );
                setCourses(filtered);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch courses", err);
                setLoading(false);
            });
    }, [name]);

    // Capitalize first letter for display
    const displayTitle = name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Subject';

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-indigo-400">Loading...</div>;
    }

    return (
        <div>
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <Link to="/" className="inline-flex items-center text-sm text-gray-400 hover:text-indigo-400 mb-4 transition-colors">
                        <ChevronLeft size={16} className="mr-1" /> Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold text-white">{displayTitle}</h1>
                    <p className="text-gray-400 mt-2">Explore our {displayTitle} courses</p>
                </div>
                <Link to={`/practice/${name}`} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-indigo-500/25 hover:opacity-90 transition-all flex items-center gap-2">
                    <Sparkles size={20} /> Take Practice Test
                </Link>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-xl">
                    <p className="text-gray-400">No courses found for this subject yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <Link key={course.id} to={`/course/${course.id}`} className="glass-card rounded-xl overflow-hidden hover:bg-white/10 transition-all group">
                            <div className="aspect-video bg-gray-800 relative overflow-hidden">
                                <img src={course.thumbnail} alt="" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <PlayCircle className="text-white w-12 h-12" />
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="font-bold text-white text-lg mb-1 group-hover:text-indigo-400 transition-colors">{course.title}</div>
                                <div className="text-sm text-gray-400 line-clamp-2">{course.description}</div>
                                <div className="mt-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{course.videos.length} videos</div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};
