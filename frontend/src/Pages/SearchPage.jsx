import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Book, Star, Eye, Clock, Filter, X, ChevronRight } from 'lucide-react';
import { fetchSearchResults, clearSearchResults } from '../redux/actions/searchActions.js';
import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';


const NovelCard = ({ novel }) => {
  const baseUrl = process.env.REACT_APP_BASE_URL; // Assuming the base URL is set in your environment variables

  // Determine if the card is for a novel or a translation
  const linkPath = novel.type === 'translation' 
    ? `/translation-novel/${novel.id}` 
    : `/novel/${novel.id}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={linkPath} className="block">
        {novel.cover ? (
          <div className="relative bg-gray-100" style={{ aspectRatio: '2 / 3' }}>
            <img
              src={`${baseUrl}/public/${novel.cover}` || `https://placehold.co/360x480`}
              alt={novel.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 px-3 py-1 m-2 rounded-md flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-white text-sm">{novel.ratings || 'N/A'}</span>
            </div>
          </div>
        ) : (
          <div className="relative bg-gray-200" style={{ aspectRatio: '2 / 3' }}>
            <img
              src={`https://placehold.co/360x480`}
              alt="Placeholder"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 px-3 py-1 m-2 rounded-md flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-white text-sm">{novel.ratings || 'N/A'}</span>
            </div>
          </div>
        )}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 text-gray-800 line-clamp-1">{novel.title}</h3>
          {novel.genre && (
            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mb-2">
              {novel.genre}
            </span>
          )}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{novel.synopsis || 'No synopsis available'}</p>
        </div>
      </Link>
    </div>
  );
};

const SearchPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();
  const { results, loading, error } = useSelector(state => state.search);
  const query = new URLSearchParams(location.search).get('query') || '';

  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    rating: '',
    sortBy: 'relevance'
  });

  const genres = ['All', 'Fantasy', 'Sci-Fi', 'Action', 'Romance', 'Adventure', 'History', 'Mystery', 'Thriller'];
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'latest', label: 'Latest Update' },
    { value: 'rating', label: 'Highest Rating' },
    { value: 'popularity', label: 'Popularity' }
  ];

  useEffect(() => {
    if (query) {
      dispatch(fetchSearchResults(query, filters));
    }

    return () => {
      dispatch(clearSearchResults());
    };
  }, [query, filters, dispatch]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      status: '',
      rating: '',
      sortBy: 'relevance'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        currentPage={window.location.pathname}
      />

      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Search Results for "{query}"
              </h1>
              <p className="text-gray-600 mt-1">
                {results?.length || 0} results found
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <div className="relative">
                <button
                  onClick={() => { setSortOpen(!sortOpen); setFilterOpen(false); }}
                  className="flex items-center space-x-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <span>Sort: {sortOptions.find(o => o.value === filters.sortBy)?.label}</span>
                  <ChevronRight className={`h-4 w-4 transition-transform ${sortOpen ? 'transform rotate-90' : ''}`} />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {sortOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          handleFilterChange('sortBy', option.value);
                          setSortOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${option.value === filters.sortBy ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-indigo-50'}`}
                      >
                        {option.label}
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
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Genre</h4>
                      <div className="flex flex-wrap gap-2">
                        {genres.map((genre, index) => (
                          <button
                            key={index}
                            onClick={() => handleFilterChange('category', genre === 'All' ? '' : genre)}
                            className={`text-xs px-2 py-1 rounded-full ${(genre === 'All' && filters.category === '') || filters.category.toLowerCase() === genre.toLowerCase()
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={resetFilters}
                      className="w-full mt-2 text-sm text-indigo-600 hover:text-indigo-800 flex items-center justify-center"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search results */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error loading search results. Please try again.
                </p>
              </div>
            </div>
          </div>
        ) : results?.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map(novel => (
                <NovelCard key={novel.id} novel={novel} />
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
          </>
        ) : (
          <div className="text-center py-12">
            <Book className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No novels found</h3>
            <p className="mt-1 text-sm text-gray-500">
              We couldn't find any novels matching "{query}". Try different keywords or filters.
            </p>
            <Link
              to="/novels"
              className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800"
            >
              Browse all novels instead
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SearchPage;