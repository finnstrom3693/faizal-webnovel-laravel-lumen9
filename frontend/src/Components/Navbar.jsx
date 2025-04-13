import React from "react";
import { Link } from 'react-router-dom';
import { BookOpen, Search, Menu, X } from 'lucide-react';

class Navbar extends React.Component {
    render() {
        const { mobileMenuOpen, setMobileMenuOpen, currentPage } = this.props;
        
        // Check if current page matches path
        const isActive = (path) => {
            return currentPage === path;
        };

        return (
            <nav className="bg-indigo-800 text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <BookOpen className="h-6 w-6 mr-2" />
                            <span className="font-bold text-xl">Faizal Webnovel</span>
                            <div className="hidden md:block ml-10">
                                <div className="flex space-x-4">
                                    <Link 
                                        to="/" 
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/') ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
                                    >
                                        Home
                                    </Link>
                                    <Link 
                                        to="/novels" 
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/novels') ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
                                    >
                                        Novels
                                    </Link>
                                    <Link 
                                        to="/translations" 
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/translations') ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
                                    >
                                        Translations
                                    </Link>
                                    <Link 
                                        to="/rankings" 
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/rankings') ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
                                    >
                                        Rankings
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search novels..."
                                    className="bg-indigo-700 rounded-md pl-8 pr-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 text-white placeholder-indigo-200"
                                />
                                <Search className="absolute left-2 top-1.5 h-4 w-4 text-indigo-200" />
                            </div>
                        </div>
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-700 focus:outline-none"
                            >
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link 
                                to="/" 
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
                            >
                                Home
                            </Link>
                            <Link 
                                to="/novels" 
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/novels') ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
                            >
                                Novels
                            </Link>
                            <Link 
                                to="/translations" 
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/translations') ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
                            >
                                Translations
                            </Link>
                            <Link 
                                to="/rankings" 
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/rankings') ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
                            >
                                Rankings
                            </Link>
                        </div>
                        <div className="px-3 py-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search novels..."
                                    className="w-full bg-indigo-700 rounded-md pl-8 pr-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 text-white placeholder-indigo-200"
                                />
                                <Search className="absolute left-2 top-1.5 h-4 w-4 text-indigo-200" />
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        );
    }
}

export default Navbar;