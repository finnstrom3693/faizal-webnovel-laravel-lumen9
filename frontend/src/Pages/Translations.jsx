import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, ChevronRight, Heart, BookOpen, Clock, Star, Filter, Languages} from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import axios from 'axios';
import { FolderTree } from 'lucide-react';

const Translations = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [translations, setTranslations] = useState([]);
  const [filteredTranslations, setFilteredTranslations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Latest');

  // Get base URL from environment variables
  const baseUrl = process.env.REACT_APP_BASE_URL || '';

  const genres = ['All', 'Fantasy', 'Sci-Fi', 'Action', 'Romance', 'Adventure', 'History', 'Mystery', 'Thriller'];
  const sortOptions = ['Latest', 'Popular', 'Rating', 'Most Chapters', 'Recently Updated'];

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const novelResponse = await axios.get(`${baseUrl}/api/translation_novel`);
        const publishedNovels = novelResponse.data.data.filter(novel => novel.status === 'published');

        // For each novel, fetch its chapters and count them
        const novelsWithChapters = await Promise.all(publishedNovels.map(async (novel) => {
          try {
            const chapterRes = await axios.get(`${baseUrl}/api/translation_novel/${novel.id}/chapter?novel_id=${novel.id}`);
            const chapterCount = chapterRes.data.data.length;
            console.log(`novel id (${novel.id}) :`,chapterCount)
            return { ...novel, chapters_count: chapterCount };
          } catch (err) {
            console.error(`Failed to fetch chapters for novel ID ${novel.id}`, err);
            return { ...novel, chapters_count: 0 }; // fallback to 0 if failed
          }
        }));

        setTranslations(novelsWithChapters);
        setFilteredTranslations(novelsWithChapters);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNovels();
  }, [baseUrl]);

  // Filter translations by language and genre
  useEffect(() => {
    let filtered = [...translations];

    // Apply language filter
    if (selectedLanguage !== 'All') {
      filtered = filtered.filter(translation =>
        translation.language && translation.language.toLowerCase() === selectedLanguage.toLowerCase()
      );
    }

    // Apply genre filter
    if (selectedGenre !== 'All') {
      filtered = filtered.filter(translation =>
        translation.genre && translation.genre.toLowerCase() === selectedGenre.toLowerCase()
      );
    }

    // Apply sorting
    switch (selectedSort) {
      case 'Latest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'Popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'Rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'Most Chapters':
        filtered.sort((a, b) => (b.chapters_count || 0) - (a.chapters_count || 0));
        break;
      case 'Recently Updated':
        filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        break;
      default:
        break;
    }

    setFilteredTranslations(filtered);
  }, [selectedLanguage, selectedGenre, selectedSort, translations]);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setFilterOpen(false);
  };

  const handleSortSelect = (sortOption) => {
    setSelectedSort(sortOption);
    setSortOpen(false);
  };

  const clearFilters = () => {
    setSelectedLanguage('All');
    setSelectedGenre('All');
    setFilterOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          currentPage={window.location.pathname}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          currentPage={window.location.pathname}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">Error loading translations: {error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                <Languages className="h-6 w-6 mr-2 text-indigo-600" />
                Translated Works
              </h1>
              <p className="text-gray-600 mt-1">Discover webnovels translated from various languages</p>
              {(selectedLanguage !== 'All' || selectedGenre !== 'All') && (
                <p className="text-sm text-gray-500 mt-1">
                  Filtered by:
                  {selectedLanguage !== 'All' && ` ${selectedLanguage}`}
                  {selectedGenre !== 'All' && ` ${selectedGenre}`}
                </p>
              )}
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <div className="relative">
                <button
                  onClick={() => { setSortOpen(!sortOpen); setFilterOpen(false); }}
                  className="flex items-center space-x-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <span>Sort: {selectedSort}</span>
                  <ChevronRight className={`h-4 w-4 transition-transform ${sortOpen ? 'transform rotate-90' : ''}`} />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {sortOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleSortSelect(option)}
                        className={`block w-full text-left px-4 py-2 text-sm ${option === selectedSort ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-indigo-50'}`}
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
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Genre</h4>
                      <div className="flex flex-wrap gap-2">
                        {genres.map((genre, index) => (
                          <button
                            key={index}
                            onClick={() => handleGenreSelect(genre)}
                            className={`text-xs px-2 py-1 rounded-full ${genre === selectedGenre
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    </div>
                    {(selectedLanguage !== 'All' || selectedGenre !== 'All') && (
                      <button
                        onClick={clearFilters}
                        className="w-full mt-2 text-xs px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        Clear Filters
                      </button>
                    )}
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
        {filteredTranslations.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No translations found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedLanguage !== 'All' || selectedGenre !== 'All'
                ? `No translations match your filters. Try different filters.`
                : 'No translations available at the moment.'}
            </p>
            {(selectedLanguage !== 'All' || selectedGenre !== 'All') && (
              <button
                onClick={clearFilters}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTranslations.map((novel) => (
                <div key={novel.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <Link to={`/translation-novel/${novel.id}`} className="block">
                    {novel.cover ? (
                      <div className="relative bg-gray-100" style={{ aspectRatio: '2 / 3' }}>
                        <img
                          src={`${baseUrl}/public/${novel.cover}`}
                          alt={novel.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/300x450`;
                          }}
                        />
                        <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 px-3 py-1 m-2 rounded-md flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-white text-sm">{novel.rating || 'N/A'}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative bg-gray-200" style={{ aspectRatio: '2 / 3' }}>
                        <img
                          src={`https://placehold.co/300x450`}
                          alt="Placeholder"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 px-3 py-1 m-2 rounded-md flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-white text-sm">{novel.rating || 'N/A'}</span>
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
        )}
      </div>

      <Footer/>
    </div>
  );
};

export default Translations;