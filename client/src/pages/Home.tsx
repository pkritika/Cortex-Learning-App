import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Course, UserStats } from '../types';
import { Sigma, Atom, Monitor, TrendingUp, Award, Flame, Star, Clock, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { API_URL } from '../config/api';

export const Home: React.FC = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [progress, setProgress] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = () => {
            const fetchCourses = fetch('${API_URL}/api/courses').then(res => res.json());

            let fetchStats = Promise.resolve(null);
            let fetchProgress = Promise.resolve(null);

            if (user) {
                fetchStats = fetch(`${API_URL}/api/stats/${user.id}`).then(res => res.json());
                // Add cache-busting to always get fresh progress
                fetchProgress = fetch(`${API_URL}/api/progress/${user.id}?t=${Date.now()}`).then(res => res.json());
            }

            Promise.all([fetchCourses, fetchStats, fetchProgress])
                .then(([coursesData, statsData, progressData]) => {
                    setCourses(coursesData);
                    setStats(statsData);
                    setProgress(progressData);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch data", err);
                    setLoading(false);
                });
        };

        fetchData();

        // Refetch when window gains focus (user returns to the page)
        const handleFocus = () => {
            if (user) {
                fetch(`${API_URL}/api/progress/${user.id}?t=${Date.now()}`)
                    .then(res => res.json())
                    .then(progressData => setProgress(progressData))
                    .catch(err => console.error("Failed to refresh progress", err));
            }
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [user]);

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-primary">Loading...</div>;
    }

    // Find resume course based on progress
    const resumeCourse = progress && progress.courseId
        ? courses.find(c => c.id === progress.courseId)
        : courses[0];

    const resumeVideo = resumeCourse && progress && progress.videoId
        ? resumeCourse.videos.find(v => v.id === progress.videoId)
        : resumeCourse?.videos[0];

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content Area (Left) */}
            <div className="flex-1 space-y-10">

                {/* Hero Banner */}
                <section className="glass-card rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name.split(' ')[0] || 'Student'}!</h1>
                        <p className="text-text-light max-w-lg text-lg">"The beautiful thing about learning is that no one can take it away from you."</p>
                        <div className="mt-6">
                            {resumeCourse ? (
                                <Link
                                    to={`/course/${resumeCourse.id}`}
                                    className="inline-block glass px-6 py-2 rounded-full font-bold text-sm hover:bg-white/10 transition-all"
                                >
                                    Resume Learning
                                </Link>
                            ) : (
                                <Link
                                    to="/"
                                    className="inline-block glass px-6 py-2 rounded-full font-bold text-sm hover:bg-white/10 transition-all"
                                >
                                    Start Learning
                                </Link>
                            )}
                        </div>
                    </div>
                    {/* Decorative subtle orbs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl mb-[-40px]"></div>
                </section>

                {/* Resume Learning */}
                {resumeCourse && (
                    <section>
                        <h2 className="text-xl font-bold text-text-dark mb-4 flex items-center gap-2">
                            <Clock size={20} className="text-primary" /> Continue Learning
                        </h2>
                        <div className="grid grid-cols-1 gap-6">
                            <Link to={`/course/${resumeCourse.id}`} className="glass-card glass-hover rounded-2xl p-6 group flex items-center gap-6">
                                <div className="hidden sm:block w-32 h-20 bg-bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={resumeCourse.thumbnail} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs uppercase font-bold text-secondary tracking-wide mb-1">{resumeCourse.title}</div>
                                    <div className="text-lg font-bold text-text-dark mb-1 group-hover:text-primary transition-colors">
                                        {resumeVideo?.title || "Continue Lesson"}
                                    </div>
                                    <div className="text-sm text-text-light mb-3">
                                        {resumeVideo ? `Video • ${resumeVideo.duration}` : 'Start learning'}
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="w-[35%] h-full bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary">
                                    <div className="text-xl">▶</div>
                                </div>
                            </Link>
                        </div>
                    </section>
                )}

                {/* Browse Subjects */}
                <section>
                    <h2 className="text-xl font-bold text-text-dark mb-4">Browse Subjects</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { to: '/subject/math', icon: Sigma, label: 'Math', color: 'blue' },
                            { to: '/subject/science', icon: Atom, label: 'Science', color: 'pink' },
                            { to: '/subject/computing', icon: Monitor, label: 'Computing', color: 'green' },
                            { to: '/subject/economics', icon: TrendingUp, label: 'Economics', color: 'orange' }
                        ].map((subject, index) => (
                            <motion.div
                                key={subject.to}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.3 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link to={subject.to} className="glass-card glass-hover rounded-2xl p-6 cursor-pointer flex flex-col items-center justify-center aspect-square group block">
                                    <div className={`w-20 h-20 rounded-full bg-${subject.color}-500/20 text-${subject.color}-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <subject.icon size={40} strokeWidth={1.5} />
                                    </div>
                                    <div className="font-bold text-base text-text-dark">{subject.label}</div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Right Sidebar (Desktop Only) */}
            <div className="w-full lg:w-80 space-y-6">

                {/* Progress Card */}
                {stats ? (
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="font-bold text-text-dark mb-4">My Progress</h3>

                        <div className="flex items-center justify-between mb-4 p-3 glass rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-500/20 p-2 rounded-lg text-orange-400">
                                    <Flame size={20} />
                                </div>
                                <div>
                                    <div className="text-xs text-text-light font-bold uppercase">Daily Streak</div>
                                    <div className="font-bold text-text-dark">{stats.streakDays} Days</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-2 p-3 glass rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/20 p-2 rounded-lg text-primary">
                                    <Star size={20} />
                                </div>
                                <div>
                                    <div className="text-xs text-text-light font-bold uppercase">Energy Points</div>
                                    <div className="font-bold text-text-dark">{stats.totalPoints.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card rounded-2xl p-6 text-center text-sm text-text-light">
                        Log in to track progress
                    </div>
                )}

                {/* Badges Card */}
                {stats && (
                    <div className="glass-card rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-text-dark">Badges</h3>
                            <span className="text-xs text-primary font-bold cursor-pointer">View All</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {stats.badges.slice(0, 6).map(badge => (
                                <div key={badge.id}
                                    title={badge.description}
                                    className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 text-center transition-all ${badge.unlocked ? 'glass text-primary' : 'bg-white/5 text-text-light opacity-50'}`}>
                                    {badge.unlocked ? <Award size={24} className="mb-1" /> : <Lock size={24} className="mb-1" />}
                                    <span className="text-[10px] font-medium leading-tight">{badge.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
