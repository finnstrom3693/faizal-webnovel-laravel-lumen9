import React, { useState } from 'react';
import { Menu, X, Search, ChevronRight, Heart, BookOpen, Clock, Star, Filter, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const topRankedNovels = [
  {
    id: 1,
    title: "The Dragon's Apprentice",
    author: "A. Flameborn",
    rating: 4.8,
    genre: "Fantasy",
    summary: "A humble boy with a destiny tied to dragons and ancient prophecies.",
  },
  {
    id: 2,
    title: "Echoes of Another World",
    author: "S. Quantum",
    rating: 4.7,
    genre: "Sci-Fi",
    summary: "Two parallel universes collide through a mysterious portal.",
  },
  {
    id: 3,
    title: "The Silent Assassin",
    author: "C. Shadow",
    rating: 4.7,
    genre: "Action",
    summary: "An assassin finds her purpose beyond vengeance in the imperial city."
  },
  {
    id: 4,
    title: "Moonlight Academy",
    author: "L. Starlit",
    rating: 4.6,
    genre: "Fantasy",
    summary: "Wizards, warriors, and hidden powers awaken under the moon."
  }
];

const Rankings = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Navigation - Fixed at the top */}
      <nav className="bg-indigo-800 text-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 mr-2" />
              <span className="font-bold text-xl">Faizal Webnovel</span>
              <div className="hidden md:block ml-10">
                <div className="flex space-x-4">
                  <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Home</Link>
                  <Link to="/novels" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Novels</Link>
                  <Link to="/translations" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-900">Translations</Link>
                  <Link to="/rankings" className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-900">Rankings</Link>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search translations..."
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
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700">Home</Link>
              <Link to="/novels" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700">Novels</Link>
              <Link to="/translations" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-900">Translations</Link>
              <Link to="/rankings" className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-900">Rankings</Link>
            </div>
            <div className="px-3 py-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search translations..."
                  className="w-full bg-indigo-700 rounded-md pl-8 pr-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 text-white placeholder-indigo-200"
                />
                <Search className="absolute left-2 top-1.5 h-4 w-4 text-indigo-200" />
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-indigo-800 text-center mb-10">📈 Top Ranked Novels</h1>

          <div className="grid gap-6">
            {topRankedNovels.map((novel, index) => (
              <div
                key={novel.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300 border border-indigo-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-indigo-500 font-semibold">#{index + 1}</span>
                    <h2 className="text-2xl font-bold text-gray-800 mt-1">{novel.title}</h2>
                    <p className="text-sm text-gray-500">by {novel.author}</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-1" />
                    <span className="text-lg font-semibold text-gray-800">{novel.rating}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="inline-block px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full font-medium mb-2">
                    {novel.genre}
                  </span>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">{novel.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-indigo-900 text-indigo-200">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="md:flex md:justify-between">
                  <div className="mb-6 md:mb-0">
                    <h2 className="font-bold text-white text-xl mb-2 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Faizal Webnovel
                    </h2>
                    <p className="max-w-xs">Your source for captivating original stories and quality translations from around the world.</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    <div>
                      <h3 className="font-semibold text-white mb-2">Navigation</h3>
                      <ul className="space-y-2">
                        <li><Link to="/" className="hover:text-white">Home</Link></li>
                        <li><Link to="/novels" className="hover:text-white">Novels</Link></li>
                        <li><Link to="/translations" className="hover:text-white">Translations</Link></li>
                        <li><Link to="/rankings" className="hover:text-white">Rankings</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">Authors</h3>
                      <ul className="space-y-2">
                        <li><Link to="/submit" className="hover:text-white">Submit Your Novel</Link></li>
                        <li><Link to="/author-guidelines" className="hover:text-white">Author Guidelines</Link></li>
                        <li><Link to="/translators" className="hover:text-white">Become a Translator</Link></li>
                      </ul>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <h3 className="font-semibold text-white mb-2">Connect</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="hover:text-white">Discord</a></li>
                        <li><a href="#" className="hover:text-white">Twitter</a></li>
                        <li><a href="#" className="hover:text-white">Facebook</a></li>
                        <li><a href="#" className="hover:text-white">Contact Us</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-indigo-800 flex flex-col md:flex-row justify-between items-center">
                  <p>© 2025 Faizal Webnovel. <a href="https://creativecommons.org/licenses/by/4.0/" className="text-yellow-400" rel="license">Creative Commons Attribution 4.0 International License</a></p>
                  <div className="flex items-center mt-4 md:mt-0">
                    Made with <Heart className="mx-1 h-4 w-4 text-red-400" /> for our beloved readers
                  </div>
                </div>
              </div>
      </footer>
    </div>
  );
};

export default Rankings;