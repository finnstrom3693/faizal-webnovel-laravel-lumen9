import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, ChevronRight, Heart, BookOpen, Clock, Star } from 'lucide-react';
import axios from 'axios';
import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';
import Header from '../Components/Header.jsx';

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuredNovels, setFeaturedNovels] = useState([]);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both novels and translations
        const [novelsRes, translationsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BASE_URL}/api/novel`),
          axios.get(`${process.env.REACT_APP_BASE_URL}/api/translation_novel`)
        ]);

        // Function to fetch latest chapter for a novel
        const fetchLatestChapter = async (id, isTranslation = false) => {
          try {
            const endpoint = isTranslation
              ? `${process.env.REACT_APP_BASE_URL}/api/translation_novel/${id}/chapter?novel_id=${id}`
              : `${process.env.REACT_APP_BASE_URL}/api/novel/${id}/chapter?novel_id=${id}`;

            const response = await axios.get(endpoint);
            const chapters = response.data.data || [];

            if (chapters.length > 0) {
              const sortedChapters = [...chapters].sort((a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
              );
              return sortedChapters[0];
            }
            return null;
          } catch (err) {
            if (err.response && err.response.status === 404) {
              return null;
            }
            console.error(`Error fetching chapters for novel ${id}:`, err);
            return null;
          }
        };

        // Process novels for featured and updates
        const novelUpdates = await Promise.all(novelsRes.data.data.map(async (novel) => {
          const latestChapter = await fetchLatestChapter(novel.id);
          const coverUrl = novel.cover
            ? `${process.env.REACT_APP_BASE_URL}/public/${novel.cover}`
            : 'https://placehold.co/300x450';

          return {
            id: novel.id,
            title: novel.title,
            genre: novel.genre,
            updated: latestChapter ? new Date(latestChapter.created_at) : new Date(novel.created_at),
            displayDate: latestChapter ? new Date(latestChapter.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : new Date(novel.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            chapter: latestChapter ? `${latestChapter.title}` : 'No chapters yet',
            excerpt: novel.synopsis || 'No synopsis available',
            rating: novel.rating || 0,
            latestChapterId: latestChapter?.id || null,
            type: 'original',
            cover: coverUrl,
            featured: novel.featured
          };
        }));

        // Process translations for featured and updates
        const translationUpdates = await Promise.all(translationsRes.data.data.map(async (translation) => {
          const latestChapter = await fetchLatestChapter(translation.id, true);
          const coverUrl = translation.cover
            ? `${process.env.REACT_APP_BASE_URL}/public/${translation.cover}`
            : 'https://placehold.co/300x450';

          return {
            id: translation.id,
            title: translation.title,
            genre: translation.genre,
            updated: latestChapter ? new Date(latestChapter.created_at) : new Date(translation.created_at),
            displayDate: latestChapter ? new Date(latestChapter.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : new Date(translation.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            chapter: latestChapter ? `${latestChapter.title}` : 'No chapters yet',
            excerpt: translation.synopsis || 'No synopsis available',
            rating: translation.rating || 0,
            latestChapterId: latestChapter?.id || null,
            type: 'translation',
            cover: coverUrl,
            featured: translation.featured
          };
        }));

        // Combine all novels
        const allNovels = [...novelUpdates, ...translationUpdates];

        // Get featured novels (first 6 featured ones)
        const featured = allNovels.filter(novel => novel.featured).slice(0, 6);
        setFeaturedNovels(featured);

        // Get recent updates (sorted by update date, newest first, first 4)
        const updates = [...allNovels].sort((a, b) => {
          return new Date(b.updated) - new Date(a.updated);
        }).slice(0, 4);
        setRecentUpdates(updates);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          currentPage={window.location.pathname}
        />
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
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

      <Header />

      {/* Featured Novels */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Featured Novels</h2>
        {featuredNovels.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {featuredNovels.map((novel) => (
              <div key={`${novel.type}-${novel.id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-[2/3] bg-indigo-200 relative w-full">
                  <img
                    src={novel.cover}
                    alt={novel.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/300x450';
                    }}
                  />
                  <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 px-3 py-1 m-2 rounded-md flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-white text-sm">{novel.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">{novel.genre}</span>
                    {novel.type === 'translation' && (
                      <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full ml-2">Translation</span>
                    )}
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-gray-800">{novel.title}</h3>
                  <p className="text-gray-600 mb-4">{novel.excerpt.substring(0, 100)}...</p>
                  <Link
                    to={novel.type === 'translation' ? `/translation-novel/${novel.id}` : `/novel/${novel.id}`}
                    className="text-indigo-600 font-medium hover:text-indigo-500 flex items-center"
                  >
                    Start Reading <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No featured novels found</p>
          </div>
        )}
      </div>

      {/* Recent Updates */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recently Updated</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              {recentUpdates.map((novel, index) => (
                <div key={`${novel.type}-${novel.id}`} className={`${index !== recentUpdates.length - 1 ? 'border-b border-gray-200 pb-4 mb-4' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full mr-2">{novel.genre}</span>
                        {novel.type === 'translation' && (
                          <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">Translation</span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg mt-1 text-gray-800">{novel.title}</h3>
                      {novel.latestChapterId ? (
                        <Link
                          to={`/${novel.type === 'translation' ? 'translation-novel' : 'novel'}/${novel.id}/chapter/${novel.latestChapterId}`}
                          className="text-gray-600 mt-1 hover:text-indigo-600 block"
                        >
                          {novel.chapter}
                        </Link>
                      ) : (
                        <span className="text-gray-600 mt-1 block">{novel.chapter}</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{novel.displayDate}</span>
                  </div>
                </div>
              ))}
              <div className="mt-6">
                <Link to="/updates" className="text-indigo-600 font-medium hover:text-indigo-500 flex items-center">
                  View all updates <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Genre Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Browse by Genre</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Fantasy', 'Sci-Fi', 'Romance', 'Action', 'Adventure', 'Mystery', 'Thriller', 'History'].map((genre, index) => (
            <Link key={index} to={`/genre/${genre.toLowerCase()}`} className="bg-white rounded-lg shadow p-6 text-center hover:shadow-md transition hover:bg-indigo-50">
              <h3 className="font-bold text-lg text-indigo-700">{genre}</h3>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;