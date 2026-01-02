import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Home, Bookmark, User, LogOut, Flame, Star, Award, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserStats, Course } from '../types';
import { API_URL } from '../config/api';

export const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    useEffect(() => {
        // Fetch courses for search
        fetch('${API_URL}/api/courses')
            .then(res => res.json())
            .then(data => setCourses(data))
            .catch(err => console.error("Failed to fetch courses", err));

        if (user) {
            fetch(`${API_URL}/api/stats/${user.id}`)
                .then(res => res.json())
                .then(data => setStats(data))
                .catch(err => console.error("Failed to fetch stats", err));
        }
    }, [user]);

    // Close search results when clicking outside
    useEffect(() => {
        const handleClick = () => setShowSearchResults(false);
        if (showSearchResults) {
            document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [showSearchResults]);

    // Filter courses and videos based on search query
    const searchResults = searchQuery.length > 1
        ? courses.flatMap(course => {
            const courseMatches = course.title.toLowerCase().includes(searchQuery.toLowerCase());
            const videoMatches = course.videos.filter(v =>
                v.title.toLowerCase().includes(searchQuery.toLowerCase())
            );

            const results: { type: 'course' | 'video', course: Course, video?: typeof course.videos[0] }[] = [];

            if (courseMatches) {
                results.push({ type: 'course', course });
            }
            videoMatches.forEach(video => {
                results.push({ type: 'video', course, video });
            });

            return results;
        }).slice(0, 8) // Limit to 8 results
        : [];

    const handleSearchSelect = (courseId: string) => {
        navigate(`/course/${courseId}`);
        setSearchQuery('');
        setShowSearchResults(false);
    };

    return (
        <div className="min-h-screen bg-bg pb-20 md:pb-0">
            {/* Desktop Header */}
            <header className="glass-card border-b border-glass-border sticky top-0 z-50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-5 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-primary font-extrabold text-xl tracking-tighter">Cortex</Link>
                        <nav className="hidden md:flex gap-6">
                            <Link to="/" className={`text-sm font-medium hover:text-primary transition-colors ${isActive('/') ? 'text-primary' : 'text-text-light'}`}>Courses</Link>
                            <Link to="/flashcards" className={`text-sm font-medium hover:text-primary transition-colors ${isActive('/flashcards') ? 'text-primary' : 'text-text-light'}`}>Flashcards</Link>
                            <Link to="/history" className={`text-sm font-medium hover:text-primary transition-colors ${isActive('/history') ? 'text-primary' : 'text-text-light'}`}>My Progress</Link>
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={16} />
                            <input
                                type="text"
                                placeholder="Search courses & videos..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSearchResults(true);
                                }}
                                onFocus={() => setShowSearchResults(true)}
                                className="pl-9 pr-10 py-2 bg-white/10 border border-white/20 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 w-72 text-white placeholder:text-gray-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    <X size={16} />
                                </button>
                            )}

                            {/* Search Results Dropdown */}
                            {showSearchResults && searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl overflow-hidden shadow-xl border border-white/10 max-h-96 overflow-y-auto">
                                    {searchResults.map((result, index) => (
                                        <button
                                            key={`${result.course.id}-${result.video?.id || 'course'}-${index}`}
                                            onClick={() => handleSearchSelect(result.course.id)}
                                            className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${result.type === 'course' ? 'bg-indigo-400' : 'bg-purple-400'}`}></div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-white truncate">
                                                        {result.type === 'video' ? result.video?.title : result.course.title}
                                                    </div>
                                                    <div className="text-xs text-gray-400 truncate">
                                                        {result.type === 'video' ? `in ${result.course.title}` : `${result.course.videos.length} videos`}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* No Results */}
                            {showSearchResults && searchQuery.length > 1 && searchResults.length === 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl p-4 text-center text-gray-400 text-sm">
                                    No results found for "{searchQuery}"
                                </div>
                            )}
                        </div>
                        {user ? (
                            <div className="relative flex items-center gap-3 pl-4 border-l border-glass-border">
                                <span className="text-sm font-medium text-text-dark">{user.name}</span>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="hover:opacity-80 transition-opacity"
                                        title="Profile"
                                    >
                                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-bg-secondary ring-2 ring-glass-border cursor-pointer" />
                                    </button>

                                    {/* Profile Dropdown */}
                                    {showProfileMenu && stats && (
                                        <div className="absolute right-0 mt-2 w-72 glass-card rounded-xl p-4 shadow-xl border border-glass-border">
                                            {/* Profile Header */}
                                            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-glass-border">
                                                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full bg-bg-secondary ring-2 ring-primary/30" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-text-dark truncate">{user.name}</div>
                                                    <div className="text-xs text-text-light truncate">{user.email}</div>
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 p-2 glass rounded-lg">
                                                    <div className="p-2 bg-orange-500/20 rounded-lg">
                                                        <Flame className="text-orange-400" size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-text-light uppercase font-bold">Day Streak</div>
                                                        <div className="text-lg font-bold text-text-dark">{stats.streakDays}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-2 glass rounded-lg">
                                                    <div className="p-2 bg-primary/20 rounded-lg">
                                                        <Star className="text-primary" size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-text-light uppercase font-bold">Total Points</div>
                                                        <div className="text-lg font-bold text-text-dark">{stats.totalPoints.toLocaleString()}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-2 glass rounded-lg">
                                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                                        <Award className="text-blue-400" size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-text-light uppercase font-bold">Badges Earned</div>
                                                        <div className="text-lg font-bold text-text-dark">{stats.badges.filter(b => b.unlocked).length}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button onClick={logout} className="text-text-light hover:text-primary transition-colors" title="Logout">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="text-sm font-bold text-primary hover:underline">Log in</Link>
                        )}
                    </div>

                    {/* Mobile Header Elements (Logo only, Auth handled in bottom nav or separate) */}
                    <div className="md:hidden flex items-center gap-3">
                        {user && (
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="hover:opacity-80 transition-opacity relative"
                            >
                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-bg-secondary ring-2 ring-glass-border cursor-pointer" />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-5 py-8">
                <Outlet />
            </main>

            {/* Footer (Desktop) */}
            <footer className="hidden md:block glass-card border-t border-glass-border mt-12 py-12">
                <div className="max-w-7xl mx-auto px-5 grid grid-cols-4 gap-8">
                    <div>
                        <div className="text-primary font-extrabold text-xl tracking-tighter mb-4">Cortex</div>
                        <p className="text-sm text-text-light">A nonprofit with the mission to provide a free, world-class education for anyone, anywhere.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-text-dark mb-4">Courses</h4>
                        <ul className="space-y-2 text-sm text-text-light">
                            <li><Link to="/subject/math" className="hover:text-primary transition-colors">Math</Link></li>
                            <li><Link to="/subject/science" className="hover:text-primary transition-colors">Science</Link></li>
                            <li><Link to="/subject/computing" className="hover:text-primary transition-colors">Computing</Link></li>
                            <li><Link to="/subject/economics" className="hover:text-primary transition-colors">Economics</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-text-dark mb-4">About</h4>
                        <ul className="space-y-2 text-sm text-text-light">
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Leadership</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Supporters</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-text-dark mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm text-text-light">
                            <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Support Community</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Share your story</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-5 mt-12 pt-8 border-t border-glass-border text-sm text-text-light flex justify-between">
                    <span>© 2024 Cortex. All rights reserved.</span>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-primary transition-colors">Terms of use</a>
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                    </div>
                </div>
            </footer>

            {/* Bottom Navigation (Mobile Only) */}
            <nav className="fixed bottom-0 left-0 w-full glass-card border-t border-glass-border h-[80px] flex justify-around items-center pb-4 z-50 md:hidden backdrop-blur-xl">
                <Link to="/" className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/') ? 'text-primary' : 'text-text-light'}`}>
                    <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
                    <span className="text-[11px] font-medium">Home</span>
                </Link>
                <div className="flex flex-col items-center gap-1.5 text-text-light">
                    <Search size={24} />
                    <span className="text-[11px] font-medium">Search</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-text-light">
                    <Bookmark size={24} />
                    <span className="text-[11px] font-medium">Saved</span>
                </div>
                {user ? (
                    <div onClick={logout} className="flex flex-col items-center gap-1.5 text-text-light cursor-pointer hover:text-primary transition-colors">
                        <LogOut size={24} />
                        <span className="text-[11px] font-medium">Logout</span>
                    </div>
                ) : (
                    <Link to="/login" className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/login') ? 'text-primary' : 'text-text-light'}`}>
                        <User size={24} strokeWidth={isActive('/login') ? 2.5 : 2} />
                        <span className="text-[11px] font-medium">Profile</span>
                    </Link>
                )}
            </nav>
        </div>
    );
};
