import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, ChevronRight, Heart, BookOpen, Clock, Star } from 'lucide-react';

const Updates = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const recentUpdates = [
    {
      id: 1,
      title: "The Dragon's Apprentice",
      genre: "Fantasy",
      updated: "Apr 7, 2025",
      chapter: "Chapter 44: The Dragon's Roar",
      excerpt: "The protagonist faces his greatest challenge yet as he confronts the ancient dragon council.",
      rating: 4.8,
      chapters: 44
    },
    {
      id: 2,
      title: "Echoes of Another World",
      genre: "Sci-Fi",
      updated: "Apr 6, 2025",
      chapter: "Chapter 37: The Mirror Dimension",
      excerpt: "The team discovers a mirror version of their world, but something is terribly wrong.",
      rating: 4.6,
      chapters: 37
    },
    {
      id: 3,
      title: "The Silent Assassin",
      genre: "Action",
      updated: "Apr 5, 2025",
      chapter: "Chapter 29: The Emperor's Secret",
      excerpt: "The truth about the imperial conspiracy begins to unravel in unexpected ways.",
      rating: 4.7,
      chapters: 29
    },
    {
      id: 4,
      title: "Moonlight Academy",
      genre: "Fantasy",
      updated: "Apr 5, 2025",
      chapter: "Chapter 87: The Final Trial",
      excerpt: "Students face their ultimate test as the academy's secrets come to light.",
      rating: 4.5,
      chapters: 87
    },
    {
      id: 5,
      title: "Corporate Cultivator",
      genre: "Urban Fantasy",
      updated: "Apr 4, 2025",
      chapter: "Chapter 56: Office Politics",
      excerpt: "The boardroom becomes a battlefield when ancient rivalries resurface.",
      rating: 4.3,
      chapters: 56
    },
    {
      id: 6,
      title: "Space Nomad Chronicles",
      genre: "Sci-Fi",
      updated: "Apr 3, 2025",
      chapter: "Chapter 124: The Nebula's Secret",
      excerpt: "The crew discovers an anomaly within the nebula that defies known physics.",
      rating: 4.9,
      chapters: 124
    },
    {
      id: 7,
      title: "Heart of the Sword",
      genre: "Wuxia",
      updated: "Apr 2, 2025",
      chapter: "Chapter 212: The Mountain Duel",
      excerpt: "The legendary swordsman faces his former master atop the Cloud Peak Mountain.",
      rating: 4.8,
      chapters: 212
    },
    {
      id: 8,
      title: "Royal Chef Reincarnated",
      genre: "Historical",
      updated: "Apr 1, 2025",
      chapter: "Chapter 15: The Emperor's Banquet",
      excerpt: "Our chef must prepare a feast that will impress the entire imperial court.",
      rating: 4.4,
      chapters: 15
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation - Same as Home */}
      <nav className="bg-indigo-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 mr-2" />
              <span className="font-bold text-xl">Faizal Webnovel</span>
              <div className="hidden md:block ml-10">
                <div className="flex space-x-4">
                  <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Home</Link>
                  <Link to="/novels" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Novels</Link>
                  <Link to="/translations" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Translations</Link>
                  <Link to="/rankings" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Rankings</Link>
                  <Link to="/updates" className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-900">Updates</Link>
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
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700">Home</Link>
              <Link to="/novels" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700">Novels</Link>
              <Link to="/translations" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700">Translations</Link>
              <Link to="/rankings" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700">Rankings</Link>
              <Link to="/updates" className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-900">Updates</Link>
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Recent Updates</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select className="bg-white border border-gray-300 rounded-md px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>All Genres</option>
                <option>Fantasy</option>
                <option>Sci-Fi</option>
                <option>Action</option>
                <option>Romance</option>
                <option>Wuxia</option>
              </select>
            </div>
            <div className="relative">
              <select className="bg-white border border-gray-300 rounded-md px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Highest Rated</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Updates List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {recentUpdates.map((novel) => (
            <div key={novel.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full mr-2">{novel.genre}</span>
                      <span className="text-xs text-gray-500">{novel.updated}</span>
                    </div>
                    <Link to={`/novel/${novel.id}`} className="block">
                      <h3 className="text-xl font-bold text-gray-800 hover:text-indigo-600 mb-1">{novel.title}</h3>
                    </Link>
                    <Link to={`/novel/${novel.id}/chapter/${novel.chapters}`} className="block text-indigo-600 hover:text-indigo-800 font-medium mb-2">
                      {novel.chapter}
                    </Link>
                    <p className="text-gray-600 mb-3">{novel.excerpt}</p>
                    <div className="flex items-center text-sm">
                      <div className="flex items-center mr-4">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{novel.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{novel.chapters} chapters</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <div className="h-32 w-24 bg-indigo-200 rounded-md overflow-hidden">
                      {/* Novel cover placeholder */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            <Link to="/updates?page=1" className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Previous
            </Link>
            <Link to="/updates?page=1" className="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-indigo-600 hover:bg-gray-50">
              1
            </Link>
            <Link to="/updates?page=2" className="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              2
            </Link>
            <Link to="/updates?page=3" className="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              3
            </Link>
            <span className="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500">
              ...
            </span>
            <Link to="/updates?page=8" className="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              8
            </Link>
            <Link to="/updates?page=2" className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Next
            </Link>
          </nav>
        </div>
      </div>

      {/* Footer - Same as Home */}
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
                  <li><Link to="/updates" className="hover:text-white">Updates</Link></li>
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

export default Updates;