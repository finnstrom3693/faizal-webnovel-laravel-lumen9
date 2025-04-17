import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, ChevronRight, Heart, BookOpen, Clock, Star } from 'lucide-react';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Updates = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpdates = async () => {
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

        // Process novels
        const novelUpdates = await Promise.all(novelsRes.data.data.map(async (novel) => {
          const latestChapter = await fetchLatestChapter(novel.id);
          const chapterCount = novel.chapters ? novel.chapters.length : 0;
          const coverUrl = novel.cover
            ? `${process.env.REACT_APP_BASE_URL}/public/${novel.cover}`
            : "https://placehold.co/300x450";

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
            chapters: chapterCount,
            latestChapterId: latestChapter?.id || null,
            type: 'original',
            cover: coverUrl
          };
        }));

        // Process translations
        const translationUpdates = await Promise.all(translationsRes.data.data.map(async (translation) => {
          const latestChapter = await fetchLatestChapter(translation.id, true);
          const chapterCount = translation.chapters ? translation.chapters.length : 0;
          const coverUrl = translation.cover
            ? `${process.env.REACT_APP_BASE_URL}/public/${translation.cover}`
            : "https://placehold.co/300x450";

          return {
            id: translation.id,
            title: translation.title,
            genre: translation.genre,
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
            excerpt: translation.synopsis || 'No synopsis available',
            rating: translation.rating || 0,
            chapters: chapterCount,
            latestChapterId: latestChapter?.id || null,
            type: 'translation',
            cover: coverUrl
          };
        }));

        // Combine and sort by update date (newest first)
        const allUpdates = [...novelUpdates, ...translationUpdates].sort((a, b) => {
          return new Date(b.updated) - new Date(a.updated);
        });

        setUpdates(allUpdates);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading updates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error loading updates: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
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
                <option>Thriller</option>
                <option>Mystery</option>
                <option>Adventure</option>
                <option>History</option>
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
          {updates.length > 0 ? (
            updates.map((novel) => (
              <div key={`${novel.type}-${novel.id}`} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full mr-2">{novel.genre}</span>
                        {novel.type === 'translation' && (
                          <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full mr-2">Translation</span>
                        )}
                        <span className="text-xs text-gray-500">{novel.displayDate}</span>
                      </div>
                      <Link to={`/${novel.type === 'translation' ? 'translation-novel' : 'novel'}/${novel.id}`} className="block">
                        <h3 className="text-xl font-bold text-gray-800 hover:text-indigo-600 mb-1">{novel.title}</h3>
                      </Link>
                      {novel.latestChapterId ? (
                        <Link
                          to={`/${novel.type === 'translation' ? 'translation-novel' : 'novel'}/${novel.id}/chapter/${novel.latestChapterId}`}
                          className="block text-indigo-600 hover:text-indigo-800 font-medium mb-2"
                        >
                          {novel.chapter}
                        </Link>
                      ) : (
                        <span className="block text-gray-500 font-medium mb-2">{novel.chapter}</span>
                      )}
                      <p className="text-gray-600 mb-3">{novel.excerpt}</p>
                      <div className="flex items-center text-sm">
                        <div className="flex items-center mr-4">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span>{novel.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <div className="h-32 w-24 rounded-md overflow-hidden">
                        <img
                          src={novel.cover}
                          alt={`${novel.title} cover`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `${process.env.REACT_APP_BASE_URL}/public/default-cover.jpg`;
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No updates found. Check back later!
            </div>
          )}
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

      <Footer />
    </div>
  );
};

export default Updates;