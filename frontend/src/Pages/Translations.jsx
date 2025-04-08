import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, ChevronRight, Heart, BookOpen, Clock, Star, Filter, Globe } from 'lucide-react';

const Translations = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [sortOpen, setSortOpen] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);

  const translations = [
    {
      id: 1,
      title: "The Legendary Moonlight Sculptor",
      originalTitle: "달빛 조각사",
      language: "Korean",
      translatedTo: "English",
      genre: "Fantasy",
      chapters: 52,
      rating: 4.9,
      updated: "Apr 5, 2025",
      status: "Ongoing",
      translator: "Rainbow Turtle",
      coverColor: "bg-blue-200"
    },
    {
      id: 2,
      title: "Release That Witch",
      originalTitle: "放开那个女巫",
      language: "Chinese",
      translatedTo: "English",
      genre: "Fantasy",
      chapters: 146,
      rating: 4.8,
      updated: "Apr 4, 2025",
      status: "Completed",
      translator: "Volare Novels",
      coverColor: "bg-red-200"
    },
    {
      id: 3,
      title: "Solo Leveling",
      originalTitle: "나 혼자만 레벨업",
      language: "Korean",
      translatedTo: "English",
      genre: "Action",
      chapters: 270,
      rating: 4.9,
      updated: "Apr 3, 2025",
      status: "Completed",
      translator: "Qidian International",
      coverColor: "bg-purple-200"
    },
    {
      id: 4,
      title: "The Second Coming of Gluttony",
      originalTitle: "탐식의 재림",
      language: "Korean",
      translatedTo: "English",
      genre: "Fantasy",
      chapters: 89,
      rating: 4.7,
      updated: "Apr 2, 2025",
      status: "Ongoing",
      translator: "FudgeNouget",
      coverColor: "bg-green-200"
    },
    {
      id: 5,
      title: "Overgeared",
      originalTitle: "초월자",
      language: "Korean",
      translatedTo: "English",
      genre: "Game",
      chapters: 183,
      rating: 4.6,
      updated: "Apr 1, 2025",
      status: "Ongoing",
      translator: "Rainbow Turtle",
      coverColor: "bg-yellow-200"
    },
    {
      id: 6,
      title: "Omniscient Reader's Viewpoint",
      originalTitle: "전지적 독자 시점",
      language: "Korean",
      translatedTo: "English",
      genre: "Fantasy",
      chapters: 75,
      rating: 4.9,
      updated: "Mar 31, 2025",
      status: "Ongoing",
      translator: "FudgeNouget",
      coverColor: "bg-indigo-200"
    },
    {
      id: 7,
      title: "Trash of the Count's Family",
      originalTitle: "백작가의 망나니가 되었다",
      language: "Korean",
      translatedTo: "English",
      genre: "Fantasy",
      chapters: 112,
      rating: 4.8,
      updated: "Mar 30, 2025",
      status: "Ongoing",
      translator: "Euphemia",
      coverColor: "bg-orange-200"
    },
    {
      id: 8,
      title: "The Beginning After The End",
      originalTitle: "끝이 아닌 시작",
      language: "Korean",
      translatedTo: "English",
      genre: "Fantasy",
      chapters: 156,
      rating: 4.7,
      updated: "Mar 29, 2025",
      status: "Ongoing",
      translator: "TurtleMe",
      coverColor: "bg-teal-200"
    }
  ];

  const languages = ['All', 'Korean', 'Chinese', 'Japanese', 'English', 'Spanish'];
  const statuses = ['All', 'Ongoing', 'Completed', 'Hiatus'];
  const sortOptions = ['Latest', 'Popular', 'Rating', 'Most Chapters', 'Recently Updated'];

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
                  <Link to="/translations" className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-900">Translations</Link>
                  <Link to="/rankings" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Rankings</Link>
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
              <Link to="/translations" className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-900">Translations</Link>
              <Link to="/rankings" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700">Rankings</Link>
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

      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                <Globe className="h-6 w-6 mr-2 text-indigo-600" />
                Translated Works
              </h1>
              <p className="text-gray-600 mt-1">Discover webnovels translated from various languages</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <div className="relative">
                <button 
                  onClick={() => { setSortOpen(!sortOpen); setFilterOpen(false); }}
                  className="flex items-center space-x-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <span>Sort: Latest</span>
                  <ChevronRight className={`h-4 w-4 transition-transform ${sortOpen ? 'transform rotate-90' : ''}`} />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {sortOptions.map((option, index) => (
                      <button
                        key={index}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <button 
                  onClick={() => { setFilterOpen(!filterOpen); setSortOpen(false); }}
                  className="flex items-center space-x-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>
                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-3 px-4 z-10">
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Original Language</h4>
                      <div className="flex flex-wrap gap-2">
                        {languages.map((language, index) => (
                          <button
                            key={index}
                            className={`text-xs px-2 py-1 rounded-full ${language === 'All' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
                          >
                            {language}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                      <div className="flex flex-wrap gap-2">
                        {statuses.map((status, index) => (
                          <button
                            key={index}
                            className={`text-xs px-2 py-1 rounded-full ${status === 'All' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Translation Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {translations.map((translation) => (
            <div key={translation.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Link to={`/translation/${translation.id}`} className="block">
                <div className={`h-48 ${translation.coverColor} relative`}>
                  <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 px-3 py-1 m-2 rounded-md flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-white text-sm">{translation.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">{translation.genre}</span>
                    <span className="text-xs text-gray-500">{translation.chapters} ch</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-gray-800 line-clamp-1">{translation.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">Original: {translation.originalTitle}</p>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span className="mr-2">{translation.language} → {translation.translatedTo}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Translator: {translation.translator}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{translation.status}</span>
                    <span>Updated {translation.updated}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-10 flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            <button className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-indigo-600 hover:bg-gray-50">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Next
            </button>
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

export default Translations;