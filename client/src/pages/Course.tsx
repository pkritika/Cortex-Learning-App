import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Course, Video, Quiz } from '../types';
import { Play, FileQuestion } from 'lucide-react';
import { QuizComponent } from '../components/Quiz';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

export const CoursePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [course, setCourse] = useState<Course | null>(null);
    const [activeVideo, setActiveVideo] = useState<Video | null>(null);
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/courses/${id}`)
            .then(res => res.json())
            .then(data => {
                setCourse(data);
                if (data.videos.length > 0) {
                    setActiveVideo(data.videos[0]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch course", err);
                setLoading(false);
            });
    }, [id]);

    const handleVideoClick = (video: Video) => {
        setActiveVideo(video);
        setActiveQuiz(null);

        // Save progress
        if (user && id) {
            fetch('${API_URL}/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    courseId: id,
                    videoId: video.id
                })
            }).catch(err => console.error('Failed to save progress:', err));
        }
    };

    if (loading) return <div className="p-8 text-center text-indigo-400">Loading...</div>;
    if (!course) return <div className="p-8 text-center text-gray-400">Course not found</div>;

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Column: Player & Description */}
            <div className="w-full lg:w-[70%] space-y-6">
                <div className="bg-black rounded-xl overflow-hidden shadow-lg aspect-video relative ring-1 ring-white/10">
                    {activeVideo ? (
                        <iframe
                            key={activeVideo.id}
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${activeVideo.url}`}
                            title={activeVideo.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">Select content</div>
                    )}
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        {activeVideo?.title || activeQuiz?.title || course.title}
                    </h1>
                    <p className="text-gray-400 leading-relaxed">
                        {course.description}
                    </p>
                </div>

                {activeQuiz && (
                    <div className="mt-8 border-t border-gray-700 pt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <FileQuestion className="text-indigo-400" /> Quiz Time
                            </h2>
                            <button onClick={() => setActiveQuiz(null)} className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">Cancel</button>
                        </div>
                        <QuizComponent quiz={activeQuiz} />
                    </div>
                )}
            </div>

            {/* Right Column: Syllabus / Playlist */}
            <div className="w-full lg:w-[30%] glass-card rounded-xl overflow-hidden sticky top-24">
                <div className="p-4 border-b border-white/10 bg-white/5">
                    <h2 className="font-bold text-white">Course Content</h2>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                    {/* Videos */}
                    {course.videos.map((video) => {
                        const isActive = activeVideo?.id === video.id && !activeQuiz;
                        return (
                            <div
                                key={video.id}
                                onClick={() => handleVideoClick(video)}
                                className={`flex items-start p-4 cursor-pointer border-b border-white/5 hover:bg-white/5 transition-colors ${isActive ? 'bg-indigo-500/20 border-l-4 border-l-indigo-500' : ''}`}
                            >
                                <div className={`mt-1 mr-3 ${isActive ? 'text-indigo-400' : 'text-gray-500'}`}>
                                    <Play size={16} fill={isActive ? "currentColor" : "none"} />
                                </div>
                                <div>
                                    <div className={`text-sm font-semibold ${isActive ? 'text-indigo-400' : 'text-white'}`}>{video.title}</div>
                                    <div className="text-xs text-gray-500 mt-1">Video • {video.duration}</div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Quizzes */}
                    {course.quizzes && course.quizzes.map((quiz) => {
                        const isActive = activeQuiz?.id === quiz.id;
                        return (
                            <div
                                key={quiz.id}
                                onClick={() => { setActiveQuiz(quiz); setActiveVideo(null); }}
                                className={`flex items-start p-4 cursor-pointer border-b border-white/5 hover:bg-white/5 transition-colors ${isActive ? 'bg-indigo-500/20 border-l-4 border-l-indigo-500' : ''}`}
                            >
                                <div className={`mt-1 mr-3 ${isActive ? 'text-indigo-400' : 'text-gray-500'}`}>
                                    <FileQuestion size={16} />
                                </div>
                                <div>
                                    <div className={`text-sm font-semibold ${isActive ? 'text-indigo-400' : 'text-white'}`}>{quiz.title}</div>
                                    <div className="text-xs text-gray-500 mt-1">Quiz • {quiz.questions.length} questions</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
