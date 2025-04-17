import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const TranslationChapterPage = () => {
    const { novelId, chapterId } = useParams();
    const navigate = useNavigate();
    const [chapter, setChapter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [prevChapter, setPrevChapter] = useState(null);
    const [nextChapter, setNextChapter] = useState(null);


    // Placeholder comment data
    const placeholderComments = [
        {
            id: 1,
            user: {
                name: "BookLover42",
                avatar: "https://placehold.co/40"
            },
            content: "This chapter was amazing! The plot twist at the end completely caught me off guard.",
            createdAt: "2023-05-15T10:30:00Z",
            likes: 24
        },
        {
            id: 2,
            user: {
                name: "FantasyFan",
                avatar: "https://placehold.co/40"
            },
            content: "I've been waiting for this chapter for weeks and it didn't disappoint. The character development is superb!",
            createdAt: "2023-05-14T18:45:00Z",
            likes: 15
        },
        {
            id: 3,
            user: {
                name: "NovelEnthusiast",
                avatar: "https://placehold.co/40"
            },
            content: "Can't wait to see what happens next! The author is really building up to something big.",
            createdAt: "2023-05-13T08:20:00Z",
            likes: 8
        }
    ];

    useEffect(() => {
        const fetchChapter = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `${process.env.REACT_APP_BASE_URL}/api/translation_novel/${novelId}/chapter/${chapterId}`
                );

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Failed to fetch chapter');
                }

                if (!data.data || !data.data.chapter) {
                    throw new Error('Chapter data not found');
                }
                
                console.log('API Response:', data); // Add this line

                setChapter(data.data.chapter);
                setPrevChapter(data.data.previousChapter);
                setNextChapter(data.data.nextChapter);
                setComments(placeholderComments); // Set placeholder comments
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchChapter();
    }, [novelId, chapterId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading chapter...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500">{error}</p>
                    <Link
                        to={`/translation-novel/${novelId}`}
                        className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Novel
                    </Link>
                </div>
            </div>
        );
    }

    if (!chapter) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Chapter not found</p>
                    <Link
                        to={`/translation-novel/${novelId}`}
                        className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Novel
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {/* Chapter Navigation */}
            <div className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-between items-center gap-2 py-3">
                        <Link
                            to={`/translation-novel/${novelId}`}
                            className="flex items-center text-indigo-600 hover:text-indigo-800"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Novel
                        </Link>

                        <div className="flex items-center space-x-4">
                            {prevChapter ? (
                                <Link
                                    to={`/novel/${novelId}/chapter/${prevChapter.id}`}
                                    className="flex items-center px-3 py-1 rounded text-indigo-600 hover:bg-indigo-50"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                                </Link>
                            ) : (
                                <span className="text-gray-400 flex items-center px-3 py-1">
                                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                                </span>
                            )}

                            <div className="text-sm font-medium text-gray-700">{chapter.title}</div>

                            {nextChapter ? (
                                <Link
                                    to={`/translation-novel/${novelId}/chapter/${nextChapter.id}`}
                                    className="flex items-center px-3 py-1 rounded text-indigo-600 hover:bg-indigo-50"
                                >
                                    Next <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                            ) : (
                                <span className="text-gray-400 flex items-center px-3 py-1">
                                    Next <ChevronRight className="h-4 w-4 ml-1" />
                                </span>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        {/* Chapter Header */}
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {chapter.title}
                            </h1>
                            <div className="flex items-center text-sm text-gray-500 mt-2">
                                <span>Released: {new Date(chapter.created_at).toLocaleDateString()}</span>
                                <span className="mx-2">•</span>
                                <span>{chapter.views} views</span>
                            </div>
                        </div>

                        {/* Chapter Body */}
                        <div className="px-6 py-4">
                            <div
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: chapter.content }}
                            />
                        </div>

                        {/* Comments Section */}
                        <div className="border-t border-gray-200 px-6 py-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Comments ({comments.length})</h2>

                            <div className="space-y-4">
                                {comments.map(comment => (
                                    <div key={comment.id} className="flex space-x-3">
                                        <img
                                            src={comment.user.avatar}
                                            alt={comment.user.name}
                                            className="h-10 w-10 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-medium text-gray-900">{comment.user.name}</h3>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mt-1">{comment.content}</p>
                                            <div className="flex items-center mt-2 text-sm text-gray-500">
                                                <button className="hover:text-indigo-600">Like</button>
                                                {comment.likes > 0 && (
                                                    <span className="ml-1">({comment.likes})</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Comment Form */}
                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Leave a comment</h3>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    rows="3"
                                    placeholder="Share your thoughts about this chapter..."
                                ></textarea>
                                <div className="mt-2 flex justify-end">
                                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Post Comment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TranslationChapterPage;