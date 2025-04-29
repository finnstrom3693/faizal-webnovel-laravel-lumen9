import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, ChevronRight, Heart, BookOpen, Clock, Star, Filter, Trash, Edit } from 'lucide-react';
import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const BookmarksPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const [filteredBookmarks, setFilteredBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [selectedSort, setSelectedSort] = useState('Latest');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentBookmark, setCurrentBookmark] = useState(null);
    const [notes, setNotes] = useState('');

    // Get base URL from environment variables
    const baseUrl = process.env.REACT_APP_BASE_URL || '';

    const genres = ['All', 'Fantasy', 'Sci-Fi', 'Action', 'Romance', 'Adventure', 'History', 'Mystery', 'Thriller'];
    const sortOptions = ['Latest', 'Title (A-Z)', 'Recent Updates', 'Most Chapters', 'Rating'];

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                // Try getting token from sessionStorage first, then localStorage
                const token = sessionStorage.getItem('token') || localStorage.getItem('token');
                if (!token) throw new Error('User not authenticated');

                const decoded = jwtDecode(token);
                const userId = decoded.sub || decoded.id || decoded.user_id; // adapt based on your token payload
                console.log(decoded);

                if (!userId) throw new Error('User ID missing in token');

                // Fetch user's bookmarks with polymorphic relationships
                const response = await axios.get(`${baseUrl}/api/bookmarks`, {
                    params: {
                        user_id: userId
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Process bookmarks data - assuming the API returns bookmarks with their relationships
                const processedBookmarks = response.data.data.map(bookmark => {
                    // The novel data is in the bookmarkable relationship
                    const novel = bookmark.bookmarkable;

                    return {
                        id: bookmark.id,
                        novel: {
                            id: novel.id,
                            title: novel.title,
                            cover: novel.cover,
                            genre: novel.genre,
                            rating: novel.rating,
                            updated_at: novel.updated_at,
                            created_at: novel.created_at
                        },
                        created_at: bookmark.created_at,
                        notes: bookmark.notes
                    };
                });

                // For each bookmark, fetch additional details if needed
                const bookmarksWithDetails = await Promise.all(processedBookmarks.map(async (bookmark) => {
                    try {
                        // Get chapter count for each novel
                        const chapterRes = await axios.get(`${baseUrl}/api/novel/${bookmark.novel.id}/chapters`);
                        const chapterCount = chapterRes.data.data.length;

                        // Get the last read chapter if available
                        let lastReadChapter = null;
                        if (bookmark.last_read_chapter_id) {
                            const chapterDetailRes = await axios.get(`${baseUrl}/api/chapters/${bookmark.last_read_chapter_id}`);
                            lastReadChapter = chapterDetailRes.data.data;
                        }

                        return {
                            ...bookmark,
                            chapters_count: chapterCount,
                            lastReadChapter
                        };
                    } catch (err) {
                        console.error(`Failed to fetch details for bookmark: ${bookmark.id}`, err);
                        return { ...bookmark, chapters_count: 0 };
                    }
                }));

                setBookmarks(bookmarksWithDetails);
                setFilteredBookmarks(bookmarksWithDetails);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, [baseUrl]);

    // Filter bookmarks by genre
    useEffect(() => {
        let filtered = [...bookmarks];

        // Apply genre filter
        if (selectedGenre !== 'All') {
            filtered = filtered.filter(bookmark =>
                bookmark.novel.genre && bookmark.novel.genre.toLowerCase() === selectedGenre.toLowerCase()
            );
        }

        // Apply sorting
        switch (selectedSort) {
            case 'Latest':
                filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'Title (A-Z)':
                filtered.sort((a, b) => a.novel.title.localeCompare(b.novel.title));
                break;
            case 'Recent Updates':
                filtered.sort((a, b) => new Date(b.novel.updated_at) - new Date(a.novel.updated_at));
                break;
            case 'Most Chapters':
                filtered.sort((a, b) => (b.chapters_count || 0) - (a.chapters_count || 0));
                break;
            case 'Rating':
                filtered.sort((a, b) => (b.novel.rating || 0) - (a.novel.rating || 0));
                break;
            default:
                break;
        }

        setFilteredBookmarks(filtered);
    }, [selectedGenre, selectedSort, bookmarks]);

    const handleGenreSelect = (genre) => {
        setSelectedGenre(genre);
        setFilterOpen(false);
    };

    const handleSortSelect = (sortOption) => {
        setSelectedSort(sortOption);
        setSortOpen(false);
    };

    const handleRemoveBookmark = async (bookmarkId) => {
        // Show confirmation dialog before proceeding with deletion
        const isConfirmed = window.confirm("Are you sure you want to remove this bookmark?");
        
        if (!isConfirmed) {
            // If user cancels, do nothing
            return;
        }
    
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            await axios.delete(`${baseUrl}/api/bookmarks/${bookmarkId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Remove from state after successful deletion
            setBookmarks(bookmarks.filter(bookmark => bookmark.id !== bookmarkId));
            setFilteredBookmarks(filteredBookmarks.filter(bookmark => bookmark.id !== bookmarkId));
        } catch (err) {
            console.error('Failed to remove bookmark:', err);
            // Optionally, show an error alert if the deletion fails
            window.alert('Failed to remove bookmark. Please try again.');
        }
    };

    const openEditModal = (bookmark) => {
        setCurrentBookmark(bookmark);
        setNotes(bookmark.notes || '');
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setCurrentBookmark(null);
        setNotes('');
    };

    const handleSaveNotes = async () => {
        if (!currentBookmark) return;

        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.put(
                `${baseUrl}/api/bookmarks/${currentBookmark.id}`,
                { notes },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Update the bookmark in state
            const updatedBookmarks = bookmarks.map(bookmark => 
                bookmark.id === currentBookmark.id 
                    ? { ...bookmark, notes } 
                    : bookmark
            );

            setBookmarks(updatedBookmarks);
            setFilteredBookmarks(updatedBookmarks);
            closeEditModal();
        } catch (err) {
            console.error('Failed to update bookmark notes:', err);
            window.alert('Failed to update notes. Please try again.');
        }
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
                                <p className="text-sm text-red-700">
                                    {error === 'User not authenticated'
                                        ? 'You need to sign in to view your bookmarks.'
                                        : `Error loading bookmarks: ${error}`}
                                </p>
                                {error === 'User not authenticated' && (
                                    <div className="mt-3">
                                        <Link
                                            to="/login"
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            Sign In
                                        </Link>
                                    </div>
                                )}
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
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Bookmarks</h1>
                            <p className="text-gray-600 mt-1">Keep track of your favorite novels</p>
                            {selectedGenre !== 'All' && (
                                <p className="text-sm text-gray-500 mt-1">Filtered by: {selectedGenre}</p>
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
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Bookmarks Grid */}
                {filteredBookmarks.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-indigo-100 mb-4">
                            <BookOpen className="h-12 w-12 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No bookmarks found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {selectedGenre !== 'All'
                                ? `No bookmarks in the ${selectedGenre} genre. Try another genre.`
                                : 'You haven\'t bookmarked any novels yet.'}
                        </p>
                        {selectedGenre !== 'All' ? (
                            <button
                                onClick={() => setSelectedGenre('All')}
                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Clear filters
                            </button>
                        ) : (
                            <Link
                                to="/novels"
                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Browse Novels
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredBookmarks.map((bookmark) => (
                                <div key={bookmark.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="relative">
                                        <Link to={`/novel/${bookmark.novel.id}`} className="block">
                                            {bookmark.novel.cover ? (
                                                <div className="relative bg-gray-100" style={{ aspectRatio: '2 / 3' }}>
                                                    <img
                                                        src={`${baseUrl}/public/${bookmark.novel.cover}`}
                                                        alt={bookmark.novel.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = `https://placehold.co/360x480`;
                                                        }}
                                                    />
                                                    <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 px-3 py-1 m-2 rounded-md flex items-center">
                                                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                                        <span className="text-white text-sm">{bookmark.novel.rating || 'N/A'}</span>
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
                                                        <span className="text-white text-sm">{bookmark.novel.rating || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </Link>
                                        <div className="absolute top-2 right-2 flex space-x-1">
                                            <button
                                                onClick={() => openEditModal(bookmark)}
                                                className="bg-white bg-opacity-90 p-1 rounded-full shadow hover:bg-indigo-50"
                                                title="Edit bookmark"
                                            >
                                                <Edit className="h-4 w-4 text-indigo-500" />
                                            </button>
                                            <button
                                                onClick={() => handleRemoveBookmark(bookmark.id)}
                                                className="bg-white bg-opacity-90 p-1 rounded-full shadow hover:bg-red-50"
                                                title="Remove bookmark"
                                            >
                                                <Trash className="h-4 w-4 text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg mb-1 text-gray-800 line-clamp-1">
                                            <Link to={`/novel/${bookmark.novel.id}`} className="hover:text-indigo-600">
                                                {bookmark.novel.title}
                                            </Link>
                                        </h3>
                                        {bookmark.novel.genre && (
                                            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mb-2">
                                                {bookmark.novel.genre}
                                            </span>
                                        )}
                                        {bookmark.notes && (
                                            <div className="mt-2">
                                                <div className="text-xs text-gray-500">Notes:</div>
                                                <p className="text-sm text-gray-700 line-clamp-2">{bookmark.notes}</p>
                                            </div>
                                        )}

                                        <div className="mt-4 flex justify-between">
                                            <Link
                                                to={`/novel/${bookmark.novel.id}`}
                                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination placeholder - implement if needed */}
                        {filteredBookmarks.length > 20 && (
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
                                    <button className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Edit Bookmark Modal */}
            {editModalOpen && currentBookmark && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Edit Bookmark Notes</h3>
                            <button 
                                onClick={closeEditModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows={4}
                                placeholder="Add your notes about this novel..."
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeEditModal}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveNotes}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default BookmarksPage;