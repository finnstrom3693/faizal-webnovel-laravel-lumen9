import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  BookOpen, 
  Search, 
  Menu, 
  X, 
  User, 
  Bookmark, 
  Heart, 
  History, 
  MessageSquare,
  LogOut 
} from 'lucide-react';
import {
  toggleMobileMenu,
  toggleDropdown,
  logoutUser,
  setSearchQuery,
  checkAuth
} from '../redux/actions/navbarActions.js';

const Navbar = ({ currentPage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mobileMenuOpen, isDropdownOpen, isLoggedIn, user } = useSelector(state => state.navbar);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const handleToggleMobileMenu = () => {
    dispatch(toggleMobileMenu());
  };

  const handleToggleDropdown = () => {
    dispatch(toggleDropdown());
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      dispatch(logoutUser());
      navigate('/');
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      dispatch(setSearchQuery(searchInput));
      navigate(`/search?query=${encodeURIComponent(searchInput)}`);
      setSearchInput('');
      
      if (mobileMenuOpen) {
        dispatch(toggleMobileMenu());
      }
    }
  };

  const isActive = (path) => {
    return currentPage === path;
  };

  // Get display name based on available user data
  const getDisplayName = () => {
    if (!user) return '';
    return user.display_name || user.username || user.email.split('@')[0];
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
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search novels..."
                className="bg-indigo-700 rounded-md pl-8 pr-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 text-white placeholder-indigo-200"
                value={searchInput}
                onChange={handleSearchInputChange}
              />
              <Search className="absolute left-2 top-1.5 h-4 w-4 text-indigo-200" />
              <button type="submit" className="sr-only">Search</button>
            </form>
            
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={handleToggleDropdown}
                  className="flex items-center space-x-1 bg-indigo-700 hover:bg-indigo-600 rounded-full px-3 py-1"
                >
                  <User className="h-5 w-5" />
                  <span>{getDisplayName()}</span>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                    <div className="px-4 py-2 text-xs text-gray-500 border-b">
                      {user?.email}
                    </div>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center"
                      onClick={handleToggleDropdown}
                    >
                      <User className="h-4 w-4 mr-2" /> Profile
                    </Link>
                    <Link 
                      to="/bookmarks" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center"
                      onClick={handleToggleDropdown}
                    >
                      <Bookmark className="h-4 w-4 mr-2" /> Bookmarks
                    </Link>
                    <Link 
                      to="/liked-novels" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center"
                      onClick={handleToggleDropdown}
                    >
                      <Heart className="h-4 w-4 mr-2" /> Liked Novels
                    </Link>
                    <Link 
                      to="/review-history" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center"
                      onClick={handleToggleDropdown}
                    >
                      <History className="h-4 w-4 mr-2" /> Review History
                    </Link>
                    <Link 
                      to="/comment-history" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center"
                      onClick={handleToggleDropdown}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" /> Comment History
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link 
                  to="/login" 
                  className="px-3 py-1 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-500"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-3 py-1 rounded-md text-sm font-medium bg-indigo-900 hover:bg-indigo-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={handleToggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-700 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-indigo-900">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'bg-indigo-800' : 'hover:bg-indigo-700'}`}
              onClick={handleToggleMobileMenu}
            >
              Home
            </Link>
            <Link 
              to="/novels" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/novels') ? 'bg-indigo-800' : 'hover:bg-indigo-700'}`}
              onClick={handleToggleMobileMenu}
            >
              Novels
            </Link>
            <Link 
              to="/translations" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/translations') ? 'bg-indigo-800' : 'hover:bg-indigo-700'}`}
              onClick={handleToggleMobileMenu}
            >
              Translations
            </Link>
            <Link 
              to="/rankings" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/rankings') ? 'bg-indigo-800' : 'hover:bg-indigo-700'}`}
              onClick={handleToggleMobileMenu}
            >
              Rankings
            </Link>
            
            {isLoggedIn ? (
              <>
                <div className="px-3 py-2 text-sm text-indigo-200">
                  Logged in as {user?.email}
                </div>
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 flex items-center"
                  onClick={handleToggleMobileMenu}
                >
                  <User className="h-5 w-5 mr-2" /> Profile
                </Link>
                <Link 
                  to="/bookmarks" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 flex items-center"
                  onClick={handleToggleMobileMenu}
                >
                  <Bookmark className="h-5 w-5 mr-2" /> Bookmarks
                </Link>
                <Link 
                  to="/liked-novels" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 flex items-center"
                  onClick={handleToggleMobileMenu}
                >
                  <Heart className="h-5 w-5 mr-2" /> Liked Novels
                </Link>
                <Link 
                  to="/review-history" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 flex items-center"
                  onClick={handleToggleMobileMenu}
                >
                  <History className="h-5 w-5 mr-2" /> Review History
                </Link>
                <Link 
                  to="/comment-history" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 flex items-center"
                  onClick={handleToggleMobileMenu}
                >
                  <MessageSquare className="h-5 w-5 mr-2" /> Comment History
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-300 hover:bg-red-800 hover:text-white flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-2" /> Sign out
                </button>
              </>
            ) : (
              <div className="pt-2 space-y-2">
                <Link 
                  to="/login" 
                  className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-indigo-600 hover:bg-indigo-500"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-indigo-800 hover:bg-indigo-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="px-3 py-3 border-t border-indigo-700">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search novels..."
                className="w-full bg-indigo-700 rounded-md pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 text-white placeholder-indigo-200"
                value={searchInput}
                onChange={handleSearchInputChange}
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-indigo-200" />
              <button 
                type="submit" 
                className="absolute right-2 top-2 text-indigo-300 hover:text-white"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;