import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, ChevronRight, Heart, BookOpen, Clock, Star } from 'lucide-react';
import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const featuredNovels = [
    {
      id: 1,
      title: "The Dragon's Apprentice",
      excerpt: "When a humble village boy discovers he can communicate with dragons, his life changes forever.",
      genre: "Fantasy",
      chapters: 42,
      rating: 4.8
    },
    {
      id: 2,
      title: "Echoes of Another World",
      excerpt: "A mysterious portal connects two parallel worlds, but crossing over comes with unexpected consequences.",
      genre: "Sci-Fi",
      chapters: 36,
      rating: 4.6
    },
    {
      id: 3,
      title: "The Silent Assassin",
      excerpt: "In the shadows of the imperial city, a skilled assassin uncovers a conspiracy that threatens the empire.",
      genre: "Action",
      chapters: 28,
      rating: 4.7
    }
  ];

  const recentUpdates = [
    {
      id: 4,
      title: "Moonlight Academy",
      genre: "Fantasy",
      updated: "Apr 5, 2025",
      chapter: "Chapter 87: The Final Trial"
    },
    {
      id: 5,
      title: "Corporate Cultivator",
      genre: "Urban Fantasy",
      updated: "Apr 4, 2025",
      chapter: "Chapter 56: Office Politics"
    },
    {
      id: 6,
      title: "Space Nomad Chronicles",
      genre: "Sci-Fi",
      updated: "Apr 3, 2025",
      chapter: "Chapter 124: The Nebula's Secret"
    },
    {
      id: 7,
      title: "Heart of the Sword",
      genre: "Wuxia",
      updated: "Apr 2, 2025",
      chapter: "Chapter 212: The Mountain Duel"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        currentPage={window.location.pathname}
      />

      {/* Hero Section */}
      <div className="bg-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Discover Original and Translated Webnovels
              </h1>
              <p className="text-indigo-100 mb-6 text-lg">
                Immerse yourself in captivating stories from around the world.
              </p>
              <div className="flex space-x-4">
                <Link to="/novels" className="bg-white text-indigo-700 px-4 py-2 rounded-md font-medium flex items-center hover:bg-indigo-50">
                  Browse Library <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
                <Link to="/rankings" className="bg-transparent border border-white text-white px-4 py-2 rounded-md font-medium flex items-center hover:bg-indigo-600">
                  Top Ranked Novels
                </Link>
              </div>
            </div>
            <div className="hidden md:block md:w-1/2 mt-10 md:mt-0">
              <div className="bg-indigo-600 p-8 rounded-lg shadow-xl">
                <div className="bg-white rounded p-4 text-indigo-800">
                  <h3 className="font-bold mb-2">LATEST RELEASE</h3>
                  <h4 className="text-xl font-bold mb-1">The Dragon's Apprentice</h4>
                  <p className="text-sm mb-3">Chapter 43: The Council's Decision</p>
                  <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                </div>
                <div className="mt-4 flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>3 hours ago</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-300" />
                    <span>4.8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Novels */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Featured Novels</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredNovels.map((novel) => (
            <div key={novel.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-56 bg-indigo-200 relative">
                {/* Placeholder for novel cover */}
                <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 px-3 py-1 m-2 rounded-md flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-white text-sm">{novel.rating}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">{novel.genre}</span>
                  <span className="text-xs text-gray-500 ml-2">{novel.chapters} chapters</span>
                </div>
                <h3 className="font-bold text-xl mb-2 text-gray-800">{novel.title}</h3>
                <p className="text-gray-600 mb-4">{novel.excerpt}</p>
                <Link to={`/novel/${novel.id}`} className="text-indigo-600 font-medium hover:text-indigo-500 flex items-center">
                  Start Reading <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Updates */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recently Updated</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              {recentUpdates.map((novel, index) => (
                <div key={novel.id} className={`${index !== recentUpdates.length - 1 ? 'border-b border-gray-200 pb-4 mb-4' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">{novel.genre}</span>
                      <h3 className="font-bold text-lg mt-2 text-gray-800">{novel.title}</h3>
                      <Link
                        to={`/novel/${novel.id}/chapter/${novel.chapter.split(' ')[1].replace(':', '')}`}
                        className="text-gray-600 mt-1 hover:text-indigo-600"
                      >
                        {novel.chapter}
                      </Link>
                    </div>
                    <span className="text-sm text-gray-500">{novel.updated}</span>
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
          {['Fantasy', 'Sci-Fi', 'Romance', 'Action', 'Adventure', 'Mystery', 'Horror', 'Wuxia'].map((genre, index) => (
            <Link key={index} to={`/genre/${genre.toLowerCase()}`} className="bg-white rounded-lg shadow p-6 text-center hover:shadow-md transition hover:bg-indigo-50">
              <h3 className="font-bold text-lg text-indigo-700">{genre}</h3>
            </Link>
          ))}
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default Home;