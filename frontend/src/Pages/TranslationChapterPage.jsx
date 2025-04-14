import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Bookmark,
    Share2,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    MessageCircle,
    Heart
} from 'lucide-react';

const TranslationChapterPage = () => {
    const { id, chapterNumber } = useParams();
    const navigate = useNavigate();

    // Mock data for the chapter
    const chapter = {
        novelId: 1,
        novelTitle: "The Dragon's Apprentice",
        number: parseInt(chapterNumber),
        title: "The Council's Decision",
        content: `
            <p>The great hall of the Dragon Council was silent as Elian stepped forward, his boots echoing on the ancient stone floor. The weight of a hundred dragon gazes pressed upon him, each pair of eyes glowing with an inner fire that seemed to pierce his very soul.</p>
            
            <p>"You understand what you ask of us, human?" rumbled the eldest, his scales the color of storm clouds and his voice like distant thunder.</p>
            
            <p>Elian swallowed hard but stood his ground. "I do, Elder Stormwing. An alliance between our kinds is the only way to face the darkness coming from the north."</p>
            
            <p>A murmur passed through the assembled dragons. Some snorted plumes of smoke in derision, while others leaned forward with interest. The young gold dragon, Sunflare, whom Elian had befriended months ago, gave him an encouraging nod.</p>
            
            <p>The debate that followed lasted hours. Elian listened as dragons argued in their deep, resonant voices about the sins of humans past, about broken treaties and lost hatchlings. His heart ached with each accusation, knowing they spoke truth.</p>
            
            <p>Finally, as the torches burned low and the first light of dawn touched the high windows, Stormwing raised a massive claw for silence.</p>
            
            <p>"We will put it to a vote," he declared. "All in favor of forming a temporary alliance with the human settlements?"</p>
            
            <p>Elian held his breath as, one by one, the dragons raised their wings. To his astonishment, nearly two-thirds of the council voted in favor.</p>
            
            <p>"The decision is made," Stormwing announced. "But know this, human—this is your last chance. Betray us again, and no plea will stay our wrath."</p>
            
            <p>Elian bowed deeply. "You have my word, and the word of my people. Together, we will face this threat."</p>
            
            <p>As he left the hall, Sunflare fell into step beside him. "You did well, little one," the dragon said, amusement coloring his voice.</p>
            
            <p>Elian smiled wearily. "This is just the beginning. Now comes the hard part—convincing my people to trust dragons as much as you've decided to trust us."</p>
        `,
        prevChapter: 42,
        nextChapter: 44,
        wordCount: 2450,
        releaseDate: "April 5, 2025",
        comments: [
            { id: 1, user: "DragonLover42", comment: "This chapter gave me chills! The tension in the council scene was amazing.", date: "Apr 5, 2025" },
            { id: 2, user: "FantasyReader", comment: "I love how Elian is growing into his role as mediator between the species.", date: "Apr 5, 2025" }
        ]
    };

    const handleNavigation = (direction) => {
        if (direction === 'prev' && chapter.prevChapter) {
            navigate(`/novel/${id}/chapter/${chapter.prevChapter}`);
        } else if (direction === 'next' && chapter.nextChapter) {
            navigate(`/novel/${id}/chapter/${chapter.nextChapter}`);
        }
    };

    const handleBookmark = () => {
        // TODO: Implement bookmark functionality
        console.log('Bookmark clicked');
    };

    const handleShare = () => {
        // TODO: Implement share functionality
        console.log('Share clicked');
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement comment submission
        console.log('Comment submitted');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navigation Bar */}
            <nav className="bg-indigo-800 text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
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

            {/* Chapter Navigation */}
            <div className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-between items-center gap-2 py-3">
                        <Link
                            to={`/novel/${id}`}
                            className="flex items-center text-indigo-600 hover:text-indigo-800"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Novel
                        </Link>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => handleNavigation('prev')}
                                disabled={!chapter.prevChapter}
                                className={`flex items-center px-3 py-1 rounded ${chapter.prevChapter ? 'text-indigo-600 hover:bg-indigo-50' : 'text-gray-400 cursor-not-allowed'}`}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                            </button>

                            <div className="text-sm font-medium text-gray-700">
                                Chapter {chapter.number}: {chapter.title}
                            </div>

                            <button
                                onClick={() => handleNavigation('next')}
                                disabled={!chapter.nextChapter}
                                className={`flex items-center px-3 py-1 rounded ${chapter.nextChapter ? 'text-indigo-600 hover:bg-indigo-50' : 'text-gray-400 cursor-not-allowed'}`}
                            >
                                Next <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow">
                {/* Chapter Content */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        {/* Chapter Header */}
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Chapter {chapter.number}: {chapter.title}
                            </h1>
                            <div className="flex items-center text-sm text-gray-500 mt-2">
                                <span>Released: {chapter.releaseDate}</span>
                                <span className="mx-2">•</span>
                                <span>{chapter.wordCount.toLocaleString()} words</span>
                            </div>
                        </div>

                        {/* Chapter Body */}
                        <div className="px-6 py-4">
                            <div
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: chapter.content }}
                            />
                        </div>

                        {/* Chapter Footer */}
                        <div className="border-t border-gray-200 px-6 py-4">
                            <div className="flex flex-wrap justify-between items-center gap-2">
                                <div className="flex space-x-4">
                                    <button 
                                        onClick={handleBookmark}
                                        className="flex items-center text-gray-600 hover:text-gray-900"
                                    >
                                        <Bookmark className="h-5 w-5 mr-1" />
                                        <span>Bookmark</span>
                                    </button>
                                    <button 
                                        onClick={handleShare}
                                        className="flex items-center text-gray-600 hover:text-gray-900"
                                    >
                                        <Share2 className="h-5 w-5 mr-1" />
                                        <span>Share</span>
                                    </button>
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => handleNavigation('prev')}
                                        disabled={!chapter.prevChapter}
                                        className={`flex items-center px-3 py-1 rounded ${chapter.prevChapter ? 'text-indigo-600 hover:bg-indigo-50' : 'text-gray-400 cursor-not-allowed'}`}
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                                    </button>
                                    <button
                                        onClick={() => handleNavigation('next')}
                                        disabled={!chapter.nextChapter}
                                        className={`flex items-center px-3 py-1 rounded ${chapter.nextChapter ? 'text-indigo-600 hover:bg-indigo-50' : 'text-gray-400 cursor-not-allowed'}`}
                                    >
                                        Next <ChevronRight className="h-4 w-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Comments ({chapter.comments.length})</h2>
                        </div>

                        <div className="px-6 py-4">
                            <form className="mb-6" onSubmit={handleCommentSubmit}>
                                <div className="mb-4">
                                    <textarea
                                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        rows="3"
                                        placeholder="Add your comment..."
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Post Comment
                                </button>
                            </form>

                            <div className="space-y-4">
                                {chapter.comments.map(comment => (
                                    <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-start">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                                <span className="font-medium text-indigo-800">{comment.user.charAt(0)}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-medium text-gray-900">{comment.user}</h3>
                                                    <span className="text-sm text-gray-500">{comment.date}</span>
                                                </div>
                                                <p className="mt-1 text-gray-700">{comment.comment}</p>
                                                <div className="mt-2 flex items-center text-sm">
                                                    <button className="text-gray-500 hover:text-gray-700 flex items-center mr-4">
                                                        <Heart className="h-4 w-4 mr-1" /> Like
                                                    </button>
                                                    <button className="text-gray-500 hover:text-gray-700 flex items-center">
                                                        <MessageCircle className="h-4 w-4 mr-1" /> Reply
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

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

export default TranslationChapterPage;