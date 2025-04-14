import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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

const TranslationNovelPage = () => {
  const { id } = useParams();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState('chapters');
  const [chaptersExpanded, setChaptersExpanded] = useState(true);

  // Mock data for a single novel
  const novel = {
    id: 1,
    title: "The Dragon's Apprentice",
    author: "R.J. Blackwood",
    translator: "Faizal Translations", // Only for translated novels
    coverImage: "https://placehold.co/300x450", // Placeholder image
    status: "Ongoing",
    rating: 4.8,
    genres: ["Fantasy", "Adventure", "Coming of Age"],
    views: 458923,
    bookmarks: 32156,
    lastUpdated: "April 5, 2025",
    description: "In a world where dragons are feared and hunted to near extinction, young Elian discovers he possesses a rare gift - the ability to communicate with these magnificent creatures. When he encounters an injured dragon in the forest near his village, his decision to help the beast marks the beginning of an extraordinary journey. As Elian becomes the first dragon's apprentice in centuries, he must navigate dangerous politics, ancient magic, and his own growing powers. But dark forces are stirring in the kingdom, and both humans and dragons face a threat greater than their long-standing enmity. Elian must master his abilities and forge unlikely alliances if he hopes to protect everything he holds dear. This epic tale explores themes of friendship, courage, and finding one's place in a divided world.",
    chapters: [
      { number: 43, title: "The Council's Decision", releaseDate: "Apr 5, 2025", locked: false },
      { number: 42, title: "Wings of Truth", releaseDate: "Apr 2, 2025", locked: false },
      { number: 41, title: "The Mountain Pass", releaseDate: "Mar 30, 2025", locked: false },
      { number: 40, title: "Ancient Scrolls", releaseDate: "Mar 28, 2025", locked: false },
      { number: 39, title: "The Fire Within", releaseDate: "Mar 26, 2025", locked: false },
      { number: 38, title: "Shadows in the Castle", releaseDate: "Mar 24, 2025", locked: false },
      { number: 37, title: "The Elders' Warning", releaseDate: "Mar 22, 2025", locked: false },
      { number: 36, title: "Dragon Flight", releaseDate: "Mar 20, 2025", locked: false },
      { number: 35, title: "Unexpected Allies", releaseDate: "Mar 18, 2025", locked: false },
      { number: 34, title: "The Hidden Cave", releaseDate: "Mar 16, 2025", locked: false },
    ],
    reviews: [
      { id: 1, user: "DragonLover42", rating: 5, comment: "This novel has kept me on the edge of my seat! The world-building is incredible and the characters feel so real.", date: "Mar 30, 2025" },
      { id: 2, user: "BookWorm99", rating: 4, comment: "A fresh take on dragon mythology. The protagonist's development is well-paced and believable.", date: "Mar 25, 2025" },
      { id: 3, user: "FantasyReader", rating: 5, comment: "One of the best fantasy stories I've read this year. Can't wait for the next chapter!", date: "Mar 20, 2025" }
    ],
    similarNovels: [
      { id: 2, title: "Echoes of Another World", genre: "Sci-Fi", rating: 4.6 },
      { id: 8, title: "Wings of Destiny", genre: "Fantasy", rating: 4.7 },
      { id: 12, title: "The Last Spellweaver", genre: "Fantasy", rating: 4.5 }
    ]
  };

  const truncatedDescription = novel.description.substring(0, 300) + "...";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

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
                  src={novel.coverImage}  
                  alt={novel.title} 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="flex justify-between mt-4">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center justify-center w-3/4 mr-2 hover:bg-indigo-700">
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
                <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium mr-2">
                  {novel.status}
                </div>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1 text-sm">{novel.rating}</span>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                <div><span className="font-medium">Author:</span> {novel.author}</div>
                {novel.translator && <div><span className="font-medium">Translator:</span> {novel.translator}</div>}
                <div className="flex items-center mt-1">
                  <Eye className="h-4 w-4 mr-1" /> 
                  <span className="mr-3">{novel.views.toLocaleString()} views</span>
                  <Bookmark className="h-4 w-4 mr-1" /> 
                  <span className="mr-3">{novel.bookmarks.toLocaleString()} bookmarks</span>
                  <Clock className="h-4 w-4 mr-1" /> 
                  <span>Updated {novel.lastUpdated}</span>
                </div>
              </div>

              <div className="flex flex-wrap mb-4">
                {novel.genres.map((genre, index) => (
                  <Link 
                    key={index}
                    to={`/genre/${genre.toLowerCase()}`}
                    className="bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-xs font-medium mr-2 mb-2 hover:bg-indigo-200"
                  >
                    {genre}
                  </Link>
                ))}
              </div>

              <div className="mb-6">
                <p className="text-gray-700">
                  {showFullDescription ? novel.description : truncatedDescription}
                </p>
                {novel.description.length > 300 && (
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
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'chapters'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
              }`}
            >
              Chapters ({novel.chapters.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
              }`}
            >
              Reviews ({novel.reviews.length})
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
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chapter Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Release Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {novel.chapters.map((chapter) => (
                      <tr key={chapter.number} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {chapter.number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Link to={`/novel/${novel.id}/chapter/${chapter.number}`} className="text-indigo-600 hover:text-indigo-900">
                            {chapter.title}
                            {chapter.locked && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Locked
                              </span>
                            )}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {chapter.releaseDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
            <div className="space-y-6">
              {novel.reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="font-medium text-indigo-800">{review.user.charAt(0)}</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{review.user}</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700">{review.comment}</p>
                  <div className="mt-4 flex items-center text-sm">
                    <button className="text-gray-500 flex items-center hover:text-gray-700">
                      <MessageCircle className="h-4 w-4 mr-1" /> Reply
                    </button>
                    <button className="ml-4 text-gray-500 flex items-center hover:text-gray-700">
                      <Heart className="h-4 w-4 mr-1" /> Helpful
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Similar Novels */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Similar Novels You May Like</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {novel.similarNovels.map((similar) => (
              <Link 
                key={similar.id} 
                to={`/novel/${similar.id}`} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 bg-indigo-200 relative">
                  {/* Placeholder for novel cover */}
                  <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 px-3 py-1 m-2 rounded-md flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-white text-sm">{similar.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">{similar.genre}</span>
                  <h3 className="font-bold text-lg mt-2 text-gray-800">{similar.title}</h3>
                </div>
              </Link>
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
              <p className="max-w-xs">Your source for captivating original stories and quality translations.</p>
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
              <div className="col-span-2 md:col-span-1">
                <h3 className="font-semibold text-white mb-2">Connect</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">Discord</a></li>
                  <li><a href="#" className="hover:text-white">Twitter</a></li>
                  <li><a href="#" className="hover:text-white">Contact Us</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-indigo-800 flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 Faizal Webnovel. All rights reserved.</p>
            <div className="flex items-center mt-4 md:mt-0">
              Made with <Heart className="mx-1 h-4 w-4 text-red-400" /> for our beloved readers
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TranslationNovelPage;