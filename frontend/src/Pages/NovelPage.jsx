import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  Star,
  MessageCircle,
  Eye,
  Clock,
  ChevronDown,
  ChevronUp,
  BookOpen
} from 'lucide-react';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const NovelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState('chapters');
  const [chaptersExpanded, setChaptersExpanded] = useState(true);

  // State for API data
  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get base URL from environment variable
  const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchNovelData = async () => {
      try {
        setLoading(true);

        // Fetch novel details
        const novelResponse = await axios.get(`${BASE_URL}/api/novel/${id}`);
        console.log("novel data", novelResponse.data)
        console.log("novel id :", id)
        if (novelResponse.data.success) {
          setNovel(novelResponse.data.data);

          // Fetch chapters via GET with query param
          const chaptersResponse = await axios.get(`${BASE_URL}/api/novel/${id}/chapter`, {
            params: { novel_id: id } // Send as query param
          });

          console.log("chapter novel data", novelResponse.data)

          if (chaptersResponse.data.success) {
            // Sort chapters by created_at in ascending order (oldest first)
            const sortedChapters = chaptersResponse.data.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            setChapters(sortedChapters);
          } else {
            setError('Failed to load chapters');
          }
        } else {
          setError('Failed to load novel data');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error loading novel data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNovelData();
    }
  }, [id, BASE_URL]);

  // Function to handle reading the first chapter
  const handleReadFirstChapter = () => {
    if (chapters.length > 0) {
      // Navigate to the first chapter (oldest by created_at)
      navigate(`/novel/${novel.id}/chapter/${chapters[0].id}`);
    }
  };

  // If loading, show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700 mx-auto"></div>
          <p className="mt-3 text-indigo-700">Loading novel...</p>
        </div>
      </div>
    );
  }

  // If error, show error message
  if (error || !novel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-4xl mb-4">!</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error || "Novel not found"}</p>
          <Link to="/" className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const truncatedDescription = novel.synopsis && novel.synopsis.length > 300
    ? `${novel.synopsis.substring(0, 300).replace(/\n/g, '\n')}...`
    : novel.synopsis;

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        currentPage={window.location.pathname}
      />

      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link to="/" className="flex items-center text-indigo-600 hover:text-indigo-800">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
      </div>

      {/* Novel Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex">
            {/* Cover Image */}
            <div className="md:w-1/4 mb-6 md:mb-0">
              <div className="bg-indigo-100 rounded-lg overflow-hidden shadow-md">
                <img
                  src={novel.cover ? `${BASE_URL}/public/${novel.cover}` : "https://placehold.co/300x450"}
                  alt={novel.title}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={handleReadFirstChapter}
                  disabled={chapters.length === 0}
                  className={`${chapters.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded-md flex items-center justify-center w-3/4 mr-2`}
                >
                  <BookOpen className="h-4 w-4 mr-2" /> Read First Chapter
                </button>
                <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md flex items-center justify-center hover:bg-gray-300">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
              <div className="flex justify-between mt-2">
                <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md flex items-center justify-center w-1/2 mr-2 hover:bg-gray-300">
                  <Heart className="h-4 w-4 mr-1" /> Like
                </button>
                <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md flex items-center justify-center w-1/2 hover:bg-gray-300">
                  <Share2 className="h-4 w-4 mr-1" /> Share
                </button>
              </div>
            </div>

            {/* Novel Info */}
            <div className="md:w-3/4 md:pl-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{novel.title}</h1>

              <div className="flex items-center mb-4">
                <div className="flex items-center text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1 text-sm">{novel.ratings || "0.0"}</span>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                <div><span className="font-medium">Author:</span> {novel.author || "Unknown"}</div>
                <div className="flex items-center mt-1">
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="mr-3">{novel.views || 0} views</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Updated {formatDate(novel.updated_at)}</span>
                </div>
              </div>

              <div className="flex flex-wrap mb-4">
                {novel.genre && novel.genre.split(',').map((genre, index) => (
                  <Link
                    key={index}
                    to={`/genre/${genre.trim().toLowerCase()}`}
                    className="bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-xs font-medium mr-2 mb-2 hover:bg-indigo-200"
                  >
                    {genre.trim()}
                  </Link>
                ))}
              </div>

              <div className="mb-6">
                <div className="text-gray-700 whitespace-pre-line">
                  {showFullDescription ? novel.synopsis : truncatedDescription}
                </div>
                {novel.synopsis && novel.synopsis.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-indigo-600 mt-2 flex items-center text-sm hover:text-indigo-800"
                  >
                    {showFullDescription ? (
                      <>Show Less <ChevronUp className="h-4 w-4 ml-1" /></>
                    ) : (
                      <>Show More <ChevronDown className="h-4 w-4 ml-1" /></>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('chapters')}
              className={`py-4 px-6 text-sm font-medium ${activeTab === 'chapters'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                }`}
            >
              Chapters ({chapters.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-6 text-sm font-medium ${activeTab === 'reviews'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                }`}
            >
              Reviews (0)
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'chapters' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Chapters</h2>
              <div className="flex items-center">
                <button
                  onClick={() => setChaptersExpanded(!chaptersExpanded)}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                >
                  {chaptersExpanded ? (
                    <>Collapse All <ChevronUp className="h-4 w-4 ml-1" /></>
                  ) : (
                    <>Expand All <ChevronDown className="h-4 w-4 ml-1" /></>
                  )}
                </button>
              </div>
            </div>
            {chaptersExpanded && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {chapters.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Chapter Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Release Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {chapters.map((chapter, index) => (
                        <tr key={chapter.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Link to={`/novel/${novel.id}/chapter/${chapter.id}`} className="text-indigo-600 hover:text-indigo-900">
                              {chapter.title}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(chapter.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No chapters available yet.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Reviews</h2>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
                Write a Review
              </button>
            </div>
            <div className="py-8 text-center text-gray-500">
              No reviews available yet.
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default NovelPage;