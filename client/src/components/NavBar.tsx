import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const NavBar: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <BookOpen className="h-8 w-8 text-green-600" />
                            <span className="font-bold text-xl text-gray-900">Cortex</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Courses
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="Search"
                            />
                        </div>

                        {isAuthenticated && user ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
                                <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                                <button
                                    onClick={logout}
                                    className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                            >
                                <LogIn className="h-4 w-4 mr-2" />
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
